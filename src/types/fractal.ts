export interface FractalVariant {
  id: number;
  name: string;
}

export interface FractalCategory {
  name: string;
  variants: FractalVariant[];
}

export interface Palette {
  id: number;
  name: string;
}
