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
  `,
  metadata: {
    description: "Classic rainbow plasma for maximal contour visibility.",
    moodTags: ["rainbow", "classic", "retro"],
    bestFor: ["contour-separation", "high-energy", "animation"],
    contrastProfile: "high",
    cycleBehavior: "high-contrast",
    mathProfile: "high-frequency",
    infoSnippet: "Plasma is intentionally vivid and can expose contour spacing quickly.",
    messages: [
      {
        id: "p-plasma",
        text: "Plasma strongly separates contour bands, useful for spotting iteration gradients.",
        tone: "highlight",
        always: false,
        conditions: { paletteName: "Plasma" },
      },
      {
        id: "p-plasma-cycle",
        text: "Fast cycling in Plasma can feel strobing; reduce speed for structure analysis.",
        tone: "warn",
        always: false,
        conditions: { paletteName: "Plasma", paletteCycling: true },
      },
    ],
  },
};
