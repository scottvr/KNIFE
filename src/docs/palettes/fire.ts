import { PaletteDefinition } from "../types/palette";

export const fire: PaletteDefinition = {
  name: "Fire",
  formula: `
    return vec3(
        0.5 + 0.5 * cos(t * 0.8 + cycle),
        0.5 + 0.5 * cos(1.0 + t * 0.6 + cycle * 0.8),
        0.5 + 0.5 * cos(2.0 + t * 0.4 + cycle * 0.6)
    );
  `
};
