import { PaletteDefinition } from "../types/palette";

export const bruise: PaletteDefinition = {
  name: "Bruise",
  formula: `
    float q = fract(t + cycle * 0.03);
    vec3 c0 = vec3(0.090, 0.020, 0.140);
    vec3 c1 = vec3(0.180, 0.070, 0.330);
    vec3 c2 = vec3(0.070, 0.120, 0.340);
    vec3 c3 = vec3(0.580, 0.540, 0.180);
    vec3 c4 = vec3(0.040, 0.020, 0.060);

    if      (q < 0.25) return mix(c0, c1, q / 0.25);
    else if (q < 0.50) return mix(c1, c2, (q - 0.25) / 0.25);
    else if (q < 0.78) return mix(c2, c3, (q - 0.50) / 0.28);
    else               return mix(c3, c4, (q - 0.78) / 0.22);
  `
};
