import { PaletteDefinition } from "../types/palette";

export const silver: PaletteDefinition = {
  name: "Silver",
  formula: `
    float v = 0.5 + 0.5 * cos(t + cycle);
    return vec3(v, v, v * 1.1);
  `,
  metadata: {
    description: "Monochrome silver gradient emphasizing shape over hue.",
    moodTags: ["monochrome", "technical", "minimal"],
    bestFor: ["geometry-first", "low-fatigue", "deep-zoom"],
    contrastProfile: "balanced",
    cycleBehavior: "smooth",
    mathProfile: "monochrome",
    infoSnippet: "Silver is ideal when you want to focus on geometry and not color bias.",
    messages: [
      {
        id: "p-silver",
        text: "Silver removes most hue cues, making boundary geometry easier to judge.",
        tone: "tip",
        always: false,
        conditions: { paletteName: "Silver" },
      },
    ],
  },
};
