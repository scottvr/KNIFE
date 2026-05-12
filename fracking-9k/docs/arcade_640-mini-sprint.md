# Arcade 640 Mini-Sprint

Feature branch: `feature/arcade_640`  
Status: `planning ready`

## Locked Decisions

- [x] Fixed internal render resolution and world simulation resolution.
- [x] Internal render target is fixed 4:3 and preset-driven in arcade mode.
- [x] Default arcade preset: `1024x768` (with test presets `640x480` and `1280x960`).
- [x] Integer scaling is preferred.
- [x] Default vector glow tier in `arcade_640`: `medium`.

## Sprint Goal

Ship a selectable `arcade_640` mode that:

- runs world + render at fixed low resolution,
- scales cleanly to modern displays with letterboxing,
- keeps CRT/vector style,
- improves frame-time versus current `native` mode.

## Task Board (In Order)

0. [x] Task 0 - Baseline metrics instrumentation and capture workflow
   - Files: `scripts/perf-metrics.js`, `scripts/game.js`, `index.html`
   - Add lightweight in-engine metrics collector:
     - rolling window stats (FPS, frame ms avg/p95/p99, CPU ms avg/p95, slow-frame ratios),
     - capture snapshots with labels for baseline comparison.
   - Add global console API:
     - `window.frackingPerf.start(label)`
     - `window.frackingPerf.stop()`
     - `window.frackingPerf.snap(label)`
     - `window.frackingPerf.stats()`
     - `window.frackingPerf.list()`
   - Add optional overlay via query parameter:
     - `?perf=1` (or `?perfOverlay=1`)
     - toggle with `F8`.
   - Baseline capture protocol:
     - Start run with overlay: open game URL with `?perf=1`
     - Begin capture: `window.frackingPerf.start('baseline_busy_wave_native')`
     - Play target scenario for 60-120s
     - End capture: `window.frackingPerf.stop()`
     - Persist result from console object (JSON) for later A/B.
   - Done when:
     - we can produce repeatable labeled baseline snapshots before `arcade_640` changes.

1. [x] Task 1 - Add mode/config scaffolding
   - Files: `scripts/game.js`
   - Add constants/settings:
     - `RENDER_MODE` (`native`, `arcade_640`)
     - `ARCADE_RES_PRESETS` (`640x480`, `1024x768`, `1280x960`)
     - `ARCADE_RES_DEFAULT = 1024x768`
     - `ARCADE_GLOW_QUALITY = 'medium'`
   - Add helper booleans for mode checks to reduce branching noise.
   - Done when:
     - Game boots with no behavior change in `native`.

2. [x] Task 2 - Implement fixed internal canvas sizing for `arcade_640`
   - Files: `scripts/game.js` (`resize()` path)
   - In `arcade_640`, set internal canvas pixel dimensions directly to fixed 4:3 preset dimensions.
   - Presets available via query param:
     - `?mode=arcade_640&arcadeRes=640x480`
     - `?mode=arcade_640&arcadeRes=1024x768`
     - `?mode=arcade_640&arcadeRes=1280x960`
   - Do not multiply internal buffer by device DPR in this mode.
   - Apply same sizing policy to both `#game` and `#fractal-layer`.
   - Done when:
     - Internal canvas dimensions stay fixed while browser window changes.

3. [x] Task 3 - Add integer upscale + letterbox presentation
   - Files: `scripts/game.js`, `styles/game.css` (if needed)
   - Compute largest integer scale that fits viewport.
   - Center playfield and letterbox remaining area.
   - Fallback: if viewport is smaller than base res, allow fractional downscale to fit.
   - Done when:
     - No stretching distortion.
     - Pixel edges stay crisp.

4. [x] Task 4 - Bind world simulation dimensions to arcade base res
   - Files: `scripts/game.js` (W/H assignments and resize lifecycle)
   - In `arcade_640`, force logical world dimensions used by gameplay systems to selected fixed arcade preset dimensions.
   - Ensure spawn/wrap/collision systems use this fixed logical space.
   - Done when:
     - Wrap and collisions behave consistently regardless of monitor size.

5. [x] Task 5 - Normalize input/dive interaction under display scaling
   - Files: `scripts/game.js`, `scripts/fractaloid-runtime.js` (if needed)
   - Convert pointer/pan deltas through current display scale.
   - Keep zoom/pan feel stable between `native` and `arcade_640`.
   - Done when:
     - Dive controls feel correct and predictable in scaled mode.

6. [x] Task 6 - Add vector glow quality tiers and wire `medium` default
   - Files: `scripts/game.js` (`strokeWithVectorGlow` + config plumbing)
   - Tier behavior:
     - `high`: halo + body + core (current rich style)
     - `medium`: reduced halo blur/alpha and tighter core
     - `low`: core-first minimal halo
   - Apply `medium` automatically when `RENDER_MODE === 'arcade_640'`.
   - Done when:
     - Visual style remains coherent with measurable performance relief.

6.5 [x] Task 6.5 - Make arcade mode the no-query default for local launches
   - Files: `scripts/game.js`
   - Default `RENDER_MODE` to `arcade_640` when `mode` query param is absent.
   - Keep `ARCADE_RES_DEFAULT = 1024x768` and use it when `arcadeRes`/`arcade_res` is absent.
   - Keep URL overrides for A/B:
     - `?mode=native`
     - `?mode=arcade_640&arcadeRes=1024x768` (or other preset)
   - Done when:
     - Opening `index.html` without params boots into `arcade_640` at `1024x768`.

7. [x] Task 7 - Tune CRT background black for arcade mode
   - Files: `styles/game.css`
   - Keep lifted near-black (not pure `#000`) and ensure letterbox areas visually match.
   - Done when:
     - Borders and playfield feel like one tube/cabinet surface.

8. [x] Task 8 - Add mode toggle + quick sanity instrumentation
   - Files: `scripts/game.js` (and HUD text only if useful)
   - Add a low-friction way to switch modes for testing (constant or temporary key toggle).
   - `mode` query-param switching is available for testing now:
     - `?mode=native`
     - `?mode=arcade_640`
   - Add lightweight FPS/frame-time readout during development if needed.
   - Done when:
     - Easy A/B between `native` and `arcade_640`.

9. [x] Task 9 - Validation pass and cleanup
   - Files: touched files from tasks above
   - Remove temporary debug noise.
   - Run syntax checks:
     - `node --check scripts/game.js`
     - `node --check scripts/fractaloid-runtime.js`
   - Done when:
     - No syntax errors.
     - No obvious regression in title/gameover/touch UI.

## Performance Acceptance

- [x] Average frame time improves versus current baseline in a busy wave scene.
- [x] No major increase in input latency feel.
- [x] Fractaloid wrap/collision behavior remains correct.
- [x] Dive mode remains usable.

## Definition of Done

- [x] `arcade_640` mode is implemented and selectable.
- [x] Internal render buffers are fixed to base resolution in that mode.
- [x] World simulation dimensions are fixed to base resolution in that mode.
- [x] Integer upscale + letterbox presentation is stable.
- [x] Default glow quality in `arcade_640` is `medium`.
- [x] Performance improvement is verified against baseline.

Quote from reviewer:

```
 Holy shit btw.. it is beautiful chaos at the "end". I made it to level 20; the highest I've ever made it and once I died the fractaloids ran wild, overtook the screen, which briefly turned black, only to be disrupted by a splendor of color when a saucer came and blew a few of them to dust.. the fractals were well-zoomed, palettes were clear and perfect. eventually we'll have to give the player a way to resign, keeping their score when they get tired of watching their gorgeous defeat by math and space rocks.
 ```
