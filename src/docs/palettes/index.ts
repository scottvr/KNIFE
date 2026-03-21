import { PaletteDefinition } from "../types/palette";

// Use import.meta.glob to dynamically load all palette definitions
const paletteModules = import.meta.glob("./*.ts", { eager: true });

export const PALETTE_REGISTRY: Record<string, PaletteDefinition> = {};

// Populate the registry and validate definitions
Object.entries(paletteModules).forEach(([path, module]: [string, any]) => {
  // Skip this index file
  if (path.endsWith("index.ts")) return;

  // Find the exported palette definition
  const definition = Object.values(module).find(
    (val): val is PaletteDefinition => 
      val !== null && 
      typeof val === "object" && 
      "name" in val && 
      "formula" in val
  );

  if (definition) {
    PALETTE_REGISTRY[definition.name] = definition;
  }
});

export const getPaletteNames = () => Object.keys(PALETTE_REGISTRY);

export const DEFAULT_PALETTE = "Cosmic";
