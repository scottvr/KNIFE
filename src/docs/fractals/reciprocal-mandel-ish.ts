import { FractalDefinition } from "../types/fractal";

export const expbrot: FractalDefinition = {
  name: "Expbrot",
  category: "Transcendental",
  formula: `
    float ex = exp(z.x);
    x = ex * cos(z.y) + c.x;
    y = ex * sin(z.y) + c.y;
    z = vec2(x, y);
  `,
  initialCenter: { x: -1.0, y: 0.0 },
  initialZoom: 2.5,
  initialPalette: 0
};
