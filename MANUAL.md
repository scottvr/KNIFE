# KNIFE Pilot Manual

Edition: Public Beta  
Last revised: 2026-04-09

If `QUICK_START.md` is the one-page insert, this is the full box manual.

## Table of contents

- [1. What KNIFE is](#1-what-knife-is)
- [2. The 60-second launch sequence](#2-the-60-second-launch-sequence)
- [3. Core mental model](#3-core-mental-model)
- [4. Workspaces (virtual desktops)](#4-workspaces-virtual-desktops)
- [5. Input surfaces](#5-input-surfaces)
- [6. Global control map (high-value controls)](#6-global-control-map-high-value-controls)
- [7. Volumetric Flight School (3D controls)](#7-volumetric-flight-school-3d-controls)
- [8. Panel and window operations](#8-panel-and-window-operations)
- [9. Color and animation controls](#9-color-and-animation-controls)
- [10. Recovery ladder (when you get lost)](#10-recovery-ladder-when-you-get-lost)
- [11. Troubleshooting by symptom](#11-troubleshooting-by-symptom)
- [12. Example play loops](#12-example-play-loops)
- [13. Companion docs](#13-companion-docs)
- [14. Maintainer note: keeping docs in sync](#14-maintainer-note-keeping-docs-in-sync)

## 1. What KNIFE is

KNIFE is a keyboard-first fractal explorer with mouse and touch support.

It is built around fast, low-friction exploration:
- move quickly without opening heavyweight menus
- keep the fractal visible while controls stay compact
- switch between focused workbenches ("workspaces") instead of one giant UI

Two rendering families are available:
- 2D escape-time fractals (Explore, Equation, Design workflows)
- 3D scene-raymarched fractals (Volumetric workflow)

## 2. The 60-second launch sequence

1. Press `?` to open the Input Map help overlay.
2. Move with arrow keys.
3. Zoom with `=` and `-`.
4. Press `p` and cycle palettes.
5. Press `f` and switch fractals.
6. Press `Shift+W`, then `V` to jump into Volumetric mode.
7. In Volumetric: click/tap an object, then drag on it to rotate.

If anything feels wrong, jump to the recovery ladder section:
- [10. Recovery ladder (when you get lost)](#10-recovery-ladder-when-you-get-lost)

## 3. Core mental model

### 3.1 Session vs workspace

Think of KNIFE as one live session with multiple desks:
- your fractal session state persists
- workspaces change layout, panel focus, and presentation

### 3.2 Control domains in 3D

In Volumetric mode, controls can affect different domains:
- object domain: rotate or move a selected object
- camera domain: orbit or frame the scene
- scene pan domain: shift framing when no object transform is active

Most confusion in 3D comes from not knowing which domain is active.  
The rules in this manual are written to make domain changes predictable.

## 4. Workspaces (virtual desktops)

Switching methods:
- keyboard: `Shift+W`, then workspace key
- UI: Workspace Manager buttons

### 4.1 Workspace list

| Workspace | Switch key | Primary use |
| --- | --- | --- |
| Explore | `E` | Default fast exploration bench |
| Volumetric | `V` | 3D scene workflow (Mandelbulb and scene controls) |
| Equation | `Q` | Formula inspection and equation-focused reading |
| Design | `D` | Fractal/palette authoring workflow |

## 5. Input surfaces

### 5.1 Keyboard (primary surface)

Keyboard is the fastest complete control path:
- navigation, reset ladder, workspace switch, panel toggles
- advanced cycle and debug controls

### 5.2 Mouse

Mouse is high-parity for navigation:
- drag, click/wheel zoom, panel interaction
- in Volumetric, object-hit drag and camera-modified drag are supported

### 5.3 Touch

Touch supports core exploration and mobile usability:
- drag and pinch/tap zoom
- optional nav pad for directional control
- in Volumetric, object-hit drag rotation and off-object pan are supported

Note:
- direct touch equivalent for `Ctrl/Cmd+drag` camera orbit is provided via nav pad Camera Orbit mode.

## 6. Global control map (high-value controls)

These are the controls most users rely on every session:

### 6.1 Navigation and reset

- Pan: arrow keys
- Zoom in/out: `=` / `-`
- Recenter: `r`
- Reset view defaults: `Shift+r`
- Safety preset reset: `Alt/Option+r` (includes cycle state reset)

### 6.2 Menus and overlays

- Palette menu/cycle: `p` (close: `Shift+p`)
- Fractal menu: `f`
- Detail menu: `d`
- Speed menu: `s`
- Info panel: `i`
- Coordinates panel: `u`
- Help/Input Map: `?` (`Shift+/`)

### 6.3 Workspace + visibility

- Workspace switch prefix: `Shift+w`
- Compact header: `k`
- Header-only mode: `h`
- Hide all UI: `Shift+h`
- Touch nav pad: `n`

For exact parity and every mapped row, see:
- [REFERENCE.md](REFERENCE.md)

## 7. Volumetric Flight School (3D controls)

This section is the heart of 3D operation.

### 7.1 Entering Volumetric

1. Press `Shift+w`.
2. Press `v`.
3. Confirm workspace switch if prompted.

### 7.2 Object focus selection

Before translating with keys/nav pad, set focus:
- click/tap object projection to make it the active target
- or use the Object Selector Dock to choose Camera, Tank, or instance directly

If no object is focused, movement actions may pan/orbit scene framing instead of moving an object.

### 7.3 Drag semantics (no modifier)

- Drag start on object: object rotates (kugel behavior)
- Drag start off object: scene pans

The drag start position determines behavior for that drag gesture.

### 7.4 Drag semantics with camera modifier

- `Ctrl/Cmd + drag`: camera orbit (yaw/pitch)

This intentionally switches domain from object to camera for the gesture.

### 7.5 Arrow keys and nav pad in Volumetric

No modifier:
- if object is focused: move object in viewer X/Y
- otherwise: pan scene framing

With `Ctrl/Cmd`:
- orbit camera

With `Shift`/`Ctrl`/`Ctrl+Shift`:
- finer movement step sizing

### 7.6 Zoom, dolly, and focal length in Volumetric

`=` / `-` in Volumetric are domain-aware:
- no modifier: standard zoom in/out behavior
- `Shift + =/-`: camera dolly forward/back
- `Ctrl/Cmd + =/-`: focal length / FoV adjustment

Nav pad behavior in Volumetric:
- normal mode: object/scene directional movement + zoom
- Camera Orbit mode enabled: directional controls orbit camera, `+/-` dolly

### 7.7 Rotation direction contract

Object rotation is tuned to feel physically intuitive:
- top -> bottom drag rolls toward the viewer
- bottom -> top drag rolls away
- left -> right drag rotates counter-clockwise (from viewer perspective)
- right -> left drag rotates clockwise

### 7.8 Tank and multi-object operations

The Object Selector Dock supports:
- selecting Camera/Tank/instance control target
- per-instance tank membership (`Add To Tank` / `Remove`)

Tank controls are context-sensitive and respect tank enabled/disabled state.

## 8. Panel and window operations

### 8.1 Control rail philosophy

The side rail is intended as a launch rail:
- open focused controls quickly
- keep long-lived control surfaces optional
- preserve view area for the fractal itself

### 8.2 Floating windows

Common panel chrome behavior:
- drag title bar to reposition
- tap/click title area to collapse/expand where supported
- long-press title area to hide where supported
- double-click title bar to reset window anchor where supported

### 8.3 Scene panel organization (Volumetric)

The Scene Panel Dock organizes major 3D windows:
- Zoom + Scale
- Scene Controls
- Shader Lab
- Render Metrics
- Advanced Tweaks

The Object Selector Dock is a dedicated control-focus + instance-management window.

## 9. Color and animation controls

### 9.1 Palette access

- `p` opens palette menu or cycles palette if already open
- `1-9` quick picks in palette context

### 9.2 Fractal quick picks

- `Shift+1` through `Shift+9` quick-select fractals

### 9.3 Colorizer controls (`o` family)

- `o`: next colorizer mode
- `Shift+o`: decrease mode parameter
- `Ctrl/Cmd+o`: increase mode parameter
- `Ctrl/Cmd+Shift+o`: cycle orbit trap shape (when applicable)

### 9.4 Palette cycle cluster (`x c v`)

- `c`: pause/resume cycle
- `Shift+c`: reset cycle phase
- `v`: faster
- `x`: slower

When paused:
- `v`: nudge phase forward
- `x`: nudge phase backward

## 10. Recovery ladder (when you get lost)

Use this in order from least to most disruptive:

1. `r`  
   Recenter framing while preserving current zoom profile.

2. `Shift+r`  
   Reset view to fractal defaults (center + zoom + initial palette).

3. `Alt/Option+r`  
   Safety preset reset: returns to home view and resets cycle state.

Volumetric note:
- all three reset paths also clear scene camera input offsets used for orbit/pan stabilization.

## 11. Troubleshooting by symptom

### "Dragging rotates one object, but another drag just pans."

Cause:
- drag started off-object, or a different object is active target.

Fix:
- click/tap the object you want to control first
- then begin drag inside its projected area

### "3D controls feel inverted."

Cause:
- scene inversion toggles may be active.

Fix:
- check Scene Controls for pan/zoom invert toggles
- use reset ladder to return to known baseline

### "I can’t find my UI anymore."

Fix:
- long-press UI restore hotspot
- use `h` / `Shift+h` to cycle visibility modes back

### "I switched workspace and behavior changed."

This is expected:
- workspaces change panel composition and workflow emphasis
- core session state remains shared, but presentation and control affordances shift

### "I keep moving camera when I meant to move an object."

Check:
- are you holding `Ctrl/Cmd` (camera domain)?
- did you focus an object first?
- are you in nav pad Camera Orbit mode?

## 12. Example play loops

### 12.1 Fast exploration loop

1. `?` to orient.
2. arrows + `=`/`-` to scout.
3. `p` to palette-hop.
4. `f` to switch fractal.
5. `i` for context readout.

### 12.2 Volumetric sculpt loop

1. `Shift+w`, `v`.
2. click an object to focus.
3. drag on object to rotate.
4. `Ctrl/Cmd+drag` to orbit camera.
5. `Shift+=/-` to dolly frame.

### 12.3 Comparison loop

1. Explore workspace for broad scan.
2. Equation workspace for formula read.
3. Design workspace to edit/compile.
4. Back to Explore/Volumetric for visual validation.

## 13. Companion docs

- [QUICK_START.md](QUICK_START.md)
- [REFERENCE.md](REFERENCE.md)
- [README.md](README.md)

Recommended usage:
- start with Quick Start
- keep Reference open for exact bindings
- use this manual for mental model and workflow depth

## 14. Maintainer note: keeping docs in sync

Authoritative input binding source:
- `src/config/inputRegistry.ts`

Help and reference sync flow:
- Help overlay reads `INPUT_MAP_REGISTRY` via `src/config/inputMap.ts`
- `public/REFERENCE.md` Input Map section is generated from the same source

Sync/check commands:

```bash
npm run docs:sync:reference-input-map
npm run docs:check:reference-input-map
```

If controls change, update input registry rows first, then sync docs.
