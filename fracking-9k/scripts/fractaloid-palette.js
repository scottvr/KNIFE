(() => {
  'use strict';

  function fract(v) { return v - Math.floor(v); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function create(options = {}) {
    const P = options.paletteModes || { cosmic: 0, ember: 1, firefly: 2, gold: 3, plasma: 4 };
    const C = options.classModes || { tau: 0, julia: 1, magnet: 2, buffalo: 3, tricorn: 4, mandelbrot: 5 };

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
      const isJulia = mode === C.julia;
      if (parentMode != null) {
        const inheritChance = isJulia
          ? (isBoss ? 0.62 : 0.48)
          : 0.82;
        if (Math.random() < inheritChance) return parentMode;
      }

      const weighted = isBoss
        ? (isJulia
            ? [[P.plasma, 0.30], [P.cosmic, 0.28], [P.gold, 0.20], [P.firefly, 0.12], [P.ember, 0.10]]
            : [[P.plasma, 0.34], [P.cosmic, 0.26], [P.gold, 0.22], [P.ember, 0.10], [P.firefly, 0.08]])
        : (isJulia
            ? [[P.plasma, 0.24], [P.cosmic, 0.24], [P.gold, 0.20], [P.firefly, 0.18], [P.ember, 0.14]]
            : [[P.cosmic, 0.34], [P.plasma, 0.24], [P.gold, 0.20], [P.ember, 0.14], [P.firefly, 0.08]]);

      return weightedPickPaletteMode(weighted);
    }

    function paletteRgbAt(t, seed, paletteMode = P.cosmic) {
      const tau = Math.PI * 2;
      const phase = seed * tau;
      const cycle = phase;
      const p = t;
      const mix = (a, b, m) => a + (b - a) * m;

      if (paletteMode === P.ember) {
        const q = fract(p + cycle * 0.05);
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

      if (paletteMode === P.firefly) {
        const p2 = p * tau + cycle * 1.1;
        const g = Math.pow(0.5 + 0.5 * Math.sin(p2 + 0.7), 2.5);
        return [
          clamp(0.02 + 0.18 * g, 0, 1),
          clamp(0.08 + 0.55 * g, 0, 1),
          clamp(0.01 + 0.10 * Math.sin(p2 * 0.6 + 2.0), 0, 1)
        ];
      }

      if (paletteMode === P.gold) {
        const sn = Math.max(p, 0.000001);
        const q = fract(Math.pow(sn, 0.35) * 0.15 + cycle * 0.02);
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

      if (paletteMode === P.plasma) {
        const p2 = p * 2.0 + cycle * 2.0;
        return [
          0.5 + 0.5 * Math.sin(p2),
          0.5 + 0.5 * Math.sin(p2 + 2.094),
          0.5 + 0.5 * Math.sin(p2 + 4.188)
        ];
      }

      return [
        0.5 + 0.5 * Math.cos(3.0 + p + cycle * 0.5),
        0.5 + 0.5 * Math.cos(3.0 + p * 0.7 + cycle * 0.3),
        0.5 + 0.5 * Math.cos(3.0 + p * 0.5 + cycle * 0.2)
      ];
    }

    function paletteVibranceScore(seed, paletteMode = P.cosmic) {
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

    function pickVibrantPaletteSeed(seedHint = Math.random(), paletteMode = P.cosmic) {
      const norm = (v) => fract(fract(v) + 1);
      const threshold = paletteMode === P.firefly ? 0.21 : 0.26;
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

    return {
      pickFractaloidPaletteMode,
      pickVibrantPaletteSeed
    };
  }

  window.FrackingFractaloidPalette = { create };
})();
