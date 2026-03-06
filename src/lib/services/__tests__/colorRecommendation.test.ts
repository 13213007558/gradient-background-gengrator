/**
 * 色彩推荐算法测试
 * 运行测试: npm test
 */

import {
  hexToHsl,
  hslToHex,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getTetradicColors,
  getSquareColors,
  getMonochromaticColors,
  recommendColors,
  getAllRecommendations,
  getContrastRatio,
  type HSLColor
} from '../colorRecommendation';

describe('Color Recommendation Service', () => {
  
  describe('hexToHsl', () => {
    it('should convert red hex to HSL correctly', () => {
      const result = hexToHsl('#FF0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should convert green hex to HSL correctly', () => {
      const result = hexToHsl('#00FF00');
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should convert blue hex to HSL correctly', () => {
      const result = hexToHsl('#0000FF');
      expect(result.h).toBe(240);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should handle hex without # prefix', () => {
      const result = hexToHsl('FF0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
    });
  });

  describe('hslToHex', () => {
    it('should convert red HSL to hex correctly', () => {
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      expect(result).toBe('#FF0000');
    });

    it('should convert green HSL to hex correctly', () => {
      const result = hslToHex({ h: 120, s: 100, l: 50 });
      expect(result).toBe('#00FF00');
    });

    it('should convert blue HSL to hex correctly', () => {
      const result = hslToHex({ h: 240, s: 100, l: 50 });
      expect(result).toBe('#0000FF');
    });

    it('should handle round-trip conversion', () => {
      const originalHex = '#5135FF';
      const hsl = hexToHsl(originalHex);
      const convertedHex = hslToHex(hsl);
      expect(convertedHex).toBe(originalHex);
    });
  });

  describe('getComplementaryColor', () => {
    it('should return correct complementary color for red', () => {
      const result = getComplementaryColor('#FF0000');
      expect(result).toBe('#00FFFF'); // Cyan
    });

    it('should return correct complementary color for green', () => {
      const result = getComplementaryColor('#00FF00');
      expect(result).toBe('#FF00FF'); // Magenta
    });

    it('should return correct complementary color for blue', () => {
      const result = getComplementaryColor('#0000FF');
      expect(result).toBe('#FFFF00'); // Yellow
    });
  });

  describe('getAnalogousColors', () => {
    it('should return two analogous colors', () => {
      const result = getAnalogousColors('#FF0000');
      expect(result).toHaveLength(2);
    });

    it('should return colors adjacent on color wheel', () => {
      const result = getAnalogousColors('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      
      // Should be approximately 30 degrees apart
      const diff1 = Math.abs(hsl1.h - 0);
      const diff2 = Math.abs(hsl2.h - 0);
      
      expect(diff1).toBeCloseTo(30, 0);
      expect(diff2).toBeCloseTo(30, 0);
    });
  });

  describe('getTriadicColors', () => {
    it('should return two triadic colors', () => {
      const result = getTriadicColors('#FF0000');
      expect(result).toHaveLength(2);
    });

    it('should return colors 120 degrees apart', () => {
      const result = getTriadicColors('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      
      expect(hsl1.h).toBe(120);
      expect(hsl2.h).toBe(240);
    });
  });

  describe('getSplitComplementaryColors', () => {
    it('should return two split complementary colors', () => {
      const result = getSplitComplementaryColors('#FF0000');
      expect(result).toHaveLength(2);
    });

    it('should return colors at 150 and 210 degrees from base', () => {
      const result = getSplitComplementaryColors('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      
      expect(hsl1.h).toBe(150);
      expect(hsl2.h).toBe(210);
    });
  });

  describe('getTetradicColors', () => {
    it('should return three tetradic colors', () => {
      const result = getTetradicColors('#FF0000');
      expect(result).toHaveLength(3);
    });
  });

  describe('getSquareColors', () => {
    it('should return three square colors', () => {
      const result = getSquareColors('#FF0000');
      expect(result).toHaveLength(3);
    });

    it('should return colors 90 degrees apart', () => {
      const result = getSquareColors('#FF0000');
      const hsls = result.map(hexToHsl);
      
      expect(hsls[0].h).toBe(90);
      expect(hsls[1].h).toBe(180);
      expect(hsls[2].h).toBe(270);
    });
  });

  describe('getMonochromaticColors', () => {
    it('should return two monochromatic colors', () => {
      const result = getMonochromaticColors('#FF0000');
      expect(result).toHaveLength(2);
    });

    it('should return colors with same hue', () => {
      const result = getMonochromaticColors('#FF0000');
      const baseHsl = hexToHsl('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      
      expect(hsl1.h).toBe(baseHsl.h);
      expect(hsl2.h).toBe(baseHsl.h);
    });
  });

  describe('recommendColors', () => {
    it('should return complementary color for complementary type', () => {
      const result = recommendColors('#FF0000', 'complementary');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('#00FFFF');
    });

    it('should return analogous colors for analogous type', () => {
      const result = recommendColors('#FF0000', 'analogous');
      expect(result).toHaveLength(2);
    });

    it('should return triadic colors for triadic type', () => {
      const result = recommendColors('#FF0000', 'triadic');
      expect(result).toHaveLength(2);
    });

    it('should return split complementary colors for splitComplementary type', () => {
      const result = recommendColors('#FF0000', 'splitComplementary');
      expect(result).toHaveLength(2);
    });

    it('should return tetradic colors for tetradic type', () => {
      const result = recommendColors('#FF0000', 'tetradic');
      expect(result).toHaveLength(3);
    });

    it('should return square colors for square type', () => {
      const result = recommendColors('#FF0000', 'square');
      expect(result).toHaveLength(3);
    });

    it('should return monochromatic colors for monochromatic type', () => {
      const result = recommendColors('#FF0000', 'monochromatic');
      expect(result).toHaveLength(2);
    });
  });

  describe('getAllRecommendations', () => {
    it('should return all harmony types', () => {
      const result = getAllRecommendations('#FF0000');
      expect(result).toHaveLength(7);
    });

    it('should include primary color in each recommendation', () => {
      const result = getAllRecommendations('#FF0000');
      result.forEach(rec => {
        expect(rec.primary).toBe('#FF0000');
      });
    });

    it('should include harmony type in each recommendation', () => {
      const result = getAllRecommendations('#FF0000');
      const harmonyTypes = result.map(r => r.harmony);
      expect(harmonyTypes).toContain('complementary');
      expect(harmonyTypes).toContain('analogous');
      expect(harmonyTypes).toContain('triadic');
    });
  });

  describe('getContrastRatio', () => {
    it('should return high contrast for black and white', () => {
      const result = getContrastRatio('#000000', '#FFFFFF');
      expect(result).toBeGreaterThan(20);
    });

    it('should return low contrast for similar colors', () => {
      const result = getContrastRatio('#333333', '#444444');
      expect(result).toBeLessThan(2);
    });

    it('should return same ratio regardless of order', () => {
      const result1 = getContrastRatio('#FF0000', '#00FF00');
      const result2 = getContrastRatio('#00FF00', '#FF0000');
      expect(result1).toBe(result2);
    });
  });
});

// 运行测试的辅助函数
export function runTests() {
  console.log('Running Color Recommendation Tests...\n');
  
  const testCases = [
    { name: 'Hex to HSL conversion', fn: () => {
      const result = hexToHsl('#FF0000');
      return result.h === 0 && result.s === 100 && result.l === 50;
    }},
    { name: 'HSL to Hex conversion', fn: () => {
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      return result === '#FF0000';
    }},
    { name: 'Complementary color', fn: () => {
      const result = getComplementaryColor('#FF0000');
      return result === '#00FFFF';
    }},
    { name: 'Analogous colors', fn: () => {
      const result = getAnalogousColors('#FF0000');
      return result.length === 2;
    }},
    { name: 'Triadic colors', fn: () => {
      const result = getTriadicColors('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      return hsl1.h === 120 && hsl2.h === 240;
    }},
    { name: 'Recommend colors', fn: () => {
      const result = recommendColors('#FF0000', 'complementary');
      return result.length === 1 && result[0] === '#00FFFF';
    }},
  ];
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach(({ name, fn }) => {
    try {
      const result = fn();
      if (result) {
        console.log(`✓ ${name}`);
        passed++;
      } else {
        console.log(`✗ ${name} - Assertion failed`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ ${name} - Error: ${error}`);
      failed++;
    }
  });
  
  console.log(`\n${passed} passed, ${failed} failed`);
  return { passed, failed };
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined') {
  // 浏览器环境
  (window as any).runColorTests = runTests;
}
