import { PaletteDefinition } from "../types/palette";

export const cosmic: PaletteDefinition = {
  name: "Cosmic",
  formula: `
    return vec3(
        0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
        0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
        0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
    );
  `
};
