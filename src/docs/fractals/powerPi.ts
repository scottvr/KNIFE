import { FractalDefinition } from "../types/fractal";

export const powerPi: FractalDefinition = {
  name: "Power Pi",
  category: "Power",
  formula: `
    float p = 3.14159265;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,
  initialCenter: { x: 0, y: 0 },
  initialZoom: 3.0
};
