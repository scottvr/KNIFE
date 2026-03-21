import { PaletteDefinition } from "../types/palette";

export const abyss: PaletteDefinition = {
  name: "Abyss",
  formula: `
    float p = t * 6.28318 + cycle * 0.8;
    float glow = pow(0.5 + 0.5 * sin(p + 1.1), 3.0);
    return vec3(
      0.00 + 0.04 * glow,
      0.02 + 0.28 * glow,
      0.06 + 0.55 * glow
    );
  `
};
