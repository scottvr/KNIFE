import { FractalDefinition } from "../types/fractal";

export const powerTau: FractalDefinition = {
  name: "Power Tau",
  category: "Power",
  formula: `
    float p = 6.28318530;
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rp = pow(r, p);
    z = vec2(rp * cos(p * theta), rp * sin(p * theta)) + c;
  `,
  initialCenter: { x: 0, y: 0 },
  initialZoom: 3.0
};
