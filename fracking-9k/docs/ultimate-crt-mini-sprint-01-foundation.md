# Ultimate CRT Mini-Sprint 01: Foundation

Feature branch: `feature/glcrtjs`  
Status: `planning ready`

## Locked Decisions

- Keep existing visuals by default in this sprint (plumbing only).
- Add shader pipeline behind query param gate first: `crtPipeline=1`.
- Keep CSS cabinet/letterbox treatment in place.

## Sprint Goal

Introduce a no-risk CRT pipeline shell that can be toggled on/off and benchmarked, with zero required stylistic change.

## Task Board (In Order)

0. [ ] Task 0 - Baseline snapshots before touching render flow
   - Files: none (capture workflow only)
   - Capture:
     - `native` + existing CSS CRT
     - `arcade_640` + existing CSS CRT
   - Record:
     - `fps avg/p95`, `frame ms avg/p95/p99`, scene notes, screenshots.
   - Done when:
     - Baseline set exists for direct A/B after each task.

1. [ ] Task 1 - Scaffold CRT module structure
   - Files: `scripts/crt-pipeline/*`
   - Add:
     - `crt-pipeline.js` public API shell
     - pass stubs + shader stub modules
     - preset and uniform schema placeholders
   - Done when:
     - Module imports cleanly with no runtime errors.

2. [ ] Task 2 - Add runtime gate + config plumbing
   - Files: `scripts/game.js`
   - Add query params:
     - `crtPipeline=0|1` (default `0`)
     - `crtPreset=<name>` (optional)
     - `crtQuality=low|medium|high` (optional)
   - Done when:
     - Game can boot with pipeline disabled or enabled.

3. [ ] Task 3 - Add scene target and final composite pass (identity output)
   - Files: `scripts/game.js`, `scripts/crt-pipeline/*`
   - Render flow:
     - draw scene -> FBO
     - present scene texture back to screen with identity shader
   - Done when:
     - `crtPipeline=1` looks functionally identical to `crtPipeline=0`.

4. [ ] Task 4 - Resize/lifecycle integration
   - Files: `scripts/game.js`, `scripts/crt-pipeline/crt-pipeline.js`
   - Wire:
     - resize notifications
     - mode/res changes
     - safe resource create/destroy
   - Done when:
     - No resize artifacts, no leaked framebuffers/textures.

5. [ ] Task 5 - Instrumentation hooks
   - Files: `scripts/game.js`, `scripts/perf-metrics.js` (only if needed)
   - Add per-pass timing hooks (coarse is fine initially).
   - Done when:
     - Perf captures can isolate pipeline overhead.

6. [ ] Task 6 - Validation pass
   - Files: touched files
   - Run:
     - `node --check scripts/game.js`
     - `node --check scripts/crt-pipeline/crt-pipeline.js`
   - Done when:
     - No syntax errors, no visual regressions in title/gameplay/game-over/touch screens.

## Acceptance

- `crtPipeline=1` is stable and visually parity (identity path).
- Pipeline overhead is measurable and acceptable for a “no-op” pass.
- No regression in input, Dive mode, wrap behavior, or overlays.

## Definition of Done

- CRT module skeleton exists and is integrated behind a gate.
- Render loop can route through pipeline path safely.
- Baseline and post-sprint captures are documented for next sprint entry criteria.
