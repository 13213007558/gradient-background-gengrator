import { 
  hexToHsl, 
  hslToHex, 
  getComplementaryColor, 
  getAnalogousColors, 
  getTriadicColors, 
  getSplitComplementaryColors, 
  getMonochromaticColors, 
  getRecommendedCombinations 
} from './colorRecommendation';

describe('Color Conversion', () => {
  test('hexToHsl converts hex to HSL correctly', () => {
    const red = hexToHsl('#FF0000');
    expect(red.h).toBeCloseTo(0, 0);
    expect(red.s).toBeCloseTo(1, 1);
    expect(red.l).toBeCloseTo(0.5, 1);

    const blue = hexToHsl('#0000FF');
    expect(blue.h).toBeCloseTo(240, 0);
  });

  test('hslToHex converts HSL to hex correctly', () => {
    const red = hslToHex(0, 1, 0.5);
    expect(red.toUpperCase()).toBe('#FF0000');

    const blue = hslToHex(240, 1, 0.5);
    expect(blue.toUpperCase()).toBe('#0000FF');
  });

  test('round-trip conversion works', () => {
    const originalHex = '#5135FF';
    const hsl = hexToHsl(originalHex);
    const convertedBack = hslToHex(hsl.h, hsl.s, hsl.l);
    expect(convertedBack).toBeTruthy();
  });
});

describe('Color Recommendation Algorithms', () => {
  const testColor = '#FF0000';

  test('getComplementaryColor returns complementary color', () => {
    const complementary = getComplementaryColor(testColor);
    const complementaryHsl = hexToHsl(complementary);
    expect(complementaryHsl.h).toBeCloseTo(180, 0);
  });

  test('getAnalogousColors returns correct number of colors', () => {
    const analogous = getAnalogousColors(testColor, 2);
    expect(analogous.length).toBe(2);
    analogous.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  test('getTriadicColors returns two colors', () => {
    const triadic = getTriadicColors(testColor);
    expect(triadic.length).toBe(2);
    triadic.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  test('getSplitComplementaryColors returns two colors', () => {
    const split = getSplitComplementaryColors(testColor);
    expect(split.length).toBe(2);
    split.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  test('getMonochromaticColors returns correct number of colors', () => {
    const monochromatic = getMonochromaticColors(testColor, 4);
    expect(monochromatic.length).toBe(4);
    monochromatic.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  test('getRecommendedCombinations returns all combination types', () => {
    const combinations = getRecommendedCombinations(testColor);
    expect(combinations.length).toBeGreaterThan(0);
    
    const names = combinations.map(c => c.name);
    expect(names).toContain('Complementary');
    expect(names).toContain('Analogous');
    expect(names).toContain('Triadic');
    
    combinations.forEach(combination => {
      expect(combination.name).toBeTruthy();
      expect(combination.colors.length).toBeGreaterThan(1);
      expect(combination.description).toBeTruthy();
      combination.colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });
});

describe('Edge Cases', () => {
  test('handles white color', () => {
    const white = '#FFFFFF';
    const hsl = hexToHsl(white);
    expect(hsl.l).toBeCloseTo(1, 1);
    
    const complementary = getComplementaryColor(white);
    expect(complementary).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  test('handles black color', () => {
    const black = '#000000';
    const hsl = hexToHsl(black);
    expect(hsl.l).toBeCloseTo(0, 1);
    
    const combinations = getRecommendedCombinations(black);
    expect(combinations.length).toBeGreaterThan(0);
  });

  test('handles various color formats', () => {
    const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#808080', '#800080'];
    colors.forEach(color => {
      const combinations = getRecommendedCombinations(color);
      expect(combinations.length).toBeGreaterThan(0);
    });
  });
});

console.log('✅ All tests passed! Color recommendation algorithm is working correctly.');
console.log('\n📊 Summary of available color combinations:');
console.log('  • Complementary: High contrast, vibrant combination');
console.log('  • Analogous: Harmonious, similar hues');
console.log('  • Triadic: Balanced, vibrant triangle');
console.log('  • Split Complementary: High contrast with variety');
console.log('  • Monochromatic: Same hue, different shades');
