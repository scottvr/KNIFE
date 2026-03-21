import { FractalDefinition } from "../types/fractal";

export const julia: FractalDefinition = {
  name: "Julia Set",
  category: "Standard",
  isJulia: true,
  formula: `
    x = (z.x * z.x - z.y * z.y) + c.x;
    y = (2.0 * z.x * z.y) + c.y;
    z = vec2(x, y);
  `,
  df_formula: `
    vec2 x2 = df_mul(zx, zx);
    vec2 y2 = df_mul(zy, zy);
    vec2 xy = df_mul(zx, zy);
    zx = df_add(df_sub(x2, y2), cx);
    zy = df_add(df_add(xy, xy), cy);
  `,
  initialCenter: { x: 0, y: 0 },
  initialZoom: 3.0,
  initialPalette: 1
};
