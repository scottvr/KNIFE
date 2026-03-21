import { PaletteDefinition } from "../types/palette";

export const aurora: PaletteDefinition = {
  name: "Aurora",
  formula: `
    float p = t * 6.28318 + cycle * 1.4;
    return vec3(
      0.25 + 0.25 * sin(p + 0.4) + 0.20 * sin(p * 2.1),
      0.45 + 0.35 * sin(p * 0.9 + 1.2),
      0.55 + 0.35 * cos(p + 2.1)
    );
  `
};
