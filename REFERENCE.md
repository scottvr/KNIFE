# KNIFE Controls and Features Reference

## WHAT is KNIFE?

KNIFE is a real-time fractal exploration app built around a keyboard-first interaction model. Rather than exposing every feature through large persistent controls, it uses a compact interface plus hotkeys, popout panels, overlays, and a help/input map. Less clutter in the interface; more room for your fractals.

Mouse and touch are supported for most important actions, but the keyboard remains the primary control surface.

## HOW to KNIFE?

KNIFE has three layers of interaction:

1. Direct exploration
   - Pan, zoom, recenter, reset
2. Contextual control panels
   - Fractal, palette, detail, speed, info
3. Overlays and advanced tools
   - Help/input map, equation view, hidden/debug tools

The app is designed so that rapid exploration can happen without leaving the keyboard, while mouse and touch users can still reach most major features.

## Authoritative Input Map (Auto-Generated)

<!-- AUTO-GEN:INPUT_MAP:START -->
Source of truth: `src/config/inputRegistry.ts` (via `src/config/inputMap.ts`).

| Action | Keyboard | Mouse | Touch | Parity |
| --- | --- | --- | --- | --- |
| Pan View | Arrow keys (Shift/Ctrl/Cmd for finer steps) | Click + drag | Single-finger drag | full |
| Zoom In / Out | =/- (Shift/Ctrl/Cmd for step size) | Wheel; click to zoom in; Shift+click to zoom out | Single tap to zoom in; two-finger tap to zoom out; pinch/stretch gesture; nav pad +/- | full |
| Reset Ladder | r (recenter), Shift+r (recenter, default zoom), Alt/Option+r (recenter, default zoom, reset palette cycle state) | Reset button (base recenter only) | Reset button (base recenter only) | partial |
| Palette Menu / Next Palette | p (open/cycle), Shift+p (close), 1-9 (quick pick) | Palette button + menu | Palette button + menu | full |
| Fractal Menu / Quick Fractal | f (menu), Shift+1-9 (quick fractal) | Fractal button + menu | Fractal button + menu | full |
| Detail / Speed Menus | d/s | Detail + Speed buttons | Detail + Speed buttons | full |
| Iteration Lock Override | l (when fractal has fixed iterations) | Detail panel -> Override fractal lock checkbox | Detail panel -> Override fractal lock checkbox | full |
| Colorizer Mode / Param | o (next mode), Shift+o (−param), Ctrl/Cmd+o (+param), Ctrl/Cmd+Shift+o (trap shape) | Palette panel -> Colorizer controls | Palette panel -> Colorizer controls | full |
| Palette Cycling | x/c/v cluster: c (pause/resume), Shift+c (phase reset), v (faster), x (slower), paused x/v (phase nudge), Shift+x/Shift+v (coarse step), Ctrl/Cmd+x/Ctrl/Cmd+v (fine step), Ctrl/Cmd+Shift+x/Ctrl/Cmd+Shift+v (ultra-fine step) | Speed menu slider/presets; long-press Speed icon resets phase | Speed menu slider/presets; long-press Speed icon resets phase | full |
| Info Overlay | i (toggle), Shift+i (reset panel position) | Info button | Info button | full |
| Hi-Res Toggle | m | Monitor button | Monitor button | full |
| Navigation Pad | n | Nav button (4-way icon); drag NAV badge to move panel | Nav button (4-way icon); drag NAV badge to move panel | full |
| Header Compact Toggle | k | Click KNIFE stats header | Tap KNIFE stats header | full |
| Header/UI Visibility | h (header-only mode toggle), Shift+h (hide all UI) | Long-press KNIFE header (controls -> hide all), long-press UI hotspot (restore all) | Long-press KNIFE header (controls -> hide all), long-press UI hotspot (restore all) | full |
| Debug Console | Ctrl/Cmd+Shift+d (alias: Ctrl/Cmd+Shift+a) | N/A | N/A | gap |
| Help Overlay | Shift+/ (?) | Info panel -> ? button | Info panel -> ? button | full |
| Fractal Equation | e | Info panel -> View Equation | Info panel -> View Equation | full |

**Parity Gaps**
- Reset Ladder: Advanced reset tiers are keyboard-only.
- Debug Console: Intentional goblin-mode keyboard access.
<!-- AUTO-GEN:INPUT_MAP:END -->

## Core navigation

### Pan
- Keyboard: arrow keys
- Fine control:
  - `Shift+Arrow` for smaller steps
  - `Ctrl+Arrow` / `Cmd+Arrow` for finer steps
  - `Ctrl+Shift+Arrow` / `Cmd+Shift+Arrow` for finest steps
- Mouse: click and drag
- Touch: single-finger drag

### Zoom
- Keyboard:
  - `=` zoom in
  - `-` zoom out
  - modifiers adjust step size
- Mouse:
  - wheel to zoom
  - click canvas to zoom in
  - `Shift+click` canvas to zoom out
- Touch:
  - single tap to zoom in
  - two-finger tap to zoom out
  - pinch/spread gesture
  - nav pad `+` / `-` when enabled

### Reset and recenter
- `r` = recenter
- `Shift+r` = recenter + default zoom + default palette
- `Alt+r` / `Option+r` = recenter + default zoom + reset palette cycle state
- Mouse/touch button support exists for basic reset, but advanced reset tiers are keyboard-only

## Main panels

