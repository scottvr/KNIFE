import { FractalDefinition } from "../types/fractal";

export const splitSquare: FractalDefinition = {
  name: "Split Square",
  category: "Experimental",
  formula: `
    float sx = z.x >= 0.0 ? 1.0 : -1.0;
    float sy = z.y >= 0.0 ? 1.0 : -1.0;

    float ax = z.x * z.x - z.y * z.y;
    float ay = 2.0 * abs(z.x) * abs(z.y);

    x = ax + c.x + 0.25 * sx;
    y = ay + c.y + 0.25 * sy;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0.0, y: 0.0 },
  initialZoom: 3.0,
  initialPalette: 0
};
