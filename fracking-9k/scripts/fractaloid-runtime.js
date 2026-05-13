(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function create(options = {}) {
    const diveZoomStepIn = options.diveZoomStepIn != null ? options.diveZoomStepIn : 0.88;
    const diveZoomStepOut = options.diveZoomStepOut != null ? options.diveZoomStepOut : 1.14;
    const diveMinZoom = options.diveMinZoom != null ? options.diveMinZoom : 1e-9;
    const diveMaxZoom = options.diveMaxZoom != null ? options.diveMaxZoom : 12.0;
    const diveEntryZoomBias = options.diveEntryZoomBias != null ? options.diveEntryZoomBias : 1.06;
    const diveAutoZoomInSecs = options.diveAutoZoomInSecs != null ? options.diveAutoZoomInSecs : 0.9;
    const diveAutoZoomInRate = options.diveAutoZoomInRate != null ? options.diveAutoZoomInRate : 0.998;
    const strokeWithVectorGlow = typeof options.strokeWithVectorGlow === 'function'
      ? options.strokeWithVectorGlow
      : (context, drawStrokePath) => {
          if (!context || typeof drawStrokePath !== 'function') return;
          drawStrokePath();
          context.stroke();
        };

    let dive = null;

    function clampDiveZoom(v) {
      return clamp(v, diveMinZoom, diveMaxZoom);
    }

    function clearDive() {
      dive = null;
    }

    function hasDive() {
      return !!(dive && dive.target);
    }

    function updateFractaloid(a, dt, helpers = {}) {
      const wrap = typeof helpers.wrap === 'function' ? helpers.wrap : () => {};
      const fract = typeof helpers.fract === 'function' ? helpers.fract : (v) => v - Math.floor(v);

      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.angle += a.spin * dt;
      a.age += dt;
      const lifeT = a.age / Math.max(0.0001, a.lifeSpan);
      const growthSpan = Math.max(0.0001, a.growthMax - a.growthStart);
      const scale = a.growthStart + growthSpan * lifeT;
      a.r = a.baseR * scale;
      const zoomScale = Math.max(scale, 0.0001);
      // Keep fractal domain-to-silhouette ratio stable as the rock grows.
      a.fzoom = a.baseFzoom / zoomScale;
      const hpT = a.maxHp > 1 ? (1 - a.hp / a.maxHp) : 0;
      const growthForCycle = Math.min(1, lifeT);
      const cycleBoost = a.isBoss ? (1.4 + hpT * 2.8 + growthForCycle * 1.7) : 1;
      a.fseed = fract(a.fseed + dt * a.seedCycleRate * cycleBoost);
      a.spawnTelegraphAge += dt;
      wrap(a);
    }

    function drawFractaloidPerimeter(ctx, a, shouldDraw = true) {
      if (!ctx || !a || !shouldDraw) return;
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.angle);
      ctx.strokeStyle = '#fdf';
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      const scale = a.baseR ? a.r / a.baseR : 1;
      ctx.scale(scale, scale);
      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        for (let i = 0; i < a.verts.length; i++) {
          const v = a.verts[i];
          const px = Math.cos(v.a) * v.d;
          const py = Math.sin(v.a) * v.d;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }, {
        haloWidthMul: 2.0,
        haloAlpha: 0.22,
        blur: 5.3
      });
      ctx.restore();
    }

    function drawFractaloids(args = {}) {
      const ctx = args.ctx;
      const fractaloids = Array.isArray(args.fractaloids) ? args.fractaloids : [];
      const timeSec = args.timeSec || 0;
      const warpBullets = Array.isArray(args.warpBullets) ? args.warpBullets : [];
      const dpr = args.dpr || 1;
      const fractalRenderer = args.fractalRenderer || null;
      const fractaloidEffects = args.fractaloidEffects || { drawSpawnTelegraph: () => {} };
      const perimeterMode = args.perimeterMode || 'none';
      const colorizerMode = args.colorizerMode || 'classic';
      const enhancedLiftMix = args.enhancedLiftMix !== false;
      const chromaTweak = args.chromaTweak != null ? args.chromaTweak : 1;
      const neonTweak = args.neonTweak != null ? args.neonTweak : 0;
      const drawPerimeter = typeof args.drawPerimeter === 'function'
        ? args.drawPerimeter
        : (a) => drawFractaloidPerimeter(ctx, a, true);

      const perimeterOn = perimeterMode === 'polygon';
      const colorEnhance = colorizerMode === 'enhanced';
      const diveMode = hasDive();
      const renderChromaTweak = diveMode ? 1 : chromaTweak;
      const renderNeonTweak = diveMode ? Math.max(neonTweak, 0.24) : neonTweak;
      if (fractalRenderer) {
        fractalRenderer.render(fractaloids, timeSec, dpr, warpBullets, {
          perimeterOn,
          chromaTweak: renderChromaTweak,
          neonTweak: renderNeonTweak,
          diveMode,
          colorEnhance,
          liftMixOn: enhancedLiftMix
        });
        if (perimeterOn) {
          for (const a of fractaloids) drawPerimeter(a);
        }
        for (const a of fractaloids) fractaloidEffects.drawSpawnTelegraph(a, timeSec);
        return;
      }

      for (const a of fractaloids) drawPerimeter(a);
      for (const a of fractaloids) fractaloidEffects.drawSpawnTelegraph(a, timeSec);
    }

    function randomizeDiveTarget(target, fn) {
      if (!target || typeof fn !== 'function') return;
      fn(target);
    }

    function enterDive(target, opts = {}) {
      if (!target) return false;
      if (opts.randomizeClass) randomizeDiveTarget(target, opts.randomizeClassFn);
      const width = opts.width || 0;
      const height = opts.height || 0;
      const baseDisplayR = Math.max(target.r, target.baseR * 2.2);
      // Push dive target to near full-screen so keyboard zoom has room to reveal structure.
      const screenFillR = Math.max(Math.min(width, height) * 0.58, Math.hypot(width, height) * 0.52);
      const displayR = Math.max(baseDisplayR, screenFillR);
      const sourceRadius = Math.max(1e-6, target.r);
      // Compensate zoom for the radius growth we force in dive so we do not spawn "inside" the fractal.
      const zoomOutForDisplayGrow = Math.max(1, displayR / sourceRadius);
      const entryZoom = clampDiveZoom(target.fzoom * zoomOutForDisplayGrow * diveEntryZoomBias);
      dive = {
        target,
        hitPoint: opts.hitPoint || null,
        fx0: target.fx,
        fy0: target.fy,
        zoom: entryZoom,
        panX: 0,
        panY: 0,
        displayR,
        age: 0
      };
      target.vx = 0;
      target.vy = 0;
      target.spin = 0;
      return true;
    }

    function maybeEnterDive(opts = {}) {
      const target = opts.target;
      if (!target) return false;
      if (opts.state !== 'playing') return false;
      const fractaloids = Array.isArray(opts.fractaloids) ? opts.fractaloids : [];
      if (fractaloids.length !== 1 || fractaloids[0] !== target) return false;
      if (target.hp > 1 || target.sizeKey !== 1) return false;

      const keys = opts.keys || {};
      const minWave = opts.minWave != null ? opts.minWave : 1;
      const autoDiveWaveInterval = opts.autoDiveWaveInterval != null ? opts.autoDiveWaveInterval : 1;
      const wave = opts.wave || 1;
      const manualTrigger = wave >= minWave && keys.inspectMod && keys.fire;
      const autoTrigger = wave >= autoDiveWaveInterval && (wave % autoDiveWaveInterval === 0);
      if (!manualTrigger && !autoTrigger) return false;

      return enterDive(target, {
        hitPoint: opts.hitPoint || null,
        width: opts.width || 0,
        height: opts.height || 0,
        randomizeClass: autoTrigger && !manualTrigger,
        randomizeClassFn: opts.randomizeClassFn
      });
    }

    function nudgeDive(code, shiftKey = false, onExit = null, opts = {}) {
      if (!hasDive()) return false;
      const displayScale = Math.max(0.1, Number.isFinite(opts.displayScale) ? opts.displayScale : 1);
      // Keep perceptual pan speed stable when the same world is upscaled on screen.
      const panScaleNorm = 1 / displayScale;
      const panStep = Math.max(dive.zoom * (shiftKey ? 0.38 : 0.16) * panScaleNorm, 1e-7);
      let panDirX = 0;
      let panDirY = 0;
      if (code === 'ArrowLeft' || code === 'KeyA') panDirX = -1;
      else if (code === 'ArrowRight' || code === 'KeyD') panDirX = 1;
      else if (code === 'ArrowUp' || code === 'KeyW') panDirY = -1;
      else if (code === 'ArrowDown' || code === 'KeyS') panDirY = 1;

      if (panDirX !== 0 || panDirY !== 0) {
        const t = dive.target || {};
        const spin = (Number.isFinite(t.angle) ? t.angle : 0) + (Number.isFinite(t.frot) ? t.frot : 0);
        const c = Math.cos(spin);
        const s = Math.sin(spin);
        const rotatedX = panDirX * c - panDirY * s;
        const rotatedY = panDirX * s + panDirY * c;
        dive.panX += rotatedX * panStep;
        dive.panY += rotatedY * panStep;
      } else if (code === 'KeyQ' || code === 'Minus' || code === 'NumpadSubtract') dive.zoom = clampDiveZoom(dive.zoom * diveZoomStepOut);
      else if (code === 'KeyE' || code === 'Equal' || code === 'NumpadAdd') dive.zoom = clampDiveZoom(dive.zoom * diveZoomStepIn);
      else if (code === 'KeyR') {
        dive.panX = 0;
        dive.panY = 0;
        dive.zoom = clampDiveZoom(dive.zoom);
      } else if (code === 'Escape') {
        if (typeof onExit === 'function') onExit();
      } else {
        return false;
      }
      return true;
    }

    function wheelDive(deltaY, opts = {}) {
      if (!hasDive()) return false;
      const displayScale = Math.max(0.1, Number.isFinite(opts.displayScale) ? opts.displayScale : 1);
      // Keep wheel zoom progression close between native and upscaled arcade display.
      const zoomScaleNorm = 1 / displayScale;
      const zoomInStep = Math.pow(diveZoomStepIn, zoomScaleNorm);
      const zoomOutStep = Math.pow(diveZoomStepOut, zoomScaleNorm);
      dive.zoom = clampDiveZoom(dive.zoom * (deltaY > 0 ? zoomOutStep : zoomInStep));
      return true;
    }

    function updateDive(dt, width, height) {
      if (!hasDive()) return;
      const a = dive.target;
      dive.age += dt;
      const centerEase = Math.min(1, dt * 5.5);
      a.x += (width * 0.5 - a.x) * centerEase;
      a.y += (height * 0.5 - a.y) * centerEase;
      a.r += (dive.displayR - a.r) * Math.min(1, dt * 3.5);
      if (dive.age < diveAutoZoomInSecs) {
        dive.zoom = clampDiveZoom(dive.zoom * Math.pow(diveAutoZoomInRate, dt * 60));
      }
      a.fzoom = clampDiveZoom(dive.zoom);
      a.fx = dive.fx0 + dive.panX;
      a.fy = dive.fy0 + dive.panY;
      a.spawnTelegraphAge = a.spawnTelegraphLife;
    }

    function drawDiveOverlay(ctx, width, height, autoDiveWaveInterval) {
      if (!ctx) return;
      ctx.save();
      ctx.fillStyle = 'rgba(8, 14, 28, 0.72)';
      ctx.fillRect(14, height - 108, Math.min(720, width - 28), 92);
      ctx.strokeStyle = 'rgba(142, 190, 255, 0.55)';
      ctx.strokeRect(14.5, height - 107.5, Math.min(720, width - 29), 91);
      ctx.fillStyle = '#d7e9ff';
      ctx.font = '16px "VT323", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('Fractal Dive: arrows pan • -/= zoom • wheel zoom • ESC return', 24, height - 98);
      ctx.fillStyle = '#8ebdff';
      ctx.fillText(`Auto every ${autoDiveWaveInterval} waves (random class) • or Alt/Ctrl + Fire on final kill`, 24, height - 74);
      ctx.restore();
    }

    function consumeDiveTarget() {
      if (!hasDive()) {
        dive = null;
        return null;
      }
      const target = dive.target;
      dive = null;
      return target;
    }

    return {
      hasDive,
      clearDive,
      clampDiveZoom,
      updateFractaloid,
      drawFractaloidPerimeter,
      drawFractaloids,
      enterDive,
      maybeEnterDive,
      nudgeDive,
      wheelDive,
      updateDive,
      drawDiveOverlay,
      consumeDiveTarget
    };
  }

  window.FrackingFractaloidRuntime = { create };
})();