### Palette controls
- `p`
  - opens the palette menu if closed
  - cycles to the next palette if already open
- `Shift+p` closes the palette menu
- `1` through `9` quick-select palette presets

Palette can also be changed through the palette UI button/menu.

### Fractal controls
- `f` toggles the fractal menu
- `Shift+1` through `Shift+9` quick-select fractals

Fractals are grouped by category in the UI and can also be selected from the fractal menu.

### Detail controls
- `d` toggles the detail menu

This area controls rendering detail, iteration behavior, and related computation settings.

### Speed controls
- `s` toggles the speed menu

This area manages palette cycling speed and related animation behavior.

### Info panel
- `i` toggles the info panel
- `Shift+i` resets the info panel position

The info panel shows:
- current coordinates
- magnification
- iteration count
- precision mode
- fractal name
- palette name
- colorizer mode
- contextual tips and facts based on zoom depth and current state

The info panel can also:
- open help
- open the current equation
- edit coordinates directly
- be dragged to a custom position
- be reset by double-clicking its header

### Help overlay
- `Shift+/` (`?`) toggles the full help/input map

This is the master control reference and explicitly shows keyboard, mouse, and touch parity for each action.

### Debug console
- `Ctrl+Shift+d` / `Cmd+Shift+d` toggles the debug console
- Alias: `Ctrl+Shift+a` / `Cmd+Shift+a`

This is intentionally keyboard-only.

### Equation view
- `e` toggles the current fractal equation view

This is also available from the info panel via "View Equation".

## Color and animation controls

### Colorizer modes
- `o` cycles through colorizer modes

Supported modes include:
- smooth
- post-escape
- orbit-trap
- final-z

### Adjust current colorizer mode
- `Shift+o` = decrease current mode parameter
- `Ctrl+o` / `Cmd+o` = increase current mode parameter
- `Ctrl+Shift+o` / `Cmd+Shift+o` = cycle orbit trap shape when orbit-trap mode is active

Depending on the current mode, these adjust:
- post-escape steps
- orbit trap scale
- final-z mix
- orbit trap shape

### Palette cycling
KNIFE uses an intentional `x c v` control cluster:

- `c` = pause/resume palette cycling
- `Shift+c` = reset cycle phase/state
- `v` = faster
- `x` = slower

When cycling is paused:
- `v` nudges phase forward
- `x` nudges phase backward

Speed-step modifiers for `x` / `v`:
- `Shift+x` / `Shift+v` = coarse steps
- `Ctrl+x` / `Ctrl+v` and `Cmd+x` / `Cmd+v` = fine steps
- `Ctrl+Shift+x` / `Ctrl+Shift+v` and `Cmd+Shift+x` / `Cmd+Shift+v` = ultra-fine steps

The speed menu also provides visual controls, and long-pressing the speed icon resets the phase.

## Rendering and precision

### Hi-res mode
- `m` toggles hi-res rendering

This switches between device-pixel-ratio-aware rendering and a lower-resolution mode.

### Iteration lock override
Some fractals define a fixed iteration behavior.

- `l` toggles iteration-lock override when supported

The same override is available in the detail panel.

### Precision awareness
The app tracks precision mode and can warn when floating-point precision limits are reached. The info panel will surface this when artifacts become likely.

## UI visibility and layout

### Header and compact mode
- `k` toggles compact header mode
- click/tap the KNIFE stats header also toggles compact mode

### UI visibility
- `h` toggles header-only mode
- `Shift+h` hides all UI

Mouse/touch equivalents exist through long-press gestures:
- long-press header to reach hide-all behavior
- long-press restore hotspot to bring UI back

### Touch navigation pad
- `n` toggles the on-screen nav pad

The nav pad can be repositioned by dragging its badge.

## Coordinate editing

The info panel supports direct coordinate editing.

Features:
- edit X and Y separately
- paste an `x,y` pair into the X field
- decimal and scientific notation supported
- Enter applies
- Escape cancels

This is one of the better bridges between exploratory use and precise repeatable navigation.

Global note:
- `Escape` also closes transient UI panels/overlays.

## Discovery notes for new users

Most confusion for first-time users will come from these facts:

1. The keyboard model is richer than the visible on-screen affordances.
2. Several powerful features are tucked behind overlays or popout panels.
3. Some advanced reset and debug functions are intentionally keyboard-only.
4. The app assumes that learning controls is part of using it.

That is not a flaw by itself, but it does mean new-user documentation is important.

## Known parity gaps

The app itself already identifies these:

- Advanced reset tiers are keyboard-only
- Debug console is keyboard-only by design

That is actually a good sign: the app is self-aware about its parity story, and the help overlay documents it directly.

## Getting started

Just press ? for the full control map. KNIFE is optimized for keyboard-first exploration.

## An Example first-session
1. Press `?`
2. Pan with arrow keys or drag
3. Zoom with `=` / `-` or wheel/tap
4. Press `p` to try palettes
5. Press `f` to switch fractals
6. Press `i` to open the info panel
7. Press `e` to inspect the equation
8. Press `d` and `s` to explore detail and speed controls

## Philosophy of use

KNIFE is closer to an instrument, editor, or console-driven explorer than to a conventional touch-first gallery app. Users who understand that tend to learn it quickly. Users expecting a purely self-describing mobile UI may miss capabilities unless the app tells them, early and clearly, that `?` is the gateway to the control system.
