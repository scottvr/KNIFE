import { FractalDefinition } from "../types/fractal";

export const cubic: FractalDefinition = {
  name: "Cubic",
  category: "Power",
  formula: `
    x = z.x * (z.x * z.x - 3.0 * z.y * z.y) + c.x;
    y = z.y * (3.0 * z.x * z.x - z.y * z.y) + c.y;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0, y: 0 },
  initialZoom: 3.0
};
