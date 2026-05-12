(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function create(options = {}) {
    const ctx = options.ctx || null;
    const strokeWithVectorGlow = typeof options.strokeWithVectorGlow === 'function'
      ? options.strokeWithVectorGlow
      : (context, drawStrokePath) => {
          if (!context || typeof drawStrokePath !== 'function') return;
          drawStrokePath();
          context.stroke();
        };

    function modeTelegraphHue(mode) {
      if (mode === 1) return 206; // julia
      if (mode === 2) return 120; // magnet
      if (mode === 3) return 28; // buffalo
      if (mode === 4) return 318; // tricorn
      if (mode === 0) return 42; // tau
      return 190; // mandelbrot/default
    }

    function drawSpawnTelegraph(a, timeSec) {
      if (!ctx || !a || a.spawnTelegraphAge >= a.spawnTelegraphLife) return;
      const t = clamp(a.spawnTelegraphAge / Math.max(0.001, a.spawnTelegraphLife), 0, 1);
      const fade = 1 - t;
      const pulse = 0.58 + 0.42 * Math.sin(timeSec * 20 + (a.fseed || 0) * 21 + t * 14);
      const hue = a.spawnTelegraphHue != null ? a.spawnTelegraphHue : modeTelegraphHue(a.mode);
      const rOuter = a.r * (1.02 + t * 0.36);
      const rInner = a.r * (0.78 + t * 0.18);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = Math.max(1, 1.3 + fade * 1.6);
      ctx.strokeStyle = `hsla(${hue}, 100%, ${62 + pulse * 18}%, ${0.16 + fade * 0.34})`;
      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, rOuter, 0, Math.PI * 2);
      }, {
        haloWidthMul: 2.0,
        haloAlpha: 0.3,
        blur: 6.0
      });
      ctx.strokeStyle = `hsla(${hue}, 92%, ${56 + pulse * 14}%, ${0.08 + fade * 0.22})`;
      strokeWithVectorGlow(ctx, () => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, rInner, 0, Math.PI * 2);
      }, {
        haloWidthMul: 1.9,
        haloAlpha: 0.2,
        blur: 5.2
      });
      ctx.restore();
    }

    return {
      modeTelegraphHue,
      drawSpawnTelegraph
    };
  }

  window.FrackingFractaloidEffects = { create };
})();
