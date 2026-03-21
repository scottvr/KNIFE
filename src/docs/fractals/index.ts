import { FractalDefinition, FractalCategory } from "../types/fractal";

// Use import.meta.glob to dynamically load all fractal definitions
const fractalModules = import.meta.glob("./*.ts", { eager: true });

export const FRACTAL_REGISTRY: Record<string, FractalDefinition> = {};

// Populate the registry and validate definitions
Object.entries(fractalModules).forEach(([path, module]: [string, any]) => {
  // Skip this index file
  if (path.includes("index.ts")) return;

  // Extract the exported definition (assuming each file exports a constant with the same name as the file or just one export)
  const definition = Object.values(module)[0] as FractalDefinition;

  if (definition && definition.name && definition.formula) {
    FRACTAL_REGISTRY[definition.name] = definition;
  } else {
    console.warn(`Invalid fractal definition at ${path}`);
  }
});

// Helper to get categories for the UI
export const getFractalCategories = (): FractalCategory[] => {
  const categoriesMap: Record<string, string[]> = {};

  Object.values(FRACTAL_REGISTRY).forEach(fractal => {
    if (!categoriesMap[fractal.category]) {
      categoriesMap[fractal.category] = [];
    }
    categoriesMap[fractal.category].push(fractal.name);
  });

  return Object.entries(categoriesMap).map(([name, variants]) => ({
    name,
    variants: variants.map(v => ({ name: v }))
  }));
};

export const DEFAULT_FRACTAL = "Mandelbrot";
