(() => {
  'use strict';

  // ============================================================
  // SETUP
  // ============================================================
  const canvas = document.getElementById('game');
  const fractalCanvas = document.getElementById('fractal-layer');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const gl = fractalCanvas ? fractalCanvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false }) : null;
  const bootIssues = { warnings: [], critical: [] };
  function noteBootWarning(msg) { bootIssues.warnings.push(msg); }
  function noteBootCritical(msg) { bootIssues.critical.push(msg); }
  let bootBlocked = false;

  if (!canvas) noteBootCritical('Missing #game canvas element.');
  if (!ctx) noteBootCritical('2D canvas context is unavailable.');
  if (!fractalCanvas) noteBootCritical('Missing #fractal-layer canvas element.');
  if (!(window.FrackingInput && typeof window.FrackingInput.create === 'function')) {
    noteBootCritical('Input module missing; controls are unavailable.');
  }
  if (!(window.FrackingFractaloidPalette && typeof window.FrackingFractaloidPalette.create === 'function')) {
    noteBootWarning('Palette module missing; using simplified palette fallback.');
  }
  if (!(window.FrackingFractaloidEffects && typeof window.FrackingFractaloidEffects.create === 'function')) {
    noteBootWarning('Fractaloid effects module missing; spawn telegraph disabled.');
  }
  if (!(window.FrackingFunPack && typeof window.FrackingFunPack.create === 'function')) {
    noteBootWarning('Fun pack module missing; adaptive pacing/combo simplified.');
  }
  if (!(window.FrackingFractaloidClasses && typeof window.FrackingFractaloidClasses.create === 'function')) {
    noteBootCritical('Fractaloid classes module missing; class catalog unavailable.');
  }
  if (!(window.FrackingFractaloidViewfit && typeof window.FrackingFractaloidViewfit.create === 'function')) {
    noteBootCritical('Fractaloid view-fit module missing; fractal tuning unavailable.');
  }
  if (!(window.FrackingFractaloidRuntime && typeof window.FrackingFractaloidRuntime.create === 'function')) {
    noteBootCritical('Fractaloid runtime module missing; fractaloid orchestration unavailable.');
  }
  if (!(window.FrackingFractaloidCombat && typeof window.FrackingFractaloidCombat.create === 'function')) {
    noteBootWarning('Fractaloid combat module missing; using inline combat fallback.');
  }
  if (!(window.FrackingGameplaySystems && typeof window.FrackingGameplaySystems.create === 'function')) {
    noteBootCritical('Gameplay systems module missing; saucer/particles/collision orchestration unavailable.');
  }
  if (!(window.FrackingInputFeel && typeof window.FrackingInputFeel.create === 'function')) {
    noteBootWarning('Input-feel module missing; using direct input without tap grace/buffer.');
  }
  if (!(window.FrackingThreatCues && typeof window.FrackingThreatCues.create === 'function')) {
    noteBootWarning('Threat-cues module missing; nearest threat rings disabled.');
  }
  const fractalRendererFactory = (window.FrackingFractalRenderer && typeof window.FrackingFractalRenderer.create === 'function')
    ? window.FrackingFractalRenderer.create
    : null;
  let fractalRenderer = null;
  if (gl && fractalRendererFactory) {
    try {
      fractalRenderer = fractalRendererFactory(gl);
    } catch (err) {
      console.warn('GL fractaloid renderer unavailable, using vector fallback.', err);
      noteBootWarning('GL fractaloid renderer failed to initialize; using vector fallback.');
    }
  } else if (gl && !fractalRendererFactory) {
    noteBootWarning('Fractal renderer module missing; using vector fallback.');
  }

  const urlParams = new URLSearchParams(window.location.search);
  const perfOverlayEnabledByQuery = urlParams.get('perf') === '1' || urlParams.get('perfOverlay') === '1';
  const maxFpsQueryRaw = (urlParams.get('max_fps') || urlParams.get('maxFps') || '').trim();
  const maxFpsParsed = Number(maxFpsQueryRaw);
  const MAX_FPS = (() => {
    if (!maxFpsQueryRaw) return 0; // default: uncapped (display vsync)
    if (!Number.isFinite(maxFpsParsed) || maxFpsParsed <= 0) {
      console.warn(`[Render mode] Invalid maxFps "${maxFpsQueryRaw}". Using uncapped frame pacing.`);
      return 0;
    }
    const clamped = Math.max(1, Math.min(240, maxFpsParsed));
    if (clamped !== maxFpsParsed) {
      console.warn(`[Render mode] maxFps "${maxFpsParsed}" clamped to "${clamped}".`);
    }
    return clamped;
  })();
  const MAX_FPS_FRAME_MS = MAX_FPS > 0 ? (1000 / MAX_FPS) : 0;

  // ============================================================
  // RENDER MODES (Task 1 scaffolding)
  // ============================================================
  const DEFAULT_RENDER_MODE = 'arcade_640';
  const modeQueryRaw = (urlParams.get('mode') || '').trim().toLowerCase();
  const modeQuery = modeQueryRaw || DEFAULT_RENDER_MODE;
  const RENDER_MODE = modeQuery === 'native' ? 'native' : 'arcade_640'; // 'native' | 'arcade_640'
  if (modeQueryRaw && modeQueryRaw !== 'native' && modeQueryRaw !== 'arcade_640') {
    console.warn(`[Render mode] Unknown mode "${modeQueryRaw}". Falling back to "${DEFAULT_RENDER_MODE}".`);
  }
  const ARCADE_RES_PRESETS = {
    '640x480': { w: 640, h: 480 },
    '480x640': { w: 480, h: 640 },
    '1024x768': { w: 1024, h: 768 },
    '768x1024': { w: 768, h: 1024 },
    '1280x960': { w: 1280, h: 960 },
    '960x1280': { w: 960, h: 1280 }
  };
  const ARCADE_RES_DEFAULT = '1024x768';
  const arcadeResQueryRaw = (urlParams.get('arcade_res') || urlParams.get('arcadeRes') || '').trim().toLowerCase();
  const arcadeResKey = ARCADE_RES_PRESETS[arcadeResQueryRaw] ? arcadeResQueryRaw : ARCADE_RES_DEFAULT;
  if (arcadeResQueryRaw && !ARCADE_RES_PRESETS[arcadeResQueryRaw]) {
    console.warn(`[Render mode] Unknown arcade resolution "${arcadeResQueryRaw}". Falling back to "${ARCADE_RES_DEFAULT}".`);
  }
  const arcadeScaleModeQueryRaw = (
    urlParams.get('scale_mode') ||
    urlParams.get('scaleMode') ||
    urlParams.get('arcade_scale_mode') ||
    urlParams.get('arcadeScaleMode') ||
    ''
  ).trim().toLowerCase();
  const ARCADE_SCALE_MODE_DEFAULT = 'integer';
  const ARCADE_SCALE_MODE = (() => {
    if (!arcadeScaleModeQueryRaw) return ARCADE_SCALE_MODE_DEFAULT;
    if (arcadeScaleModeQueryRaw === 'integer' || arcadeScaleModeQueryRaw === 'fit' || arcadeScaleModeQueryRaw === 'stretch') {
      return arcadeScaleModeQueryRaw;
    }
    if (arcadeScaleModeQueryRaw === 'int' || arcadeScaleModeQueryRaw === 'pixel' || arcadeScaleModeQueryRaw === 'pixel-perfect') {
      return 'integer';
    }
    if (arcadeScaleModeQueryRaw === 'fill') {
      return 'stretch';
    }
    console.warn(`[Render mode] Unknown scale mode "${arcadeScaleModeQueryRaw}". Falling back to "${ARCADE_SCALE_MODE_DEFAULT}".`);
    return ARCADE_SCALE_MODE_DEFAULT;
  })();
  const crtScanlinesQueryRaw = (urlParams.get('scanlines') || urlParams.get('crt_scanlines') || urlParams.get('crtScanlines') || '').trim();
  const crtScanlinesQueryParsed = Number(crtScanlinesQueryRaw);
  const CRT_SCANLINES_OVERRIDE = (() => {
    if (!crtScanlinesQueryRaw) return 0;
    if (!Number.isFinite(crtScanlinesQueryParsed) || crtScanlinesQueryParsed <= 0) {
      console.warn(`[Render mode] Invalid scanlines "${crtScanlinesQueryRaw}". Using active render height.`);
      return 0;
    }
    const clamped = Math.max(1, Math.min(8192, Math.round(crtScanlinesQueryParsed)));
    if (clamped !== Math.round(crtScanlinesQueryParsed)) {
      console.warn(`[Render mode] scanlines "${crtScanlinesQueryParsed}" clamped to "${clamped}".`);
    }
    return clamped;
  })();
  const fullscreenQueryRaw = (urlParams.get('fullscreen') || urlParams.get('full_screen') || urlParams.get('fullScreen') || '').trim().toLowerCase();
  const FULLSCREEN_QUERY_ACTION = (() => {
    if (!fullscreenQueryRaw) return 'none'; // none | enter | exit | toggle
    if (
      fullscreenQueryRaw === '1' ||
      fullscreenQueryRaw === 'true' ||
      fullscreenQueryRaw === 'on' ||
      fullscreenQueryRaw === 'yes' ||
      fullscreenQueryRaw === 'enter'
    ) return 'enter';
    if (
      fullscreenQueryRaw === '0' ||
      fullscreenQueryRaw === 'false' ||
      fullscreenQueryRaw === 'off' ||
      fullscreenQueryRaw === 'no' ||
      fullscreenQueryRaw === 'exit'
    ) return 'exit';
    if (fullscreenQueryRaw === 'toggle') return 'toggle';
    console.warn(`[Launch options] Unknown fullscreen value "${fullscreenQueryRaw}". Valid values: 1|0|toggle.`);
    return 'none';
  })();
  const ARCADE_WIDTH = ARCADE_RES_PRESETS[arcadeResKey].w;
  const ARCADE_HEIGHT = ARCADE_RES_PRESETS[arcadeResKey].h;
  const ARCADE_GLOW_QUALITY = 'medium'; // 'low' | 'medium' | 'high'
  const NATIVE_GLOW_QUALITY = 'high';
  const IS_ARCADE_640 = RENDER_MODE === 'arcade_640';
  const IS_NATIVE_RENDER = !IS_ARCADE_640;
  const ACTIVE_GLOW_QUALITY = IS_ARCADE_640 ? ARCADE_GLOW_QUALITY : NATIVE_GLOW_QUALITY;
  const CRT_CLEAR_COLOR = (() => {
    const root = window.getComputedStyle(document.documentElement);
    const cssColor = (root.getPropertyValue('--crt-black') || '').trim();
    return cssColor || '#090e14';
  })();
  const CRT_CLEAR_RGB = (() => {
    const c = CRT_CLEAR_COLOR.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(c)) {
      return [
        parseInt(c.slice(1, 3), 16) / 255,
        parseInt(c.slice(3, 5), 16) / 255,
        parseInt(c.slice(5, 7), 16) / 255
      ];
    }
    if (/^#[0-9a-fA-F]{3}$/.test(c)) {
      return [
        parseInt(c[1] + c[1], 16) / 255,
        parseInt(c[2] + c[2], 16) / 255,
        parseInt(c[3] + c[3], 16) / 255
      ];
    }
    const rgbMatch = c.match(/^rgba?\(([^)]+)\)$/i);
    if (rgbMatch) {
      const parts = rgbMatch[1].split(',').map((v) => Number(v.trim()));
      if (parts.length >= 3 && parts.every((v, i) => i >= 3 || Number.isFinite(v))) {
        return [
          Math.max(0, Math.min(255, parts[0])) / 255,
          Math.max(0, Math.min(255, parts[1])) / 255,
          Math.max(0, Math.min(255, parts[2])) / 255
        ];
      }
    }
    return [0.0352941176, 0.0549019608, 0.0784313725];
  })();
  const VECTOR_GLOW_TIERS = {
    high: {
      // Rich arcade-vector look: full halo + body + tight core.
      haloWidthMulScale: 1.0,
      haloAlphaScale: 1.0,
      blurScale: 1.0,
      bodyWidthMulScale: 1.0,
      bodyAlphaScale: 1.0,
      coreWidthMulScale: 1.0,
      coreAlphaScale: 1.0
    },
    medium: {
      // Performance-oriented: lighter halo with a narrower, crisp core.
      haloWidthMulScale: 0.9,
      haloAlphaScale: 0.62,
      blurScale: 0.68,
      bodyWidthMulScale: 0.96,
      bodyAlphaScale: 0.9,
      coreWidthMulScale: 0.88,
      coreAlphaScale: 1.05
    },
    low: {
      // Core-first: minimal halo, restrained body, bright center line.
      haloWidthMulScale: 0.8,
      haloAlphaScale: 0.22,
      blurScale: 0.42,
      bodyWidthMulScale: 0.9,
      bodyAlphaScale: 0.66,
      coreWidthMulScale: 1.24,
      coreAlphaScale: 1.1
    }
  };

  const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isMobile) {
    document.body.classList.add('mobile');
    document.getElementById('desktop-instr').classList.add('hidden');
    document.getElementById('mobile-instr').classList.remove('hidden');
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
  }

  function canToggleFullscreen() {
    const root = document.documentElement;
    return !!(root && (root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen));
  }

  function updateFullscreenUi() {
    const active = !!fullscreenElement();
    const supported = canToggleFullscreen();
    document.body.classList.toggle('is-fullscreen', active);
    const buttonIds = ['fullscreen-btn', 'fullscreen-btn-gameover'];
    for (const id of buttonIds) {
      const btn = document.getElementById(id);
      if (!btn) continue;
      if (!supported) {
        btn.disabled = true;
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = 'FULL SCREEN N/A';
        btn.title = 'Fullscreen API unavailable in this browser.';
        continue;
      }
      btn.disabled = false;
      btn.removeAttribute('title');
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.textContent = active ? 'EXIT FULLSCREEN' : 'FULL SCREEN';
    }
  }

  async function enterFullscreen() {
    const root = document.documentElement;
    if (!root) return false;
    const request = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
    if (!request) return false;
    try {
      const maybePromise = request.call(root);
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
      return true;
    } catch (err) {
      console.warn('[Fullscreen] Request denied or failed.', err);
      return false;
    }
  }

  async function exitFullscreen() {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!exit) return false;
    try {
      const maybePromise = exit.call(document);
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
      return true;
    } catch (err) {
      console.warn('[Fullscreen] Exit failed.', err);
      return false;
    }
  }

  async function toggleFullscreen() {
    if (!canToggleFullscreen()) return false;
    if (fullscreenElement()) {
      return exitFullscreen();
    }
    return enterFullscreen();
  }

  function bindFullscreenButtons() {
    const buttonIds = ['fullscreen-btn', 'fullscreen-btn-gameover'];
    for (const id of buttonIds) {
      const btn = document.getElementById(id);
      if (!btn) continue;
      btn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        void toggleFullscreen();
      });
    }
  }

  let pendingFullscreenQueryAction = FULLSCREEN_QUERY_ACTION;

  async function applyFullscreenQueryAction() {
    const action = pendingFullscreenQueryAction;
    if (action === 'none') return true;
    if (!canToggleFullscreen()) {
      pendingFullscreenQueryAction = 'none';
      return false;
    }
    const active = !!fullscreenElement();
    let ok = true;
    if (action === 'enter') {
      ok = active ? true : await enterFullscreen();
    } else if (action === 'exit') {
      ok = active ? await exitFullscreen() : true;
    } else if (action === 'toggle') {
      ok = await toggleFullscreen();
    }
    if (ok || action === 'exit') {
      pendingFullscreenQueryAction = 'none';
    }
    return ok;
  }

  if (!canToggleFullscreen()) {
    noteBootWarning('Fullscreen API unavailable in this browser; use browser-level fullscreen if available.');
  }

  const onFullscreenChange = () => {
    updateFullscreenUi();
    resize();
  };
  window.addEventListener('fullscreenchange', onFullscreenChange);
  window.addEventListener('webkitfullscreenchange', onFullscreenChange);
  if (pendingFullscreenQueryAction !== 'none') {
    // Do an immediate attempt (may fail without user activation). We intentionally
    // do not hook a global pointer listener because that can steal/cancel the
    // mobile title-screen tap that should start the game.
    void applyFullscreenQueryAction();
  }

  if (fractalRenderer && typeof fractalRenderer.setCrtBlack === 'function') {
    fractalRenderer.setCrtBlack(CRT_CLEAR_RGB);
  }

  function renderBootIssues() {
    if (bootIssues.warnings.length) {
      console.warn('[Boot warnings]', bootIssues.warnings.join(' | '));
    }
    if (!bootIssues.critical.length && !bootIssues.warnings.length) return;
    const titleScreen = document.getElementById('title-screen');
    if (!titleScreen) return;

    const panel = document.createElement('div');
    panel.style.maxWidth = '720px';
    panel.style.margin = '12px 0 18px';
    panel.style.padding = '10px 14px';
    panel.style.border = '2px solid';
    panel.style.textAlign = 'left';
    panel.style.fontFamily = '"VT323", monospace';
    panel.style.fontSize = '19px';
    panel.style.lineHeight = '1.28';
    panel.style.whiteSpace = 'pre-wrap';

    const warningText = bootIssues.warnings.length
      ? 'Warnings:\n- ' + bootIssues.warnings.join('\n- ')
      : '';
    if (bootIssues.critical.length) {
      bootBlocked = true;
      panel.style.borderColor = '#ff6868';
      panel.style.color = '#ffd5d5';
      const criticalText = 'Startup blocked (critical):\n- ' + bootIssues.critical.join('\n- ');
      panel.textContent = warningText ? (criticalText + '\n\n' + warningText) : criticalText;
      const startBtn = document.getElementById('start-btn');
      const restartBtn = document.getElementById('restart-btn');
      if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = 'MODULE ERROR';
        startBtn.style.opacity = '0.6';
      }
      if (restartBtn) {
        restartBtn.disabled = true;
        restartBtn.style.opacity = '0.6';
      }
    } else {
      panel.style.borderColor = '#ffd166';
      panel.style.color = '#ffe5ad';
      panel.textContent = warningText;
    }
    const titleContent = titleScreen.querySelector('.overlay-content') || titleScreen;
    const btnAnchor = titleContent.querySelector('.btn');
    if (btnAnchor) {
      titleContent.insertBefore(panel, btnAnchor);
    } else {
      titleContent.appendChild(panel);
    }
  }

  let W = 0, H = 0, DPR = 1;
  let VIEW_W = 0, VIEW_H = 0;
  let DISPLAY_SCALE = 1;
  let DISPLAY_SCALE_X = 1, DISPLAY_SCALE_Y = 1;
  let PLAYFIELD_X = 0, PLAYFIELD_Y = 0;
  let PLAYFIELD_W = 0, PLAYFIELD_H = 0;

  function placeCanvasLayer(layer, x, y, width, height) {
    if (!layer) return;
    layer.style.left = x + 'px';
    layer.style.top = y + 'px';
    layer.style.right = 'auto';
    layer.style.bottom = 'auto';
    layer.style.width = width + 'px';
    layer.style.height = height + 'px';
  }

  function setCrtViewportCss(x, y, width, height) {
    const rootStyle = document.documentElement ? document.documentElement.style : null;
    if (!rootStyle) return;
    rootStyle.setProperty('--crt-x', `${Math.max(0, Math.round(x))}px`);
    rootStyle.setProperty('--crt-y', `${Math.max(0, Math.round(y))}px`);
    rootStyle.setProperty('--crt-w', `${Math.max(1, Math.round(width))}px`);
    rootStyle.setProperty('--crt-h', `${Math.max(1, Math.round(height))}px`);
  }

  function setCrtScanlinesCss(count) {
    const rootStyle = document.documentElement ? document.documentElement.style : null;
    if (!rootStyle) return;
    rootStyle.setProperty('--crt-scanlines', `${Math.max(1, Math.round(count))}`);
  }

  function resize() {
    if (!canvas || !ctx || !fractalCanvas) return;
    const wrap = document.getElementById('game-wrap');
    if (!wrap) return;
    const wrapWidth = wrap.clientWidth;
    const wrapHeight = wrap.clientHeight;
    VIEW_W = wrapWidth;
    VIEW_H = wrapHeight;
    if (IS_ARCADE_640) {
      DPR = 1;
      // Fixed low-res internal buffers with selectable display scaling behavior.
      W = ARCADE_WIDTH;
      H = ARCADE_HEIGHT;
      const fitScale = Math.min(wrapWidth / ARCADE_WIDTH, wrapHeight / ARCADE_HEIGHT);
      let displayScale = Math.max(0.1, fitScale);
      let displayWidth = Math.max(1, Math.round(ARCADE_WIDTH * displayScale));
      let displayHeight = Math.max(1, Math.round(ARCADE_HEIGHT * displayScale));
      let offsetX = Math.floor((wrapWidth - displayWidth) * 0.5);
      let offsetY = Math.floor((wrapHeight - displayHeight) * 0.5);
      let displayScaleX = displayWidth / Math.max(1, ARCADE_WIDTH);
      let displayScaleY = displayHeight / Math.max(1, ARCADE_HEIGHT);

      if (ARCADE_SCALE_MODE === 'integer') {
        const intScale = Math.floor(fitScale);
        displayScale = intScale >= 1 ? intScale : Math.max(0.1, fitScale);
        displayWidth = Math.max(1, Math.round(ARCADE_WIDTH * displayScale));
        displayHeight = Math.max(1, Math.round(ARCADE_HEIGHT * displayScale));
        offsetX = Math.floor((wrapWidth - displayWidth) * 0.5);
        offsetY = Math.floor((wrapHeight - displayHeight) * 0.5);
        displayScaleX = displayScale;
        displayScaleY = displayScale;
      } else if (ARCADE_SCALE_MODE === 'stretch') {
        displayWidth = Math.max(1, wrapWidth);
        displayHeight = Math.max(1, wrapHeight);
        offsetX = 0;
        offsetY = 0;
        displayScaleX = displayWidth / Math.max(1, ARCADE_WIDTH);
        displayScaleY = displayHeight / Math.max(1, ARCADE_HEIGHT);
      } else {
        // "fit" keeps aspect ratio, but allows non-integer upscale for bigger cabinet fill.
        displayScaleX = displayScale;
        displayScaleY = displayScale;
      }

      DISPLAY_SCALE = Math.min(displayScaleX, displayScaleY);
      DISPLAY_SCALE_X = displayScaleX;
      DISPLAY_SCALE_Y = displayScaleY;
      PLAYFIELD_X = offsetX;
      PLAYFIELD_Y = offsetY;
      PLAYFIELD_W = displayWidth;
      PLAYFIELD_H = displayHeight;
      placeCanvasLayer(canvas, offsetX, offsetY, displayWidth, displayHeight);
      canvas.width = ARCADE_WIDTH;
      canvas.height = ARCADE_HEIGHT;
      placeCanvasLayer(fractalCanvas, offsetX, offsetY, displayWidth, displayHeight);
      fractalCanvas.width = ARCADE_WIDTH;
      fractalCanvas.height = ARCADE_HEIGHT;
      setCrtViewportCss(offsetX, offsetY, displayWidth, displayHeight);
      setCrtScanlinesCss(CRT_SCANLINES_OVERRIDE || ARCADE_HEIGHT);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = wrapWidth;
      H = wrapHeight;
      DISPLAY_SCALE = 1;
      DISPLAY_SCALE_X = 1;
      DISPLAY_SCALE_Y = 1;
      PLAYFIELD_X = 0;
      PLAYFIELD_Y = 0;
      PLAYFIELD_W = W;
      PLAYFIELD_H = H;
      placeCanvasLayer(canvas, 0, 0, W, H);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      placeCanvasLayer(fractalCanvas, 0, 0, W, H);
      fractalCanvas.width = Math.floor(W * DPR);
      fractalCanvas.height = Math.floor(H * DPR);
      setCrtViewportCss(0, 0, W, H);
      setCrtScanlinesCss(CRT_SCANLINES_OVERRIDE || H);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    if (fractalRenderer) {
      fractalRenderer.resize(fractalCanvas.width, fractalCanvas.height);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  // ============================================================
  // AUDIO (Web Audio synth — beeps and boops)
  // ============================================================
  const audioSystem = (window.FrackingAudio && typeof window.FrackingAudio.create === 'function')
    ? window.FrackingAudio.create()
    : {
        ensureAudio: () => {},
        heartbeatPulse: () => {},
        sfx: (window.FrackingAudio && typeof window.FrackingAudio.createNoopSfx === 'function')
          ? window.FrackingAudio.createNoopSfx()
          : {
              fire: () => {}, thrust: () => {}, bangLarge: () => {}, bangMedium: () => {},
              bangSmall: () => {}, death: () => {}, hyper: () => {}, saucerLarge: null,
              saucerSmall: null, saucerFire: () => {}, extraLife: () => {}
            }
      };
  const ensureAudio = audioSystem.ensureAudio;
  const heartbeatPulse = audioSystem.heartbeatPulse;
  const sfx = audioSystem.sfx;
  const heartbeatSystem = (window.FrackingHeartbeat && typeof window.FrackingHeartbeat.create === 'function')
    ? window.FrackingHeartbeat.create({
        heartbeatPulse,
        lowHz: 88.2,
        highHz: 93.8,
        pulseSec: 0.102,
        attackSec: 0.0012,
        decaySec: 0.061
      })
    : {
        reset: () => {},
        setIntervalSec: () => {},
        measureDanger: () => 0,
        update: () => {}
      };

  // ============================================================
  // INPUT
  // ============================================================
  const inputSystem = (window.FrackingInput && typeof window.FrackingInput.create === 'function')
    ? window.FrackingInput.create({
        ensureAudio,
        onStartRequested: () => {
          if (state === 'title' || state === 'gameover') startGame();
        }
      })
    : {
        keys: { left: false, right: false, thrust: false, fire: false, hyper: false, inspectMod: false },
        consumeHyperPressed: () => false,
        destroy: () => {}
      };
  const keys = inputSystem.keys;
  const inputFeelSystem = (window.FrackingInputFeel && typeof window.FrackingInputFeel.create === 'function')
    ? window.FrackingInputFeel.create({
        keys,
        consumeHyperPressed: () => inputSystem.consumeHyperPressed(),
        fireGraceSec: 0.06,
        thrustGraceSec: 0.08,
        hyperBufferSec: 0.22
      })
    : (() => {
        let hyperBuffered = false;
        return {
          tick: () => { hyperBuffered = !!inputSystem.consumeHyperPressed(); },
          getIntents: () => ({ fire: !!keys.fire, thrust: !!keys.thrust }),
          consumeHyperBuffered: () => {
            const was = hyperBuffered;
            hyperBuffered = false;
            return was;
          },
          reset: () => { hyperBuffered = false; }
        };
      })();
  let fractaloidRuntimeSystem = null;
  let fractaloidCombatSystem = null;
  let gameplaySystems = null;
  const DIVE_ACTION_TO_CODE = Object.freeze({
    panLeft: 'ArrowLeft',
    panRight: 'ArrowRight',
    panUp: 'ArrowUp',
    panDown: 'ArrowDown',
    zoomOut: 'Minus',
    zoomIn: 'Equal',
    reset: 'KeyR',
    exit: 'Escape'
  });

  function diveActionFromCode(code) {
    if (code === 'ArrowLeft' || code === 'KeyA') return 'panLeft';
    if (code === 'ArrowRight' || code === 'KeyD') return 'panRight';
    if (code === 'ArrowUp' || code === 'KeyW') return 'panUp';
    if (code === 'ArrowDown' || code === 'KeyS') return 'panDown';
    if (code === 'Minus' || code === 'NumpadSubtract' || code === 'KeyQ') return 'zoomOut';
    if (code === 'Equal' || code === 'NumpadAdd' || code === 'KeyE') return 'zoomIn';
    if (code === 'KeyR') return 'reset';
    if (code === 'Escape') return 'exit';
    return null;
  }

  function nudgeFractalDive(code, shiftKey = false) {
    if (state !== 'fractaldive' || !fractaloidRuntimeSystem) return false;
    return fractaloidRuntimeSystem.nudgeDive(code, shiftKey, () => exitFractalDive(), {
      displayScale: DISPLAY_SCALE
    });
  }

  function nudgeFractalDiveAction(action, shiftKey = false) {
    const code = DIVE_ACTION_TO_CODE[action];
    if (!code) return false;
    return nudgeFractalDive(code, shiftKey);
  }

  function bindDiveTouchControl(id, action, opts = {}) {
    const el = document.getElementById(id);
    if (!el) return;
    const repeatMs = opts.repeatMs != null ? opts.repeatMs : 0;
    const shiftKey = !!opts.shiftKey;
    let holdTimer = null;

    const clearHold = () => {
      if (holdTimer != null) {
        clearInterval(holdTimer);
        holdTimer = null;
      }
      el.classList.remove('active');
    };

    const trigger = () => {
      if (state !== 'fractaldive') {
        clearHold();
        return;
      }
      nudgeFractalDiveAction(action, shiftKey);
    };

    const press = (e) => {
      if (state !== 'fractaldive') return;
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      ensureAudio();
      el.classList.add('active');
      trigger();
      if (repeatMs > 0 && holdTimer == null) {
        holdTimer = setInterval(trigger, repeatMs);
      }
    };

    const release = (e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      clearHold();
    };

    el.addEventListener('touchstart', press, { passive: false });
    el.addEventListener('touchend', release, { passive: false });
    el.addEventListener('touchcancel', release, { passive: false });
    el.addEventListener('mousedown', press);
    el.addEventListener('mouseup', release);
    el.addEventListener('mouseleave', release);
    window.addEventListener('blur', clearHold);
  }

  window.addEventListener('keydown', (e) => {
    if (state !== 'fractaldive') return;
    const action = diveActionFromCode(e.code);
    if (action && nudgeFractalDiveAction(action, !!e.shiftKey)) e.preventDefault();
  });

  window.addEventListener('wheel', (e) => {
    if (state !== 'fractaldive' || !fractaloidRuntimeSystem || !fractaloidRuntimeSystem.hasDive()) return;
    fractaloidRuntimeSystem.wheelDive(e.deltaY, { displayScale: DISPLAY_SCALE });
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'F8' && window.frackingPerf && typeof window.frackingPerf.toggle === 'function') {
      window.frackingPerf.toggle();
      e.preventDefault();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.repeat) return;
    if (e.code !== 'KeyF') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.target;
    if (
      target &&
      (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )
    ) return;
    e.preventDefault();
    void toggleFullscreen();
  });

  bindDiveTouchControl('btn-dive-left', 'panLeft', { repeatMs: 56 });
  bindDiveTouchControl('btn-dive-right', 'panRight', { repeatMs: 56 });
  bindDiveTouchControl('btn-dive-up', 'panUp', { repeatMs: 56 });
  bindDiveTouchControl('btn-dive-down', 'panDown', { repeatMs: 56 });
  bindDiveTouchControl('btn-dive-zoom-in', 'zoomIn', { repeatMs: 84 });
  bindDiveTouchControl('btn-dive-zoom-out', 'zoomOut', { repeatMs: 84 });
  bindDiveTouchControl('btn-dive-reset', 'reset');
  bindDiveTouchControl('btn-dive-exit', 'exit');

  // ============================================================
  // GAME STATE
  // ============================================================
  let state = 'title'; // title | playing | dying | wavebreak | gameover | fractaldive
  let score = 0;
  let lives = 9;
  let wave = 1;
  let nextExtraLife = 10000;
  let stateTimer = 0;

  let ship = null;
  let bullets = [];
  let fractaloids = [];
  let particles = [];
  let shockwaves = [];
  let saucer = null;
  let saucerBullets = [];
  let activeThreatCues = [];
  let saucerTimer = 0;
  let waveProfile = null;
  let activeFractaloidClass = 'mandelbrot';
  let deathLifeSpent = false;
  const perfMetrics = (window.FrackingPerfMetrics && typeof window.FrackingPerfMetrics.create === 'function')
    ? window.FrackingPerfMetrics.create({
        overlayVisible: perfOverlayEnabledByQuery,
        metaProvider: () => ({
          geometryMode: IS_NATIVE_RENDER ? 'locked-native' : 'fixed-world+scaled-display',
          mode: IS_NATIVE_RENDER ? 'native' : 'arcade_640',
          scaleMode: IS_NATIVE_RENDER ? 'native' : ARCADE_SCALE_MODE,
          glowQuality: ACTIVE_GLOW_QUALITY,
          arcadeBase: `${ARCADE_WIDTH}x${ARCADE_HEIGHT}`,
          state,
          wave,
          viewport: `${VIEW_W}x${VIEW_H}`,
          viewportRect: `x=0 y=0 w=${VIEW_W} h=${VIEW_H}`,
          playfieldRect: `x=${PLAYFIELD_X} y=${PLAYFIELD_Y} w=${PLAYFIELD_W} h=${PLAYFIELD_H}`,
          world: `${W}x${H}`,
          worldRect: `x=0 y=0 w=${W} h=${H}`,
          worldToPlayfieldScale: `${(PLAYFIELD_W / Math.max(1, W)).toFixed(3)}x ${(PLAYFIELD_H / Math.max(1, H)).toFixed(3)}y`,
          displayScale: DISPLAY_SCALE,
          displayScaleXY: `${DISPLAY_SCALE_X.toFixed(3)}x ${DISPLAY_SCALE_Y.toFixed(3)}y`,
          render: `${canvas ? canvas.width : 0}x${canvas ? canvas.height : 0}`,
          render2dRect: `w=${canvas ? canvas.width : 0} h=${canvas ? canvas.height : 0}`,
          renderFractalRect: `w=${fractalCanvas ? fractalCanvas.width : 0} h=${fractalCanvas ? fractalCanvas.height : 0}`,
          dpr: DPR,
          maxFps: MAX_FPS > 0 ? MAX_FPS : 'uncapped'
        })
      })
    : {
        beginFrame: () => null,
        endFrame: () => {},
        startCapture: () => null,
        stopCapture: () => null,
        snapshot: () => null,
        getSnapshots: () => [],
        getRollingStats: () => ({}),
        clearSnapshots: () => {},
        setOverlayVisible: () => {},
        isOverlayVisible: () => false,
        bindGlobalApi: () => null
      };
  perfMetrics.bindGlobalApi();
  if (window.frackingPerf && perfOverlayEnabledByQuery) {
    console.info('[Perf] Overlay enabled. Console API: window.frackingPerf.start(label), stop(), snap(label), stats(), list(), show(), hide(), toggle()');
  }
  const funPack = (window.FrackingFunPack && typeof window.FrackingFunPack.create === 'function')
    ? window.FrackingFunPack.create()
    : {
        resetChain: () => {},
        resetRun: () => {},
        tick: () => {},
        award: (baseScore) => Math.max(1, Math.floor(baseScore || 0)),
        triggerReliefForLives: () => {},
        computeWavePace: () => ({ spawnMul: 1, speedMul: 1, saucerCadenceMul: 1 }),
        getChainLabel: () => ''
      };
  const fractaloidEffects = (window.FrackingFractaloidEffects && typeof window.FrackingFractaloidEffects.create === 'function')
    ? window.FrackingFractaloidEffects.create({
        ctx,
        strokeWithVectorGlow
      })
    : {
        modeTelegraphHue: () => 190,
        drawSpawnTelegraph: () => {}
      };
  const threatCueSystem = (window.FrackingThreatCues && typeof window.FrackingThreatCues.create === 'function')
    ? window.FrackingThreatCues.create({
        ctx,
        strokeWithVectorGlow
      })
    : {
        compute: () => [],
        draw: () => {}
      };
  let wavePace = { spawnMul: 1, speedMul: 1, saucerCadenceMul: 1 };

  // Tunable constants (classic-ish)
  const SHIP_SIZE = 20;
  const SHIP_TURN = 4.62 // rad/s
  const SHIP_THRUST = 220; // px/s^2
  const SHIP_FRICTION = 0.4; // per second
  const SHIP_MAX_SPEED = 666;
  const BULLET_SPEED = 466;
  const BULLET_LIFE = 0.85;
  const MAX_BULLETS = 16; // power-of-two ammo ceiling
  const FIRE_COOLDOWN_BASE = 0.0275;
  const FIRE_PATTERN = [ 8, 4, 2, 2, 1 ];
  const SHIP_FRACTAL_CLASS = 'mandelbrot_outline'; // 'sierpinski' | 'mandelbrot_outline'
  const SHIP_FRACTAL_CLASSES = ['sierpinski', 'mandelbrot_outline'];
  const FRACTALOID_CLASS = 'cycle'; // 'cycle' | 'tau' | 'magnet' | 'buffalo' | 'tricorn' | 'julia' | 'mandelbrot'
  const FRACTALOID_MIX_AFTER_CYCLE = true;
  const fractaloidClassSystem = (window.FrackingFractaloidClasses && typeof window.FrackingFractaloidClasses.create === 'function')
    ? window.FrackingFractaloidClasses.create({
        selectedClass: FRACTALOID_CLASS,
        mixAfterCycle: FRACTALOID_MIX_AFTER_CYCLE
      })
    : {
        classModes: { tau: 0, julia: 1, magnet: 2, buffalo: 3, tricorn: 4, mandelbrot: 5 },
        classes: ['tau'],
        classSequence: ['tau'],
        autoDiveWaveInterval: 1,
        getClassSequence: () => ['tau'],
        getClassByMode: () => 'tau',
        getClassSpec: () => ({ mode: 0, label: 'TAU BROT' }),
        isJuliaMode: () => false,
        hasCompletedCycle: () => false,
        isMixedWave: () => false,
        resolveClassForWave: () => 'tau',
        pickClassForWaveSpawn: () => 'tau',
        classLabel: () => 'TAU BROT'
      };
  const FRACTALOID_CLASSES = fractaloidClassSystem.classes;
  const FRACTALOID_CLASS_SEQUENCE = fractaloidClassSystem.classSequence;
  const FRACTALOID_CLASS_MODES = fractaloidClassSystem.classModes;
  const FRACTAL_DIVE_AUTO_WAVE_INTERVAL = fractaloidClassSystem.autoDiveWaveInterval;
  const fractaloidViewfitSystem = (window.FrackingFractaloidViewfit && typeof window.FrackingFractaloidViewfit.create === 'function')
    ? window.FrackingFractaloidViewfit.create({
        classModes: FRACTALOID_CLASS_MODES
      })
    : {
        juliaViewAttempts: 14,
        mandelViewAttempts: 10,
        tuneJuliaView: (jx, jy, fx, fy, fzoom) => ({ fx, fy, fzoom, fill: 0.5 }),
        tuneMandelbrotView: (mode, fx, fy, fzoom) => ({ fx, fy, fzoom, escape: 0.5 }),
        deriveMandelZoomFloorRatio: () => 0.9,
        centerFractaloidView: (mode, jx, jy, fx, fy) => ({ fx, fy }),
        getJuliaAreaScale: () => 1.0
      }
  const FRACTALOID_PALETTE_MODES = { cosmic: 0, ember: 1, firefly: 2, gold: 3, plasma: 4 };
  const FRACTALOID_PERIMETER_MODE = 'none'; // 'none' | 'polygon'
  const FRACTALOID_COLORIZER_MODE = 'classic'; // 'classic' | 'enhanced'
  const FRACTALOID_COLORIZER_ENHANCED = FRACTALOID_COLORIZER_MODE === 'enhanced';
  const FRACTALOID_ENHANCED_LIFTMIX = false; // set true to re-enable luma-lift rescue in enhanced mode
  const FRACTALOID_CHROMA_TWEAK = FRACTALOID_COLORIZER_MODE === 'enhanced' ? 1.0 : 0.1; // rescue boosts are enhanced-only
  const FRACTALOID_NEON_TWEAK = FRACTALOID_COLORIZER_MODE === 'enhanced' ? 1.0 : 0.1; // boosted glow path is enhanced-only (temporaraily enabled in classic mode deliberately for testing.)
  const SAUCER_FRACTAL_CLASS = 'cycle'; // 'cycle' | 'classic' | 'sierpinski' | 'koch'
  const SAUCER_FRACTAL_CLASSES = ['classic', 'sierpinski', 'koch'];
  const shipIconAsset = window.FrackingShipIcon || null;
  const SHIP_ICON_VIEWBOX = shipIconAsset && shipIconAsset.viewBox
    ? shipIconAsset.viewBox
    : { x: 1.1, y: 0.45, w: 5.6, h: 5.6 };
  const SHIP_ICON_STROKE_WIDTH = shipIconAsset && typeof shipIconAsset.strokeWidth === 'number'
    ? shipIconAsset.strokeWidth
    : 0.03;
  let shipIconPath = null;
  if (typeof Path2D === 'function' && shipIconAsset && typeof shipIconAsset.pathD === 'string') {
    try {
      shipIconPath = new Path2D(shipIconAsset.pathD);
    } catch (err) {
      shipIconPath = null;
    }
  }
  const JULIA_CONSTANTS = [
    { x: -0.8, y: 0.156 },
    { x: -0.4, y: 0.6 },
    { x: 0.285, y: 0.01 },
    { x: -0.7269, y: 0.1889 },
    { x: -0.74543, y: 0.11301 }
  ];

  const FRACTALOID_SIZES = { 4: 74, 3: 44, 2: 26, 1: 14 }; // size key -> radius
  const FRACTALOID_SCORE = { 4: 10, 3: 20, 2: 50, 1: 100 };
  const FRACTALOID_BASE_SPEED = 40;
  const FRACTALOID_GROWTH_LIFE = { 4: 56, 3: 42, 2: 36, 1: 21 };
  const FRACTALOID_GROWTH_SCALE = { 4: 2.2, 3: 1.36, 2: 1.52, 1: 1.7 };
  const BOSS_WAVE_INTERVAL = 5;
  const BOSS_BASE_HP = 6;
  const SHOCKWAVE_LIFE = 0.62;
  const SHOCKWAVE_RADIUS_GAIN = 2.2;
  const SHOCKWAVE_WIDTH = 2.2;
  const FRACTAL_DIVE_MIN_WAVE = 6;
  const FRACTAL_DIVE_ZOOM_STEP_IN = 0.88;
  const FRACTAL_DIVE_ZOOM_STEP_OUT = 1.14;
  const FRACTAL_DIVE_MIN_ZOOM = 1e-9;
  const FRACTAL_DIVE_MAX_ZOOM = 12.0;
  fractaloidRuntimeSystem = (window.FrackingFractaloidRuntime && typeof window.FrackingFractaloidRuntime.create === 'function')
    ? window.FrackingFractaloidRuntime.create({
        diveZoomStepIn: FRACTAL_DIVE_ZOOM_STEP_IN,
        diveZoomStepOut: FRACTAL_DIVE_ZOOM_STEP_OUT,
        diveMinZoom: FRACTAL_DIVE_MIN_ZOOM,
        diveMaxZoom: FRACTAL_DIVE_MAX_ZOOM,
        strokeWithVectorGlow
      })
    : {
        hasDive: () => false,
        clearDive: () => {},
        clampDiveZoom: (v) => v,
        updateFractaloid: () => {},
        drawFractaloidPerimeter: () => {},
        drawFractaloids: () => {},
        enterDive: () => false,
        maybeEnterDive: () => false,
        nudgeDive: () => false,
        wheelDive: () => false,
        updateDive: () => {},
        drawDiveOverlay: () => {},
        consumeDiveTarget: () => null
      };
  fractaloidCombatSystem = (window.FrackingFractaloidCombat && typeof window.FrackingFractaloidCombat.create === 'function')
    ? window.FrackingFractaloidCombat.create({
        scoreBySize: FRACTALOID_SCORE
      })
    : {
        splitFractaloid: (a, hitPoint = null, grantScore = true, ctx = {}) => {
          const spawnShockwave = typeof ctx.spawnShockwave === 'function' ? ctx.spawnShockwave : () => {};
          const explode = typeof ctx.explode === 'function' ? ctx.explode : () => {};
          const makeFractaloid = typeof ctx.makeFractaloid === 'function' ? ctx.makeFractaloid : () => null;
          const awardFractaloidScore = typeof ctx.awardFractaloidScore === 'function' ? ctx.awardFractaloidScore : () => 0;
          const fractaloids = Array.isArray(ctx.fractaloids) ? ctx.fractaloids : [];
          const wave = ctx.wave || 1;
          const sfxSystem = ctx.sfx || { bangLarge: () => {}, bangMedium: () => {}, bangSmall: () => {} };
          spawnShockwave(a.x, a.y, a.r, a.fseed || 0);
          if (grantScore) awardFractaloidScore(FRACTALOID_SCORE[a.sizeKey]);
          if (a.sizeKey === 4) {
            sfxSystem.bangLarge();
            explode(a.x, a.y, 30, 1.9);
            spawnShockwave(a.x, a.y, a.r * 1.2, a.fseed || 0);
            for (let i = 0; i < 3; i++) fractaloids.push(makeFractaloid(a.x, a.y, 3, wave * 6.2, a, hitPoint));
            for (let i = 0; i < 2; i++) fractaloids.push(makeFractaloid(a.x, a.y, 2, wave * 6.8, a, hitPoint));
          } else if (a.sizeKey === 3) {
            sfxSystem.bangLarge();
            explode(a.x, a.y, 14, 1.0);
            fractaloids.push(makeFractaloid(a.x, a.y, 2, wave * 4, a, hitPoint));
            fractaloids.push(makeFractaloid(a.x, a.y, 2, wave * 4, a, hitPoint));
          } else if (a.sizeKey === 2) {
            sfxSystem.bangMedium();
            explode(a.x, a.y, 10, 0.8);
            fractaloids.push(makeFractaloid(a.x, a.y, 1, wave * 4, a, hitPoint));
            fractaloids.push(makeFractaloid(a.x, a.y, 1, wave * 4, a, hitPoint));
          } else {
            sfxSystem.bangSmall();
            explode(a.x, a.y, 8, 0.6);
          }
        },
        damageFractaloid: (a, hitPoint, grantScore, ctx = {}) => {
          const spawnShockwave = typeof ctx.spawnShockwave === 'function' ? ctx.spawnShockwave : () => {};
          const explode = typeof ctx.explode === 'function' ? ctx.explode : () => {};
          const addRawScore = typeof ctx.addRawScore === 'function' ? ctx.addRawScore : () => {};
          const fractFn = typeof ctx.fract === 'function' ? ctx.fract : (v) => v - Math.floor(v);
          if (a.hp > 1) {
            a.hp -= 1;
            a.fseed = fractFn(a.fseed + 0.14 + Math.random() * 0.2);
            a.age = Math.min(a.lifeSpan, a.age + a.lifeSpan * 0.08);
            spawnShockwave(a.x, a.y, a.r * 0.66, a.fseed || 0);
            explode(a.x, a.y, 8, 0.45);
            if (grantScore) addRawScore(Math.max(8, Math.floor((FRACTALOID_SCORE[a.sizeKey] || 40) * 0.12)));
            return false;
          }
          fractaloidCombatSystem.splitFractaloid(a, hitPoint, grantScore, ctx);
          return true;
        }
      };
  const WAVE_GENOMES = [
    { name: 'Filament', focusX: -0.7445, focusY: 0.1318, seedBias: 0.06, spread: 1.0, zoomBase: 1.62 },
    { name: 'Seahorse', focusX: -0.748, focusY: 0.104, seedBias: 0.24, spread: 0.9, zoomBase: 1.72 },
    { name: 'Needle', focusX: -1.25066, focusY: 0.02012, seedBias: 0.56, spread: 0.62, zoomBase: 1.86 },
    { name: 'Elephant', focusX: 0.285, focusY: 0.012, seedBias: 0.78, spread: 0.72, zoomBase: 1.78 }
  ];
  const SAUCER_LARGE = { r: 17, score: 200, speed: 90, fireRate: 1.6, accuracy: 0.0 };
  const SAUCER_SMALL = { r: 17, score: 1000, speed: 130, fireRate: 1.0, accuracy: 0.75 };
  gameplaySystems = (window.FrackingGameplaySystems && typeof window.FrackingGameplaySystems.create === 'function')
    ? window.FrackingGameplaySystems.create({
        ctx,
        strokeWithVectorGlow,
        rand,
        randSign,
        dist2,
        maybeEnterFractalDive,
        damageFractaloid,
        killShip,
        resolveSaucerFractalClass,
        drawSierpinski,
        sfx,
        SAUCER_LARGE,
        SAUCER_SMALL,
        BULLET_SPEED,
        SHOCKWAVE_LIFE,
        SHOCKWAVE_RADIUS_GAIN,
        SHOCKWAVE_WIDTH,
        state: {
          getWidth: () => W,
          getHeight: () => H,
          getScore: () => score,
          setScore: (v) => { score = v; },
          getLives: () => lives,
          setLives: (v) => { lives = v; },
          getNextExtraLife: () => nextExtraLife,
          setNextExtraLife: (v) => { nextExtraLife = v; },
          getWave: () => wave,
          getShip: () => ship,
          getBullets: () => bullets,
          getSaucerBullets: () => saucerBullets,
          getFractaloids: () => fractaloids,
          getParticles: () => particles,
          getShockwaves: () => shockwaves,
          getSaucer: () => saucer,
          setSaucer: (v) => { saucer = v; }
        }
      })
    : {
        spawnSaucer: () => {},
        updateSaucer: () => {},
        drawSaucer: () => {},
        explode: () => {},
        spawnShockwave: () => {},
        updateParticles: () => {},
        updateShockwaves: () => {},
        drawParticles: () => {},
        drawShockwaves: () => {},
        updateBullets: () => {},
        drawBullets: () => {},
        checkCollisions: () => {},
        checkExtraLife: () => {}
      };
  const paletteSystem = (window.FrackingFractaloidPalette && typeof window.FrackingFractaloidPalette.create === 'function')
    ? window.FrackingFractaloidPalette.create({
        paletteModes: FRACTALOID_PALETTE_MODES,
        classModes: FRACTALOID_CLASS_MODES
      })
    : {
        pickFractaloidPaletteMode: (mode, isBoss = false, parentMode = null) => {
          if (parentMode != null && Math.random() < 0.82) return parentMode;
          if (mode === FRACTALOID_CLASS_MODES.julia) {
            return isBoss ? FRACTALOID_PALETTE_MODES.plasma : FRACTALOID_PALETTE_MODES.firefly;
          }
          return isBoss ? FRACTALOID_PALETTE_MODES.cosmic : FRACTALOID_PALETTE_MODES.ember;
        },
        pickVibrantPaletteSeed: (seedHint = Math.random()) => fract(fract(seedHint) + 1)
      };

  // ============================================================
  // UTILITIES
  // ============================================================
  function rand(a, b) { return a + Math.random() * (b - a); }
  function randSign() { return Math.random() < 0.5 ? -1 : 1; }

  function strokeWithVectorGlow(context, drawStrokePath, opts = {}) {
    if (!context || typeof drawStrokePath !== 'function') return;
    const tierKeyRaw = typeof opts.glowQuality === 'string' ? opts.glowQuality : ACTIVE_GLOW_QUALITY;
    const tierKey = tierKeyRaw.toLowerCase();
    const tier = VECTOR_GLOW_TIERS[tierKey] || VECTOR_GLOW_TIERS.high;
    const baseAlpha = context.globalAlpha;
    const baseWidth = Number.isFinite(opts.baseWidth) ? opts.baseWidth : context.lineWidth;
    const haloWidthMulBase = Number.isFinite(opts.haloWidthMul) ? opts.haloWidthMul : 1.85;
    const haloAlphaBase = Number.isFinite(opts.haloAlpha) ? opts.haloAlpha : 0.22;
    const bodyWidthMulBase = Number.isFinite(opts.bodyWidthMul) ? opts.bodyWidthMul : 1.0;
    const bodyAlphaBase = Number.isFinite(opts.bodyAlpha) ? opts.bodyAlpha : 0.58;
    const coreWidthMulBase = Number.isFinite(opts.coreWidthMul) ? opts.coreWidthMul : 0.50;
    const coreAlphaBase = Number.isFinite(opts.coreAlpha) ? opts.coreAlpha : 1.0;
    const blurBase = Number.isFinite(opts.blur) ? opts.blur : 4.8;
    const haloWidthMul = haloWidthMulBase * tier.haloWidthMulScale;
    const haloAlpha = haloAlphaBase * tier.haloAlphaScale;
    const bodyWidthMul = bodyWidthMulBase * tier.bodyWidthMulScale;
    const bodyAlpha = bodyAlphaBase * tier.bodyAlphaScale;
    const coreWidthMul = coreWidthMulBase * tier.coreWidthMulScale;
    const coreAlpha = Math.min(1.25, coreAlphaBase * tier.coreAlphaScale);
    const blur = blurBase * tier.blurScale;
    const glowEnabled = opts.glowEnabled !== false;
    const hasHalo = glowEnabled && haloAlpha > 0.0001;
    const path = opts.path || null;

    context.save();
    if (hasHalo) {
      context.globalAlpha = baseAlpha * haloAlpha;
      context.lineWidth = Math.max(0.1, baseWidth * haloWidthMul);
      context.shadowBlur = blur;
      context.shadowColor = context.strokeStyle;
      drawStrokePath();
      if (path) context.stroke(path); else context.stroke();
    }

    context.globalAlpha = baseAlpha * bodyAlpha;
    context.lineWidth = Math.max(0.1, baseWidth * bodyWidthMul);
    context.shadowBlur = 0;
    context.shadowColor = 'transparent';
    drawStrokePath();
    if (path) context.stroke(path); else context.stroke();

    context.globalAlpha = baseAlpha * coreAlpha;
    context.lineWidth = Math.max(0.1, baseWidth * coreWidthMul);
    drawStrokePath();
    if (path) context.stroke(path); else context.stroke();
    context.restore();
  }

  function fract(v) { return v - Math.floor(v); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function waveNoise(w, salt) { return fract(Math.sin(w * 127.1 + salt * 311.7) * 43758.5453123); }
  function waveRange(w, salt, min, max) { return min + (max - min) * waveNoise(w, salt); }

  function tuneMandelbrotView(mode, fx, fy, fzoom, spread, attempts = fractaloidViewfitSystem.mandelViewAttempts, zoomMin, zoomMax) {
    return fractaloidViewfitSystem.tuneMandelbrotView(mode, fx, fy, fzoom, spread, attempts, zoomMin, zoomMax);
  }

  function deriveMandelZoomFloorRatio(mode, fx, fy, baseFzoom) {
    return fractaloidViewfitSystem.deriveMandelZoomFloorRatio(mode, fx, fy, baseFzoom);
  }

  function tuneJuliaView(jx, jy, fx, fy, fzoom, attempts = fractaloidViewfitSystem.juliaViewAttempts) {
    return fractaloidViewfitSystem.tuneJuliaView(jx, jy, fx, fy, fzoom, attempts);
  }

  function getJuliaAreaScale(jx, jy, fx, fy, fzoom) {
    return fractaloidViewfitSystem.getJuliaAreaScale(jx, jy, fx, fy, fzoom);
  }

  function centerFractaloidView(mode, jx, jy, fx, fy, fzoom) {
    return fractaloidViewfitSystem.centerFractaloidView(mode, jx, jy, fx, fy, fzoom);
  }

  function makeWaveProfile(w) {
    const genome = WAVE_GENOMES[(w - 1) % WAVE_GENOMES.length];
    const tier = Math.min(1.85, (w - 1) * 0.09);
    return {
      name: genome.name,
      focusX: genome.focusX + waveRange(w, 1, -0.018, 0.018),
      focusY: genome.focusY + waveRange(w, 2, -0.018, 0.018),
      seedBias: fract(genome.seedBias + waveRange(w, 3, 0, 0.32)),
      spreadMul: genome.spread * (1 + Math.min(0.68, (w - 1) * 0.05)),
      growthMul: 1 + tier * 0.62,
      growthRate: 1 + tier * 0.9,
      speedMul: 1 + tier * 0.44,
      zoomRate: 1 + tier * 0.52,
      zoomBase: genome.zoomBase + waveRange(w, 4, 0.04, 0.48),
      zoomVariance: 0.56 + waveRange(w, 5, 0.04, 0.44),
      paletteDrift: 0.04 + waveRange(w, 6, 0.03, 0.27)
    };
  }

  function computeAdaptiveWavePace(w) {
    return funPack.computeWavePace(w, lives);
  }

  function getShipFractalClass() {
    return SHIP_FRACTAL_CLASSES.includes(SHIP_FRACTAL_CLASS) ? SHIP_FRACTAL_CLASS : 'sierpinski';
  }

  function getFractaloidClassSequence() {
    return fractaloidClassSystem.getClassSequence();
  }

  function getFractaloidClassByMode(mode) {
    return fractaloidClassSystem.getClassByMode(mode);
  }

  function getFractaloidClassSpec(className) {
    return fractaloidClassSystem.getClassSpec(className);
  }

  function isJuliaMode(mode) {
    return fractaloidClassSystem.isJuliaMode(mode);
  }

  function hasCompletedFractaloidCycle(w) {
    return fractaloidClassSystem.hasCompletedCycle(w);
  }

  function isMixedFractaloidWave(w) {
    return fractaloidClassSystem.isMixedWave(w);
  }

  function resolveFractaloidClassForWave(w) {
    return fractaloidClassSystem.resolveClassForWave(w);
  }

  function setWaveFractaloidClass(w) {
    activeFractaloidClass = resolveFractaloidClassForWave(w);
  }

  function getFractaloidClass() {
    return activeFractaloidClass;
  }

  function resolveSaucerFractalClass() {
    if (SAUCER_FRACTAL_CLASSES.includes(SAUCER_FRACTAL_CLASS) && SAUCER_FRACTAL_CLASS !== 'cycle') {
      return SAUCER_FRACTAL_CLASS;
    }
    if (SAUCER_FRACTAL_CLASS === 'cycle') {
      return Math.random() < 0.5 ? 'sierpinski' : 'koch';
    }
    return 'classic';
  }

  function fractaloidClassLabel(className) {
    return fractaloidClassSystem.classLabel(className);
  }

  function pickFractaloidClassForWaveSpawn(w) {
    return fractaloidClassSystem.pickClassForWaveSpawn(w);
  }

  function pickJuliaConstant(profile, sizeKey, seedBias = 0) {
    const base = Math.floor((profile.seedBias + seedBias) * 23);
    const idx = Math.abs((wave * 7 + sizeKey * 11 + base) % JULIA_CONSTANTS.length);
    const c = JULIA_CONSTANTS[idx];
    const spread = Math.max(0.02, profile.spreadMul * 0.035);
    return {
      jx: c.x + rand(-spread, spread),
      jy: c.y + rand(-spread, spread)
    };
  }

  function wrap(obj) {
    if (obj.x < -obj.r) obj.x = W + obj.r;
    else if (obj.x > W + obj.r) obj.x = -obj.r;
    if (obj.y < -obj.r) obj.y = H + obj.r;
    else if (obj.y > H + obj.r) obj.y = -obj.r;
  }

  function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx*dx + dy*dy;
  }

  function edgeSpawnPoint(spawnInset = 0) {
    let x, y;
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) { x = -spawnInset; y = Math.random() * H; }
    else if (edge === 1) { x = W + spawnInset; y = Math.random() * H; }
    else if (edge === 2) { x = Math.random() * W; y = -spawnInset; }
    else { x = Math.random() * W; y = H + spawnInset; }
    return { x, y };
  }

  function antiAxisSpawnVelocity(vx, vy, speed, fromSplit = false) {
    const targetSpeed = Math.max(0.001, speed);
    const minRatio = fromSplit ? 0.028 : 0.018;
    const maxRatio = fromSplit ? 0.072 : 0.048;
    const minComp = targetSpeed * minRatio;
    const maxComp = targetSpeed * maxRatio;
    let nx = vx;
    let ny = vy;

    // Prevent nearly pure horizontal/vertical travel that can loop forever in
    // the off-screen passthrough corridor when fractaloids grow very large.
    if (Math.abs(nx) < minComp) nx = randSign() * rand(minComp, maxComp);
    if (Math.abs(ny) < minComp) ny = randSign() * rand(minComp, maxComp);

    const mag = Math.hypot(nx, ny);
    if (mag < 0.0001) return { vx, vy };
    return {
      vx: (nx / mag) * targetSpeed,
      vy: (ny / mag) * targetSpeed
    };
  }


  // ============================================================
  // SHIP
  // ============================================================
  function makeShip() {
    return {
      x: W/2, y: H/2,
      vx: 0, vy: 0,
      angle: -Math.PI/2,
      r: SHIP_SIZE * 0.7,
      thrusting: false,
      fireTimer: 0,
      shotPhase: 0,
      invuln: 2.5, // spawn invulnerability
      blink: 0,
      alive: true
    };
  }

  function drawSierpinski(x1, y1, x2, y2, x3, y3, depth) {
    ctx.lineWidth = 1.2 / (depth + 1);
    strokeWithVectorGlow(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
    }, {
      haloWidthMul: 1.9,
      haloAlpha: 0.19,
      blur: 4.8
    });
    if (depth <= 0) return;

    const m12x = (x1 + x2) * 0.5, m12y = (y1 + y2) * 0.5;
    const m23x = (x2 + x3) * 0.5, m23y = (y2 + y3) * 0.5;
    const m31x = (x3 + x1) * 0.5, m31y = (y3 + y1) * 0.5;

    drawSierpinski(x1, y1, m12x, m12y, m31x, m31y, depth - 1);
    drawSierpinski(m12x, m12y, x2, y2, m23x, m23y, depth - 1);
    drawSierpinski(m31x, m31y, m23x, m23y, x3, y3, depth - 1);
  }

  function drawSierpinskiShipHull(sz) {
    const p1 = { x: sz, y: 0 };
    const p2 = { x: -sz * 0.74, y: sz * 0.72 };
    const p3 = { x: -sz * 0.74, y: -sz * 0.72 };
    drawSierpinski(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, 2);
  }

  function drawLegacyMandelbrotOutlineShipHull(sz) {
    const sx = sz * 0.84;
    const sy = sz * 0.88;
    const xOff = -sz * 0.11;
    const n = 88;

    strokeWithVectorGlow(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * Math.PI * 2;
        const x = 0.5 * Math.cos(t) - 0.25 * Math.cos(2 * t);
        const y = 0.5 * Math.sin(t) - 0.25 * Math.sin(2 * t);
        const px = xOff + x * sx * 2.35;
        const py = y * sy * 1.95;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }, {
      haloWidthMul: 2.2,
      haloAlpha: 0.24,
      blur: 5.9
    });

    const cx = xOff - sx * 1.72;
    const bulbN = 44;
    strokeWithVectorGlow(ctx, () => {
      ctx.beginPath();
      for (let i = 0; i <= bulbN; i++) {
        const t = (i / bulbN) * Math.PI * 2;
        const px = cx + Math.cos(t) * sx * 0.52;
        const py = Math.sin(t) * sy * 0.52;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }, {
      haloWidthMul: 2.2,
      haloAlpha: 0.24,
      blur: 5.9
    });
  }

  function drawMandelbrotOutlineShipHull(sz) {
    if (!shipIconPath) {
      drawLegacyMandelbrotOutlineShipHull(sz);
      return;
    }

    const scale = (sz * 2.00) / SHIP_ICON_VIEWBOX.w;
    const cx = SHIP_ICON_VIEWBOX.x + SHIP_ICON_VIEWBOX.w * 0.5;
    const cy = SHIP_ICON_VIEWBOX.y + SHIP_ICON_VIEWBOX.h * 0.5;

    ctx.save();
    // KNIFE icon points opposite our ship forward vector; flip it to align barrel with bullet emission.
    ctx.rotate(Math.PI);
    ctx.translate(-sz * 0.02, 0);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    ctx.lineWidth = SHIP_ICON_STROKE_WIDTH;
    ctx.lineStyle = "#fff"
    strokeWithVectorGlow(ctx, () => {}, {
      baseWidth: SHIP_ICON_STROKE_WIDTH,
      haloWidthMul: 0.03,
      haloAlpha: 0.5,
      blur: 3.2,
      path: shipIconPath
    });
    ctx.restore();
  }

  function drawShipHull(sz) {
    if (getShipFractalClass() === 'mandelbrot_outline') {
      drawMandelbrotOutlineShipHull(sz);
      return;
    }
    drawSierpinskiShipHull(sz);
  }

  function nextFireCooldown(s) {
    const step = FIRE_PATTERN[s.shotPhase % FIRE_PATTERN.length];
    s.shotPhase = (s.shotPhase + 1) % FIRE_PATTERN.length;
    return FIRE_COOLDOWN_BASE * step;
  }

  function drawShip(s) {
    if (!s.alive) return;
    if (s.invuln > 0) {
      s.blink += 1;
      if (Math.floor(s.blink / 4) % 2 === 0) return;
    }
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const sz = SHIP_SIZE * 1.08;
    drawShipHull(sz);

    if (getShipFractalClass() !== 'mandelbrot_outline') {
      // small center spar so orientation stays obvious while moving fast
      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-sz * 0.18, 0);
        ctx.lineTo(sz * 0.62, 0);
      }, {
        haloWidthMul: 1.9,
        haloAlpha: 0.18,
        blur: 4.5
      });
    }

    // thrust flame
    if (s.thrusting && Math.random() > 0.3) {
      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(-sz * 0.72, sz * 0.26);
        ctx.lineTo(-sz * 1.15 - Math.random() * 5, 0);
        ctx.lineTo(-sz * 0.72, -sz * 0.26);
      }, {
        haloWidthMul: 2.4,
        haloAlpha: 0.26,
        blur: 6.2
      });
    }
    ctx.restore();
  }

  function updateShip(s, dt) {
    if (!s.alive) return;
    const intents = inputFeelSystem.getIntents();
    if (s.invuln > 0) s.invuln -= dt;

    if (keys.left) s.angle -= SHIP_TURN * dt;
    if (keys.right) s.angle += SHIP_TURN * dt;

    s.thrusting = intents.thrust;
    if (s.thrusting) {
      s.vx += Math.cos(s.angle) * SHIP_THRUST * dt;
      s.vy += Math.sin(s.angle) * SHIP_THRUST * dt;
      // cap speed
      const sp = Math.hypot(s.vx, s.vy);
      if (sp > SHIP_MAX_SPEED) {
        s.vx = s.vx/sp * SHIP_MAX_SPEED;
        s.vy = s.vy/sp * SHIP_MAX_SPEED;
      }
      if (Math.random() < 0.5) sfx.thrust();
    }

    // friction
    const fr = Math.pow(1 - SHIP_FRICTION, dt);
    s.vx *= fr;
    s.vy *= fr;

    s.x += s.vx * dt;
    s.y += s.vy * dt;
    wrap(s);

    s.fireTimer -= dt;
    if (!intents.fire && s.fireTimer <= FIRE_COOLDOWN_BASE) {
      s.shotPhase = 0;
    }

    if (intents.fire && s.fireTimer <= 0 && bullets.length < MAX_BULLETS) {
      fireBullet(s);
      s.fireTimer = nextFireCooldown(s);
    }
    if (inputFeelSystem.consumeHyperBuffered()) {
      hyperspace(s);
    }
  }

  function fireBullet(s) {
    const tipX = s.x + Math.cos(s.angle) * SHIP_SIZE;
    const tipY = s.y + Math.sin(s.angle) * SHIP_SIZE;
    bullets.push({
      x: tipX, y: tipY,
      vx: Math.cos(s.angle) * BULLET_SPEED + s.vx * 0.5,
      vy: Math.sin(s.angle) * BULLET_SPEED + s.vy * 0.5,
      life: BULLET_LIFE,
      r: 1.5
    });
    sfx.fire();
  }

  function hyperspace(s) {
    // small chance of malfunction (classic feature)
    sfx.hyper();
    if (Math.random() < 0.08) {
      killShip();
      return;
    }
    s.x = rand(40, W-40);
    s.y = rand(40, H-40);
    s.vx = 0; s.vy = 0;
    s.invuln = 0.5;
  }

  function killShip() {
    if (!ship.alive || ship.invuln > 0) return;
    ship.alive = false;
    deathLifeSpent = false;
    funPack.resetChain();
    explode(ship.x, ship.y, 24, 1.5);
    sfx.death();
    state = 'dying';
    stateTimer = 2.5;
  }

  // ============================================================
  // FRACTALOIDS
  // ============================================================
  function makeFractalSeed(sizeKey, isBoss = false, forcedClassName = null) {
    const profile = waveProfile || makeWaveProfile(wave);
    const baseSpread = (sizeKey === 4 ? 0.16 : sizeKey === 3 ? 0.11 : sizeKey === 2 ? 0.07 : 0.05);
    const className = FRACTALOID_CLASSES.includes(forcedClassName) ? forcedClassName : getFractaloidClass();
    const classSpec = getFractaloidClassSpec(className);
    const mode = classSpec.mode;
    const isJulia = isJuliaMode(mode);
    const spread = baseSpread * profile.spreadMul * (classSpec.spreadMul || 1);
    const julia = isJulia
      ? pickJuliaConstant(profile, sizeKey)
      : { jx: 0, jy: 0 };

    let fx;
    let fy;
    let fzoom;
    let mZoomFloorRatio = null;

    if (isJulia) {
      fx = profile.focusX + rand(-spread, spread);
      fy = profile.focusY + rand(-spread, spread);
      fzoom = profile.zoomBase + Math.random() * profile.zoomVariance;
      const tuned = tuneJuliaView(julia.jx, julia.jy, fx, fy, fzoom);
      fx = tuned.fx;
      fy = tuned.fy;
      fzoom = tuned.fzoom;
    } else {
      const waveZoom = 1 + Math.min(0.9, (wave - 1) * 0.045) * (classSpec.waveZoomMul || 0.56);
      fx = classSpec.focusX + rand(-spread, spread);
      fy = classSpec.focusY + rand(-spread, spread);
      fzoom = clamp(
        (classSpec.zoomBase + Math.random() * classSpec.zoomVariance) / waveZoom,
        classSpec.zoomMin,
        classSpec.zoomMax
      );
      const tuned = tuneMandelbrotView(
        mode,
        fx,
        fy,
        fzoom,
        spread,
        fractaloidViewfitSystem.mandelViewAttempts,
        classSpec.zoomMin,
        classSpec.zoomMax
      );
      fx = tuned.fx;
      fy = tuned.fy;
      fzoom = tuned.fzoom;
      mZoomFloorRatio = deriveMandelZoomFloorRatio(mode, fx, fy, fzoom);
    }

    const centeredSeed = centerFractaloidView(mode, julia.jx, julia.jy, fx, fy, fzoom);
    fx = centeredSeed.fx;
    fy = centeredSeed.fy;
    if (!isJulia) {
      mZoomFloorRatio = deriveMandelZoomFloorRatio(mode, fx, fy, fzoom);
    }

    const shapeScale = isJulia
      ? getJuliaAreaScale(julia.jx, julia.jy, fx, fy, fzoom)
      : 1;
    const paletteMode = paletteSystem.pickFractaloidPaletteMode(mode, isBoss, null);
    return {
      className,
      fx,
      fy,
      fzoom,
      fseed: paletteSystem.pickVibrantPaletteSeed(profile.seedBias + Math.random() * 0.43, paletteMode),
      frot: Math.random() * Math.PI * 2,
      mode,
      paletteMode,
      jx: julia.jx,
      jy: julia.jy,
      shapeScale,
      mZoomFloorRatio
    };
  }

  function deriveFractalChild(parent, hitPoint, isBoss = false) {
    const profile = waveProfile || makeWaveProfile(wave);
    let nx = Math.cos(Math.random() * Math.PI * 2);
    let ny = Math.sin(Math.random() * Math.PI * 2);
    if (hitPoint) {
      const dx = hitPoint.x - parent.x;
      const dy = hitPoint.y - parent.y;
      const len = Math.hypot(dx, dy);
      if (len > 0.001) {
        nx = dx / len;
        ny = dy / len;
      }
    }
    const tx = -ny;
    const ty = nx;
    const mode = parent.mode != null ? parent.mode : getFractaloidClassSpec(getFractaloidClass()).mode;
    const className = parent.className || getFractaloidClassByMode(mode);
    const classSpec = getFractaloidClassSpec(className);
    const isJulia = isJuliaMode(mode);
    const parentSpan = Math.max(parent.fzoom, parent.baseFzoom * 0.55);
    const tangentAmp = classSpec.childTangent != null ? classSpec.childTangent : 0.2;
    const radial = parentSpan * (isJulia ? (0.10 + Math.random() * 0.16) : (0.24 + Math.random() * 0.24));
    const tangent = parentSpan * (isJulia ? rand(-0.11, 0.11) : rand(-tangentAmp, tangentAmp));
    const julia = isJulia
      ? {
          jx: (parent.jx || 0) + rand(-0.018, 0.018),
          jy: (parent.jy || 0) + rand(-0.018, 0.018)
        }
      : { jx: 0, jy: 0 };
    let fx = parent.fx + nx * radial + tx * tangent;
    let fy = parent.fy + ny * radial + ty * tangent;
    let fzoom = parent.fzoom * (
      isJulia
        ? (0.74 + Math.random() * 0.18)
        : (classSpec.childZoomMin + Math.random() * (classSpec.childZoomMax - classSpec.childZoomMin))
    );
    let mZoomFloorRatio = parent.mZoomFloorRatio != null ? parent.mZoomFloorRatio : null;
    if (isJulia) {
      const tuned = tuneJuliaView(julia.jx, julia.jy, fx, fy, fzoom, fractaloidViewfitSystem.juliaViewAttempts + 4);
      fx = tuned.fx;
      fy = tuned.fy;
      fzoom = tuned.fzoom;
    } else {
      fzoom = clamp(fzoom, classSpec.zoomMin, classSpec.zoomMax);
      const tuned = tuneMandelbrotView(
        mode,
        fx,
        fy,
        fzoom,
        parentSpan * 0.24,
        fractaloidViewfitSystem.mandelViewAttempts + 3,
        classSpec.zoomMin,
        classSpec.zoomMax
      );
      fx = tuned.fx;
      fy = tuned.fy;
      fzoom = tuned.fzoom;
      mZoomFloorRatio = deriveMandelZoomFloorRatio(mode, fx, fy, fzoom);
    }
    const centeredChild = centerFractaloidView(mode, julia.jx, julia.jy, fx, fy, fzoom);
    fx = centeredChild.fx;
    fy = centeredChild.fy;
    if (!isJulia) {
      mZoomFloorRatio = deriveMandelZoomFloorRatio(mode, fx, fy, fzoom);
    }

    const shapeScale = isJulia
      ? getJuliaAreaScale(julia.jx, julia.jy, fx, fy, fzoom)
      : 1;
    const parentPaletteMode = parent.paletteMode != null ? parent.paletteMode : null;
    const paletteMode = paletteSystem.pickFractaloidPaletteMode(mode, isBoss || parent.isBoss, parentPaletteMode);
    return {
      className,
      fx,
      fy,
      fzoom,
      fseed: paletteSystem.pickVibrantPaletteSeed(parent.fseed + profile.paletteDrift + rand(0.04, 0.2), paletteMode),
      frot: parent.frot + rand(-0.9, 0.9),
      mode,
      paletteMode,
      jx: julia.jx,
      jy: julia.jy,
      shapeScale,
      mZoomFloorRatio
    };
  }

  function makeFractaloid(x, y, sizeKey, speedBoost = 0, parent = null, hitPoint = null, opts = null) {
    const options = opts || {};
    const profile = waveProfile || makeWaveProfile(wave);
    const isBoss = !!options.isBoss || sizeKey === 4;
    const forcedClassName = FRACTALOID_CLASSES.includes(options.className) ? options.className : null;
    const fractal = parent
      ? deriveFractalChild(parent, hitPoint, isBoss)
      : makeFractalSeed(sizeKey, isBoss, forcedClassName);
    const r = FRACTALOID_SIZES[sizeKey] * (fractal.shapeScale || 1);
    // generate jagged polygon
    const verts = [];
    const n = 10 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const variance = 0.4 + Math.random() * 0.5;
      verts.push({ a, d: r * variance });
    }
    const speed = (FRACTALOID_BASE_SPEED + speedBoost + Math.random() * 30) * profile.speedMul;
    const dir = Math.random() * Math.PI * 2;
    const initialVelocity = antiAxisSpawnVelocity(
      Math.cos(dir) * speed,
      Math.sin(dir) * speed,
      speed,
      !!parent
    );
    const jitter = parent ? parent.r * 0.2 : 0;
    const growthStart = parent ? 0.7 : 0.82;
    const growthMax = FRACTALOID_GROWTH_SCALE[sizeKey] * profile.growthMul * rand(1.02, 1.13);
    const lifeSpan = (FRACTALOID_GROWTH_LIFE[sizeKey] * rand(0.9, 1.12)) / profile.growthRate;
    const baseFzoom = fractal.fzoom;
    const initialZoomScale = Math.max(growthStart, 0.0001);
    const initialFzoom = baseFzoom / initialZoomScale;
    const zoomRate = profile.zoomRate * rand(0.9, 1.1);
    const maxHp = options.hp || (isBoss ? BOSS_BASE_HP + Math.floor(wave / BOSS_WAVE_INTERVAL) : 1);
    const seedCycleRate = options.seedCycleRate || (
      isBoss
        ? 0.29 + wave * 0.01
        : (FRACTALOID_COLORIZER_ENHANCED ? rand(0.012, 0.065) : rand(0.003, 0.018))
    );
    return {
      x: x + rand(-jitter, jitter),
      y: y + rand(-jitter, jitter),
      vx: initialVelocity.vx,
      vy: initialVelocity.vy,
      angle: 0,
      spin: rand(-1.2, 1.2),
      baseR: r,
      r: r * growthStart,
      sizeKey,
      verts,
      age: 0,
      lifeSpan,
      growthStart,
      growthMax,
      zoomRate,
      isBoss,
      hp: maxHp,
      maxHp,
      seedCycleRate,
      spawnTelegraphAge: 0,
      spawnTelegraphLife: parent ? rand(0.20, 0.36) : rand(0.38, 0.62),
      spawnTelegraphHue: fractaloidEffects.modeTelegraphHue(fractal.mode),
      fx: fractal.fx,
      fy: fractal.fy,
      baseFzoom,
      fzoom: initialFzoom,
      fseed: fractal.fseed,
      frot: fractal.frot,
      className: fractal.className || getFractaloidClassByMode(fractal.mode),
      mode: fractal.mode,
      paletteMode: fractal.paletteMode != null ? fractal.paletteMode : FRACTALOID_PALETTE_MODES.cosmic,
      jx: fractal.jx,
      jy: fractal.jy,
      shapeScale: fractal.shapeScale || 1,
      mZoomFloorRatio: fractal.mZoomFloorRatio != null ? fractal.mZoomFloorRatio : null
    };
  }

  function spawnWave(w) {
    setWaveFractaloidClass(w);
    waveProfile = makeWaveProfile(w);
    wavePace = computeAdaptiveWavePace(w);
    fractaloids = [];
    const isBossWave = w % BOSS_WAVE_INTERVAL === 0;
    if (isBossWave) {
      const bossSpawn = edgeSpawnPoint(40);
      fractaloids.push(
        makeFractaloid(
          bossSpawn.x,
          bossSpawn.y,
          4,
          w * 6 * wavePace.speedMul * rand(0.92, 1.16),
          null,
          null,
          {
            isBoss: true,
            hp: BOSS_BASE_HP + Math.floor(w / BOSS_WAVE_INTERVAL),
            className: pickFractaloidClassForWaveSpawn(w)
          }
        )
      );
      const escorts = Math.max(2, Math.min(Math.floor((2 + Math.floor(w / 10)) * wavePace.spawnMul * 0.72), 6));
      for (let i = 0; i < escorts; i++) {
        const p = edgeSpawnPoint(0);
        fractaloids.push(makeFractaloid(p.x, p.y, 3, w * 4.5 * wavePace.speedMul * rand(0.9, 1.18), null, null, { className: pickFractaloidClassForWaveSpawn(w) }));
      }
      return;
    }

    const count = Math.max(4, Math.min(42, Math.floor((4 + w) * wavePace.spawnMul)));
    for (let i = 0; i < count; i++) {
      const p = edgeSpawnPoint(0);
      fractaloids.push(makeFractaloid(p.x, p.y, 3, w * 4 * wavePace.speedMul * rand(0.9, 1.16), null, null, { className: pickFractaloidClassForWaveSpawn(w) }));
    }
  }

  function fractaloidForcesPerimeter(a) {
    if (!a) return false;
    return a.mode === FRACTALOID_CLASS_MODES.buffalo;
  }

  function shouldDrawFractaloidPerimeter(a = null) {
    // Keep fallback renderer playable; polygon perimeter is optional with WebGL fractal shading.
    if (!fractalRenderer) return true;
    if (FRACTALOID_PERIMETER_MODE !== 'polygon') return false;
    if (fractaloidForcesPerimeter(a)) return true;
    return true;
  }

  function drawFractaloid(a) {
    if (!fractaloidRuntimeSystem) return;
    fractaloidRuntimeSystem.drawFractaloidPerimeter(ctx, a, shouldDrawFractaloidPerimeter(a));
  }

  function drawFractaloids(timeSec, warpBullets = []) {
    if (!fractaloidRuntimeSystem) return;
    fractaloidRuntimeSystem.drawFractaloids({
      ctx,
      fractaloids,
      timeSec,
      warpBullets,
      dpr: DPR,
      fractalRenderer,
      fractaloidEffects,
      perimeterMode: FRACTALOID_PERIMETER_MODE,
      colorizerMode: FRACTALOID_COLORIZER_MODE,
      enhancedLiftMix: FRACTALOID_ENHANCED_LIFTMIX,
      chromaTweak: FRACTALOID_CHROMA_TWEAK,
      neonTweak: FRACTALOID_NEON_TWEAK,
      drawPerimeter: (a) => drawFractaloid(a)
    });
  }

  function updateFractaloid(a, dt) {
    if (!fractaloidRuntimeSystem) return;
    fractaloidRuntimeSystem.updateFractaloid(a, dt, { wrap, isJuliaMode, fract });
  }

  function clampDiveZoom(v) {
    return fractaloidRuntimeSystem ? fractaloidRuntimeSystem.clampDiveZoom(v) : v;
  }

  function randomizeFractalDiveTarget(target) {
    if (!target) return;
    const randomClass = FRACTALOID_CLASSES[Math.floor(Math.random() * FRACTALOID_CLASSES.length)] || 'tau';
    const seeded = makeFractalSeed(Math.max(1, target.sizeKey || 1), !!target.isBoss, randomClass);
    target.className = seeded.className || randomClass;
    target.mode = seeded.mode;
    target.paletteMode = seeded.paletteMode != null ? seeded.paletteMode : FRACTALOID_PALETTE_MODES.cosmic;
    target.fx = seeded.fx;
    target.fy = seeded.fy;
    target.baseFzoom = seeded.fzoom;
    target.fzoom = isJuliaMode(seeded.mode) ? seeded.fzoom * 1.08 : seeded.fzoom;
    target.fseed = seeded.fseed;
    target.frot = seeded.frot;
    target.jx = seeded.jx;
    target.jy = seeded.jy;
    target.mZoomFloorRatio = seeded.mZoomFloorRatio != null ? seeded.mZoomFloorRatio : null;
    target.spawnTelegraphHue = fractaloidEffects.modeTelegraphHue(seeded.mode);
  }

  function setDiveUiActive(active) {
    document.body.classList.toggle('dive-active', !!active);
  }

  function enterFractalDive(target, hitPoint = null, opts = null) {
    if (!target || !fractaloidRuntimeSystem) return;
    const options = opts || {};
    const entered = fractaloidRuntimeSystem.enterDive(target, {
      hitPoint,
      width: W,
      height: H,
      randomizeClass: !!options.randomizeClass,
      randomizeClassFn: randomizeFractalDiveTarget
    });
    if (entered) {
      state = 'fractaldive';
      setDiveUiActive(true);
    }
  }

  function maybeEnterFractalDive(target, hitPoint = null) {
    if (!fractaloidRuntimeSystem) return false;
    const entered = fractaloidRuntimeSystem.maybeEnterDive({
      target,
      hitPoint,
      state,
      wave,
      keys,
      fractaloids,
      minWave: FRACTAL_DIVE_MIN_WAVE,
      autoDiveWaveInterval: FRACTAL_DIVE_AUTO_WAVE_INTERVAL,
      randomizeClassFn: randomizeFractalDiveTarget,
      width: W,
      height: H
    });
    if (entered) {
      state = 'fractaldive';
      setDiveUiActive(true);
    }
    return entered;
  }

  function updateFractalDive(dt) {
    if (!fractaloidRuntimeSystem) return;
    fractaloidRuntimeSystem.updateDive(dt, W, H);
  }

  function drawFractalDiveOverlay() {
    if (!fractaloidRuntimeSystem) return;
    fractaloidRuntimeSystem.drawDiveOverlay(ctx, W, H, FRACTAL_DIVE_AUTO_WAVE_INTERVAL);
  }

  function exitFractalDive() {
    if (!fractaloidRuntimeSystem) {
      state = 'playing';
      setDiveUiActive(false);
      return;
    }
    const a = fractaloidRuntimeSystem.consumeDiveTarget();
    if (!a) {
      state = 'playing';
      setDiveUiActive(false);
      return;
    }
    const idx = fractaloids.indexOf(a);
    if (idx >= 0) fractaloids.splice(idx, 1);
    spawnShockwave(a.x, a.y, a.r, a.fseed || 0);
    awardFractaloidScore(FRACTALOID_SCORE[a.sizeKey]);
    checkExtraLife();
    sfx.bangSmall();
    explode(a.x, a.y, 10, 0.75);
    if (fractaloids.length === 0) {
      state = 'wavebreak';
      stateTimer = 2.0;
    } else {
      state = 'playing';
    }
    setDiveUiActive(false);
  }

  function awardFractaloidScore(baseScore) {
    const gained = funPack.award(baseScore);
    score += gained;
    return gained;
  }

  function damageFractaloid(a, hitPoint, grantScore) {
    if (!fractaloidCombatSystem) return false;
    return fractaloidCombatSystem.damageFractaloid(a, hitPoint, grantScore, {
      wave,
      fractaloids,
      makeFractaloid,
      spawnShockwave,
      explode,
      sfx,
      fract,
      awardFractaloidScore,
      addRawScore: (points) => { score += points; }
    });
  }

  function splitFractaloid(a, hitPoint = null, grantScore = true) {
    if (!fractaloidCombatSystem) return;
    fractaloidCombatSystem.splitFractaloid(a, hitPoint, grantScore, {
      wave,
      fractaloids,
      makeFractaloid,
      spawnShockwave,
      explode,
      sfx,
      fract,
      awardFractaloidScore,
      addRawScore: (points) => { score += points; }
    });
  }

  // ============================================================
  // GAMEPLAY SYSTEMS (saucer, particles, bullets, collisions)
  // ============================================================
  function spawnSaucer() {
    if (!gameplaySystems) return;
    gameplaySystems.spawnSaucer();
  }

  function updateSaucer(dt) {
    if (!gameplaySystems) return;
    gameplaySystems.updateSaucer(dt);
  }

  function drawSaucer() {
    if (!gameplaySystems) return;
    gameplaySystems.drawSaucer();
  }

  function explode(x, y, count, scale = 1) {
    if (!gameplaySystems) return;
    gameplaySystems.explode(x, y, count, scale);
  }

  function spawnShockwave(x, y, sourceRadius, seed = 0) {
    if (!gameplaySystems) return;
    gameplaySystems.spawnShockwave(x, y, sourceRadius, seed);
  }

  function updateParticles(dt) {
    if (!gameplaySystems) return;
    gameplaySystems.updateParticles(dt);
  }

  function updateShockwaves(dt) {
    if (!gameplaySystems) return;
    gameplaySystems.updateShockwaves(dt);
  }

  function drawParticles() {
    if (!gameplaySystems) return;
    gameplaySystems.drawParticles();
  }

  function drawShockwaves() {
    if (!gameplaySystems) return;
    gameplaySystems.drawShockwaves();
  }

  function updateBullets(dt) {
    if (!gameplaySystems) return;
    gameplaySystems.updateBullets(dt);
  }

  function drawBullets() {
    if (!gameplaySystems) return;
    gameplaySystems.drawBullets();
  }

  function checkCollisions() {
    if (!gameplaySystems) return;
    gameplaySystems.checkCollisions();
  }

  function checkExtraLife() {
    if (!gameplaySystems) return;
    gameplaySystems.checkExtraLife();
  }

  // ============================================================
  // GAME FLOW
  // ============================================================
  function startGame() {
    if (bootBlocked) return;
    void applyFullscreenQueryAction();
    ensureAudio();
    score = 0;
    lives = 6;
    wave = 1;
    nextExtraLife = 15000;
    heartbeatSystem.reset();
    bullets = [];
    fractaloids = [];
    particles = [];
    shockwaves = [];
    if (fractaloidRuntimeSystem) fractaloidRuntimeSystem.clearDive();
    deathLifeSpent = false;
    inputFeelSystem.reset();
    saucer = null;
    saucerBullets = [];
    activeThreatCues = [];
    saucerTimer = rand(15, 25);
    funPack.resetRun();
    wavePace = { spawnMul: 1, speedMul: 1, saucerCadenceMul: 1 };
    ship = makeShip();
    state = 'playing';
    setDiveUiActive(false);
    document.body.classList.add('playing');
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    spawnWave(wave);
    saucerTimer = Math.max(8, rand(15, 25) / Math.max(0.68, wavePace.saucerCadenceMul || 1));
  }

  function endGame() {
    state = 'gameover';
    if (fractaloidRuntimeSystem) fractaloidRuntimeSystem.clearDive();
    deathLifeSpent = false;
    inputFeelSystem.reset();
    activeThreatCues = [];
    setDiveUiActive(false);
    document.body.classList.remove('playing');
    document.getElementById('final-score').textContent = 'SCORE: ' + score.toString().padStart(6, '0');
    document.getElementById('gameover-screen').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
  }

  function isRespawnSpotSafe(x, y, safeR) {
    const probe = { x, y };
    for (const a of fractaloids) {
      const rr = (a.r + safeR);
      if (dist2(probe, a) < rr * rr) return false;
    }
    if (saucer) {
      const rr = (saucer.r + safeR);
      if (dist2(probe, saucer) < rr * rr) return false;
    }
    for (const b of saucerBullets) {
      const br = b.r || 2;
      const rr = (br + safeR);
      if (dist2(probe, b) < rr * rr) return false;
    }
    return true;
  }

  function findRespawnSpot() {
    const cx = W * 0.5;
    const cy = H * 0.5;
    const cycleComplete = hasCompletedFractaloidCycle(wave);
    const waveProgress = cycleComplete
      ? Math.max(0, wave - FRACTALOID_CLASS_SEQUENCE.length)
      : Math.max(0, wave - 6);
    const relaxT = clamp(waveProgress / 24, 0, 1);
    const strictR = cycleComplete ? 62 : 66;
    const minR = cycleComplete ? 34 : 50;
    const safeR = strictR - (strictR - minR) * relaxT;

    if (isRespawnSpotSafe(cx, cy, safeR)) {
      return { x: cx, y: cy, relaxed: false };
    }

    const step = Math.max(18, safeR * 0.52);
    const maxRadius = Math.hypot(W, H) * 0.52;
    const rings = Math.max(5, Math.ceil(maxRadius / step));
    const edgeMargin = Math.max(24, safeR * 0.64);

    for (let ring = 1; ring <= rings; ring++) {
      const radius = ring * step;
      const samples = Math.max(12, Math.ceil((Math.PI * 2 * radius) / Math.max(16, step * 0.9)));
      const phase = ring * 0.37;
      for (let i = 0; i < samples; i++) {
        const a = phase + (i / samples) * Math.PI * 2;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        if (x < edgeMargin || x > W - edgeMargin || y < edgeMargin || y > H - edgeMargin) continue;
        if (isRespawnSpotSafe(x, y, safeR)) {
          return { x, y, relaxed: false };
        }
        if (cycleComplete && ring > rings * 0.55) {
          const relaxedR = Math.max(minR * 0.82, safeR * 0.82);
          if (isRespawnSpotSafe(x, y, relaxedR)) {
            return { x, y, relaxed: true };
          }
        }
      }
    }

    return null;
  }

  function respawnShip() {
    const spot = findRespawnSpot();
    if (!spot) return;
    ship = makeShip();
    ship.x = spot.x;
    ship.y = spot.y;
    if (spot.relaxed) ship.invuln = Math.max(ship.invuln, 3.2);
    state = 'playing';
  }

  renderBootIssues();
  bindFullscreenButtons();
  updateFullscreenUi();
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('start-btn').addEventListener('touchend', (e) => { e.preventDefault(); startGame(); });
  document.getElementById('restart-btn').addEventListener('click', startGame);
  document.getElementById('restart-btn').addEventListener('touchend', (e) => { e.preventDefault(); startGame(); });

  // ============================================================
  // HUD
  // ============================================================
  function updateHUD() {
    document.getElementById('score').textContent = score.toString().padStart(6, '0');
    let livesStr = '';
    for (let i = 0; i < lives; i++) livesStr += '^';
    document.getElementById('lives').textContent = livesStr;
    const genomeLabel = waveProfile ? waveProfile.name.toUpperCase() : 'FRACTAL';
    const classLabel = fractaloidClassLabel(getFractaloidClass());
    const bossLabel = wave % BOSS_WAVE_INTERVAL === 0 ? ' • BOSS' : '';
    const chainLabel = funPack.getChainLabel();
    document.getElementById('wave').textContent = 'WAVE ' + wave + ' • ' + classLabel + ' • ' + genomeLabel + bossLabel + chainLabel;
  }

  // ============================================================
  // STARFIELD (subtle background)
  // ============================================================
  const stars = [];
  for (let i = 0; i < 80; i++) {
    stars.push({ x: Math.random(), y: Math.random(), b: Math.random() * 0.4 + 0.1, tw: Math.random() });
  }
  function drawStars(t) {
    for (const s of stars) {
      const flicker = 0.7 + 0.3 * Math.sin(t * 2 + s.tw * 10);
      ctx.fillStyle = `rgba(255,255,255,${s.b * flicker})`;
      ctx.fillRect(s.x * W, s.y * H, 1, 1);
    }
  }

  function perfFrameInfo(dt) {
    return {
      dtMs: dt * 1000,
      state,
      wave,
      fractaloids: fractaloids.length,
      bullets: bullets.length,
      saucerBullets: saucerBullets.length,
      particles: particles.length,
      shockwaves: shockwaves.length,
      viewportWidth: VIEW_W,
      viewportHeight: VIEW_H,
      worldWidth: W,
      worldHeight: H,
      displayScale: DISPLAY_SCALE,
      displayScaleX: DISPLAY_SCALE_X,
      displayScaleY: DISPLAY_SCALE_Y,
      renderWidth: canvas ? canvas.width : 0,
      renderHeight: canvas ? canvas.height : 0,
      dpr: DPR,
      maxFps: MAX_FPS > 0 ? MAX_FPS : 0
    };
  }

  // ============================================================
  // MAIN LOOP
  // ============================================================
  let lastTime = performance.now();
  let lastRafTime = lastTime;
  let cappedFrameCarryMs = 0;
  let totalTime = 0;

  function frame(now) {
    if (!ctx) return;
    if (MAX_FPS_FRAME_MS > 0) {
      const rafDelta = Math.max(0, now - lastRafTime);
      lastRafTime = now;
      cappedFrameCarryMs += rafDelta;
      if (cappedFrameCarryMs < MAX_FPS_FRAME_MS) {
        requestAnimationFrame(frame);
        return;
      }
      // Preserve remainder so fractional caps (e.g. 59.94) stay accurate over time.
      cappedFrameCarryMs %= MAX_FPS_FRAME_MS;
    } else {
      lastRafTime = now;
    }

    const perfFrame = perfMetrics.beginFrame(now);
    let dt = (now - lastTime) / 1000;
    if (dt > 0.05) dt = 0.05; // clamp
    lastTime = now;
    totalTime += dt;
    funPack.tick(dt);
    inputFeelSystem.tick(dt, { active: state === 'playing' && !!ship && ship.alive });

    // clear
    ctx.fillStyle = CRT_CLEAR_COLOR;
    ctx.fillRect(0, 0, W, H);

    drawStars(totalTime);

    if (state === 'fractaldive') {
      activeThreatCues = [];
      updateFractalDive(dt);
      drawFractaloids(totalTime, []);
      drawFractalDiveOverlay();
      updateHUD();
      perfMetrics.endFrame(perfFrame, perfFrameInfo(dt));
      requestAnimationFrame(frame);
      return;
    }

    if (state === 'playing' || state === 'dying' || state === 'wavebreak') {
      // dynamic heartbeat: speeds up as waves escalate and danger increases
      const baseInterval = Math.max(0.52, 1.02 - Math.min(0.44, (wave - 1) * 0.022));
      const minInterval = Math.max(0.14, 0.32 - Math.min(0.14, (wave - 1) * 0.007));
      const remainingFactor = Math.min(1, fractaloids.length / 12);
      const dangerFactor = heartbeatSystem.measureDanger({
        ship,
        fractaloids,
        saucerBullets,
        width: W,
        height: H
      });
      const chaseFactor = Math.max(1 - remainingFactor, dangerFactor);
      heartbeatSystem.setIntervalSec(baseInterval - (baseInterval - minInterval) * chaseFactor);
      heartbeatSystem.update(dt, { state, wave });

      if (state === 'playing') {
        updateShip(ship, dt);
      }
      // fractaloids and saucer always move
      for (const a of fractaloids) updateFractaloid(a, dt);

      saucerTimer -= dt;
      if (!saucer && saucerTimer <= 0 && state === 'playing') {
        spawnSaucer();
        const cadence = Math.max(0.68, wavePace.saucerCadenceMul || 1);
        saucerTimer = Math.max(5, (rand(20, 35) / cadence) - Math.log2(Math.max(2, wave + 1)) * 1.2);
      }
      updateSaucer(dt);

      updateBullets(dt);
      updateParticles(dt);
      updateShockwaves(dt);

      if (state === 'playing') checkCollisions();

      if (state === 'playing' && ship && ship.alive && ship.invuln <= 0) {
        activeThreatCues = threatCueSystem.compute({
          ship,
          fractaloids,
          saucerBullets,
          width: W,
          height: H,
          maxThreats: 2
        });
      } else {
        activeThreatCues = [];
      }

      // draw
      drawFractaloids(totalTime, saucerBullets);
      if (state === 'playing' && ship && ship.alive) {
        threatCueSystem.draw({
          ship,
          threats: activeThreatCues,
          width: W,
          height: H,
          timeSec: totalTime
        });
      }
      drawShockwaves();
      drawSaucer();
      if (state === 'playing') drawShip(ship);
      drawBullets();
      drawParticles();

      // wave progression
      if (state === 'playing' && fractaloids.length === 0) {
        state = 'wavebreak';
        stateTimer = 2.0;
      }

      if (state === 'wavebreak') {
        stateTimer -= dt;
        // big wave text
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#88f';
        ctx.fillText('WAVE ' + (wave + 1), W/2, H/2 - 20);
        ctx.font = '14px "VT323", monospace';
        const nextGenome = makeWaveProfile(wave + 1).name.toUpperCase();
        const nextClass = fractaloidClassLabel(resolveFractaloidClassForWave(wave + 1));
        const nextBoss = (wave + 1) % BOSS_WAVE_INTERVAL === 0 ? ' • BOSS GENOTYPE' : '';
        ctx.fillText('incoming: ' + nextClass + ' • ' + nextGenome + nextBoss, W/2, H/2 + 20);
        ctx.restore();
        if (stateTimer <= 0) {
          wave++;
          spawnWave(wave);
          state = 'playing';
        }
      }

      if (state === 'dying') {
        stateTimer -= dt;
        if (stateTimer <= 0) {
          if (!deathLifeSpent) {
            lives--;
            deathLifeSpent = true;
            if (lives <= 0) {
              endGame();
            }
            else {
              funPack.triggerReliefForLives(lives);
            }
          }
          if (state === 'dying') {
            // wait for clear spawn area; do not spend extra lives while waiting
            respawnShip();
            if (state === 'dying') stateTimer = 0.2; // try again shortly
            else deathLifeSpent = false;
          }
        }
      }

      updateHUD();
    } else if (state === 'title') {
      // animated demo fractaloids on title screen
      if (fractaloids.length === 0) {
        for (let i = 0; i < 5; i++) {
          fractaloids.push(makeFractaloid(rand(0,W), rand(0,H), 3));
        }
      }
      for (const a of fractaloids) updateFractaloid(a, dt);
      drawFractaloids(totalTime, []);
    } else if (fractalRenderer) {
      drawFractaloids(totalTime, []);
    }

    perfMetrics.endFrame(perfFrame, perfFrameInfo(dt));
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
