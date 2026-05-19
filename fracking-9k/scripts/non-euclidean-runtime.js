(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function asFinite(v, fallback) {
    return Number.isFinite(v) ? v : fallback;
  }

  function create(options = {}) {
    const geometry = options.geometry || null;
    const enabled = options.enabled !== false;
    const onUiActiveChange = typeof options.onUiActiveChange === 'function'
      ? options.onUiActiveChange
      : () => {};

    const defaultDuration = Math.max(1, asFinite(options.defaultDuration, 24));
    const saucerHitDuration = Math.max(1, asFinite(options.saucerHitDuration, 19));
    const saucerHitExtend = Math.max(1, asFinite(options.saucerHitExtend, 10));
    const maxDuration = Math.max(1, asFinite(options.maxDuration, 48));
    const forcedDurationSec = Math.max(0, asFinite(options.forcedDurationSec, 0));

    const diskFill = clamp(asFinite(options.diskFill, 0.46), 0.12, 0.92);
    const curvatureMul = clamp(asFinite(options.curvatureMul, 1.0), 0.08, 12.0);

    const cycleMultiplier = Math.max(1, Math.round(asFinite(options.cycleMultiplier, 2)));
    const autoBaseCycleInterval = Math.max(1, Math.round(asFinite(options.autoBaseCycleInterval, 1)));

    let session = null;
    let pendingForce = forcedDurationSec > 0;

    function setUiActive(active) {
      onUiActiveChange(!!active);
    }

    function isReady() {
      return enabled && !!geometry;
    }

    function isActive() {
      return isReady() && !!session;
    }

    function cycleIntervalWaves() {
      return Math.max(1, autoBaseCycleInterval * cycleMultiplier);
    }

    function shouldAutoEnter(nextWave) {
      if (!isReady()) return false;
      const wave = Math.round(asFinite(nextWave, 0));
      const interval = cycleIntervalWaves();
      return wave >= interval && (wave % interval === 0);
    }

    function resolveView(view = {}) {
      if (!isActive()) return null;
      return geometry.resolveView({
        width: Math.max(1, asFinite(view.width, 1)),
        height: Math.max(1, asFinite(view.height, 1)),
        centerX: asFinite(view.centerX, asFinite(view.width, 1) * 0.5),
        centerY: asFinite(view.centerY, asFinite(view.height, 1) * 0.5),
        originX: Number.isFinite(view.originX) ? view.originX : session.originX,
        originY: Number.isFinite(view.originY) ? view.originY : session.originY,
        diskFill,
        curvatureMul
      });
    }

    function projectRadius(radius, projectedScale = 1) {
      const base = Math.max(0, asFinite(radius, 0));
      if (!isActive()) return base;
      return geometry.projectRadius(base, projectedScale);
    }

    function projectPoint(x, y, radius = 0, view = {}) {
      if (!isActive()) {
        return { x, y, scale: 1, insideDisk: true, hidden: false, radius: Math.max(0, radius) };
      }
      const resolvedView = resolveView(view);
      if (!resolvedView) {
        return { x, y, scale: 1, insideDisk: true, hidden: false, radius: Math.max(0, radius) };
      }
      const p = geometry.projectPoint(x, y, resolvedView);
      return {
        x: p.x,
        y: p.y,
        scale: p.scale,
        insideDisk: p.insideDisk,
        hidden: p.insideDisk === false,
        radius: geometry.projectRadius(radius, p.scale)
      };
    }

    function projectEntity(entity, view = {}) {
      if (!entity) return null;
      if (!isActive()) return Object.assign({}, entity);
      const resolvedView = resolveView(view);
      if (!resolvedView) return Object.assign({}, entity);
      return geometry.projectEntity(entity, resolvedView);
    }

    function enter(opts = {}) {
      if (!isReady()) return false;
      const durationSec = Math.max(5, asFinite(opts.durationSec, defaultDuration));
      session = {
        startedAtWave: Math.max(1, Math.round(asFinite(opts.wave, 1))),
        reason: opts.reason || 'auto',
        remaining: durationSec,
        duration: durationSec,
        originX: asFinite(opts.originX, 0),
        originY: asFinite(opts.originY, 0)
      };
      setUiActive(true);
      return true;
    }

    function triggerSaucerHit(opts = {}) {
      if (!isReady()) return false;
      const hitDuration = Math.max(4, asFinite(opts.durationSec, saucerHitDuration));
      if (isActive()) {
        const extendBy = Math.max(2, saucerHitExtend);
        const extended = Math.min(maxDuration, session.remaining + extendBy);
        session.remaining = Math.max(session.remaining, extended);
        session.reason = opts.reason || 'saucer-hit-extend';
        return true;
      }
      return enter({
        wave: opts.wave,
        reason: opts.reason || 'saucer-hit',
        durationSec: hitDuration,
        originX: opts.originX,
        originY: opts.originY
      });
    }

    function exit() {
      const hadSession = !!session;
      session = null;
      setUiActive(false);
      return hadSession;
    }

    function clear() {
      return exit();
    }

    function tick(dt) {
      if (!isActive()) return { expired: false, remaining: 0 };
      session.remaining -= Math.max(0, asFinite(dt, 0));
      if (session.remaining <= 0) {
        exit();
        return { expired: true, remaining: 0 };
      }
      return { expired: false, remaining: session.remaining };
    }

    function resetForRun() {
      session = null;
      pendingForce = forcedDurationSec > 0;
      setUiActive(false);
    }

    function startForcedIfPending(opts = {}) {
      if (!pendingForce) return false;
      const entered = enter({
        wave: opts.wave,
        reason: opts.reason || 'forced-url',
        durationSec: forcedDurationSec,
        originX: opts.originX,
        originY: opts.originY
      });
      if (entered) pendingForce = false;
      return entered;
    }

    function hasPendingForce() {
      return pendingForce;
    }

    function drawOverlay(args = {}) {
      const ctx = args.ctx;
      if (!ctx || !isActive()) return false;
      const width = Math.max(1, asFinite(args.width, 1));
      const height = Math.max(1, asFinite(args.height, 1));
      const view = resolveView({
        width,
        height,
        centerX: asFinite(args.centerX, width * 0.5),
        centerY: asFinite(args.centerY, height * 0.5)
      });
      if (!view) return false;

      const pulse = 0.72 + 0.28 * Math.sin(asFinite(args.timeSec, 0) * 2.7);
      const strokeWithVectorGlow = typeof args.strokeWithVectorGlow === 'function'
        ? args.strokeWithVectorGlow
        : (context, drawPath) => {
            if (!context || typeof drawPath !== 'function') return;
            drawPath();
            context.stroke();
          };
      const interval = cycleIntervalWaves();
      const seconds = Math.ceil(Math.max(0, session.remaining));
      const reasonLabel = (session.reason || '').startsWith('saucer-hit')
        ? 'CURVATURE BREACH'
        : 'NON-EUCLIDEAN DRIFT';

      ctx.save();
      // Darken outside the disk so the geometry read is immediate.
      ctx.fillStyle = 'rgba(4, 8, 14, 0.68)';
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.arc(view.centerX, view.centerY, view.diskRadius, 0, Math.PI * 2, true);
      ctx.fill('evenodd');

      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(158, 218, 255, ${0.64 * pulse})`;
      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.arc(view.centerX, view.centerY, view.diskRadius, 0, Math.PI * 2);
      }, {
        haloWidthMul: 1.8,
        haloAlpha: 0.22,
        blur: 5.0
      });

      ctx.fillStyle = '#d7ecff';
      ctx.font = '16px "VT323", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`${reasonLabel} • T-${seconds}s • AUTO EVERY ${interval} WAVES`, 18, 16);
      ctx.restore();
      return true;
    }

    return {
      isReady,
      isActive,
      cycleIntervalWaves,
      shouldAutoEnter,
      resolveView,
      projectPoint,
      projectRadius,
      projectEntity,
      enter,
      triggerSaucerHit,
      exit,
      clear,
      tick,
      resetForRun,
      startForcedIfPending,
      hasPendingForce,
      drawOverlay
    };
  }

  window.FrackingNonEuclideanRuntime = { create };
})();
