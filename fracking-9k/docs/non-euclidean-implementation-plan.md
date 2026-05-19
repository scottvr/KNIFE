# Non-Euclidean Mode Implementation Plan

## Goal
Add a modular `nonEuclidean` gameplay mode that can:
- run as a periodic bonus/intermission sequence,
- be forced via URL for testing,
- stay mostly isolated so the mode can be extracted into a fork with minimal effort.

The mode should deliver a Poincare-disk feel:
- apparent shrinking near the boundary,
- apparent slowdown toward the boundary,
- geodesic-looking (curved-on-screen) shot paths,
- while keeping game logic/collision in the existing Euclidean world model.

## Current Seams
- Existing special-mode state precedent: `fractaldive`.
- Central draw orchestration through `drawFractaloids`, `drawBullets`, `drawSaucer`, etc.
- Wave transition point suitable for periodic mode insertion in `wavebreak` progression.
- Modular script loading from `index.html` supports adding dedicated mode modules.

## Conflicts To Manage
- World wrapping assumptions conflict with strict hyperbolic behavior.
- Several draw paths currently assume world==screen coordinates.
- Threat cues and overlays assume Euclidean distance in screen space.

## Slice Plan

### Slice 1: Mode Scaffolding + Scheduling
- Add `nonEuclidean` runtime state.
- Add URL control (`non_euclidean=<seconds>`) for testing forced entry duration.
- Add periodic scheduling default: every `2 * class-cycle` waves.
- Add mode entry/exit helpers and HUD indicator.

Deliverable:
- mode enters/exits without breaking existing flows,
- can be forced from URL with a numeric duration,
- periodic trigger wired at wave transition.

### Slice 2: Geometry Module + Render-Time Projection (No Physics Rewrite)
- Add `scripts/non-euclidean-geometry.js` with projection helpers.
- Keep logic/collision in current Euclidean coordinates.
- Project entities only for rendering:
  - ship, fractaloids, bullets, saucer, particles, shockwaves.
- Draw visible disk boundary/overlay to make the mode legible.

Deliverable:
- clear Poincare-disk visual behavior,
- shrinking and perceived slowdown near edge,
- curved-on-screen projectile motion emerges from projected straight paths.

### Slice 3: Mode Runtime Extraction
- Create dedicated runtime module (`non-euclidean-runtime.js`) to own mode lifecycle, scoring hooks, and timers.
- Reduce `game.js` orchestration burden.

Deliverable:
- `scripts/non-euclidean-runtime.js` owns non-Euclidean session lifecycle, forced-start handling, auto-entry checks, and overlay timing.
- `game.js` uses runtime-backed wrappers/callbacks rather than managing raw non-Euclidean session objects directly.

### Slice 4: Anchored-Ship Semantics
- Keep ship centered in disk.
- Apply inverse movement to universe entities.
- Replace/disable wrap behavior for this mode with far-field culling.

Deliverable:
- Ship remains anchored at disk center throughout non-Euclidean play.
- Player thrust translates the universe in the opposite direction (relative-motion semantics).
- Wraparound is disabled for non-Euclidean updates and replaced by far-field despawn/culling.

### Slice 5: Geodesic UX and Aiming Feel
- Improve projectile readability (arc trails, lead cues, optional teaching prompts).
- Tune handling so aiming remains challenging but learnable.

Deliverable:
- Non-Euclidean mode renders a predictive curved trajectory guide while engaging thrust/fire.
- A lead marker highlights an intercept-biased target point for current threats.
- Rotating instructional hint text is shown alongside the non-Euclidean overlay banner.

### Slice 6: Intermission Productization
- Add entry/exit transitions and reward model.
- Integrate into cadence as bonus stage.
- Ensure standalone extraction path is documented.

### Slice 7: Geometry-Warp Enemy Saucer
- Add a dedicated geometry saucer class (`pseudosphere`) alongside `classic`, `sierpinski`, and `koch`.
- Add saucer-fired `curvature` projectiles.
- On ship hit by curvature projectile: trigger or extend non-Euclidean mode timer instead of ship death.
- Keep existing lethal saucer bullets for non-geometry saucers.

Deliverable:
- A combat-native trigger for warped-space play, not only wave scheduling.
- Clear player readability that this saucer alters space-time rather than doing direct hull damage.

## Acceptance Criteria For Slices 1-2
- `non_euclidean=20` (or any positive seconds value) starts mode immediately on game start.
- Auto trigger occurs every two class cycles.
- Mode uses projected rendering in a bounded disk with visible edge.
- Core game loop remains stable (no collision rewrite yet).

## Test Notes (initial)
- Desktop keyboard, mobile touch baseline unaffected when not in mode.
- Framerate/perf acceptable with projection enabled.
- Existing `fractaldive` remains functional.
