(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function create(options = {}) {
    const heartbeatPulse = typeof options.heartbeatPulse === 'function' ? options.heartbeatPulse : () => {};
    const lowHz = typeof options.lowHz === 'number' ? options.lowHz : 88.2;
    const highHz = typeof options.highHz === 'number' ? options.highHz : 93.8;
    const pulseSec = typeof options.pulseSec === 'number' ? options.pulseSec : 0.102;
    const attackSec = typeof options.attackSec === 'number' ? options.attackSec : 0.0012;
    const decaySec = typeof options.decaySec === 'number' ? options.decaySec : 0.061;

    let beatHi = false;
    let beatInterval = 1.0;
    let beatTimer = 0;

    function reset() {
      beatHi = false;
      beatInterval = 1.0;
      beatTimer = 0;
    }

    function setIntervalSec(intervalSec) {
      if (Number.isFinite(intervalSec) && intervalSec > 0) {
        beatInterval = intervalSec;
      }
    }

    function measureDanger(context = {}) {
      const ship = context.ship;
      const fractaloids = Array.isArray(context.fractaloids) ? context.fractaloids : [];
      const saucerBullets = Array.isArray(context.saucerBullets) ? context.saucerBullets : [];
      const width = context.width || 0;
      const height = context.height || 0;

      if (!ship || !ship.alive || width <= 0 || height <= 0) return 0;

      let nearest = Math.min(width, height);

      for (const a of fractaloids) {
        const dx0 = Math.abs(a.x - ship.x);
        const dy0 = Math.abs(a.y - ship.y);
        const dx = Math.min(dx0, width - dx0);
        const dy = Math.min(dy0, height - dy0);
        const d = Math.hypot(dx, dy) - (a.r + ship.r);
        if (d < nearest) nearest = d;
      }

      for (const b of saucerBullets) {
        const dx0 = Math.abs(b.x - ship.x);
        const dy0 = Math.abs(b.y - ship.y);
        const dx = Math.min(dx0, width - dx0);
        const dy = Math.min(dy0, height - dy0);
        const d = Math.hypot(dx, dy) - (b.r + ship.r);
        if (d < nearest) nearest = d;
      }

      const dangerRadius = Math.min(width, height) * 0.34;
      return 1 - clamp(nearest / dangerRadius, 0, 1);
    }

    function update(dt, context = {}) {
      beatTimer += dt;
      if (beatTimer < beatInterval) return;

      beatTimer = 0;
      if (context.state !== 'playing') return;

      const wave = typeof context.wave === 'number' ? context.wave : 1;
      const freq = beatHi ? highHz : lowHz;
      const level = 0.046 + Math.min(0.022, (wave - 1) * 0.0011);
      heartbeatPulse(freq, { level, pulseSec, attackSec, decaySec });
      beatHi = !beatHi;
    }

    return {
      reset,
      setIntervalSec,
      measureDanger,
      update
    };
  }

  window.FrackingHeartbeat = { create };
})();
