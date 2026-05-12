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
  `,
  metadata: {
    description: 'Vivid high-saturation palette for aggressive contour contrast.',
    moodTags: ['neon', 'electric', 'bold'],
    bestFor: ['high-energy', 'animation', 'boundary-tracking'],
    contrastProfile: 'high',
    cycleBehavior: 'high-contrast',
    mathProfile: 'high-frequency',
    infoSnippet: 'Neon is intentionally loud; best when you want structure to pop immediately.',
    messages: [
      {
        id: 'p-neon',
        text: 'Neon makes boundaries pop, but can hide subtle gradients in smooth regions.',
        tone: 'highlight',
        always: false,
        conditions: { paletteName: 'Neon' },
      },
      {
        id: 'p-neon-cycle',
        text: 'Neon + cycling can become intense quickly; consider lowering cycle speed.',
        tone: 'warn',
        always: false,
        conditions: { paletteName: 'Neon', paletteCycling: true },
      },
    ],
  },
};
