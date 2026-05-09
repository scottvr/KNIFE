(() => {
  'use strict';

  // ============================================================
  // SETUP
  // ============================================================
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const fractalCanvas = document.getElementById('fractal-layer');
  const gl = fractalCanvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false });
  const fractalRendererFactory = (window.FrackingFractalRenderer && typeof window.FrackingFractalRenderer.create === 'function')
    ? window.FrackingFractalRenderer.create
    : null;
  let fractalRenderer = null;
  if (gl && fractalRendererFactory) {
    try {
      fractalRenderer = fractalRendererFactory(gl);
    } catch (err) {
      console.warn('GL fractaloid renderer unavailable, using vector fallback.', err);
    }
  } else if (gl && !fractalRendererFactory) {
    console.warn('Fractal renderer module missing; using vector fallback.');
  }

  const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isMobile) {
    document.body.classList.add('mobile');
    document.getElementById('desktop-instr').classList.add('hidden');
    document.getElementById('mobile-instr').classList.remove('hidden');
  }

  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const wrap = document.getElementById('game-wrap');
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    fractalCanvas.style.width = W + 'px';
    fractalCanvas.style.height = H + 'px';
    fractalCanvas.width = Math.floor(W * DPR);
    fractalCanvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
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
        keys: { left: false, right: false, thrust: false, fire: false, hyper: false },
        consumeHyperPressed: () => false,
        destroy: () => {}
      };
  const keys = inputSystem.keys;

  // ============================================================
  // GAME STATE
  // ============================================================
  let state = 'title'; // title | playing | dying | wavebreak | gameover
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
  let saucerTimer = 0;
  let waveProfile = null;
  let activeFractaloidClass = 'mandelbrot';

  // Tunable constants (classic-ish)
  const SHIP_SIZE = 22;
  const SHIP_TURN = 4.5; // rad/s
  const SHIP_THRUST = 220; // px/s^2
  const SHIP_FRICTION = 0.4; // per second
  const SHIP_MAX_SPEED = 420;
  const BULLET_SPEED = 540;
  const BULLET_LIFE = 0.85;
  const MAX_BULLETS = 8; // power-of-two ammo ceiling
  const FIRE_COOLDOWN_BASE = 0.04;
  const FIRE_PATTERN = [1, 1,  2, 1, 1, 4, 1, 1, 8];
  const SHIP_FRACTAL_CLASS = 'mandelbrot_outline'; // 'sierpinski' | 'mandelbrot_outline'
  const FRACTALOID_CLASS = 'cycle'; // 'cycle' | 'tau' | 'magnet' | 'buffalo' | 'tricorn' | 'julia' | 'mande
  const SHIP_FRACTAL_CLASSES = ['sierpinski', 'mandelbrot_outline'];
  const FRACTALOID_CLASSES = ['tau', 'magnet', 'buffalo', 'tricorn', 'julia', 'mandelbrot'];
  const FRACTALOID_CLASS_SEQUENCE = [ 'mandelbrot', 'magnet', 'julia', 'buffalo', 'tricorn', 'julia', 'mandelbrot', 'tau'];
  const FRACTALOID_MIX_AFTER_CYCLE = true;
  const FRACTALOID_CLASS_MODES = {
    tau: 0,
    julia: 1,
    magnet: 2,
    buffalo: 3,
    tricorn: 4,
    mandelbrot: 5 // compatibility alias
  };
  const FRACTALOID_MODE_NAMES = {
    0: 'tau',
    1: 'julia',
    2: 'magnet',
    3: 'buffalo',
    4: 'tricorn',
    5: 'mandelbrot'
  };
  const FRACTALOID_CLASS_SPECS = {
    mandelbrot: {
      mode: FRACTALOID_CLASS_MODES.mandelbrot,
      label: 'MANDELBROT',
      focusX: -0.450,
      focusY: 0.003,
      zoomBase: 0.92,
      zoomVariance: 0.52,
      zoomMin: 0.38,
      zoomMax: 2.35,
      spreadMul: 0.94,
      waveZoomMul: 0.58,
      childZoomMin: 0.62,
      childZoomMax: 0.82,
      childTangent: 0.21
    },
    tau: {
      mode: FRACTALOID_CLASS_MODES.tau,
      label: 'TAU BROT',
      focusX: -0.222,
      focusY: 0.003,
      zoomBase: 0.92,
      zoomVariance: 0.52,
      zoomMin: 0.38,
      zoomMax: 2.35,
      spreadMul: 0.94,
      waveZoomMul: 0.58,
      childZoomMin: 0.62,
      childZoomMax: 0.82,
      childTangent: 0.21
    },
    julia: {
      mode: FRACTALOID_CLASS_MODES.julia,
      label: 'JULIA',
      focusX: -0.7445,
      focusY: 0.1318,
      zoomBase: 2.0,
      zoomVariance: 0.56,
      zoomMin: 1.5,
      zoomMax: 2.5,
      spreadMul: 1.0,
      waveZoomMul: 0.52,
      childZoomMin: 0.74,
      childZoomMax: 0.92,
      childTangent: 0.11
    },
    magnet: {
      mode: FRACTALOID_CLASS_MODES.magnet,
      label: 'MAGNET',
      focusX: .5,
      focusY: 0.0,
      zoomBase: 1.0,
      zoomVariance: 0.38,
      zoomMin: 0.6,
      zoomMax: 1.7,
      spreadMul: 0.58,
      waveZoomMul: 0.56,
      childZoomMin: 0.64,
      childZoomMax: 0.86,
      childTangent: 0.18
    },
    buffalo: {
      mode: FRACTALOID_CLASS_MODES.buffalo,
      label: 'BUFFALO',
      focusX: -1.813978835021709,
      focusY: -0.18926374819102731,
      zoomBase: 1 / 10.7,
      zoomVariance: 0.034,
      zoomMin: 0.026,
      zoomMax: 0.24,
      spreadMul: 0.42,
      waveZoomMul: 0.36,
      childZoomMin: 0.68,
      childZoomMax: 0.9,
      childTangent: 0.16
    },
    tricorn: {
      mode: FRACTALOID_CLASS_MODES.tricorn,
      label: 'TRICORN',
      focusX: -0.485,
      focusY: 0.0,
      zoomBase: 1.04,
      zoomVariance: 0.56,
      zoomMin: 0.34,
      zoomMax: 2.2,
      spreadMul: 0.84,
      waveZoomMul: 0.6,
      childZoomMin: 0.6,
      childZoomMax: 0.84,
      childTangent: 0.2
    }
  };
  const FRACTALOID_PALETTE_MODES = { cosmic: 0, ember: 1, firefly: 2, gold: 3, plasma: 4 };
  const FRACTALOID_PERIMETER_MODE = 'none'; // 'none' | 'polygon'
  const FRACTALOID_CHROMA_TWEAK = 1.0; // 0..1, set to 0 to disable chroma/luma rescue boosts
  const FRACTALOID_NEON_TWEAK = 0.01; // 0..1, set to 0 for flatter/older look
  const SAUCER_FRACTAL_CLASS = 'cycle'; // 'cycle' | 'classic' | 'sierpinski' | 'koch'
  const SAUCER_FRACTAL_CLASSES = ['classic', 'sierpinski', 'koch'];
  const shipIconAsset = window.FrackingShipIcon || null;
  const SHIP_ICON_VIEWBOX = shipIconAsset && shipIconAsset.viewBox
    ? shipIconAsset.viewBox
    : { x: 1.1, y: 0.45, w: 5.6, h: 5.6 };
  const SHIP_ICON_STROKE_WIDTH = shipIconAsset && typeof shipIconAsset.strokeWidth === 'number'
    ? shipIconAsset.strokeWidth
    : 0.23;
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
  const JULIA_AREA_TARGET_FILL = 0.49;
  const JULIA_AREA_MIN_SCALE = 3.66;
  const JULIA_AREA_MAX_SCALE = 4.0;
  const JULIA_AREA_SCALE_BLEND = 0.58;
  const JULIA_AREA_SAMPLE_GRID = 17;
  const JULIA_AREA_MAX_ITER = 76;
  const JULIA_VISIBLE_FILL_MIN = .055;
  const JULIA_VIEW_ATTEMPTS = 14;
  const JULIA_SHAPE_SCALE_FAILSAFE = 1.16;
  const JULIA_ZOOM_MIN = 0.54;
  const JULIA_ZOOM_MAX = 2.8;
  const juliaAreaScaleCache = new Map();
  const MANDEL_VIEW_ATTEMPTS = 10;
  const MANDEL_SAMPLE_GRID = 13;
  const MANDEL_MAX_ITER = 72;
  const MANDEL_ESCAPE_TARGET = 0.42;
  const MANDEL_ESCAPE_MIN = 0.16;
  const MANDEL_ZOOM_MIN = 0.56;
  const MANDEL_ZOOM_MAX = 2.9;
  const MANDEL_ZOOM_FLOOR_STEPS = [0.9, 0.82, 0.74, 0.66, 0.58, 0.52, 0.46, 0.4];
  const FRACTALOID_CENTERING_GRID = 15;
  const FRACTALOID_CENTERING_MAX_ITER = 84;
  const FRACTALOID_CENTERING_PASSES = 2;

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
  const WAVE_GENOMES = [
    { name: 'Filament', focusX: -0.7445, focusY: 0.1318, seedBias: 0.06, spread: 1.0, zoomBase: 1.62 },
    { name: 'Seahorse', focusX: -0.748, focusY: 0.104, seedBias: 0.24, spread: 0.9, zoomBase: 1.72 },
    { name: 'Needle', focusX: -1.25066, focusY: 0.02012, seedBias: 0.56, spread: 0.62, zoomBase: 1.86 },
    { name: 'Elephant', focusX: 0.285, focusY: 0.012, seedBias: 0.78, spread: 0.72, zoomBase: 1.78 }
  ];

  const SAUCER_LARGE = { r: 19, score: 200, speed: 90, fireRate: 1.6, accuracy: 0.0 };
  const SAUCER_SMALL = { r: 16, score: 1000, speed: 130, fireRate: 1.0, accuracy: 0.85 };

  // ============================================================
  // UTILITIES
  // ============================================================
  function rand(a, b) { return a + Math.random() * (b - a); }
  function randSign() { return Math.random() < 0.5 ? -1 : 1; }

  function fract(v) { return v - Math.floor(v); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function waveNoise(w, salt) { return fract(Math.sin(w * 127.1 + salt * 311.7) * 43758.5453123); }
  function waveRange(w, salt, min, max) { return min + (max - min) * waveNoise(w, salt); }
  function weightedPickPaletteMode(weightedModes) {
    let total = 0;
    for (const item of weightedModes) total += Math.max(0, item[1]);
    if (total <= 0) return weightedModes[0][0];

    let roll = Math.random() * total;
    for (const item of weightedModes) {
      const weight = Math.max(0, item[1]);
      if (roll <= weight) return item[0];
      roll -= weight;
    }
    return weightedModes[weightedModes.length - 1][0];
  }

  function pickFractaloidPaletteMode(mode, isBoss = false, parentMode = null) {
    if (parentMode != null && Math.random() < 0.82) {
      return parentMode;
    }

    const P = FRACTALOID_PALETTE_MODES;
    const isJulia = mode === FRACTALOID_CLASS_MODES.julia;
    const weighted = isBoss
      ? (isJulia
          ? [[P.plasma, 0.36], [P.gold, 0.24], [P.ember, 0.18], [P.cosmic, 0.16], [P.firefly, 0.06]]
          : [[P.plasma, 0.34], [P.cosmic, 0.26], [P.gold, 0.22], [P.ember, 0.10], [P.firefly, 0.08]])
      : (isJulia
          ? [[P.firefly, 0.30], [P.ember, 0.26], [P.gold, 0.20], [P.cosmic, 0.14], [P.plasma, 0.10]]
          : [[P.cosmic, 0.34], [P.plasma, 0.24], [P.gold, 0.20], [P.ember, 0.14], [P.firefly, 0.08]]);

    return weightedPickPaletteMode(weighted);
  }

  function paletteRgbAt(t, seed, paletteMode = FRACTALOID_PALETTE_MODES.cosmic) {
    const tau = Math.PI * 2;
    const phase = seed * tau;
    const cycle = phase;
    const p = t;
    const mix = (a, b, m) => a + (b - a) * m;

    if (paletteMode === FRACTALOID_PALETTE_MODES.ember) {
      const q = fract(p + cycle * 0.05 + seed * 0.37);
      const c0 = [0.010, 0.000, 0.000];
      const c1 = [0.180, 0.000, 0.000];
      const c2 = [0.600, 0.080, 0.000];
      const c3 = [1.000, 0.420, 0.060];
      const c4 = [1.000, 0.900, 0.350];
      let a = c0;
      let b = c1;
      let m = q / 0.22;
      if (q >= 0.22 && q < 0.50) {
        a = c1;
        b = c2;
        m = (q - 0.22) / 0.28;
      } else if (q >= 0.50 && q < 0.78) {
        a = c2;
        b = c3;
        m = (q - 0.50) / 0.28;
      } else if (q >= 0.78) {
        a = c3;
        b = c4;
        m = (q - 0.78) / 0.22;
      }
      return [mix(a[0], b[0], m), mix(a[1], b[1], m), mix(a[2], b[2], m)];
    }

    if (paletteMode === FRACTALOID_PALETTE_MODES.firefly) {
      const p2 = (p + seed * 0.11) * tau + cycle * 1.1;
      const g = Math.pow(0.5 + 0.5 * Math.sin(p2 + 0.7), 2.5);
      return [
        clamp(0.02 + 0.18 * g, 0, 1),
        clamp(0.08 + 0.55 * g, 0, 1),
        clamp(0.01 + 0.10 * Math.sin(p2 * 0.6 + 2.0 + seed * 4.0), 0, 1)
      ];
    }

    if (paletteMode === FRACTALOID_PALETTE_MODES.gold) {
      const sn = Math.max(p + seed * 0.06, 0.000001);
      const q = fract(Math.pow(sn, 0.35) * 0.15 + cycle * 0.02 + seed * 0.28);
      const c0 = [0.000, 0.027, 0.392];
      const c1 = [0.125, 0.420, 0.796];
      const c2 = [0.929, 1.000, 1.000];
      const c3 = [1.000, 0.667, 0.000];
      const c4 = [0.000, 0.008, 0.000];
      let a = c0;
      let b = c1;
      let m = q / 0.1600;
      if (q >= 0.1600 && q < 0.4200) {
        a = c1;
        b = c2;
        m = (q - 0.1600) / 0.2600;
      } else if (q >= 0.4200 && q < 0.6425) {
        a = c2;
        b = c3;
        m = (q - 0.4200) / 0.2225;
      } else if (q >= 0.6425 && q < 0.8575) {
        a = c3;
        b = c4;
        m = (q - 0.6425) / 0.2150;
      } else if (q >= 0.8575) {
        a = c4;
        b = c0;
        m = (q - 0.8575) / 0.1425;
      }
      return [mix(a[0], b[0], m), mix(a[1], b[1], m), mix(a[2], b[2], m)];
    }

    if (paletteMode === FRACTALOID_PALETTE_MODES.plasma) {
      const p2 = p * 2.0 + cycle * 2.0 + seed * tau;
      return [
        0.5 + 0.5 * Math.sin(p2),
        0.5 + 0.5 * Math.sin(p2 + 2.094),
        0.5 + 0.5 * Math.sin(p2 + 4.188)
      ];
    }

    return [
      0.5 + 0.5 * Math.cos(3.0 + p + cycle * 0.5 + cycle * 0.31),
      0.5 + 0.5 * Math.cos(3.0 + p * 0.7 + cycle * 0.3 + cycle * 0.19),
      0.5 + 0.5 * Math.cos(3.0 + p * 0.5 + cycle * 0.2 + cycle * 0.11)
    ];
  }

  function paletteVibranceScore(seed, paletteMode = FRACTALOID_PALETTE_MODES.cosmic) {
    const samples = [0.06, 0.19, 0.33, 0.51, 0.74, 0.91];
    let chromaSum = 0;
    let minChroma = Infinity;
    let lumaMin = Infinity;
    let lumaMax = -Infinity;
    for (const t of samples) {
      const [r, g, b] = paletteRgbAt(t, seed, paletteMode);
      const hi = Math.max(r, g, b);
      const lo = Math.min(r, g, b);
      const chroma = hi - lo;
      const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
      chromaSum += chroma;
      minChroma = Math.min(minChroma, chroma);
      lumaMin = Math.min(lumaMin, luma);
      lumaMax = Math.max(lumaMax, luma);
    }
    const avgChroma = chromaSum / samples.length;
    const lumaSpan = lumaMax - lumaMin;
    return avgChroma * 0.7 + minChroma * 0.9 + lumaSpan * 0.4;
  }

  function pickVibrantPaletteSeed(seedHint = Math.random(), paletteMode = FRACTALOID_PALETTE_MODES.cosmic) {
    const norm = (v) => fract(fract(v) + 1);
    const threshold = paletteMode === FRACTALOID_PALETTE_MODES.firefly ? 0.21 : 0.26;
    const candidates = [
      norm(seedHint),
      norm(seedHint + 0.137),
      norm(seedHint + 0.319),
      norm(seedHint + 0.618),
      Math.random(),
      Math.random()
    ];

    let bestSeed = candidates[0];
    let bestScore = -Infinity;
    for (const seed of candidates) {
      const score = paletteVibranceScore(seed, paletteMode);
      if (score > bestScore) {
        bestScore = score;
        bestSeed = seed;
      }
      if (score >= threshold) return seed;
    }
    return bestSeed;
  }

  function cPowReal(re, im, power) {
    const r = Math.hypot(re, im);
    if (r < 1e-9) return { re: 0, im: 0 };
    const theta = Math.atan2(im, re);
    const rp = Math.pow(r, power);
    const pt = theta * power;
    return { re: rp * Math.cos(pt), im: rp * Math.sin(pt) };
  }

  function cDiv(aRe, aIm, bRe, bIm) {
    const denom = bRe * bRe + bIm * bIm;
    if (denom < 1e-9) return { re: 1e6, im: 1e6 };
    return {
      re: (aRe * bRe + aIm * bIm) / denom,
      im: (aIm * bRe - aRe * bIm) / denom
    };
  }

  function iterateFractaloidOrbit(mode, cx, cy, jx, jy, maxIter = FRACTALOID_CENTERING_MAX_ITER) {
    const tauPower = Math.PI * 2;
    const isJulia = isJuliaMode(mode);
    const bailout = mode === FRACTALOID_CLASS_MODES.magnet ? 10 : 4;
    const bailout2 = bailout * bailout;
    const cRe = isJulia ? jx : cx;
    const cIm = isJulia ? jy : cy;
    let zRe = isJulia ? cx : 0;
    let zIm = isJulia ? cy : 0;

    for (let i = 0; i < maxIter; i++) {
      let nx;
      let ny;
      if (mode === FRACTALOID_CLASS_MODES.tau) {
        const zp = cPowReal(zRe, zIm, tauPower);
        nx = zp.re + cRe;
        ny = zp.im + cIm;
      } else if (mode === FRACTALOID_CLASS_MODES.magnet) {
        const z2x = zRe * zRe - zIm * zIm;
        const z2y = 2 * zRe * zIm;
        const numRe = z2x + cRe - 1;
        const numIm = z2y + cIm;
        const denRe = 2 * zRe + cRe - 2;
        const denIm = 2 * zIm + cIm;
        const q = cDiv(numRe, numIm, denRe, denIm);
        nx = q.re * q.re - q.im * q.im;
        ny = 2 * q.re * q.im;
      } else if (mode === FRACTALOID_CLASS_MODES.buffalo) {
        nx = Math.abs(zRe * zRe - zIm * zIm) + cRe;
        ny = Math.abs(2 * zRe * zIm) + cIm;
      } else if (mode === FRACTALOID_CLASS_MODES.tricorn) {
        nx = zRe * zRe - zIm * zIm + cRe;
        ny = -2 * zRe * zIm + cIm;
      } else {
        nx = zRe * zRe - zIm * zIm + cRe;
        ny = 2 * zRe * zIm + cIm;
      }
      zRe = nx;
      zIm = ny;
      if (zRe * zRe + zIm * zIm > bailout2) return i;
    }

    return maxIter;
  }

  function estimateFractaloidCentroid(mode, jx, jy, fx, fy, fzoom, sampleGrid = FRACTALOID_CENTERING_GRID, maxIter = FRACTALOID_CENTERING_MAX_ITER) {
    let sumX = 0;
    let sumY = 0;
    let sumW = 0;
    let samples = 0;
    const juliaMode = isJuliaMode(mode);

    for (let gy = 0; gy < sampleGrid; gy++) {
      const y = ((gy + 0.5) / sampleGrid) * 2 - 1;
      for (let gx = 0; gx < sampleGrid; gx++) {
        const x = ((gx + 0.5) / sampleGrid) * 2 - 1;
        if (Math.hypot(x, y) > 1.12) continue;

        const cx = fx + x * fzoom;
        const cy = fy + y * fzoom;
        const iBreak = iterateFractaloidOrbit(mode, cx, cy, jx, jy, maxIter);
        const iterRatio = iBreak / maxIter;
        const interior = iBreak >= maxIter - 1 ? 1 : 0;

        let weight;
        if (juliaMode) {
          const band = smoothstep(0.30, 0.86, iterRatio) * (1 - smoothstep(0.93, 0.999, iterRatio));
          weight = band + interior * 0.22;
        } else {
          const boundary = smoothstep(0.56, 0.95, iterRatio);
          weight = interior * 0.95 + boundary * 0.85;
        }

        if (weight > 0.0001) {
          sumX += x * weight;
          sumY += y * weight;
          sumW += weight;
        }
        samples++;
      }
    }

    if (sumW <= 1e-6 || samples <= 0) {
      return { cx: 0, cy: 0, confidence: 0 };
    }

    return {
      cx: sumX / sumW,
      cy: sumY / sumW,
      confidence: clamp(sumW / samples, 0, 1)
    };
  }

  function centerFractaloidView(mode, jx, jy, fx, fy, fzoom, passes = FRACTALOID_CENTERING_PASSES) {
    let tx = fx;
    let ty = fy;
    const magnetMode = mode === FRACTALOID_CLASS_MODES.magnet;
    const passCount = magnetMode ? Math.max(passes + 2, 4) : passes;
    const driftThreshold = magnetMode ? 0.0035 : 0.01;

    for (let i = 0; i < passCount; i++) {
      const centroid = estimateFractaloidCentroid(mode, jx, jy, tx, ty, fzoom);
      const drift = Math.hypot(centroid.cx, centroid.cy);
      if (drift < driftThreshold) break;
      const baseStrength = magnetMode ? 0.92 : 0.72;
      const falloff = magnetMode ? 0.14 : 0.2;
      const passStrength = Math.max(0.22, baseStrength - i * falloff);
      tx += centroid.cx * fzoom * passStrength;
      ty += centroid.cy * fzoom * passStrength;
    }
    return { fx: tx, fy: ty };
  }

  function estimateMandelbrotEscapeFill(mode, fx, fy, fzoom) {
    let escapeCount = 0;
    let sampleCount = 0;
    const grid = MANDEL_SAMPLE_GRID;
    const maxIter = MANDEL_MAX_ITER;
    const tauPower = Math.PI * 2;

    for (let gy = 0; gy < grid; gy++) {
      const y = ((gy + 0.5) / grid) * 2 - 1;
      for (let gx = 0; gx < grid; gx++) {
        const x = ((gx + 0.5) / grid) * 2 - 1;
        const r = Math.hypot(x, y);
        if (r > 1.15) continue;

        const cx = fx + x * fzoom;
        const cy = fy + y * fzoom;
        let zx = 0;
        let zy = 0;
        let escaped = 0;
        for (let i = 0; i < maxIter; i++) {
          let nx;
          let ny;
          if (mode === FRACTALOID_CLASS_MODES.tau) {
            const zp = cPowReal(zx, zy, tauPower);
            nx = zp.re + cx;
            ny = zp.im + cy;
          } else if (mode === FRACTALOID_CLASS_MODES.magnet) {
            const z2x = zx * zx - zy * zy;
            const z2y = 2 * zx * zy;
            const numRe = z2x + cx - 1;
            const numIm = z2y + cy;
            const denRe = 2 * zx + cx - 2;
            const denIm = 2 * zy + cy;
            const q = cDiv(numRe, numIm, denRe, denIm);
            nx = q.re * q.re - q.im * q.im;
            ny = 2 * q.re * q.im;
          } else if (mode === FRACTALOID_CLASS_MODES.buffalo) {
            nx = Math.abs(zx * zx - zy * zy) + cx;
            ny = Math.abs(2 * zx * zy) + cy;
          } else if (mode === FRACTALOID_CLASS_MODES.tricorn) {
            nx = zx * zx - zy * zy + cx;
            ny = -2 * zx * zy + cy;
          } else {
            nx = zx * zx - zy * zy + cx;
            ny = 2 * zx * zy + cy;
          }
          zx = nx;
          zy = ny;
          const bailout = mode === FRACTALOID_CLASS_MODES.magnet ? 10 : 4;
          if (zx * zx + zy * zy > bailout * bailout) {
            escaped = 1;
            break;
          }
        }

        escapeCount += escaped;
        sampleCount++;
      }
    }

    if (sampleCount === 0) return 0.5;
    return escapeCount / sampleCount;
  }

  function tuneMandelbrotView(mode, fx, fy, fzoom, spread, attempts = MANDEL_VIEW_ATTEMPTS, zoomMin = MANDEL_ZOOM_MIN, zoomMax = MANDEL_ZOOM_MAX) {
    let bestFx = fx;
    let bestFy = fy;
    let bestZoom = fzoom;
    let bestEscape = estimateMandelbrotEscapeFill(mode, fx, fy, fzoom);
    let bestScore = Math.abs(bestEscape - MANDEL_ESCAPE_TARGET)
      + Math.max(0, MANDEL_ESCAPE_MIN - bestEscape) * 2.4;

    for (let i = 0; i < attempts; i++) {
      const jitter = spread * (0.7 + i * 0.15) + fzoom * 0.08;
      const testFx = fx + rand(-jitter, jitter);
      const testFy = fy + rand(-jitter, jitter);
      const testZoom = clamp(fzoom * (0.72 + Math.random() * 0.74), zoomMin, zoomMax);
      const escape = estimateMandelbrotEscapeFill(mode, testFx, testFy, testZoom);
      const score = Math.abs(escape - MANDEL_ESCAPE_TARGET)
        + Math.max(0, MANDEL_ESCAPE_MIN - escape) * 2.4;
      if (score < bestScore) {
        bestScore = score;
        bestFx = testFx;
        bestFy = testFy;
        bestZoom = testZoom;
        bestEscape = escape;
        if (escape >= MANDEL_ESCAPE_MIN && Math.abs(escape - MANDEL_ESCAPE_TARGET) < 0.06) break;
      }
    }

    return { fx: bestFx, fy: bestFy, fzoom: bestZoom, escape: bestEscape };
  }

  function deriveMandelZoomFloorRatio(mode, fx, fy, baseFzoom) {
    let floor = MANDEL_ZOOM_FLOOR_STEPS[0];
    for (const ratio of MANDEL_ZOOM_FLOOR_STEPS) {
      const escape = estimateMandelbrotEscapeFill(mode, fx, fy, baseFzoom * ratio);
      if (escape >= MANDEL_ESCAPE_MIN) {
        floor = ratio;
      } else {
        break;
      }
    }
    return floor;
  }

  function estimateJuliaVisualFill(jx, jy, fx, fy, fzoom) {
    let alphaSum = 0;
    let sampleCount = 0;
    const grid = JULIA_AREA_SAMPLE_GRID;
    const maxIter = JULIA_AREA_MAX_ITER;

    for (let gy = 0; gy < grid; gy++) {
      const y = ((gy + 0.5) / grid) * 2 - 1;
      for (let gx = 0; gx < grid; gx++) {
        const x = ((gx + 0.5) / grid) * 2 - 1;
        const r = Math.hypot(x, y);
        if (r > 1.22) continue;

        const sx = fx + x * fzoom;
        const sy = fy + y * fzoom;
        let zx = sx;
        let zy = sy;
        let iBreak = maxIter;
        for (let i = 0; i < maxIter; i++) {
          const x2 = zx * zx - zy * zy + jx;
          const y2 = 2 * zx * zy + jy;
          zx = x2;
          zy = y2;
          if (zx * zx + zy * zy > 4) {
            iBreak = i;
            break;
          }
        }

        const iterRatio = iBreak / maxIter;
        const boundaryBand = smoothstep(0.36, 0.78, iterRatio) * (1 - smoothstep(0.88, 0.997, iterRatio));
        const interior = iBreak >= (maxIter - 1) ? 1 : 0;
        const radialFade = smoothstep(1.22, 0.88, r);
        const filament = 0.65 + 0.35 * Math.sin((sx - sy) * 18 + jx * 2.4 + jy * 3.1);
        const interiorGate = 0.08 + 0.20 * Math.max(0, Math.min(1, filament));
        const alpha = Math.max(boundaryBand * 1.35, interior * interiorGate) * radialFade;
        alphaSum += alpha;
        sampleCount++;
      }
    }

    if (sampleCount === 0) return 0.45;
    return alphaSum / sampleCount;
  }

  function tuneJuliaView(jx, jy, fx, fy, fzoom, attempts = JULIA_VIEW_ATTEMPTS) {
    let bestFx = fx;
    let bestFy = fy;
    let bestZoom = fzoom;
    let bestFill = estimateJuliaVisualFill(jx, jy, fx, fy, fzoom);

    if (bestFill >= JULIA_VISIBLE_FILL_MIN) {
      return { fx: bestFx, fy: bestFy, fzoom: bestZoom, fill: bestFill };
    }

    for (let i = 0; i < attempts; i++) {
      const jitter = fzoom * (0.42 + i * 0.05);
      const testFx = fx + rand(-jitter, jitter);
      const testFy = fy + rand(-jitter, jitter);
      const testZoom = clamp(fzoom * (0.66 + Math.random() * 0.78), JULIA_ZOOM_MIN, JULIA_ZOOM_MAX);
      const fill = estimateJuliaVisualFill(jx, jy, testFx, testFy, testZoom);
      if (fill > bestFill) {
        bestFill = fill;
        bestFx = testFx;
        bestFy = testFy;
        bestZoom = testZoom;
        if (bestFill >= JULIA_VISIBLE_FILL_MIN) break;
      }
    }

    return { fx: bestFx, fy: bestFy, fzoom: bestZoom, fill: bestFill };
  }

  function getJuliaAreaScale(jx, jy, fx, fy, fzoom) {
    const key = Math.round(jx * 220) + ':' + Math.round(jy * 220) + ':' + Math.round(fx * 180) + ':' + Math.round(fy * 180) + ':' + Math.round(fzoom * 110);
    const cached = juliaAreaScaleCache.get(key);
    if (cached != null) return cached;

    const fill = Math.max(0.0001, estimateJuliaVisualFill(jx, jy, fx, fy, fzoom));
    if (fill < JULIA_VISIBLE_FILL_MIN * 0.6) {
      juliaAreaScaleCache.set(key, JULIA_SHAPE_SCALE_FAILSAFE);
      return JULIA_SHAPE_SCALE_FAILSAFE;
    }

    const clampedFill = Math.max(0.08, fill);
    const rawScale = Math.sqrt(JULIA_AREA_TARGET_FILL / clampedFill);
    const blended = 1 + (rawScale - 1) * JULIA_AREA_SCALE_BLEND;
    const finalScale = clamp(blended, JULIA_AREA_MIN_SCALE, JULIA_AREA_MAX_SCALE);
    juliaAreaScaleCache.set(key, finalScale);
    return finalScale;
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

  function getShipFractalClass() {
    return SHIP_FRACTAL_CLASSES.includes(SHIP_FRACTAL_CLASS) ? SHIP_FRACTAL_CLASS : 'sierpinski';
  }

  function getFractaloidClassSequence() {
    const seq = FRACTALOID_CLASS_SEQUENCE.filter((name) => FRACTALOID_CLASSES.includes(name));
    return seq.length ? seq : ['tau'];
  }

  function getFractaloidClassByMode(mode) {
    return FRACTALOID_MODE_NAMES[mode] || 'tau';
  }

  function getFractaloidClassSpec(className) {
    const key = FRACTALOID_CLASS_SPECS[className] ? className : 'tau';
    return FRACTALOID_CLASS_SPECS[key] || FRACTALOID_CLASS_SPECS.tau;
  }

  function isJuliaMode(mode) {
    return mode === FRACTALOID_CLASS_MODES.julia;
  }

  function hasCompletedFractaloidCycle(w) {
    if (!FRACTALOID_MIX_AFTER_CYCLE || FRACTALOID_CLASS !== 'cycle') return false;
    const seq = getFractaloidClassSequence();
    if (!seq.length) return false;
    const required = new Set(FRACTALOID_CLASSES);
    const seen = new Set();
    const wavesElapsed = Math.max(0, Math.floor(w) - 1);
    for (let i = 0; i < wavesElapsed; i++) {
      seen.add(seq[i % seq.length]);
    }
    for (const className of required) {
      if (!seen.has(className)) return false;
    }
    return true;
  }

  function isMixedFractaloidWave(w) {
    return hasCompletedFractaloidCycle(w);
  }

  function resolveFractaloidClassForWave(w) {
    if (FRACTALOID_CLASS === 'mandelbrot') return 'tau';
    if (FRACTALOID_CLASSES.includes(FRACTALOID_CLASS)) return FRACTALOID_CLASS;
    if (isMixedFractaloidWave(w)) return 'mixed';
    const seq = getFractaloidClassSequence();
    return seq[(Math.max(1, w) - 1) % seq.length];
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
    if (className === 'mixed') return 'MIXED';
    const spec = getFractaloidClassSpec(className);
    return spec.label || 'FRACTAL';
  }

  function pickFractaloidClassForWaveSpawn(w) {
    if (!isMixedFractaloidWave(w)) return resolveFractaloidClassForWave(w);
    const seq = getFractaloidClassSequence();
    const anchorClass = seq[(Math.max(1, w) - 1) % seq.length];
    if (Math.random() < 0.45) return anchorClass;
    return FRACTALOID_CLASSES[Math.floor(Math.random() * FRACTALOID_CLASSES.length)];
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
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
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
    ctx.stroke();

    ctx.beginPath();
    const cx = xOff - sx * 1.72;
    const bulbN = 44;
    for (let i = 0; i <= bulbN; i++) {
      const t = (i / bulbN) * Math.PI * 2;
      const px = cx + Math.cos(t) * sx * 0.52;
      const py = Math.sin(t) * sy * 0.52;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  function drawMandelbrotOutlineShipHull(sz) {
    if (!shipIconPath) {
      drawLegacyMandelbrotOutlineShipHull(sz);
      return;
    }

    const scale = (sz * 2.24) / SHIP_ICON_VIEWBOX.w;
    const cx = SHIP_ICON_VIEWBOX.x + SHIP_ICON_VIEWBOX.w * 0.5;
    const cy = SHIP_ICON_VIEWBOX.y + SHIP_ICON_VIEWBOX.h * 0.5;

    ctx.save();
    // KNIFE icon points opposite our ship forward vector; flip it to align barrel with bullet emission.
    ctx.rotate(Math.PI);
    ctx.translate(-sz * 0.02, 0);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    ctx.lineWidth = SHIP_ICON_STROKE_WIDTH;
    ctx.stroke(shipIconPath);
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
      // blink
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
      ctx.beginPath();
      ctx.moveTo(-sz * 0.18, 0);
      ctx.lineTo(sz * 0.62, 0);
      ctx.stroke();
    }

    // thrust flame
    if (s.thrusting && Math.random() > 0.3) {
      ctx.beginPath();
      ctx.moveTo(-sz * 0.72, sz * 0.26);
      ctx.lineTo(-sz * 1.15 - Math.random() * 5, 0);
      ctx.lineTo(-sz * 0.72, -sz * 0.26);
      ctx.stroke();
    }
    ctx.restore();
  }

  function updateShip(s, dt) {
    if (!s.alive) return;
    if (s.invuln > 0) s.invuln -= dt;

    if (keys.left) s.angle -= SHIP_TURN * dt;
    if (keys.right) s.angle += SHIP_TURN * dt;

    s.thrusting = keys.thrust;
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
    if (!keys.fire && s.fireTimer <= FIRE_COOLDOWN_BASE) {
      s.shotPhase = 0;
    }

    if (keys.fire && s.fireTimer <= 0 && bullets.length < MAX_BULLETS) {
      fireBullet(s);
      s.fireTimer = nextFireCooldown(s);
    }
    if (inputSystem.consumeHyperPressed()) {
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
        MANDEL_VIEW_ATTEMPTS,
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
    const paletteMode = pickFractaloidPaletteMode(mode, isBoss, null);
    return {
      className,
      fx,
      fy,
      fzoom,
      fseed: pickVibrantPaletteSeed(profile.seedBias + Math.random() * 0.43, paletteMode),
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
      const tuned = tuneJuliaView(julia.jx, julia.jy, fx, fy, fzoom, JULIA_VIEW_ATTEMPTS + 4);
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
        MANDEL_VIEW_ATTEMPTS + 3,
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
    const paletteMode = pickFractaloidPaletteMode(mode, isBoss || parent.isBoss, parentPaletteMode);
    return {
      className,
      fx,
      fy,
      fzoom,
      fseed: pickVibrantPaletteSeed(parent.fseed + profile.paletteDrift + rand(0.04, 0.2), paletteMode),
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
    const jitter = parent ? parent.r * 0.2 : 0;
    const growthStart = parent ? 0.7 : 0.82;
    const growthMax = FRACTALOID_GROWTH_SCALE[sizeKey] * profile.growthMul * rand(1.02, 1.13);
    const lifeSpan = (FRACTALOID_GROWTH_LIFE[sizeKey] * rand(0.9, 1.12)) / profile.growthRate;
    const baseFzoom = fractal.fzoom;
    const zoomRate = profile.zoomRate * rand(0.9, 1.1);
    const maxHp = options.hp || (isBoss ? BOSS_BASE_HP + Math.floor(wave / BOSS_WAVE_INTERVAL) : 1);
    const seedCycleRate = options.seedCycleRate || (isBoss ? 0.29 + wave * 0.01 : rand(0.003, 0.018));
    return {
      x: x + rand(-jitter, jitter),
      y: y + rand(-jitter, jitter),
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
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
      fx: fractal.fx,
      fy: fractal.fy,
      baseFzoom,
      fzoom: isJuliaMode(fractal.mode) ? baseFzoom * 1.08 : baseFzoom,
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
    fractaloids = [];
    const isBossWave = w % BOSS_WAVE_INTERVAL === 0;
    if (isBossWave) {
      const bossSpawn = edgeSpawnPoint(40);
      fractaloids.push(
        makeFractaloid(
          bossSpawn.x,
          bossSpawn.y,
          4,
          w * 6,
          null,
          null,
          {
            isBoss: true,
            hp: BOSS_BASE_HP + Math.floor(w / BOSS_WAVE_INTERVAL),
            className: pickFractaloidClassForWaveSpawn(w)
          }
        )
      );
      const escorts = Math.min(2 + Math.floor(w / 10), 4);
      for (let i = 0; i < escorts; i++) {
        const p = edgeSpawnPoint(0);
        fractaloids.push(makeFractaloid(p.x, p.y, 3, w * 4.5, null, null, { className: pickFractaloidClassForWaveSpawn(w) }));
      }
      return;
    }

    const count = Math.min(4 + w, 11);
    for (let i = 0; i < count; i++) {
      const p = edgeSpawnPoint(0);
      fractaloids.push(makeFractaloid(p.x, p.y, 3, w * 4, null, null, { className: pickFractaloidClassForWaveSpawn(w) }));
    }
  }

  function fractaloidForcesPerimeter(a) {
    if (!a) return false;
    return a.mode === FRACTALOID_CLASS_MODES.buffalo;
  }

  function shouldDrawFractaloidPerimeter(a = null) {
    // Keep fallback renderer playable; polygon perimeter is optional with WebGL fractal shading.
    if (!fractalRenderer) return true;
    if (FRACTALOID_PERIMETER_MKODE !== 'polygon') return false;
    if (fractaloidForcesPerimeter(a)) return true;
    return true;
  }

  function drawFractaloid(a) {
    if (!shouldDrawFractaloidPerimeter(a)) return;
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.angle);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    const scale = a.baseR ? a.r / a.baseR : 1;
    ctx.scale(scale, scale);
    ctx.beginPath();
    for (let i = 0; i < a.verts.length; i++) {
      const v = a.verts[i];
      const px = Math.cos(v.a) * v.d;
      const py = Math.sin(v.a) * v.d;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function drawFractaloids(timeSec, warpBullets = []) {
    const perimeterOn = FRACTALOID_PERIMETER_MODE === 'polygon';
    if (fractalRenderer) {
      fractalRenderer.render(fractaloids, timeSec, DPR, warpBullets, {
        perimeterOn,
        chromaTweak: FRACTALOID_CHROMA_TWEAK,
        neonTweak: FRACTALOID_NEON_TWEAK
      });
      if (perimeterOn) {
        for (const a of fractaloids) drawFractaloid(a);
      }
      return;
    }
    for (const a of fractaloids) drawFractaloid(a);
  }

  function updateFractaloid(a, dt) {
    a.x += a.vx * dt;
    a.y += a.vy * dt;
    a.angle += a.spin * dt;
    a.age += dt;
    const lifeT = a.age / Math.max(0.0001, a.lifeSpan);
    const growthSpan = Math.max(0.0001, a.growthMax - a.growthStart);
    const scale = a.growthStart + growthSpan * lifeT;
    a.r = a.baseR * scale;
    const zoomScale = Math.max(scale, 0.0001);
    // Keep procedural zoom advancing as rocks grow, with no hard floor cap.
    a.fzoom = a.baseFzoom / zoomScale;
    const hpT = a.maxHp > 1 ? (1 - a.hp / a.maxHp) : 0;
    const growthForCycle = Math.min(1, lifeT);
    const cycleBoost = a.isBoss ? (1.4 + hpT * 2.8 + growthForCycle * 1.7) : 1;
    a.fseed = fract(a.fseed + dt * a.seedCycleRate * cycleBoost);
    wrap(a);
  }

  function damageFractaloid(a, hitPoint, grantScore) {
    if (a.hp > 1) {
      a.hp -= 1;
      a.fseed = fract(a.fseed + 0.14 + Math.random() * 0.2);
      a.age = Math.min(a.lifeSpan, a.age + a.lifeSpan * 0.08);
      spawnShockwave(a.x, a.y, a.r * 0.66, a.fseed || 0);
      explode(a.x, a.y, 8, 0.45);
      if (grantScore) score += Math.max(8, Math.floor((FRACTALOID_SCORE[a.sizeKey] || 40) * 0.12));
      return false;
    }

    splitFractaloid(a, hitPoint, grantScore);
    return true;
  }

  function splitFractaloid(a, hitPoint = null, grantScore = true) {
    spawnShockwave(a.x, a.y, a.r, a.fseed || 0);
    if (grantScore) score += FRACTALOID_SCORE[a.sizeKey];
    if (a.sizeKey === 4) {
      sfx.bangLarge();
      explode(a.x, a.y, 30, 1.9);
      spawnShockwave(a.x, a.y, a.r * 1.2, a.fseed || 0);
      for (let i = 0; i < 3; i++) {
        fractaloids.push(makeFractaloid(a.x, a.y, 3, wave * 6.2, a, hitPoint));
      }
      for (let i = 0; i < 2; i++) {
        fractaloids.push(makeFractaloid(a.x, a.y, 2, wave * 6.8, a, hitPoint));
      }
    } else if (a.sizeKey === 3) {
      sfx.bangLarge();
      explode(a.x, a.y, 14, 1.0);
      fractaloids.push(makeFractaloid(a.x, a.y, 2, wave * 4, a, hitPoint));
      fractaloids.push(makeFractaloid(a.x, a.y, 2, wave * 4, a, hitPoint));
    } else if (a.sizeKey === 2) {
      sfx.bangMedium();
      explode(a.x, a.y, 10, 0.8);
      fractaloids.push(makeFractaloid(a.x, a.y, 1, wave * 4, a, hitPoint));
      fractaloids.push(makeFractaloid(a.x, a.y, 1, wave * 4, a, hitPoint));
    } else {
      sfx.bangSmall();
      explode(a.x, a.y, 8, 0.6);
    }
  }

  // ============================================================
  // SAUCER (UFO)
  // ============================================================
  function spawnSaucer() {
    // small saucer more likely as score climbs
    const isSmall = score > 10000 || Math.random() < Math.min(0.4 + score/30000, 0.7);
    const cfg = isSmall ? SAUCER_SMALL : SAUCER_LARGE;
    const fromLeft = Math.random() < 0.5;
    saucer = {
      x: fromLeft ? -30 : W + 30,
      y: rand(60, H - 60),
      vx: (fromLeft ? 1 : -1) * cfg.speed,
      vy: 0,
      r: cfg.r,
      isSmall,
      cfg,
      fireTimer: cfg.fireRate * 0.6,
      directionTimer: rand(1.5, 3),
      shapeClass: resolveSaucerFractalClass()
    };
  }

  function updateSaucer(dt) {
    if (!saucer) return;
    saucer.x += saucer.vx * dt;
    saucer.y += saucer.vy * dt;

    saucer.directionTimer -= dt;
    if (saucer.directionTimer <= 0) {
      // change vertical direction occasionally
      saucer.vy = randSign() * saucer.cfg.speed * 0.5;
      saucer.directionTimer = rand(1.2, 2.5);
    }
    if (saucer.y < 30) saucer.vy = Math.abs(saucer.vy);
    if (saucer.y > H - 30) saucer.vy = -Math.abs(saucer.vy);

    // off-screen horizontally => done
    if (saucer.vx > 0 && saucer.x > W + 40) saucer = null;
    else if (saucer.vx < 0 && saucer.x < -40) saucer = null;
    if (!saucer) return;

    saucer.fireTimer -= dt;
    if (saucer.fireTimer <= 0 && ship && ship.alive) {
      saucerFire();
      saucer.fireTimer = saucer.cfg.fireRate;
    }
  }

  function saucerFire() {
    let angle;
    if (saucer.cfg.accuracy > 0 && ship && ship.alive) {
      // lead the ship a little
      const dx = ship.x - saucer.x, dy = ship.y - saucer.y;
      angle = Math.atan2(dy, dx);
      // jitter based on accuracy
      angle += (1 - saucer.cfg.accuracy) * (Math.random() - 0.5) * Math.PI;
    } else {
      angle = Math.random() * Math.PI * 2;
    }
    saucerBullets.push({
      x: saucer.x, y: saucer.y,
      vx: Math.cos(angle) * BULLET_SPEED * 0.85,
      vy: Math.sin(angle) * BULLET_SPEED * 0.85,
      life: 1.0,
      r: 1.5
    });
    sfx.saucerFire();
  }

  function drawKochSegment(x1, y1, x2, y2, depth) {
    if (depth <= 0) {
      ctx.lineTo(x2, y2);
      return;
    }
    const dx = (x2 - x1) / 3;
    const dy = (y2 - y1) / 3;
    const ax = x1 + dx;
    const ay = y1 + dy;
    const bx = x1 + dx * 2;
    const by = y1 + dy * 2;
    const px = ax + dx * 0.5 - dy * 0.86602540378;
    const py = ay + dy * 0.5 + dx * 0.86602540378;

    drawKochSegment(x1, y1, ax, ay, depth - 1);
    drawKochSegment(ax, ay, px, py, depth - 1);
    drawKochSegment(px, py, bx, by, depth - 1);
    drawKochSegment(bx, by, x2, y2, depth - 1);
  }

  function drawKochSnowflake(radius, depth) {
    const p1 = { x: 0, y: -radius };
    const p2 = { x: -radius * 0.866, y: radius * 0.5 };
    const p3 = { x: radius * 0.866, y: radius * 0.5 };

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    drawKochSegment(p1.x, p1.y, p2.x, p2.y, depth);
    drawKochSegment(p2.x, p2.y, p3.x, p3.y, depth);
    drawKochSegment(p3.x, p3.y, p1.x, p1.y, depth);
    ctx.closePath();
    ctx.stroke();
  }

  function drawSaucer() {
    if (!saucer) return;
    ctx.save();
    ctx.translate(saucer.x, saucer.y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const r = saucer.r;
    const saucerClass = saucer.shapeClass || 'classic';
    if (saucerClass === 'sierpinski') {
      const s = r * 1.08;
      const depth = saucer.isSmall ? 2 : 3;
      drawSierpinski(0, -s * 0.84, -s * 0.92, s * 0.72, s * 0.92, s * 0.72, depth);
      ctx.beginPath();
      ctx.moveTo(-r * 0.48, r * 0.22);
      ctx.lineTo(r * 0.48, r * 0.22);
      ctx.stroke();
    } else if (saucerClass === 'koch') {
      const depth = saucer.isSmall ? 1 : 2;
      drawKochSnowflake(r * 0.94, depth);
      ctx.beginPath();
      ctx.arc(0, r * 0.08, r * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // classic vector ufo
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(-r * 0.5, -r * 0.4);
      ctx.lineTo(r * 0.5, -r * 0.4);
      ctx.lineTo(r, 0);
      ctx.lineTo(r * 0.5, r * 0.4);
      ctx.lineTo(-r * 0.5, r * 0.4);
      ctx.closePath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(r, 0);
      // dome
      ctx.moveTo(-r * 0.5, -r * 0.4);
      ctx.lineTo(-r * 0.25, -r * 0.75);
      ctx.lineTo(r * 0.25, -r * 0.75);
      ctx.lineTo(r * 0.5, -r * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ============================================================
  // PARTICLES (explosions, debris)
  // ============================================================
  function explode(x, y, count, scale = 1) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = rand(40, 180) * scale;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.4, 1.0) * scale,
        maxLife: 1,
        size: rand(1, 2.5)
      });
    }
  }

  function spawnShockwave(x, y, sourceRadius, seed = 0) {
    const r0 = Math.max(10, sourceRadius * 0.62);
    const r1 = r0 + sourceRadius * SHOCKWAVE_RADIUS_GAIN;
    shockwaves.push({
      x,
      y,
      r0,
      r1,
      age: 0,
      life: SHOCKWAVE_LIFE * rand(0.92, 1.08),
      phase: Math.random() * Math.PI * 2,
      seed
    });
  }

  function drawShockwaveRing(w, radius, alpha, width, harmonicScale) {
    const points = 84;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      const a = t * Math.PI * 2;
      const jitter = 1 + Math.sin(a * 6 + w.phase) * 0.05 + Math.sin(a * 11 + w.seed * 9) * 0.025;
      const x = w.x + Math.cos(a) * radius * jitter;
      const y = w.y + Math.sin(a) * radius * jitter;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.strokeStyle = `hsl(${38 + w.seed * 84}, 92%, ${62 + harmonicScale * 14}%)`;
    ctx.stroke();
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function updateShockwaves(dt) {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const w = shockwaves[i];
      w.age += dt;
      if (w.age >= w.life) {
        shockwaves.splice(i, 1);
      }
    }
  }

  function drawParticles() {
    ctx.fillStyle = '#fff';
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawShockwaves() {
    if (shockwaves.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const w of shockwaves) {
      const t = Math.min(1, w.age / w.life);
      const eased = 1 - Math.pow(1 - t, 2.2);
      const radius = w.r0 + (w.r1 - w.r0) * eased;
      const fade = Math.max(0, 1 - t);

      drawShockwaveRing(w, radius, fade * 0.42, SHOCKWAVE_WIDTH, 0.2);
      drawShockwaveRing(w, radius * 0.74, fade * 0.22, SHOCKWAVE_WIDTH * 0.58, 0.55);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ============================================================
  // BULLETS
  // ============================================================
  function updateBullets(dt) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      // wrap bullets too (classic)
      if (b.x < 0) b.x += W;
      if (b.x > W) b.x -= W;
      if (b.y < 0) b.y += H;
      if (b.y > H) b.y -= H;
      if (b.life <= 0) bullets.splice(i, 1);
    }
    for (let i = saucerBullets.length - 1; i >= 0; i--) {
      const b = saucerBullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (b.x < 0) b.x += W;
      if (b.x > W) b.x -= W;
      if (b.y < 0) b.y += H;
      if (b.y > H) b.y -= H;
      if (b.life <= 0) saucerBullets.splice(i, 1);
    }
  }

  function drawBullets() {
    ctx.fillStyle = '#fff';
    for (const b of bullets) ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);
    for (const b of saucerBullets) {
      const t = 1 - b.life;
      ctx.fillStyle = `hsl(${280 + t * 70}, 95%, ${62 - t * 14}%)`;
      ctx.fillRect(b.x - 1.9, b.y - 1.9, 3.8, 3.8);
    }
  }

  // ============================================================
  // COLLISIONS
  // ============================================================
  function checkCollisions() {
    // bullets vs fractaloids
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      for (let j = fractaloids.length - 1; j >= 0; j--) {
        const a = fractaloids[j];
        if (dist2(b, a) < a.r * a.r) {
          bullets.splice(i, 1);
          const destroyed = damageFractaloid(a, b, true);
          if (destroyed) fractaloids.splice(j, 1);
          checkExtraLife();
          break;
        }
      }
    }
    // bullets vs saucer
    if (saucer) {
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (dist2(b, saucer) < saucer.r * saucer.r) {
          bullets.splice(i, 1);
          score += saucer.cfg.score;
          explode(saucer.x, saucer.y, 16, 1.0);
          sfx.bangMedium();
          saucer = null;
          checkExtraLife();
          break;
        }
      }
    }
    // ship vs fractaloids
    if (ship && ship.alive && ship.invuln <= 0) {
      for (const a of fractaloids) {
        if (dist2(ship, a) < (a.r + ship.r) * (a.r + ship.r)) {
          const destroyed = damageFractaloid(a, ship, true);
          if (destroyed) fractaloids.splice(fractaloids.indexOf(a), 1);
          killShip();
          return;
        }
      }
      // ship vs saucer
      if (saucer && dist2(ship, saucer) < (saucer.r + ship.r) * (saucer.r + ship.r)) {
        explode(saucer.x, saucer.y, 16, 1.0);
        sfx.bangMedium();
        saucer = null;
        killShip();
        return;
      }
      // ship vs saucer bullets
      for (let i = saucerBullets.length - 1; i >= 0; i--) {
        const b = saucerBullets[i];
        if (dist2(ship, b) < (ship.r + b.r) * (ship.r + b.r)) {
          saucerBullets.splice(i, 1);
          killShip();
          return;
        }
      }
    }
    // saucer bullets vs fractaloids (saucer can break rocks too)
    for (let i = saucerBullets.length - 1; i >= 0; i--) {
      const b = saucerBullets[i];
      for (let j = fractaloids.length - 1; j >= 0; j--) {
        const a = fractaloids[j];
        if (dist2(b, a) < a.r * a.r) {
          saucerBullets.splice(i, 1);
          const destroyed = damageFractaloid(a, b, false);
          if (destroyed) fractaloids.splice(j, 1);
          break;
        }
      }
    }
  }

  function checkExtraLife() {
    if (score >= nextExtraLife) {
      lives++;
      nextExtraLife += 10000;
      sfx.extraLife();
    }
  }

  // ============================================================
  // GAME FLOW
  // ============================================================
  function startGame() {
    ensureAudio();
    score = 0;
    lives =9;
    wave = 1;
    nextExtraLife = 10000;
    heartbeatSystem.reset();
    bullets = [];
    fractaloids = [];
    particles = [];
    shockwaves = [];
    saucer = null;
    saucerBullets = [];
    saucerTimer = rand(15, 25);
    ship = makeShip();
    state = 'playing';
    document.body.classList.add('playing');
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    spawnWave(wave);
  }

  function endGame() {
    state = 'gameover';
    document.body.classList.remove('playing');
    document.getElementById('final-score').textContent = 'SCORE: ' + score.toString().padStart(6, '0');
    document.getElementById('gameover-screen').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
  }

  function respawnShip() {
    // wait until center is clear-ish
    const center = { x: W/2, y: H/2, r: 60 };
    let clear = true;
    for (const a of fractaloids) {
      if (dist2(center, a) < (a.r + center.r) * (a.r + center.r)) { clear = false; break; }
    }
    if (saucer && dist2(center, saucer) < (saucer.r + center.r) * (saucer.r + center.r)) clear = false;
    if (clear) {
      ship = makeShip();
      state = 'playing';
    }
  }

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
    document.getElementById('wave').textContent = 'WAVE ' + wave + ' • ' + classLabel + ' • ' + genomeLabel + bossLabel;
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

  // ============================================================
  // MAIN LOOP
  // ============================================================
  let lastTime = performance.now();
  let totalTime = 0;

  function frame(now) {
    let dt = (now - lastTime) / 1000;
    if (dt > 0.05) dt = 0.05; // clamp
    lastTime = now;
    totalTime += dt;

    // clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    drawStars(totalTime);

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
        saucerTimer = rand(20, 35) - Math.min(wave * 1.5, 10);
      }
      updateSaucer(dt);

      updateBullets(dt);
      updateParticles(dt);
      updateShockwaves(dt);

      if (state === 'playing') checkCollisions();

      // draw
      drawFractaloids(totalTime, saucerBullets);
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
          lives--;
          if (lives <= 0) {
            endGame();
          } else {
            // wait for clear spawn area
            respawnShip();
            if (state === 'dying') stateTimer = 0.2; // try again shortly
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

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
