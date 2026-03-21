import { FractalCategory } from "../types/fractal";

export const FRACTAL_CATEGORIES: FractalCategory[] = [
  {
    name: "Standard",
    variants: [
      { id: 0, name: "Mandelbrot" },
      { id: 1, name: "Julia Set" },
      { id: 9, name: "Inverse" }
    ]
  },
  {
    name: "Symmetry",
    variants: [
      { id: 2, name: "Burning Ship" },
      { id: 3, name: "Tricorn" },
      { id: 7, name: "Celtic" },
      { id: 8, name: "Buffalo" }
    ]
  },
  {
    name: "Power",
    variants: [
      { id: 4, name: "Cubic" },
      { id: 5, name: "Quartic" },
      { id: 6, name: "Power Pi" },
      { id: 10, name: "Power Phi" },
      { id: 11, name: "Power Tau" }
    ]
  }
];
