import { PaletteDefinition } from "../types/palette";

export const cosmic: PaletteDefinition = {
  name: "Cosmic",
  formula: `
    return vec3(
        0.5 + 0.5 * cos(3.0 + t + cycle * 0.5),
        0.5 + 0.5 * cos(3.0 + t * 0.7 + cycle * 0.3),
        0.5 + 0.5 * cos(3.0 + t * 0.5 + cycle * 0.2)
    );
  `,
  metadata: {
    description: 'Warm plasma glow with cool highlights over dark interiors.',
    moodTags: ['cinematic', 'high-contrast', 'classic'],
    bestFor: ['boundary-tracking', 'contour-separation', 'animation'],
    contrastProfile: 'high',
    cycleBehavior: 'smooth',
    mathProfile: 'harmonic',
    renderHints: {
      byColorizer: {
        statistical: {
          autoIterations: false,
          maxIterations: 50,
          statScale: 0.2,
        },
      },
    },
    infoSnippet: 'Cosmic emphasizes boundary glow and keeps stable interiors visually anchored.',
    messages: [
      {
        id: 'p-cosmic-core',
        text: 'Cosmic emphasizes glow edges and keeps interior sets dark and readable.',
        tone: 'highlight',
        always: false,
        conditions: { paletteName: 'Cosmic' },
      },
      {
        id: 'p-cosmic-cycle',
        text: 'Cosmic cycling is smooth; slower rates help preserve shape perception.',
        tone: 'note',
        always: false,
        conditions: { paletteName: 'Cosmic', paletteCycling: true },
      },
    ],
  },
};
