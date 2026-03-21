import { PaletteDefinition } from "../types/palette";

export const firefly: PaletteDefinition = {
  name: "Firefly",
  formula: `
    float p = t * 6.28318 + cycle * 1.1;
    float g = pow(0.5 + 0.5 * sin(p + 0.7), 2.5);
    return vec3(
      0.02 + 0.18 * g,
      0.08 + 0.55 * g,
      0.01 + 0.10 * sin(p * 0.6 + 2.0)
    );
  `
};
