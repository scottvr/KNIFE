import { PaletteDefinition } from "../types/palette";

export const neon: PaletteDefinition = {
  name: "Neon",
  formula: `
    float p = t * 5.0 + cycle * 3.0;
    return vec3(
        abs(sin(p)),
        abs(cos(p * 0.5)),
        abs(sin(p * 0.2))
    );
  `
};
