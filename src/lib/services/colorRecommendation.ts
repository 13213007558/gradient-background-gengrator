/**
 * 色彩推荐服务 - 基于色彩理论算法
 * 支持多种配色方案：互补色、类似色、三角色、分裂互补色、四角色等
 */

export type ColorHarmonyType = 
  | 'complementary'   // 互补色
  | 'analogous'       // 类似色
  | 'triadic'         // 三角色
  | 'splitComplementary' // 分裂互补色
  | 'tetradic'        // 四角色（矩形）
  | 'square'          // 方形
  | 'monochromatic';  // 单色

export interface ColorRecommendation {
  primary: string;
  secondary: string;
  harmony: ColorHarmonyType;
  description: string;
}

// HSL 颜色接口
export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/**
 * 将十六进制颜色转换为 HSL
 */
export function hexToHsl(hex: string): HSLColor {
  // 移除 # 前缀
  hex = hex.replace(/^#/, '');
  
  // 解析 RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * 将 HSL 转换为十六进制颜色
 */
export function hslToHex(hsl: HSLColor): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 确保色相值在 0-360 范围内
 */
function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

/**
 * 获取互补色（色轮上相对的颜色）
 */
export function getComplementaryColor(hex: string): string {
  const hsl = hexToHsl(hex);
  hsl.h = normalizeHue(hsl.h + 180);
  return hslToHex(hsl);
}

/**
 * 获取类似色（色轮上相邻的颜色）
 */
export function getAnalogousColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: normalizeHue(hsl.h - 30) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 30) })
  ];
}

/**
 * 获取三角色（色轮上等距的三种颜色）
 */
export function getTriadicColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 120) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 240) })
  ];
}

/**
 * 获取分裂互补色
 */
export function getSplitComplementaryColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 150) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 210) })
  ];
}

/**
 * 获取四角色（矩形配色）
 */
export function getTetradicColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 60) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 180) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 240) })
  ];
}

/**
 * 获取方形配色
 */
export function getSquareColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 90) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 180) }),
    hslToHex({ ...hsl, h: normalizeHue(hsl.h + 270) })
  ];
}

/**
 * 获取单色系配色
 */
export function getMonochromaticColors(hex: string): string[] {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, l: Math.max(10, hsl.l - 30) }),
    hslToHex({ ...hsl, l: Math.min(90, hsl.l + 30) })
  ];
}

/**
 * 根据主色和配色方案类型推荐颜色
 */
export function recommendColors(
  primaryColor: string, 
  harmonyType: ColorHarmonyType
): string[] {
  switch (harmonyType) {
    case 'complementary':
      return [getComplementaryColor(primaryColor)];
    case 'analogous':
      return getAnalogousColors(primaryColor);
    case 'triadic':
      return getTriadicColors(primaryColor);
    case 'splitComplementary':
      return getSplitComplementaryColors(primaryColor);
    case 'tetradic':
      return getTetradicColors(primaryColor);
    case 'square':
      return getSquareColors(primaryColor);
    case 'monochromatic':
      return getMonochromaticColors(primaryColor);
    default:
      return [getComplementaryColor(primaryColor)];
  }
}

/**
 * 获取所有配色方案推荐
 */
export function getAllRecommendations(primaryColor: string): ColorRecommendation[] {
  const harmonies: { type: ColorHarmonyType; description: string }[] = [
    { type: 'complementary', description: '高对比度，视觉冲击力强的配色' },
    { type: 'analogous', description: '和谐统一，自然舒适的配色' },
    { type: 'triadic', description: '平衡且富有活力的配色' },
    { type: 'splitComplementary', description: '对比强烈但更加柔和的配色' },
    { type: 'tetradic', description: '丰富多样，适合复杂设计的配色' },
    { type: 'square', description: '均衡稳定，现代感强的配色' },
    { type: 'monochromatic', description: '简约优雅，层次分明的配色' }
  ];
  
  const recommended = recommendColors(primaryColor, 'complementary');
  
  return harmonies.map(h => ({
    primary: primaryColor,
    secondary: recommendColors(primaryColor, h.type)[0],
    harmony: h.type,
    description: h.description
  }));
}

/**
 * 获取最佳推荐（默认使用互补色，对比度适中）
 */
export function getBestRecommendation(primaryColor: string): ColorRecommendation {
  return {
    primary: primaryColor,
    secondary: getComplementaryColor(primaryColor),
    harmony: 'complementary',
    description: '高对比度，视觉冲击力强的配色方案'
  };
}

/**
 * 计算两种颜色之间的对比度
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}
