import { PaletteDefinition } from "../types/palette";

export const plasma: PaletteDefinition = {
  name: "Plasma",
  formula: `
    float p = t * 2.0 + cycle * 2.0;
    return vec3(
        0.5 + 0.5 * sin(p),
        0.5 + 0.5 * sin(p + 2.094),
        0.5 + 0.5 * sin(p + 4.188)
    );
  `
};
