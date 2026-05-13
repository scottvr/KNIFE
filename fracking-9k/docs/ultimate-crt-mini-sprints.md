# Ultimate CRT Mini-Sprints

Status: `planning ready`  
Primary spec: `docs/ultimate-crt-render-pipeline.md`

## Purpose

Break the shader-first CRT architecture into execution-sized mini-sprints with hard gates so we can ship incrementally without losing current `arcade_640` performance wins.

## Sprint Sequence

1. `docs/ultimate-crt-mini-sprint-01-foundation.md`
   - Pipeline shell, query-param gate, render-target plumbing, no visual change.
2. `docs/ultimate-crt-mini-sprint-02-crt-pass-parity.md`
   - Move scanlines/vignette/RGB split into shader and remove playfield CRT dependency from CSS.
3. `docs/ultimate-crt-mini-sprint-03-bloom-persistence-tuning.md`
   - Add bloom, convergence, persistence, and quality-tier budgets.
4. `docs/ultimate-crt-mini-sprint-04-hud-interstitial-unification.md`
   - Move HUD/title/game-over into the same CRT pipeline and extract reusable module boundaries.

## Global Constraints (Apply to All Sprints)

- Keep `mode=arcade_640` and `arcadeRes=1024x768` defaults unchanged unless explicitly decided.
- Keep letterbox/panel gloss in CSS (non-CRT area).
- Preserve A/B testing path (`crtPipeline=0|1`, mode/res query params).
- Do not regress mobile controls or Dive usability.
- Keep perf capture protocol active (`window.frackingPerf`).

## Program Acceptance (Final)

- One coherent CRT treatment across gameplay, fractals, HUD, and interstitials.
- No playfield dependence on CSS scanline/RGB overlays for final look.
- `arcade_640` remains in target performance class from prior baseline work.
- Reusable CRT module API is stable enough to be treated as a library surface.
