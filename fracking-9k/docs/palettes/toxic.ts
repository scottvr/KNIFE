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
  `,
  metadata: {
    description: "Acid green palette with dark undertones and strong edge punch.",
    moodTags: ["toxic", "acid", "high-energy"],
    bestFor: ["high-energy", "boundary-tracking", "contour-separation"],
    contrastProfile: "high",
    cycleBehavior: "punchy",
    mathProfile: "high-frequency",
    infoSnippet: "Toxic is aggressive and can quickly reveal thin branch boundaries.",
    messages: [
      {
        id: "p-toxic",
        text: "Toxic makes active boundaries glow hard against dark interiors.",
        tone: "highlight",
        always: false,
        conditions: { paletteName: "Toxic" },
      },
      {
        id: "p-toxic-cycle",
        text: "Toxic cycling can get visually intense; slower speeds improve readability.",
        tone: "warn",
        always: false,
        conditions: { paletteName: "Toxic", paletteCycling: true },
      },
    ],
  },
};
