# Ultimate CRT Mini-Sprint 02: CRT Pass Parity

Feature branch: `feature/glcrtjs`  
Status: `planning ready`  
Entry criteria: Mini-Sprint 01 complete

## Locked Decisions

- Move only playfield CRT treatment into shader in this sprint.
- Keep letterbox/panel gloss in CSS.
- Preserve current artistic character first, then refine.

## Sprint Goal

Replace CSS playfield scanline/RGB/vignette overlays with shader equivalents while keeping the look familiar and performant.

## Task Board (In Order)

0. [ ] Task 0 - Freeze visual references
   - Files: none
   - Capture reference screenshots/video from `crtPipeline=0`:
     - gameplay dense scene,
     - Dive view,
     - title/game-over.
   - Done when:
     - We have side-by-side visual targets.

1. [ ] Task 1 - Implement CRT pass core uniforms
   - Files: `scripts/crt-pipeline/passes/crt-pass.js`, `scripts/crt-pipeline/shaders/*`
   - Add:
     - scanline intensity/density
     - vignette strength
     - RGB/channel split amount
   - Done when:
     - Pass compiles and responds to uniform changes.

2. [ ] Task 2 - Wire pass into pipeline order
   - Files: `scripts/crt-pipeline/crt-pipeline.js`
   - Order:
     - scene -> CRT pass -> final composite
   - Done when:
     - `crtPipeline=1` visibly applies CRT treatment inside playfield only.

3. [ ] Task 3 - Add presets for parity tuning
   - Files: `scripts/crt-pipeline/presets.js`
   - Presets:
     - `arcade_clean`
     - `arcade_heavy`
   - Done when:
     - Runtime can switch via `crtPreset=...`.

4. [ ] Task 4 - Disable overlapping CSS playfield overlays in pipeline mode
   - Files: `styles/game.css`, `scripts/game.js`
   - Ensure:
     - no double-scanline or double-vignette in `crtPipeline=1`.
   - Done when:
     - CSS CRT effect is off only for pipeline-enabled playfield.

5. [ ] Task 5 - A/B parity sweep
   - Files: none
   - Compare:
     - `crtPipeline=0` vs `crtPipeline=1`
     - same `mode` and `arcadeRes`.
   - Done when:
     - Visual drift is intentional and documented.

6. [ ] Task 6 - Validation
   - Files: touched files
   - Run:
     - `node --check scripts/game.js`
     - `node --check scripts/crt-pipeline/crt-pipeline.js`
   - Done when:
     - No syntax or obvious behavior regressions.

## Acceptance

- Shader CRT pass reaches parity or better with old CSS look.
- Playfield CRT no longer depends on CSS overlays when pipeline is enabled.
- Performance remains within agreed budget for `medium` quality target class.

## Definition of Done

- CRT scanline/vignette/RGB behaviors are shader-driven for playfield.
- Preset switching works and is testable by query params.
- Side-by-side captures are stored and reviewed.
