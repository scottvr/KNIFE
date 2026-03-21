import { PaletteDefinition } from "../types/palette";

export const ice: PaletteDefinition = {
  name: "Ice",
  formula: `
    float p = t * 6.28318 + cycle * 0.7;
    float s = 0.5 + 0.5 * sin(p);
    return vec3(
      0.70 + 0.20 * s,
      0.85 + 0.12 * sin(p + 0.8),
      0.95 + 0.05 * cos(p + 1.8)
    );
  `
};
