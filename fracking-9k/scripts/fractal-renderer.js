(() => {
  'use strict';

function createFractalRenderer(glCtx) {
  const maxInstances = 220;
  const floatsPerInstance = 13;
  const maxWarpBullets = 18;

  const vertexSource = `#version 300 es
    precision highp float;
    layout(location=0) in vec2 a_pos;
    layout(location=1) in vec2 i_center;
    layout(location=2) in float i_radius;
    layout(location=3) in float i_spin;
    layout(location=4) in vec3 i_fractal;
    layout(location=5) in float i_palette;
    layout(location=6) in float i_sizeNorm;
    layout(location=7) in float i_mode;
    layout(location=8) in vec2 i_juliaC;
    layout(location=9) in float i_paletteMode;

    uniform vec2 u_resolution;

    out vec2 v_local;
    out vec2 v_world;
    out vec3 v_fractal;
    out float v_palette;
    out float v_sizeNorm;
    out float v_spin;
    out float v_mode;
    out vec2 v_juliaC;
    out float v_paletteMode;

    void main() {
      float c = cos(i_spin);
      float s = sin(i_spin);
      mat2 rot = mat2(c, -s, s, c);
      vec2 world = i_center + rot * (a_pos * i_radius);
      vec2 clip = (world / u_resolution) * 2.0 - 1.0;
      clip.y *= -1.0;
      gl_Position = vec4(clip, 0.0, 1.0);

      v_local = a_pos;
      v_world = world;
      v_fractal = i_fractal;
      v_palette = i_palette;
      v_sizeNorm = i_sizeNorm;
      v_spin = i_spin;
      v_mode = i_mode;
      v_juliaC = i_juliaC;
      v_paletteMode = i_paletteMode;
    }
  `;

  const fragmentSource = `#version 300 es
    precision highp float;
    in vec2 v_local;
    in vec2 v_world;
    in vec3 v_fractal;
    in float v_palette;
    in float v_sizeNorm;
    in float v_spin;
    in float v_mode;
    in vec2 v_juliaC;
    in float v_paletteMode;

    uniform float u_time;
    uniform int u_warpCount;
    uniform vec3 u_warpBullets[${maxWarpBullets}];
    uniform float u_perimeterOn;
    uniform float u_chromaTweak;
    uniform float u_neonTweak;
    uniform float u_diveMode;
    uniform float u_colorEnhance;
    uniform float u_liftMixOn;
    out vec4 outColor;

    vec3 paletteCosmic(float t, float seed, float cycle) {
      return vec3(
        0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
        0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
        0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
      );
    }

    vec3 paletteEmber(float t, float seed, float cycle) {
      vec3 c0 = vec3(0.010, 0.000, 0.000);
      vec3 c1 = vec3(0.180, 0.000, 0.000);
      vec3 c2 = vec3(0.600, 0.080, 0.000);
      vec3 c3 = vec3(1.000, 0.420, 0.060);
      vec3 c4 = vec3(1.000, 0.900, 0.350);
      float q = fract(t + cycle * 0.05);
      if (q < 0.22) return mix(c0, c1, q / 0.22);
      if (q < 0.50) return mix(c1, c2, (q - 0.22) / 0.28);
      if (q < 0.78) return mix(c2, c3, (q - 0.50) / 0.28);
      return mix(c3, c4, (q - 0.78) / 0.22);
    }

    vec3 paletteFirefly(float t, float seed, float cycle) {
      float p = t * 6.28318 + cycle * 1.1;
      float g = pow(0.5 + 0.5 * sin(p + 0.7), 2.5);
      return vec3(
        0.02 + 0.18 * g,
        0.08 + 0.55 * g,
        0.01 + 0.10 * sin(p * 0.6 + 2.0)
      );
    }

    vec3 paletteGold(float t, float seed, float cycle) {
      float sn = max(t, 0.000001);
      float q = fract(pow(sn, 0.35) * 0.15 + cycle * 0.02);
      vec3 c0 = vec3(0.000, 0.027, 0.392);
      vec3 c1 = vec3(0.125, 0.420, 0.796);
      vec3 c2 = vec3(0.929, 1.000, 1.000);
      vec3 c3 = vec3(1.000, 0.667, 0.000);
      vec3 c4 = vec3(0.000, 0.008, 0.000);
      if (q < 0.1600) return mix(c0, c1, q / 0.1600);
      if (q < 0.4200) return mix(c1, c2, (q - 0.1600) / 0.2600);
      if (q < 0.6425) return mix(c2, c3, (q - 0.4200) / 0.2225);
      if (q < 0.8575) return mix(c3, c4, (q - 0.6425) / 0.2150);
      return mix(c4, c0, (q - 0.8575) / 0.1425);
    }

    vec3 palettePlasma(float t, float seed, float cycle) {
      float p = t * 2.0 + cycle * 2.0;
      return vec3(
        0.5 + 0.5 * sin(p),
        0.5 + 0.5 * sin(p + 2.094),
        0.5 + 0.5 * sin(p + 4.188)
      );
    }

    vec3 paletteByMode(float t, float seed, float cycle, float mode) {
      if (mode < 0.5) return paletteCosmic(t, seed, cycle);
      if (mode < 1.5) return paletteEmber(t, seed, cycle);
      if (mode < 2.5) return paletteFirefly(t, seed, cycle);
      if (mode < 3.5) return paletteGold(t, seed, cycle);
      return palettePlasma(t, seed, cycle);
    }

    float chromaOf(vec3 color) {
      float hi = max(max(color.r, color.g), color.b);
      float lo = min(min(color.r, color.g), color.b);
      return hi - lo;
    }

    float lumaOf(vec3 color) {
      return dot(color, vec3(0.2126, 0.7152, 0.0722));
    }

    float paletteCycleRate(float mode, float seed, bool enhanced) {
      float drift = fract(seed * 7.13);
      if (enhanced) {
        if (mode < 0.5) return (0.100 + drift * 0.165) * 1.18;
        if (mode < 1.5) return (0.115 + drift * 0.185) * 1.18;
        if (mode < 2.5) return (0.095 + drift * 0.155) * 1.18;
        if (mode < 3.5) return (0.110 + drift * 0.180) * 1.18;
        return (0.100 + drift * 0.170) * 1.18;
      }
      if (mode < 0.5) return (0.045 + drift * 0.085) * 1.35;
      if (mode < 1.5) return (0.060 + drift * 0.110) * 1.35;
      if (mode < 2.5) return (0.050 + drift * 0.080) * 1.35;
      if (mode < 3.5) return (0.060 + drift * 0.105) * 1.35;
      return (0.050 + drift * 0.090) * 1.35;
    }

    float paletteCycleModeBoost(float mode) {
      // Five-stop palettes need extra phase speed to avoid visually stagnant long blends.
      if (mode < 1.5) return mode < 0.5 ? 1.0 : 1.65;
      if (mode < 3.5) return mode < 2.5 ? 1.0 : 4.4;
      return 1.0;
    }

    vec2 cMul(vec2 a, vec2 b) {
      return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }

    vec2 cDiv(vec2 a, vec2 b) {
      float denom = dot(b, b);
      if (denom < 1e-10) return vec2(1e6, 1e6);
      return vec2(
        (a.x * b.x + a.y * b.y) / denom,
        (a.y * b.x - a.x * b.y) / denom
      );
    }

    vec2 cPowReal(vec2 z, float power) {
      float r = length(z);
      if (r < 1e-10) return vec2(0.0);
      float theta = atan(z.y, z.x);
      float rp = pow(r, power);
      float phi = theta * power;
      return vec2(rp * cos(phi), rp * sin(phi));
    }

    void main() {
      const float MODE_TAU = 0.0;
      const float MODE_JULIA = 1.0;
      const float MODE_MAGNET = 2.0;
      const float MODE_BUFFALO = 3.0;
      const float MODE_TRICORN = 4.0;
      const float MODE_MANDELBROT = 5.0;
      const float TAU_POWER = 6.28318530718;
      const float NON_JULIA_VIEW_SCALE = 1.0; // >1 shrinks set, more outside color
      const float NON_JULIA_DOMAIN_WARP = 0.0; // 0 = no edge-driven domain distortion
      const float NON_JULIA_OUTER_PAD = 1.1; // >1 thickens outside shell
      // Keep full procedural re-rendering while preventing spin-induced morphology drift.
      const float NON_JULIA_EDGE_SPIN_WOBBLE = 0.02; // 0 = rigid silhouette under spin
      const float DOMAIN_SPIN_FACTOR = 0.0; // 0 = no extra internal domain spin
      const float DOMAIN_TIME_FACTOR = 0.0; // 0 = no time-driven domain precession

      float mode = floor(v_mode + 0.5);
      float r = length(v_local);
      bool isJulia = abs(mode - MODE_JULIA) < 0.5;
      bool isMagnet = abs(mode - MODE_MAGNET) < 0.5;
      bool inDive = u_diveMode > 0.5;
      bool enhanceColor = u_colorEnhance > 0.5;
      bool liftMixOn = u_liftMixOn > 0.5;
      float fractalZoomDepth = clamp(log2(1.0 / max(v_fractal.z, 1e-7)), 0.0, 16.0);
      float chromaTweak = clamp(u_chromaTweak, 0.0, 1.0);
      float neonTweak = clamp(u_neonTweak * (isJulia ? 1.5 : 1.0), 0.0, 1.0);
      float ang = atan(v_local.y, v_local.x);
      float edgePhase = v_palette * 6.28318 + dot(v_fractal.xy, vec2(23.17, 37.91));
      float edgeNoise = inDive
        ? 0.0
        : (0.12 * sin(7.0 * ang + edgePhase + v_spin * NON_JULIA_EDGE_SPIN_WOBBLE)
          + 0.07 * sin(13.0 * ang + edgePhase * 1.37));
      float edge = 1.0 + edgeNoise;
      // Non-Julia classes keep the rock shell; Julia derives visible silhouette from iteration field.
      float edgeClip = inDive ? 1.0 : (isJulia ? 1.22 : edge * NON_JULIA_OUTER_PAD);
      if (r > edgeClip) {
        discard;
      }

      vec2 p = v_local;
      if (!isJulia && !inDive) {
        vec2 warped = v_local / edge;
        p = mix(v_local, warped, NON_JULIA_DOMAIN_WARP);
        p *= NON_JULIA_VIEW_SCALE;
      }
      float domainAngle = v_spin * DOMAIN_SPIN_FACTOR + u_time * DOMAIN_TIME_FACTOR;
      float c = cos(domainAngle);
      float s = sin(domainAngle);
      mat2 frot = mat2(c, -s, s, c);
      vec2 samplePoint = v_fractal.xy + frot * p * v_fractal.z;
      float warpEnergy = 0.0;
      vec2 warpOffset = vec2(0.0);
      for (int i = 0; i < ${maxWarpBullets}; i++) {
        if (i >= u_warpCount) break;
        vec2 d = v_world - u_warpBullets[i].xy;
        float dist2 = dot(d, d) + 1.0;
        float influence = u_warpBullets[i].z / (1.0 + dist2 * 0.00085);
        vec2 tangent = vec2(-d.y, d.x) * inversesqrt(dist2);
        warpOffset += tangent * influence * 0.045;
        warpEnergy += influence;
      }
      samplePoint += warpOffset;

      vec2 cplx = samplePoint;
      vec2 z = vec2(0.0);
      if (isJulia) {
        z = samplePoint;
        vec2 cDrift = vec2(0.0);
        if (!inDive) {
          // Restore the late-wave Julia "frenzy" without adding early-game noise.
          float sizeStress = smoothstep(0.42, 1.0, clamp(v_sizeNorm, 0.0, 1.0));
          float zoomStress = smoothstep(1.6, 5.8, fractalZoomDepth);
          float chaosStress = max(sizeStress, zoomStress * 0.92);
          float driftAmp = (enhanceColor ? 0.0042 : 0.0038) * chaosStress;
          cDrift = vec2(
            sin(u_time * 0.19 + v_palette * 8.3) * driftAmp,
            cos(u_time * 0.17 + v_palette * 6.7) * driftAmp
          );
        }
        cplx = v_juliaC + cDrift;
      }

      // Linear iteration ramp by growth size ratio:
      // v_sizeNorm = 0 at spawn size, 1 at ~3x spawn size.
      int maxIter = int(mix(50.0, 150.0, clamp(v_sizeNorm, 0.0, 1.0)) + 0.5);
      if (inDive) {
        maxIter = int(clamp(180.0 + fractalZoomDepth * 18.0, 180.0, 360.0));
      } else if (enhanceColor) {
        float zoomDepth = clamp(fractalZoomDepth, 0.0, 8.0);
        maxIter += int(zoomDepth * 10.0 + 0.5);
        maxIter = int(clamp(float(maxIter), 54.0, 220.0));
      }
      int iBreak = maxIter;
      float smoothIter = float(maxIter);
      float smoothBase = 2.8;
      float escapeRadius = 2.0;
      if (abs(mode - MODE_TAU) < 0.5) {
        smoothBase = TAU_POWER;
      } else if (abs(mode - MODE_MAGNET) < 0.5) {
        escapeRadius = 10.0;
      }
      if (u_perimeterOn < 0.5 && enhanceColor) {
        // Mild bailout trim for outlineless mode; keep it conservative to avoid full blackout.
        if (abs(mode - MODE_MAGNET) < 0.5) {
          escapeRadius = min(escapeRadius, 7.5);
        } else {
          escapeRadius = min(escapeRadius, 1.95);
        }
      }
      float escape2 = escapeRadius * escapeRadius;
      float orbitTrapCross = 1e9;
      float orbitTrapCircle = 1e9;

      for (int i = 0; i < 360; i++) {
        if (i >= maxIter) break;
        if (abs(mode - MODE_TAU) < 0.5) {
          z = cPowReal(z, TAU_POWER) + cplx;
        } else if (abs(mode - MODE_MAGNET) < 0.5) {
          vec2 z2 = cMul(z, z);
          vec2 numerator = z2 + cplx - vec2(1.0, 0.0);
          vec2 denominator = 2.0 * z + cplx - vec2(2.0, 0.0);
          vec2 q = cDiv(numerator, denominator);
          z = cMul(q, q);
        } else if (abs(mode - MODE_BUFFALO) < 0.5) {
          float zx = z.x;
          float zy = z.y;
          z = vec2(
            abs(zx * zx - zy * zy) + cplx.x,
            abs(2.0 * zx * zy) + cplx.y
          );
        } else if (abs(mode - MODE_TRICORN) < 0.5) {
          float zx = z.x;
          float zy = z.y;
          z = vec2(
            zx * zx - zy * zy + cplx.x,
            -2.0 * zx * zy + cplx.y
          );
        } else {
          z = vec2(
            z.x * z.x - z.y * z.y + cplx.x,
            2.0 * z.x * z.y + cplx.y
          );
        }

        vec2 trapDelta = z - v_fractal.xy;
        orbitTrapCross = min(orbitTrapCross, min(abs(trapDelta.x), abs(trapDelta.y)));
        orbitTrapCircle = min(orbitTrapCircle, abs(length(trapDelta) - 1.0));

        float mag2 = dot(z, z);
        if (mag2 > escape2) {
          iBreak = i;
          float logZn = 0.5 * log(max(mag2, 1.000001));
          float baseLn = log(max(smoothBase, 2.0));
          float nu = log(max(logZn / log(2.0), 1.000001)) / baseLn;
          smoothIter = float(i) + 1.0 - nu;
          break;
        }
      }

      float iterRatio = clamp(smoothIter / float(maxIter), 0.0, 1.0);
      float bandPhase = warpEnergy * 0.022 + v_palette * 0.17;
      // Force visible variation on tiny fractaloids by quantizing coarse bands.
      float bandCoordWide = smoothIter * mix(0.052, 0.0096, v_sizeNorm);
      float quantMix = (inDive || !enhanceColor) ? 0.0 : smoothstep(0.34, 0.0, v_sizeNorm);
      float bandWideQuant = mix(bandCoordWide, floor(bandCoordWide * 24.0) / 14.0, quantMix);
      float bandDetailFreq = enhanceColor
        ? mix(0.015, 0.044, v_sizeNorm)
        : mix(0.028, 0.082, v_sizeNorm);
      float bandCoordDetail = smoothIter * bandDetailFreq;
      float tWide = fract(bandWideQuant + bandPhase);
      float tDetail = fract(bandCoordDetail + bandPhase * 0.52);
      float t = inDive
        ? fract(bandCoordDetail * 0.7 + bandPhase * 0.85)
        : (enhanceColor
          ? mix(tWide, tDetail, 0.34 + 0.28 * clamp(v_sizeNorm, 0.0, 1.0))
          : tDetail);
      float paletteCycle = u_time
        * paletteCycleRate(v_paletteMode, v_palette, enhanceColor)
        * paletteCycleModeBoost(v_paletteMode)
        + v_palette * 6.28318;
      float insideMaskHard = step(float(maxIter), float(iBreak));
      float insideMask = insideMaskHard;
      if (enhanceColor) {
        if (!isJulia) {
          // Enhanced look: soften non-Julia interior fill to avoid hard silhouette.
          insideMask = smoothstep(0.76, 0.8, iterRatio);
        }
        if (isMagnet) {
          // Enhanced look: magnet benefits from an even softer interior gate.
          insideMask = smoothstep(0.70, 0.994, iterRatio);
        }
      }
      float trapCrossTone = exp(-orbitTrapCross * 0.50);
      float trapCircleTone = exp(-orbitTrapCircle * 9.0);
      float trapTone = clamp(trapCrossTone * 0.65 + trapCircleTone * 0.35, 0.0, 1.0);
      vec3 insideBase = enhanceColor
        ? (isMagnet ? vec3(0.015, 0.02, 0.03) : vec3(0.09, 0.11, 0.15))
        : vec3(0.0, 0.0, 0.0);
      vec3 insideAccent = paletteByMode(
        fract(t * 0.42 + trapTone * 0.85 + v_palette * 0.19),
        fract(v_palette + 0.13),
        paletteCycle * 0.5 + 0.7,
        mod(v_paletteMode + 0.5, 5.0)
      );
      float insideAccentMix = enhanceColor ? ((0.15 + trapTone * 0.15) * neonTweak) : 0.0;
      vec3 inside = mix(insideBase, insideAccent, insideAccentMix);
      float paletteT = enhanceColor ? pow(t, 0.9) : t;
      vec3 outside = paletteByMode(paletteT, v_palette, paletteCycle, v_paletteMode);
      float outsideLuma = lumaOf(outside);
      if (enhanceColor && liftMixOn && outsideLuma < 0.08 && chromaTweak > 0.0001) {
        vec3 lift = palettePlasma(fract(t * 0.55 + 0.19), fract(v_palette + 0.21), paletteCycle + 0.7);
        float liftMix = smoothstep(0.08, 0.0, outsideLuma) * 0.42 * chromaTweak;
        outside = mix(outside, lift, liftMix);
      }
      vec3 color = mix(outside, inside, insideMask);

      float edgeForEffects = isJulia ? mix(0.84, 1.03, iterRatio) : edge;
      float glow = smoothstep(edgeForEffects + 0.16, 0.0, r);
      float rim = smoothstep(edgeForEffects - 0.12, edgeForEffects, r);
      float lightGain = enhanceColor ? mix(1.0, 0.96 + glow * 0.46, neonTweak) : 1.0;
      color *= lightGain;
      if (enhanceColor) {
        color += rim * vec3(0.46, 0.28, 0.10) * neonTweak;
        color += vec3(0.04, 0.02, 0.07) * min(1.0, warpEnergy * 0.55) * neonTweak;
        color += vec3(0.03, 0.03, 0.04) * neonTweak;
      }
      float colorChroma = chromaOf(color);
      if (enhanceColor && colorChroma < 0.012 && chromaTweak > 0.0001) {
        float accentMode = mod(v_paletteMode + 1.0, 5.0);
        vec3 accent = paletteByMode(fract(v_palette * 1.73 + iterRatio * 0.33), fract(v_palette + 0.37), paletteCycle + 0.83, accentMode);
        float fixAmount = smoothstep(0.12, 0.0, colorChroma);
        color = mix(color, accent + vec3(0.05, 0.03, 0.02), (0.16 + fixAmount * 0.52) * chromaTweak);
      }

      float alphaEdge = isJulia ? edge : edge * NON_JULIA_OUTER_PAD;
      float alpha = smoothstep(alphaEdge + 0.06, alphaEdge - 0.05, r);
      if (isJulia) {
        float boundaryBand = smoothstep(0.36, 0.78, iterRatio) * (1.0 - smoothstep(0.88, 0.997, iterRatio));
        float interior = step(float(maxIter), float(iBreak));
        float radialFade = smoothstep(1.22, 0.88, r);
        float filament = 0.65 + 0.35 * sin((samplePoint.x - samplePoint.y) * 18.0 + v_palette * 6.28318 + u_time * 0.32);
        float interiorGate = mix(0.08, 0.28, clamp(filament, 0.0, 1.0));
        alpha = max(boundaryBand * 1.35, interior * interiorGate) * radialFade;
        float structure = max(boundaryBand, interior * interiorGate);
        if (structure < 0.012) {
          float ghost = 0.06 * smoothstep(1.14, 0.26, r) * (0.4 + 0.6 * abs(sin((samplePoint.x + samplePoint.y) * 9.0 + v_palette * 6.28318)));
          alpha = max(alpha, ghost);
        }
        color += vec3(0.06, 0.05, 0.08) * boundaryBand * neonTweak;
      }

      if (u_perimeterOn < 0.5 && !inDive && enhanceColor) {
        // Outlineless mode: darken toward black, but fail-open so fractaloids never vanish.
        float outsideNearBoundary = (1.0 - insideMask) * smoothstep(0.46, 0.997, iterRatio);
        float bandEdge = abs(fract(bandCoordWide * 1.35 + bandPhase * 0.31) - 0.5);
        float outsideBand = outsideNearBoundary * (1.0 - smoothstep(0.23, 0.49, bandEdge));
        float insideFilaments = insideMask * pow(clamp(trapTone, 0.0, 1.0), 1.35);
        float silhouette = max(outsideBand * 0.95 + outsideNearBoundary * 0.32, insideFilaments);
        float radialMask = smoothstep(1.18, 0.04, r);
        float noir = clamp(silhouette * radialMask, 0.0, 1.0);

        // Visibility floor prevents the whole sprite from dropping to pure black/transparent.
        float keep = max(noir, 0.78 + outsideNearBoundary * 0.22 + insideMask * 0.10);
        color *= keep;
        alpha *= clamp(0.18 + keep * 1.12, 0.18, 1.0);
      }

      outColor = vec4(color, alpha);
    }
  `;

  function compile(type, src) {
    const shader = glCtx.createShader(type);
    glCtx.shaderSource(shader, src);
    glCtx.compileShader(shader);
    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
      throw new Error(glCtx.getShaderInfoLog(shader) || 'Shader compile failed');
    }
    return shader;
  }

  const vs = compile(glCtx.VERTEX_SHADER, vertexSource);
  const fs = compile(glCtx.FRAGMENT_SHADER, fragmentSource);
  const program = glCtx.createProgram();
  glCtx.attachShader(program, vs);
  glCtx.attachShader(program, fs);
  glCtx.linkProgram(program);
  if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
    throw new Error(glCtx.getProgramInfoLog(program) || 'Shader link failed');
  }
  glCtx.deleteShader(vs);
  glCtx.deleteShader(fs);

  const vao = glCtx.createVertexArray();
  glCtx.bindVertexArray(vao);

  const quad = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, quad);
  glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
  ]), glCtx.STATIC_DRAW);
  glCtx.enableVertexAttribArray(0);
  glCtx.vertexAttribPointer(0, 2, glCtx.FLOAT, false, 0, 0);

  const instances = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, instances);
  glCtx.bufferData(glCtx.ARRAY_BUFFER, maxInstances * floatsPerInstance * 4, glCtx.DYNAMIC_DRAW);

  glCtx.enableVertexAttribArray(1);
  glCtx.vertexAttribPointer(1, 2, glCtx.FLOAT, false, floatsPerInstance * 4, 0);
  glCtx.vertexAttribDivisor(1, 1);

  glCtx.enableVertexAttribArray(2);
  glCtx.vertexAttribPointer(2, 1, glCtx.FLOAT, false, floatsPerInstance * 4, 2 * 4);
  glCtx.vertexAttribDivisor(2, 1);

  glCtx.enableVertexAttribArray(3);
  glCtx.vertexAttribPointer(3, 1, glCtx.FLOAT, false, floatsPerInstance * 4, 3 * 4);
  glCtx.vertexAttribDivisor(3, 1);

  glCtx.enableVertexAttribArray(4);
  glCtx.vertexAttribPointer(4, 3, glCtx.FLOAT, false, floatsPerInstance * 4, 4 * 4);
  glCtx.vertexAttribDivisor(4, 1);

  glCtx.enableVertexAttribArray(5);
  glCtx.vertexAttribPointer(5, 1, glCtx.FLOAT, false, floatsPerInstance * 4, 7 * 4);
  glCtx.vertexAttribDivisor(5, 1);

  glCtx.enableVertexAttribArray(6);
  glCtx.vertexAttribPointer(6, 1, glCtx.FLOAT, false, floatsPerInstance * 4, 8 * 4);
  glCtx.vertexAttribDivisor(6, 1);

  glCtx.enableVertexAttribArray(7);
  glCtx.vertexAttribPointer(7, 1, glCtx.FLOAT, false, floatsPerInstance * 4, 9 * 4);
  glCtx.vertexAttribDivisor(7, 1);

  glCtx.enableVertexAttribArray(8);
  glCtx.vertexAttribPointer(8, 2, glCtx.FLOAT, false, floatsPerInstance * 4, 10 * 4);
  glCtx.vertexAttribDivisor(8, 1);

  glCtx.enableVertexAttribArray(9);
  glCtx.vertexAttribPointer(9, 1, glCtx.FLOAT, false, floatsPerInstance * 4, 12 * 4);
  glCtx.vertexAttribDivisor(9, 1);

  glCtx.bindVertexArray(null);
  glCtx.enable(glCtx.BLEND);
  glCtx.blendFunc(glCtx.SRC_ALPHA, glCtx.ONE_MINUS_SRC_ALPHA);

  const uResolution = glCtx.getUniformLocation(program, 'u_resolution');
  const uTime = glCtx.getUniformLocation(program, 'u_time');
  const uWarpCount = glCtx.getUniformLocation(program, 'u_warpCount');
  const uWarpBullets = glCtx.getUniformLocation(program, 'u_warpBullets[0]');
  const uPerimeterOn = glCtx.getUniformLocation(program, 'u_perimeterOn');
  const uChromaTweak = glCtx.getUniformLocation(program, 'u_chromaTweak');
  const uNeonTweak = glCtx.getUniformLocation(program, 'u_neonTweak');
  const uDiveMode = glCtx.getUniformLocation(program, 'u_diveMode');
  const uColorEnhance = glCtx.getUniformLocation(program, 'u_colorEnhance');
  const uLiftMixOn = glCtx.getUniformLocation(program, 'u_liftMixOn');

  const data = new Float32Array(maxInstances * floatsPerInstance);
  const warpData = new Float32Array(maxWarpBullets * 3);
  let viewportW = 0;
  let viewportH = 0;

  function resize(pixelW, pixelH) {
    viewportW = pixelW;
    viewportH = pixelH;
  }

  function render(list, timeSec, dpr, warpBullets = [], options = null) {
    glCtx.viewport(0, 0, viewportW, viewportH);
    glCtx.clearColor(0, 0, 0, 0);
    glCtx.clear(glCtx.COLOR_BUFFER_BIT);

    if (!list || list.length === 0) return;

    const count = Math.min(list.length, maxInstances);
    for (let i = 0; i < count; i++) {
      const a = list[i];
      const o = i * floatsPerInstance;
      data[o + 0] = a.x * dpr;
      data[o + 1] = a.y * dpr;
      data[o + 2] = a.r * dpr;
      data[o + 3] = a.angle + a.frot;
      data[o + 4] = a.fx;
      data[o + 5] = a.fy;
      data[o + 6] = a.fzoom;
      data[o + 7] = a.fseed;
      const startRadius = Math.max(0.0001, a.baseR * (a.growthStart || 1));
      const sizeRatio = a.r / startRadius;
      // Iteration ramp: 1x start size => 50 iters, 3x start size => 150 iters.
      const detailNorm = Math.max(0, Math.min(1, (sizeRatio - 1) * 0.5));
      data[o + 8] = detailNorm;
      data[o + 9] = a.mode || 0;
      data[o + 10] = a.jx || 0;
      data[o + 11] = a.jy || 0;
      data[o + 12] = a.paletteMode || 0;
    }

    const warpCount = Math.min(warpBullets.length, maxWarpBullets);
    for (let i = 0; i < warpCount; i++) {
      const b = warpBullets[i];
      const o = i * 3;
      warpData[o + 0] = b.x * dpr;
      warpData[o + 1] = b.y * dpr;
      warpData[o + 2] = 0.7 + (1 - b.life) * 0.9;
    }
    for (let i = warpCount; i < maxWarpBullets; i++) {
      const o = i * 3;
      warpData[o + 0] = 0;
      warpData[o + 1] = 0;
      warpData[o + 2] = 0;
    }

    glCtx.useProgram(program);
    glCtx.uniform2f(uResolution, viewportW, viewportH);
    glCtx.uniform1f(uTime, timeSec);
    glCtx.uniform1i(uWarpCount, warpCount);
    glCtx.uniform3fv(uWarpBullets, warpData);
    const perimeterOn = options && options.perimeterOn ? 1.0 : 0.0;
    const chromaTweak = options && typeof options.chromaTweak === 'number' ? options.chromaTweak : 1.0;
    const neonTweak = options && typeof options.neonTweak === 'number' ? options.neonTweak : 1.0;
    const diveMode = options && options.diveMode ? 1.0 : 0.0;
    const colorEnhance = options && options.colorEnhance ? 1.0 : 0.0;
    const liftMixOn = options && options.liftMixOn === false ? 0.0 : 1.0;
    glCtx.uniform1f(uPerimeterOn, perimeterOn);
    glCtx.uniform1f(uChromaTweak, chromaTweak);
    glCtx.uniform1f(uNeonTweak, neonTweak);
    glCtx.uniform1f(uDiveMode, diveMode);
    glCtx.uniform1f(uColorEnhance, colorEnhance);
    glCtx.uniform1f(uLiftMixOn, liftMixOn);
    glCtx.bindVertexArray(vao);
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, instances);
    glCtx.bufferSubData(glCtx.ARRAY_BUFFER, 0, data.subarray(0, count * floatsPerInstance));
    glCtx.drawArraysInstanced(glCtx.TRIANGLE_STRIP, 0, 4, count);
    glCtx.bindVertexArray(null);
  }

  return { resize, render };
}

  window.FrackingFractalRenderer = {
    create: createFractalRenderer
  };
})();
