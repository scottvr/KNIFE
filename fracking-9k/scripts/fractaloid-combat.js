(() => {
  'use strict';

  function create(options = {}) {
    const scoreBySize = options.scoreBySize || { 4: 10, 3: 20, 2: 50, 1: 100 };

    function chipScoreFor(sizeKey) {
      return Math.max(8, Math.floor((scoreBySize[sizeKey] || 40) * 0.12));
    }

    function splitFractaloid(a, hitPoint = null, grantScore = true, ctx = {}) {
      const spawnShockwave = typeof ctx.spawnShockwave === 'function' ? ctx.spawnShockwave : () => {};
      const explode = typeof ctx.explode === 'function' ? ctx.explode : () => {};
      const makeFractaloid = typeof ctx.makeFractaloid === 'function' ? ctx.makeFractaloid : () => null;
      const awardFractaloidScore = typeof ctx.awardFractaloidScore === 'function' ? ctx.awardFractaloidScore : () => 0;
      const fractaloids = Array.isArray(ctx.fractaloids) ? ctx.fractaloids : [];
      const wave = ctx.wave || 1;
      const sfx = ctx.sfx || {
        bangLarge: () => {},
        bangMedium: () => {},
        bangSmall: () => {}
      };

      spawnShockwave(a.x, a.y, a.r, a.fseed || 0);
      if (grantScore) awardFractaloidScore(scoreBySize[a.sizeKey]);

      if (a.sizeKey === 4) {
        sfx.bangLarge();
        explode(a.x, a.y, 30, 1.9);
        spawnShockwave(a.x, a.y, a.r * 1.2, a.fseed || 0);
        for (let i = 0; i < 3; i++) {
          const child = makeFractaloid(a.x, a.y, 3, wave * 6.2, a, hitPoint);
          if (child) fractaloids.push(child);
        }
        for (let i = 0; i < 2; i++) {
          const child = makeFractaloid(a.x, a.y, 2, wave * 6.8, a, hitPoint);
          if (child) fractaloids.push(child);
        }
      } else if (a.sizeKey === 3) {
        sfx.bangLarge();
        explode(a.x, a.y, 14, 1.0);
        const c1 = makeFractaloid(a.x, a.y, 2, wave * 4, a, hitPoint);
        const c2 = makeFractaloid(a.x, a.y, 2, wave * 4, a, hitPoint);
        if (c1) fractaloids.push(c1);
        if (c2) fractaloids.push(c2);
      } else if (a.sizeKey === 2) {
        sfx.bangMedium();
        explode(a.x, a.y, 10, 0.8);
        const c1 = makeFractaloid(a.x, a.y, 1, wave * 4, a, hitPoint);
        const c2 = makeFractaloid(a.x, a.y, 1, wave * 4, a, hitPoint);
        if (c1) fractaloids.push(c1);
        if (c2) fractaloids.push(c2);
      } else {
        sfx.bangSmall();
        explode(a.x, a.y, 8, 0.6);
      }
    }

    function damageFractaloid(a, hitPoint, grantScore, ctx = {}) {
      const spawnShockwave = typeof ctx.spawnShockwave === 'function' ? ctx.spawnShockwave : () => {};
      const explode = typeof ctx.explode === 'function' ? ctx.explode : () => {};
      const addRawScore = typeof ctx.addRawScore === 'function' ? ctx.addRawScore : () => {};
      const fract = typeof ctx.fract === 'function' ? ctx.fract : (v) => v - Math.floor(v);

      if (a.hp > 1) {
        a.hp -= 1;
        a.fseed = fract(a.fseed + 0.14 + Math.random() * 0.2);
        a.age = Math.min(a.lifeSpan, a.age + a.lifeSpan * 0.08);
        spawnShockwave(a.x, a.y, a.r * 0.66, a.fseed || 0);
        explode(a.x, a.y, 8, 0.45);
        if (grantScore) addRawScore(chipScoreFor(a.sizeKey));
        return false;
      }

      splitFractaloid(a, hitPoint, grantScore, ctx);
      return true;
    }

    return {
      damageFractaloid,
      splitFractaloid
    };
  }

  window.FrackingFractaloidCombat = { create };
})();
