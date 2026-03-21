import { PaletteDefinition } from "../types/palette";

export const silver: PaletteDefinition = {
  name: "Silver",
  formula: `
    float v = 0.5 + 0.5 * cos(t + cycle);
    return vec3(v, v, v * 1.1);
  `
};
