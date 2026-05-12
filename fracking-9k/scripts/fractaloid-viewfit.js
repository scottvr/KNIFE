(() => {
  'use strict';

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
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

  function create(options = {}) {
    const classModes = options.classModes || { tau: 0, julia: 1, magnet: 2, buffalo: 3, tricorn: 4, mandelbrot: 5 };

    const cfg = {
      juliaAreaTargetFill: options.juliaAreaTargetFill != null ? options.juliaAreaTargetFill : 0.49,
      juliaAreaMinScale: options.juliaAreaMinScale != null ? options.juliaAreaMinScale : 3.66,
      juliaAreaMaxScale: options.juliaAreaMaxScale != null ? options.juliaAreaMaxScale : 4.0,
      juliaAreaScaleBlend: options.juliaAreaScaleBlend != null ? options.juliaAreaScaleBlend : 0.58,
      juliaAreaSampleGrid: options.juliaAreaSampleGrid != null ? options.juliaAreaSampleGrid : 17,
      juliaAreaMaxIter: options.juliaAreaMaxIter != null ? options.juliaAreaMaxIter : 76,
      juliaVisibleFillMin: options.juliaVisibleFillMin != null ? options.juliaVisibleFillMin : 0.055,
      juliaViewAttempts: options.juliaViewAttempts != null ? options.juliaViewAttempts : 14,
      juliaShapeScaleFailsafe: options.juliaShapeScaleFailsafe != null ? options.juliaShapeScaleFailsafe : 1.16,
      juliaZoomMin: options.juliaZoomMin != null ? options.juliaZoomMin : 0.54,
      juliaZoomMax: options.juliaZoomMax != null ? options.juliaZoomMax : 2.8,
      mandelViewAttempts: options.mandelViewAttempts != null ? options.mandelViewAttempts : 10,
      mandelSampleGrid: options.mandelSampleGrid != null ? options.mandelSampleGrid : 13,
      mandelMaxIter: options.mandelMaxIter != null ? options.mandelMaxIter : 72,
      mandelEscapeTarget: options.mandelEscapeTarget != null ? options.mandelEscapeTarget : 0.42,
      mandelEscapeMin: options.mandelEscapeMin != null ? options.mandelEscapeMin : 0.16,
      mandelZoomMin: options.mandelZoomMin != null ? options.mandelZoomMin : 0.56,
      mandelZoomMax: options.mandelZoomMax != null ? options.mandelZoomMax : 2.9,
      mandelZoomFloorSteps: Array.isArray(options.mandelZoomFloorSteps) && options.mandelZoomFloorSteps.length
        ? options.mandelZoomFloorSteps.slice()
        : [0.9, 0.82, 0.74, 0.66, 0.58, 0.52, 0.46, 0.4],
      centeringGrid: options.centeringGrid != null ? options.centeringGrid : 15,
      centeringMaxIter: options.centeringMaxIter != null ? options.centeringMaxIter : 84,
      centeringPasses: options.centeringPasses != null ? options.centeringPasses : 2
    };

    const juliaAreaScaleCache = new Map();

    function isJuliaMode(mode) {
      return mode === classModes.julia;
    }

    function iterateFractaloidOrbit(mode, cx, cy, jx, jy, maxIter = cfg.centeringMaxIter) {
      const tauPower = Math.PI * 2;
      const juliaMode = isJuliaMode(mode);
      const bailout = mode === classModes.magnet ? 10 : 4;
      const bailout2 = bailout * bailout;
      const cRe = juliaMode ? jx : cx;
      const cIm = juliaMode ? jy : cy;
      let zRe = juliaMode ? cx : 0;
      let zIm = juliaMode ? cy : 0;

      for (let i = 0; i < maxIter; i++) {
        let nx;
        let ny;
        if (mode === classModes.tau) {
          const zp = cPowReal(zRe, zIm, tauPower);
          nx = zp.re + cRe;
          ny = zp.im + cIm;
        } else if (mode === classModes.magnet) {
          const z2x = zRe * zRe - zIm * zIm;
          const z2y = 2 * zRe * zIm;
          const numRe = z2x + cRe - 1;
          const numIm = z2y + cIm;
          const denRe = 2 * zRe + cRe - 2;
          const denIm = 2 * zIm + cIm;
          const q = cDiv(numRe, numIm, denRe, denIm);
          nx = q.re * q.re - q.im * q.im;
          ny = 2 * q.re * q.im;
        } else if (mode === classModes.buffalo) {
          nx = Math.abs(zRe * zRe - zIm * zIm) + cRe;
          ny = Math.abs(2 * zRe * zIm) + cIm;
        } else if (mode === classModes.tricorn) {
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

    function estimateFractaloidCentroid(mode, jx, jy, fx, fy, fzoom, sampleGrid = cfg.centeringGrid, maxIter = cfg.centeringMaxIter) {
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

    function centerFractaloidView(mode, jx, jy, fx, fy, fzoom, passes = cfg.centeringPasses) {
      let tx = fx;
      let ty = fy;
      const magnetMode = mode === classModes.magnet;
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
      const grid = cfg.mandelSampleGrid;
      const maxIter = cfg.mandelMaxIter;
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
            if (mode === classModes.tau) {
              const zp = cPowReal(zx, zy, tauPower);
              nx = zp.re + cx;
              ny = zp.im + cy;
            } else if (mode === classModes.magnet) {
              const z2x = zx * zx - zy * zy;
              const z2y = 2 * zx * zy;
              const numRe = z2x + cx - 1;
              const numIm = z2y + cy;
              const denRe = 2 * zx + cx - 2;
              const denIm = 2 * zy + cy;
              const q = cDiv(numRe, numIm, denRe, denIm);
              nx = q.re * q.re - q.im * q.im;
              ny = 2 * q.re * q.im;
            } else if (mode === classModes.buffalo) {
              nx = Math.abs(zx * zx - zy * zy) + cx;
              ny = Math.abs(2 * zx * zy) + cy;
            } else if (mode === classModes.tricorn) {
              nx = zx * zx - zy * zy + cx;
              ny = -2 * zx * zy + cy;
            } else {
              nx = zx * zx - zy * zy + cx;
              ny = 2 * zx * zy + cy;
            }
            zx = nx;
            zy = ny;
            const bailout = mode === classModes.magnet ? 10 : 4;
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

    function tuneMandelbrotView(mode, fx, fy, fzoom, spread, attempts = cfg.mandelViewAttempts, zoomMin = cfg.mandelZoomMin, zoomMax = cfg.mandelZoomMax) {
      let bestFx = fx;
      let bestFy = fy;
      let bestZoom = fzoom;
      let bestEscape = estimateMandelbrotEscapeFill(mode, fx, fy, fzoom);
      let bestScore = Math.abs(bestEscape - cfg.mandelEscapeTarget)
        + Math.max(0, cfg.mandelEscapeMin - bestEscape) * 2.4;

      for (let i = 0; i < attempts; i++) {
        const jitter = spread * (0.7 + i * 0.15) + fzoom * 0.08;
        const testFx = fx + rand(-jitter, jitter);
        const testFy = fy + rand(-jitter, jitter);
        const testZoom = clamp(fzoom * (0.72 + Math.random() * 0.74), zoomMin, zoomMax);
        const escape = estimateMandelbrotEscapeFill(mode, testFx, testFy, testZoom);
        const score = Math.abs(escape - cfg.mandelEscapeTarget)
          + Math.max(0, cfg.mandelEscapeMin - escape) * 2.4;
        if (score < bestScore) {
          bestScore = score;
          bestFx = testFx;
          bestFy = testFy;
          bestZoom = testZoom;
          bestEscape = escape;
          if (escape >= cfg.mandelEscapeMin && Math.abs(escape - cfg.mandelEscapeTarget) < 0.06) break;
        }
      }

      return { fx: bestFx, fy: bestFy, fzoom: bestZoom, escape: bestEscape };
    }

    function deriveMandelZoomFloorRatio(mode, fx, fy, baseFzoom) {
      let floor = cfg.mandelZoomFloorSteps[0];
      for (const ratio of cfg.mandelZoomFloorSteps) {
        const escape = estimateMandelbrotEscapeFill(mode, fx, fy, baseFzoom * ratio);
        if (escape >= cfg.mandelEscapeMin) {
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
      const grid = cfg.juliaAreaSampleGrid;
      const maxIter = cfg.juliaAreaMaxIter;

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

    function tuneJuliaView(jx, jy, fx, fy, fzoom, attempts = cfg.juliaViewAttempts) {
      let bestFx = fx;
      let bestFy = fy;
      let bestZoom = fzoom;
      let bestFill = estimateJuliaVisualFill(jx, jy, fx, fy, fzoom);

      if (bestFill >= cfg.juliaVisibleFillMin) {
        return { fx: bestFx, fy: bestFy, fzoom: bestZoom, fill: bestFill };
      }

      for (let i = 0; i < attempts; i++) {
        const jitter = fzoom * (0.42 + i * 0.05);
        const testFx = fx + rand(-jitter, jitter);
        const testFy = fy + rand(-jitter, jitter);
        const testZoom = clamp(fzoom * (0.66 + Math.random() * 0.78), cfg.juliaZoomMin, cfg.juliaZoomMax);
        const fill = estimateJuliaVisualFill(jx, jy, testFx, testFy, testZoom);
        if (fill > bestFill) {
          bestFill = fill;
          bestFx = testFx;
          bestFy = testFy;
          bestZoom = testZoom;
          if (bestFill >= cfg.juliaVisibleFillMin) break;
        }
      }

      return { fx: bestFx, fy: bestFy, fzoom: bestZoom, fill: bestFill };
    }

    function getJuliaAreaScale(jx, jy, fx, fy, fzoom) {
      const key = Math.round(jx * 220) + ':' + Math.round(jy * 220) + ':' + Math.round(fx * 180) + ':' + Math.round(fy * 180) + ':' + Math.round(fzoom * 110);
      const cached = juliaAreaScaleCache.get(key);
      if (cached != null) return cached;

      const fill = Math.max(0.0001, estimateJuliaVisualFill(jx, jy, fx, fy, fzoom));
      if (fill < cfg.juliaVisibleFillMin * 0.6) {
        juliaAreaScaleCache.set(key, cfg.juliaShapeScaleFailsafe);
        return cfg.juliaShapeScaleFailsafe;
      }

      const clampedFill = Math.max(0.08, fill);
      const rawScale = Math.sqrt(cfg.juliaAreaTargetFill / clampedFill);
      const blended = 1 + (rawScale - 1) * cfg.juliaAreaScaleBlend;
      const finalScale = clamp(blended, cfg.juliaAreaMinScale, cfg.juliaAreaMaxScale);
      juliaAreaScaleCache.set(key, finalScale);
      return finalScale;
    }

    return {
      juliaViewAttempts: cfg.juliaViewAttempts,
      mandelViewAttempts: cfg.mandelViewAttempts,
      tuneJuliaView,
      tuneMandelbrotView,
      deriveMandelZoomFloorRatio,
      centerFractaloidView,
      getJuliaAreaScale
    };
  }

  window.FrackingFractaloidViewfit = { create };
})();
