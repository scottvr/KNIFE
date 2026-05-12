import { PaletteDefinition } from "../types/palette";

export const fire: PaletteDefinition = {
  name: "Fire",
  formula: `
    return vec3(
        0.5 + 0.5 * cos(t * 0.8 + cycle),
        0.5 + 0.5 * cos(1.0 + t * 0.6 + cycle * 0.8),
        0.5 + 0.5 * cos(2.0 + t * 0.4 + cycle * 0.6)
    );
  `,
  metadata: {
    description: 'Hot gradient tuned for strong thermal contrast.',
    moodTags: ['fiery', 'dramatic', 'high-energy'],
    bestFor: ['boundary-tracking', 'high-energy', 'contour-separation'],
    contrastProfile: 'high',
    cycleBehavior: 'punchy',
    mathProfile: 'harmonic',
    infoSnippet: 'Fire makes escape bands feel energetic and emphasizes ridge transitions.',
    messages: [
      {
        id: 'p-fire',
        text: 'Fire palette boosts contour contrast; ideal for ridge-heavy fractals.',
        tone: 'highlight',
        always: false,
        conditions: { paletteName: 'Fire' },
      },
      {
        id: 'p-fire-cycle',
        text: 'Fire cycling can feel aggressive at high speed; reduce speed for readability.',
        tone: 'note',
        always: false,
        conditions: { paletteName: 'Fire', paletteCycling: true },
      },
    ],
  },
};
