import { PaletteDefinition } from "../types/palette";

export const abyss: PaletteDefinition = {
  name: "Abyss",
  formula: `
    float p = t * 6.28318 + cycle * 0.8;
    float glow = pow(0.5 + 0.5 * sin(p + 1.1), 3.0);
    return vec3(
      0.00 + 0.04 * glow,
      0.02 + 0.28 * glow,
      0.06 + 0.55 * glow
    );
  `,
  metadata: {
    description: 'Deep-ocean palette with low baseline luminance and cool highlights.',
    moodTags: ['calm', 'deep', 'moody'],
    bestFor: ['deep-zoom', 'low-fatigue', 'geometry-first'],
    contrastProfile: 'balanced',
    cycleBehavior: 'smooth',
    mathProfile: 'nonlinear-glow',
    infoSnippet: 'Abyss keeps noise low and rewards deep zoom patience.',
    messages: [
      {
        id: 'p-abyss',
        text: 'Abyss is less saturated; it helps track shape before color drama.',
        tone: 'neutral',
        always: false,
        conditions: { paletteName: 'Abyss' },
      },
      {
        id: 'p-abyss-deep',
        text: 'At deep zoom, Abyss can reveal subtle boundary gradients hidden by hotter palettes.',
        tone: 'tip',
        always: false,
        conditions: { paletteName: 'Abyss', minMagnification: 5e5 },
      },
    ],
  },
};
