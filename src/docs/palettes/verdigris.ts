import { PaletteDefinition } from "../types/palette";

export const verdigris: PaletteDefinition = {
  name: "Verdigris",
  formula: `
    float q = fract(t + cycle * 0.04);
    vec3 c0 = vec3(0.020, 0.040, 0.030);
    vec3 c1 = vec3(0.090, 0.220, 0.160);
    vec3 c2 = vec3(0.200, 0.520, 0.420);
    vec3 c3 = vec3(0.700, 0.860, 0.720);
    vec3 c4 = vec3(0.180, 0.120, 0.050);

    if      (q < 0.25) return mix(c0, c1, q / 0.25);
    else if (q < 0.55) return mix(c1, c2, (q - 0.25) / 0.30);
    else if (q < 0.82) return mix(c2, c3, (q - 0.55) / 0.27);
    else               return mix(c3, c4, (q - 0.82) / 0.18);
  `
};
