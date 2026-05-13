# Ultimate CRT Render Pipeline (Shader-First)

Status: `planning`  
Scope: Fracking-9k integration plan + reusable CRT module/library design

## Goal

Build a shader-driven CRT pipeline that makes gameplay, fractals, HUD, and overlays feel like they were all drawn by the same electron gun, while preserving the performance wins from `arcade_640`.

## Non-Goals (for first implementation)

- Exact historical emulation of one specific arcade monitor chassis.
- Replacing gameplay/simulation systems.
- Requiring WebGPU (WebGL2 remains baseline).

## Why Move CRT Out of CSS

Shader-first CRT gives us:

- One coherent image model for all layers (world, fractals, HUD, interstitials).
- Uniform behavior across browsers/devices (fewer blend-mode quirks).
- Physically-inspired effects impossible or awkward in CSS:
  - per-channel convergence,
  - phosphor persistence,
  - beam profile control,
  - distortion at geometry edges,
  - bloom derived from scene luminance.

CSS still has value for cabinet/panel treatment:

- bezel/letterbox gloss,
- page-level composition outside the tube area.

## Target Architecture

Render graph at a high level:

1. `Scene Pass`
   - Render gameplay + fractals + HUD into a single linear scene texture at logical arcade resolution.
2. `Glow Prefilter`
   - Extract bright/emissive signal.
3. `Bloom Chain`
   - Multi-level downsample/upsample (Kawase or separable Gaussian).
4. `CRT Tube Pass`
   - Apply barrel/pincushion warp, scanlines, mask, convergence, beam profile, vignette, grain/jitter.
5. `Persistence Feedback Pass` (optional by quality tier)
   - Blend current frame with previous phosphor buffer for temporal decay.
6. `Composite Pass`
   - Composite CRT result into centered playfield rect.
   - Keep outer letterbox/panel as non-CRT glossy black.

## Module Boundaries (Library-Ready)

Suggested new module:

- `scripts/crt-pipeline/`
  - `crt-pipeline.js` (public API + lifecycle)
  - `passes/scene-composite-pass.js`
  - `passes/glow-prefilter-pass.js`
  - `passes/bloom-pass.js`
  - `passes/crt-pass.js`
  - `passes/persistence-pass.js`
  - `passes/final-composite-pass.js`
  - `shaders/*.glsl.js` (string modules)
  - `presets.js`
  - `uniform-schema.js`

Public API sketch:

```js
const crt = createCrtPipeline(gl, {
  logicalWidth: 1024,
  logicalHeight: 768,
  quality: 'medium',
  preset: 'arcade_color',
});

crt.resize({ viewportWidth, viewportHeight, dpr });
crt.setPreset('vector_arcade');
crt.setQuality('high');
crt.setUniforms({ scanlineDensity: 0.95, convergence: 0.35 });

crt.beginScene();      // bind scene FBO
// draw world, fractals, HUD into scene target
crt.endScene();        // run post chain
crt.present();         // composite to default framebuffer
```

## Rendering Unification Strategy

Current state is mixed (`2D canvas` + `WebGL fractal canvas` + DOM HUD).  
Target state should unify the visual output before CRT pass:

- Option A (recommended): single WebGL compositor
  - Keep existing draw paths initially, then upload/compose into one scene texture.
  - Migrate HUD text from DOM to GPU text pass (SDF or bitmap font atlas).
- Option B: keep DOM HUD forever
  - Faster migration, but HUD will never perfectly match tube behavior.

If “same electron gun” is the goal, HUD/text must be rendered in-pipeline (Option A end state).

## Effect Stack Specification

The CRT pass should expose these controls (uniforms/preset-driven):

- Geometry
  - `warpAmountX`, `warpAmountY`, `cornerRoundness`
- Beam/Scan
  - `scanlineStrength`, `scanlineDensity`, `beamMinSigma`, `beamMaxSigma`
- Phosphor/Mask
  - `maskType` (`none`, `aperture`, `slot`, `triad`)
  - `maskStrength`, `maskScale`
- Color/Convergence
  - `convergenceX`, `convergenceY`, `chromaticBleed`
  - `gammaIn`, `gammaOut`, `lift`, `gain`
- Bloom/Glow
  - `bloomIntensity`, `bloomThreshold`, `bloomRadius`
- Temporal/Noise
  - `persistence`, `persistenceDecay`, `jitter`, `noiseAmount`
- Vignette/Glass
  - `vignetteStrength`, `tubeShadow`

## Quality Tiers

Keep user-facing tiers that map to pass toggles:

- `low`
  - 1 bloom level, no persistence, minimal mask math.
- `medium` (default for arcade mode)
  - 2-3 bloom levels, lightweight convergence, optional low-cost persistence.
- `high`
  - full bloom chain, full mask + convergence + persistence.

## Performance Budget Targets

Maintain acceptance posture from `arcade_640`:

- Busy scenes should stay near current improved range (`~45+ fps` target class on tested hardware).
- CRT stack should be mostly constant-time per frame (decoupled from fractal complexity).
- Budget guideline at `1024x768`:
  - `low`: <= 1.5 ms GPU overhead
  - `medium`: <= 3.0 ms GPU overhead
  - `high`: <= 5.0 ms GPU overhead

## Migration Plan (Phased)

1. Phase 0: Baseline + guardrails
   - Keep current CSS pipeline intact.
   - Snapshot perf + screenshots (already enabled via perf tooling).
2. Phase 1: Introduce CRT pipeline shell (no visual change)
   - Add module + pass wiring behind query param (e.g. `crtPipeline=1`).
3. Phase 2: Move scanlines/vignette/RGB split from CSS to CRT shader
   - Disable overlapping CSS effects inside playfield.
4. Phase 3: Add bloom + convergence + optional persistence
   - Tune presets for `arcade_640` resolutions.
5. Phase 4: HUD in-pipeline
   - Replace DOM HUD for gameplay with GPU text layer.
6. Phase 5: Start/game-over parity
   - Route title/game-over through same scene->CRT path.
7. Phase 6: Hardening + extraction
   - Stabilize API and separate module for reuse.

## Integration Notes for Fracking-9k

- Keep letterbox/panel gloss in CSS (`non-CRT area`).
- Keep URL config model used elsewhere:
  - `mode`, `arcadeRes`, `maxFps`, and add CRT knobs only where needed.
- Preserve current defaults:
  - `mode=arcade_640`
  - `arcadeRes=1024x768`
  - glow quality defaults remain performance-friendly.

## Risks and Mitigations

- Risk: increased implementation complexity.
  - Mitigation: phase gates + query-param opt-in + side-by-side A/B.
- Risk: mobile GPU variance.
  - Mitigation: strict tier fallbacks + feature toggles per capability.
- Risk: text clarity degradation after full CRT processing.
  - Mitigation: dedicated HUD pass with tuned gamma/beam profile.

## Done Criteria (Ultimate CRT)

- Gameplay, fractals, HUD, and interstitial screens share one CRT visual model.
- No playfield CSS scanline/RGB effect dependency for final look.
- Letterbox/panel remains non-CRT glossy black.
- `arcade_640` performance remains in acceptable range vs current baseline.
- Presets exist for at least:
  - `arcade_clean`
  - `arcade_heavy`
  - `vector_arcade`

## Suggested Next Implementation Ticket

“Phase 1 shell”: add `crt-pipeline` module scaffolding with no-op passes and query-param gate, then render through final composite pass only (no stylistic delta yet). This gives safe plumbing before aesthetic changes.
