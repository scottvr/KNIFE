import { FractalDefinition } from "../types/fractal";

export const lambda: FractalDefinition = {
  name: "Lambda",
  category: "Rational",
  formula: `
    vec2 oneMinusZ = vec2(1.0 - z.x, -z.y);

    float rx = z.x * oneMinusZ.x - z.y * oneMinusZ.y;
    float ry = z.x * oneMinusZ.y + z.y * oneMinusZ.x;

    x = c.x * rx - c.y * ry;
    y = c.x * ry + c.y * rx;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0.0, y: 0.0 },
  initialZoom: 2.8,
  initialPalette: 0
};
