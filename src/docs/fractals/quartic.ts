import { FractalDefinition } from "../types/fractal";

export const quartic: FractalDefinition = {
  name: "Quartic",
  category: "Power",
  formula: `
    float x2 = z.x * z.x;
    float y2 = z.y * z.y;
    x = (x2 * x2 - 6.0 * x2 * y2 + y2 * y2) + c.x;
    y = (4.0 * z.x * z.y * (x2 - y2)) + c.y;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0, y: 0 },
  initialZoom: 3.0
};
