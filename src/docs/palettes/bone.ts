import { PaletteDefinition } from "../types/palette";

export const bone: PaletteDefinition = {
  name: "Bone",
  formula: `
    float q = fract(t + cycle * 0.02);
    vec3 c0 = vec3(0.030, 0.025, 0.020);
    vec3 c1 = vec3(0.220, 0.190, 0.150);
    vec3 c2 = vec3(0.620, 0.560, 0.470);
    vec3 c3 = vec3(0.920, 0.890, 0.800);
    vec3 c4 = vec3(0.180, 0.180, 0.190);

    if      (q < 0.20) return mix(c0, c1, q / 0.20);
    else if (q < 0.48) return mix(c1, c2, (q - 0.20) / 0.28);
    else if (q < 0.78) return mix(c2, c3, (q - 0.48) / 0.30);
    else               return mix(c3, c4, (q - 0.78) / 0.22);
  `
};
