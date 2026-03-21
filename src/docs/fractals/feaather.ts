import { FractalDefinition } from "../types/fractal";

export const feather: FractalDefinition = {
  name: "Feather",
  category: "Rational",
  formula: `
    float z2r = z.x * z.x - z.y * z.y;
    float z2i = 2.0 * z.x * z.y;

    float z3r = z.x * z2r - z.y * z2i;
    float z3i = z.x * z2i + z.y * z2r;

    float dr = 1.0 + z2r;
    float di = z2i;
    float denom = dr * dr + di * di + 1e-9;

    x = (z3r * dr + z3i * di) / denom + c.x;
    y = (z3i * dr - z3r * di) / denom + c.y;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0.0, y: 0.0 },
  initialZoom: 3.0,
  initialPalette: 0
};
