import { PaletteDefinition } from "../types/palette";

export const gold: PaletteDefinition = {
  name: "Gold",
  formula: `
    float sn = max(t, 0.000001);
    float q = fract(pow(sn, 0.35) * 0.15 + cycle * 0.02);
    vec3 c0 = vec3(0.000, 0.027, 0.392);
    vec3 c1 = vec3(0.125, 0.420, 0.796);
    vec3 c2 = vec3(0.929, 1.000, 1.000);
    vec3 c3 = vec3(1.000, 0.667, 0.000);
    vec3 c4 = vec3(0.000, 0.008, 0.000);

    if      (q < 0.1600) return mix(c0, c1, q / 0.1600);
    else if (q < 0.4200) return mix(c1, c2, (q - 0.1600) / 0.2600);
    else if (q < 0.6425) return mix(c2, c3, (q - 0.4200) / 0.2225);
    else if (q < 0.8575) return mix(c3, c4, (q - 0.6425) / 0.2150);
    else                 return mix(c4, c0, (q - 0.8575) / 0.1425);
  `,
  metadata: {
    description: "Warm metallic gold palette with amber-to-bronze transitions.",
    moodTags: ["warm", "metallic", "classic"],
    bestFor: ["boundary-tracking", "contour-separation", "animation"],
    contrastProfile: "high",
    cycleBehavior: "smooth",
    mathProfile: "piecewise",
    infoSnippet: "Gold accentuates warm contour halos while keeping interiors dark.",
    messages: [
      {
        id: "p-gold",
        text: "Gold highlights boundary halos and gives a classic warm fractint-style look.",
        tone: "highlight",
        always: false,
        conditions: { paletteName: "Gold" },
      },
    ],
  },
};
