import chroma from 'chroma-js';

export interface ColorCombination {
  name: string;
  colors: string[];
  description: string;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const color = chroma(hex);
  const [h, s, l] = color.hsl();
  return { h: h || 0, s, l };
}

export function hslToHex(h: number, s: number, l: number): string {
  return chroma(h, s, l, 'hsl').hex();
}

export function getComplementaryColor(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  const complementaryHue = (h + 180) % 360;
  return hslToHex(complementaryHue, s, l);
}

export function getAnalogousColors(hex: string, count: number = 2): string[] {
  const { h, s, l } = hexToHsl(hex);
  const colors: string[] = [];
  const step = 30;
  
  for (let i = 1; i <= count; i++) {
    colors.push(hslToHex((h + step * i) % 360, s, l));
    colors.push(hslToHex((h - step * i + 360) % 360, s, l));
  }
  
  return colors.slice(0, count);
}

export function getTriadicColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l)
  ];
}

export function getSplitComplementaryColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l)
  ];
}

export function getTetradicColors(hex: string): string[] {
  const { h, s, l } = hexToHsl(hex);
  return [
    hslToHex((h + 90) % 360, s, l),
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 270) % 360, s, l)
  ];
}

export function getMonochromaticColors(hex: string, count: number = 4): string[] {
  const { h, s, l } = hexToHsl(hex);
  const colors: string[] = [];
  const lightnessStep = 0.15;
  
  for (let i = 1; i <= Math.floor(count / 2); i++) {
    const lighterL = Math.min(1, l + lightnessStep * i);
    const darkerL = Math.max(0, l - lightnessStep * i);
    colors.push(hslToHex(h, s, lighterL));
    colors.push(hslToHex(h, s, darkerL));
  }
  
  return colors.slice(0, count);
}

export function getShades(hex: string, count: number = 5): string[] {
  const scale = chroma.scale([hex, '#000000']).mode('lab');
  return Array.from({ length: count }, (_, i) => scale(i / (count - 1)).hex());
}

export function getTints(hex: string, count: number = 5): string[] {
  const scale = chroma.scale([hex, '#ffffff']).mode('lab');
  return Array.from({ length: count }, (_, i) => scale(i / (count - 1)).hex());
}

export function getRecommendedCombinations(hex: string): ColorCombination[] {
  const complementary = getComplementaryColor(hex);
  const analogous = getAnalogousColors(hex, 2);
  const triadic = getTriadicColors(hex);
  const splitComplementary = getSplitComplementaryColors(hex);
  const monochromatic = getMonochromaticColors(hex, 2);

  return [
    {
      name: 'Complementary',
      colors: [hex, complementary],
      description: 'High contrast, vibrant combination'
    },
    {
      name: 'Analogous',
      colors: [hex, ...analogous],
      description: 'Harmonious, similar hues'
    },
    {
      name: 'Triadic',
      colors: [hex, ...triadic],
      description: 'Balanced, vibrant triangle'
    },
    {
      name: 'Split Complementary',
      colors: [hex, ...splitComplementary],
      description: 'High contrast with variety'
    },
    {
      name: 'Monochromatic',
      colors: [hex, ...monochromatic],
      description: 'Same hue, different shades'
    }
  ];
}

export function getBestGradientPair(hex: string): string {
  const combinations = getRecommendedCombinations(hex);
  return combinations[0].colors[1];
}
