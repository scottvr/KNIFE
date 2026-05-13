# Ultimate CRT Mini-Sprint 03: Bloom, Persistence, and Quality Tuning

Feature branch: `feature/glcrtjs`  
Status: `planning ready`  
Entry criteria: Mini-Sprint 02 complete

## Locked Decisions

- Keep `medium` as default quality for `arcade_640`.
- Add fidelity in layers with hard perf gates.
- Favor consistent frame pacing over maximal effect intensity.

## Sprint Goal

Introduce bloom, convergence refinement, and optional persistence while preserving the strong performance behavior of current `arcade_640`.

## Task Board (In Order)

0. [ ] Task 0 - Define budget gates before coding
   - Files: none
   - Budgets at `1024x768`:
     - `low` <= 1.5 ms GPU overhead
     - `medium` <= 3.0 ms GPU overhead
     - `high` <= 5.0 ms GPU overhead
   - Done when:
     - Budgets are accepted and used as stop/go criteria.

1. [ ] Task 1 - Glow prefilter and bloom chain
   - Files: `scripts/crt-pipeline/passes/glow-prefilter-pass.js`, `scripts/crt-pipeline/passes/bloom-pass.js`, shader modules
   - Add:
     - bright-pass threshold
     - 2-3 level downsample/upsample chain
   - Done when:
     - Bloom can be tuned independently from base scene.

2. [ ] Task 2 - Convergence and beam profile refinement
   - Files: `scripts/crt-pipeline/passes/crt-pass.js`
   - Add:
     - per-channel offset controls
     - beam width response controls
   - Done when:
     - Fractals and vector strokes retain crisp core + soft halo feel.

3. [ ] Task 3 - Persistence feedback pass (tiered)
   - Files: `scripts/crt-pipeline/passes/persistence-pass.js`, `scripts/crt-pipeline/crt-pipeline.js`
   - Enable:
     - off on `low`
     - restrained on `medium`
     - richer trail on `high`
   - Done when:
     - Motion trails look intentional and readable, not smeared.

4. [ ] Task 4 - Wire tier matrix
   - Files: `scripts/crt-pipeline/presets.js`, `scripts/game.js`
   - Ensure each tier toggles pass complexity predictably.
   - Done when:
     - `crtQuality=low|medium|high` maps to stable pass sets.

5. [ ] Task 5 - Mobile and low-end fallback checks
   - Files: touched files
   - Validate:
     - touch controls remain responsive
     - quality fallback can be forced via query param
   - Done when:
     - mobile/low-end remains playable and visually coherent.

6. [ ] Task 6 - Perf and visual sign-off
   - Files: none
   - Capture A/B against Sprint 02:
     - `low`, `medium`, `high`
     - dense gameplay and Dive scenes
   - Done when:
     - `medium` clears budget and looks preferred.

## Acceptance

- Bloom/persistence are present, controllable, and tiered.
- `medium` quality keeps acceptable frame-time behavior in busy scenes.
- Visual identity improves without introducing muddy output.

## Definition of Done

- Multi-pass CRT stack exists (prefilter, bloom, CRT, optional persistence).
- Tier system is trustworthy for perf/fidelity tradeoffs.
- Performance and capture artifacts are documented for final sprint.
