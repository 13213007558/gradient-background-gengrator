'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  type ColorHarmonyType
} from '@/lib/services/colorRecommendation';
import { CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // Test 1: Hex to HSL conversion
    try {
      const result = hexToHsl('#FF0000');
      const passed = result.h === 0 && result.s === 100 && result.l === 50;
      testResults.push({
        name: 'Hex to HSL conversion (Red)',
        passed,
        message: passed ? `h:${result.h}, s:${result.s}, l:${result.l}` : `Expected h:0, s:100, l:50, got h:${result.h}, s:${result.s}, l:${result.l}`
      });
    } catch (error) {
      testResults.push({ name: 'Hex to HSL conversion (Red)', passed: false, message: String(error) });
    }

    // Test 2: HSL to Hex conversion
    try {
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      const passed = result === '#FF0000';
      testResults.push({
        name: 'HSL to Hex conversion (Red)',
        passed,
        message: passed ? result : `Expected #FF0000, got ${result}`
      });
    } catch (error) {
      testResults.push({ name: 'HSL to Hex conversion (Red)', passed: false, message: String(error) });
    }

    // Test 3: Round-trip conversion
    try {
      const originalHex = '#5135FF';
      const hsl = hexToHsl(originalHex);
      const convertedHex = hslToHex(hsl);
      const passed = convertedHex === originalHex;
      testResults.push({
        name: 'Round-trip conversion',
        passed,
        message: passed ? `${originalHex} → HSL → ${convertedHex}` : `Expected ${originalHex}, got ${convertedHex}`
      });
    } catch (error) {
      testResults.push({ name: 'Round-trip conversion', passed: false, message: String(error) });
    }

    // Test 4: Complementary color
    try {
      const result = getComplementaryColor('#FF0000');
      const passed = result === '#00FFFF';
      testResults.push({
        name: 'Complementary color (Red → Cyan)',
        passed,
        message: passed ? result : `Expected #00FFFF, got ${result}`
      });
    } catch (error) {
      testResults.push({ name: 'Complementary color (Red → Cyan)', passed: false, message: String(error) });
    }

    // Test 5: Analogous colors
    try {
      const result = getAnalogousColors('#FF0000');
      const passed = result.length === 2;
      testResults.push({
        name: 'Analogous colors count',
        passed,
        message: passed ? `Generated ${result.length} colors: ${result.join(', ')}` : `Expected 2 colors, got ${result.length}`
      });
    } catch (error) {
      testResults.push({ name: 'Analogous colors count', passed: false, message: String(error) });
    }

    // Test 6: Triadic colors
    try {
      const result = getTriadicColors('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      const passed = hsl1.h === 120 && hsl2.h === 240;
      testResults.push({
        name: 'Triadic colors (Red base)',
        passed,
        message: passed ? `120°: ${result[0]}, 240°: ${result[1]}` : `Expected hues 120 and 240, got ${hsl1.h} and ${hsl2.h}`
      });
    } catch (error) {
      testResults.push({ name: 'Triadic colors (Red base)', passed: false, message: String(error) });
    }

    // Test 7: Split complementary colors
    try {
      const result = getSplitComplementaryColors('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      const passed = hsl1.h === 150 && hsl2.h === 210;
      testResults.push({
        name: 'Split complementary colors (Red base)',
        passed,
        message: passed ? `150°: ${result[0]}, 210°: ${result[1]}` : `Expected hues 150 and 210, got ${hsl1.h} and ${hsl2.h}`
      });
    } catch (error) {
      testResults.push({ name: 'Split complementary colors (Red base)', passed: false, message: String(error) });
    }

    // Test 8: Square colors
    try {
      const result = getSquareColors('#FF0000');
      const hsls = result.map(hexToHsl);
      const passed = hsls[0].h === 90 && hsls[1].h === 180 && hsls[2].h === 270;
      testResults.push({
        name: 'Square colors (Red base)',
        passed,
        message: passed ? `90°: ${result[0]}, 180°: ${result[1]}, 270°: ${result[2]}` : `Expected hues 90, 180, 270, got ${hsls.map(h => h.h).join(', ')}`
      });
    } catch (error) {
      testResults.push({ name: 'Square colors (Red base)', passed: false, message: String(error) });
    }

    // Test 9: Monochromatic colors
    try {
      const result = getMonochromaticColors('#FF0000');
      const baseHsl = hexToHsl('#FF0000');
      const hsl1 = hexToHsl(result[0]);
      const hsl2 = hexToHsl(result[1]);
      const passed = hsl1.h === baseHsl.h && hsl2.h === baseHsl.h;
      testResults.push({
        name: 'Monochromatic colors (same hue)',
        passed,
        message: passed ? `Same hue ${baseHsl.h}°, different lightness` : `Expected same hue ${baseHsl.h}, got ${hsl1.h} and ${hsl2.h}`
      });
    } catch (error) {
      testResults.push({ name: 'Monochromatic colors (same hue)', passed: false, message: String(error) });
    }

    // Test 10: Recommend colors function
    try {
      const result = recommendColors('#FF0000', 'complementary');
      const passed = result.length === 1 && result[0] === '#00FFFF';
      testResults.push({
        name: 'Recommend colors (complementary)',
        passed,
        message: passed ? result[0] : `Expected [#00FFFF], got [${result.join(', ')}]`
      });
    } catch (error) {
      testResults.push({ name: 'Recommend colors (complementary)', passed: false, message: String(error) });
    }

    // Test 11: Get all recommendations
    try {
      const result = getAllRecommendations('#FF0000');
      const passed = result.length === 7;
      testResults.push({
        name: 'Get all recommendations count',
        passed,
        message: passed ? `Generated ${result.length} harmony recommendations` : `Expected 7 recommendations, got ${result.length}`
      });
    } catch (error) {
      testResults.push({ name: 'Get all recommendations count', passed: false, message: String(error) });
    }

    // Test 12: Contrast ratio
    try {
      const result = getContrastRatio('#000000', '#FFFFFF');
      const passed = result > 20;
      testResults.push({
        name: 'Contrast ratio (Black vs White)',
        passed,
        message: passed ? `Ratio: ${result.toFixed(2)}:1` : `Expected ratio > 20, got ${result.toFixed(2)}`
      });
    } catch (error) {
      testResults.push({ name: 'Contrast ratio (Black vs White)', passed: false, message: String(error) });
    }

    // Test 13: Green complementary
    try {
      const result = getComplementaryColor('#00FF00');
      const passed = result === '#FF00FF';
      testResults.push({
        name: 'Complementary color (Green → Magenta)',
        passed,
        message: passed ? result : `Expected #FF00FF, got ${result}`
      });
    } catch (error) {
      testResults.push({ name: 'Complementary color (Green → Magenta)', passed: false, message: String(error) });
    }

    // Test 14: Blue complementary
    try {
      const result = getComplementaryColor('#0000FF');
      const passed = result === '#FFFF00';
      testResults.push({
        name: 'Complementary color (Blue → Yellow)',
        passed,
        message: passed ? result : `Expected #FFFF00, got ${result}`
      });
    } catch (error) {
      testResults.push({ name: 'Complementary color (Blue → Yellow)', passed: false, message: String(error) });
    }

    setResults(testResults);
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">色彩推荐算法测试</h1>
          <p className="text-muted-foreground">测试色彩理论算法的正确性和准确性</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>测试控制</span>
              <div className="flex gap-2">
                <Button 
                  onClick={runTests} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isRunning ? '运行中...' : '运行测试'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearResults}
                  disabled={results.length === 0}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  清除结果
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 && (
              <div className="flex items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">通过: {passedCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium">失败: {failedCount}</span>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  总计: {results.length} 项测试
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>点击"运行测试"开始测试色彩推荐算法</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      result.passed ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{result.name}</div>
                      <div className={`text-xs mt-1 ${result.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {result.message}
                      </div>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded ${
                      result.passed 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {result.passed ? 'PASS' : 'FAIL'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 色彩推荐演示 */}
        <Card>
          <CardHeader>
            <CardTitle>色彩推荐演示</CardTitle>
          </CardHeader>
          <CardContent>
            <ColorDemo />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ColorDemo() {
  const [baseColor, setBaseColor] = useState('#5135FF');
  const harmonies: { type: ColorHarmonyType; label: string }[] = [
    { type: 'complementary', label: '互补色' },
    { type: 'analogous', label: '类似色' },
    { type: 'triadic', label: '三角色' },
    { type: 'splitComplementary', label: '分裂互补' },
    { type: 'tetradic', label: '四角色' },
    { type: 'square', label: '方形' },
    { type: 'monochromatic', label: '单色' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">基础颜色:</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer"
          />
          <span className="font-mono text-sm">{baseColor}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {harmonies.map(({ type, label }) => {
          const recommended = recommendColors(baseColor, type);
          return (
            <div key={type} className="p-4 border rounded-lg">
              <div className="font-medium mb-2">{label}</div>
              <div className="flex gap-2">
                <div 
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: baseColor }}
                  title="基础色"
                />
                {recommended.map((color, i) => (
                  <div 
                    key={i}
                    className="w-12 h-12 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground font-mono">
                {recommended.join(', ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
