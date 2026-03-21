import { FractalDefinition } from "../types/fractal";

export const burningShip: FractalDefinition = {
  name: "Burning Ship",
  category: "Symmetry",
  formula: `
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = abs(2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
    z = abs(z);
  `,
  initialCenter: { x: -1.75, y: -0.02 },
  initialZoom: 0.1,
  initialPalette: 2
};
