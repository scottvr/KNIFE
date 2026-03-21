import { FractalDefinition } from "../types/fractal";

export const inverse: FractalDefinition = {
  name: "Inverse",
  category: "Standard",
  formula: `
    float d = dot(z, z);
    if (d < 0.0001) d = 0.0001;
    vec2 invZ = vec2(z.x / d, -z.y / d);
    x = (invZ.x * invZ.x - invZ.y * invZ.y) + c.x;
    y = (2.0 * invZ.x * invZ.y) + c.y;
    z = vec2(x, y);
  `,
  initialCenter: { x: 0, y: 0 },
  initialZoom: 3.0
};
