import { PaletteDefinition } from "../types/palette";

export const ember: PaletteDefinition = {
  name: "Ember",
  formula: `
    float p = t;
    vec3 c0 = vec3(0.010, 0.000, 0.000);
    vec3 c1 = vec3(0.180, 0.000, 0.000);
    vec3 c2 = vec3(0.600, 0.080, 0.000);
    vec3 c3 = vec3(1.000, 0.420, 0.060);
    vec3 c4 = vec3(1.000, 0.900, 0.350);

    float q = fract(p + cycle * 0.05);
    if      (q < 0.22) return mix(c0, c1, q / 0.22);
    else if (q < 0.50) return mix(c1, c2, (q - 0.22) / 0.28);
    else if (q < 0.78) return mix(c2, c3, (q - 0.50) / 0.28);
    else               return mix(c3, c4, (q - 0.78) / 0.22);
  `,
  metadata: {
    description: 'Smoldering heat-map with warm highlights and dark embers.',
    moodTags: ['warm', 'smoldering', 'dramatic'],
    bestFor: ['contour-separation', 'boundary-tracking', 'high-energy'],
    contrastProfile: 'high',
    cycleBehavior: 'punchy',
    mathProfile: 'piecewise',
    infoSnippet: 'Ember favors warm contrast and reveals band layering clearly.',
    messages: [
      {
        id: 'p-ember',
        text: 'Ember emphasizes warm band transitions and works well on folded maps.',
        tone: 'highlight',
        always: false,
        conditions: { paletteName: 'Ember' },
      },
      {
        id: 'p-ember-cycle',
        text: 'At high cycle speed, Ember can appear strobing in dense edge fields.',
        tone: 'note',
        always: false,
        conditions: { paletteName: 'Ember', paletteCycling: true },
      },
    ],
  },
};
