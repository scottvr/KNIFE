import { FractalDefinition } from "../types/fractal";

export const magnet1: FractalDefinition = {
  name: "Magnet I",
  category: "Rational",
  formula: `
    float z2r = z.x * z.x - z.y * z.y;
    float z2i = 2.0 * z.x * z.y;

    float nr = z2r + c.x - 1.0;
    float ni = z2i + c.y;

    float dr = 2.0 * z.x + c.x - 2.0;
    float di = 2.0 * z.y + c.y;

    float denom = dr * dr + di * di + 1e-9;

    float qr = (nr * dr + ni * di) / denom;
    float qi = (ni * dr - nr * di) / denom;

    x = qr * qr - qi * qi;
    y = 2.0 * qr * qi;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0.5, y: 0.0 },
  initialZoom: 3.0,
  initialPalette: 0
};
