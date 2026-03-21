import { PaletteDefinition } from "../types/palette";

export const toxic: PaletteDefinition = {
  name: "Toxic",
  formula: `
    float p = t * 6.28318 + cycle * 2.5;
    return vec3(
      0.30 + 0.25 * sin(p * 1.2 + 2.0),
      0.65 + 0.35 * sin(p + 0.2),
      0.02 + 0.12 * cos(p * 0.8)
    );
  `
};
