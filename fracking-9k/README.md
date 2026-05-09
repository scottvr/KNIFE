# FracKing 9000

A retro shooter about surviving wave after wave of growing fractaloids, enemy saucers, risky hyperspace jumps, and one fragile Mandelbrot (or Sierpinski) ship.

Part of the [sloopygames.com](https://sloopygames.com) collection.

## Play

Open `index.html` in any modern browser. No build step is required; the game runs from static HTML, CSS, and vanilla JavaScript files and loads optional Google Fonts from the web. Rendering and zooming real-time Mandelbrot and Julia sets does require GLSL (and so a WebGL-compatible GPU)a.

## How to Play

- Blast every fractaloid in the wave to advance to the next, faster wave.
- Large fractaloids split into medium rocks, and medium rocks split into small rocks.
- Shoot saucers for bonus points while avoiding their fire.
- Earn an extra life every 10,000 points.
- Use hyperspace to escape danger, but it can occasionally destroy your ship.

## Controls

- **Left Arrow / A** -- rotate left
- **Right Arrow / D** -- rotate right
- **Up Arrow / W** -- thrust
- **Space** -- fire
- **Shift** -- hyperspace
- **Enter** -- start or restart
- **Touch buttons** -- rotate, thrust, fire, and hyperspace on mobile

## Features

- Classic wraparound asteroid field with escalating waves.
- Mandelbrot-rendered fractaloids that split, grow, and deepen over time.
- Boss-genotype waves with aggressive palette cycling.
- Fractal shockwaves and saucer bullets that warp local fractal color fields.
- Enemy saucers, score bonuses, and extra lives.
- CRT-style scanlines, starfield backdrop, and synthesized arcade audio.
- Mobile touch controls with browser-safe fullscreen layout.
- Zero-build HTML5 Canvas game with separated htmli entry point, css styles, and javascript (scripts/*.js):wq files.

## Fractal Class Toggles

Set these constants near the top of `index.html` to swap visual classes without refactoring:

- `SHIP_FRACTAL_CLASS`: `'sierpinski'` or `'mandelbrot_outline'`
- `FRACTALOID_CLASS`: `'mandelbrot'` or `'julia'`

## Tech

- HTML, CSS, vanilla JavaScript
- HTML5 Canvas
- Web Audio API
- Google Fonts for arcade typography

## License

See repository for license details.
