import { FractalDefinition } from "../types/fractal";

export const celtic: FractalDefinition = {
  name: "Celtic",
  category: "Symmetry",
  formula: `
    x = abs(z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,
  initialCenter: { x: -0.5, y: 0 },
  initialZoom: 3.0
};
