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
  `,
  metadata: {
    description: "Glacial blue-white palette with clean, crisp luminance.",
    moodTags: ["cool", "clean", "crisp"],
    bestFor: ["geometry-first", "low-fatigue", "deep-zoom"],
    contrastProfile: "balanced",
    cycleBehavior: "smooth",
    mathProfile: "harmonic",
    infoSnippet: "Ice is high clarity and gentle enough for long inspection sessions.",
    messages: [
      {
        id: "p-ice",
        text: "Ice keeps edges crisp while avoiding heavy saturation.",
        tone: "neutral",
        always: false,
        conditions: { paletteName: "Ice" },
      },
    ],
  },
};
