# Ultimate CRT Mini-Sprint 04: HUD and Interstitial Unification

Feature branch: `feature/glcrtjst`  
Status: `planning ready`  
Entry criteria: Mini-Sprint 03 complete

## Locked Decisions

- End state is “same electron gun” for gameplay + HUD + title/game-over.
- Keep outer cabinet/letterbox styling in CSS.
- Prioritize readability of UI text while preserving CRT character.

## Sprint Goal

Move HUD and interstitial screens into the shader-driven scene path so all in-tube visuals share one CRT treatment, then finalize module boundaries for reuse.

## Task Board (In Order)

0. [ ] Task 0 - Select text rendering path
   - Files: design choice doc update if needed
   - Choose one:
     - bitmap font atlas,
     - SDF/MSDF text.
   - Done when:
     - choice is explicit with implementation constraints.

1. [ ] Task 1 - GPU HUD pass
   - Files: `scripts/crt-pipeline/passes/scene-composite-pass.js` (or dedicated hud pass), `scripts/game.js`
   - Migrate gameplay HUD from DOM into scene texture pipeline.
   - Keep layout behavior equivalent to existing HUD.
   - Done when:
     - score/lives/wave/class are in-pipeline and readable.

2. [ ] Task 2 - Title and game-over scene routing
   - Files: `scripts/game.js`, optional UI modules
   - Route title/game-over visuals through same scene->CRT path.
   - Done when:
     - no abrupt style shift entering/exiting gameplay.

3. [ ] Task 3 - Retire now-redundant in-play CRT HUD CSS effects
   - Files: `styles/game.css`
   - Remove or gate styles that duplicate in-pipeline treatment.
   - Done when:
     - no double glow/scanline on in-tube UI.

4. [ ] Task 4 - Library extraction hardening
   - Files: `scripts/crt-pipeline/*`
   - Stabilize:
     - public API shape,
     - uniform schema,
     - preset catalog,
     - lifecycle and error guards.
   - Done when:
     - module can be treated as reusable subsystem.

5. [ ] Task 5 - Cross-mode validation matrix
   - Files: none
   - Validate at minimum:
     - `native`, `arcade_640`
     - `1024x768`, one portrait preset
     - desktop + mobile touch
   - Done when:
     - no major behavior or readability regressions.

6. [ ] Task 6 - Final acceptance and cleanup
   - Files: touched files, docs
   - Run syntax checks and prune dead toggles.
   - Record final A/B and callouts.
   - Done when:
     - all program-level acceptance criteria are met.

## Acceptance

- HUD and interstitials visually match gameplay tube behavior.
- Text stays readable under CRT processing.
- No notable regression in input feel, Dive controls, or mobile interaction.

## Definition of Done

- In-tube visuals are unified under shader CRT pipeline.
- CSS handles cabinet/panel framing only.
- CRT pipeline module boundaries are documented and implementation-stable.
