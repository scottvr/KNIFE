1. [x] Class telegraphing at spawn
Give each fractaloid class a 0.4s “signature pulse” (color/shape cue) when entering so players can react fast without reading HUD text.

2. [x] Threat priority cues
Add subtle target rings on the 1-2 nearest collision threats to the ship; this improves survivability without making the game easier overall.

3. [x] Adaptive wave pacing
If player is at 1 life, slightly reduce spawn spread/speed for 8-12 seconds; if player is cruising, ramp aggression faster. Keeps tension high with fewer cheap deaths.

4. [ ] Risk-reward hyperspace
Keep current danger, but add “precision hyperspace”: timing a second key press during jump gives safer re-entry and bonus score chain.

5. [x] Kill-chain scoring
Short combo window (for example 2.2s) where consecutive fractaloid breaks multiply score. Makes aggressive play exciting.

6a. [ ]  Mini-objectives per wave
Example: “Destroy 2 Julia first” or “No hyperspace this wave” for bonus points. Adds variety without changing core controls.

6b. [ ] add "intermission" levels using same assets as normal levesl but:
    - maybe fractals are just obstacles, guns are disabled.. it's more like a mazd; a test of flying skills. timed.
    - target shooting mode. targets (fractaloids) pop in and out of existnace in a timed test of rotation and shotting skill
    - other siimilar type change-ups of levesl that appear between every 5 or six levels.

7. [ ] Better readability during chaos
Dynamic background dimming around player and enemy bullets when screen density is high. Small visual assist, big usability gain.

8. [ ] Distinct boss phases
At HP thresholds, boss changes behavior/palette/warp style. Makes boss fights memorable instead of just tankier versions.

9. [ ] Progression unlock mutators
After full class cycle, let players enable mutators (double warp bullets, no outlines, fast split, mirrored controls) for replayability.

10. [x] Input feel polish
Tiny coyote-time for fire/thrust taps and slightly buffered hyperspace input. Makes controls feel responsive, especially on mobile/touchpads.

11. [x] Small sound fx pass
get rid of high pitched ding that seems to be playing along with the heartbeat. I don't know when or how it got in. take the "pew" sound out of the explosion fx, leaving the percussive noise only for eplosions, and replacing the current missile firingn sound with the "pew" sound, make the pew sound a bit higher pitched.


## Always
- prefer separating concerns
- avoid single "god" files, functions
- prefer lightweight orchestration rather than single dispatcher with huge if/else branches
