'use client';

import { useState, useMemo } from 'react';
import { ColorWheel } from './ColorWheel';
import { Button } from './ui/button';
import { Palette, Sparkles, Check, RotateCcw } from 'lucide-react';
import { getRecommendedCombinations, type ColorCombination } from '@/lib/colorRecommendation';

interface ColorSelectorProps {
  colors: string[];
  onColorsChange: (colors: string[]) => void;
}

type SelectionMode = 'free' | 'recommended';

export function ColorSelector({ colors, onColorsChange }: ColorSelectorProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [selectedPrimary, setSelectedPrimary] = useState<string>(colors[0] || '#5135FF');

  const recommendedCombinations = useMemo(() => {
    return getRecommendedCombinations(selectedPrimary);
  }, [selectedPrimary]);

  const primaryColor = colors[0] || '#5135FF';
  const secondaryColor = colors[1] || '#FF5828';

  const handlePrimaryColorChange = (color: string) => {
    const newColors = [...colors];
    newColors[0] = color;
    onColorsChange(newColors);
    setSelectedPrimary(color);
  };

  const handleSecondaryColorChange = (color: string) => {
    const newColors = [...colors];
    if (newColors.length < 2) {
      newColors.push(color);
    } else {
      newColors[1] = color;
    }
    onColorsChange(newColors);
  };

  const applyRecommendedCombination = (combination: ColorCombination) => {
    onColorsChange([...combination.colors]);
  };

  const resetColors = () => {
    onColorsChange(['#5135FF', '#FF5828', '#F69CFF', '#FFA50F']);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Color Selector</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetColors}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
      </div>

      <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
        <Button
          variant={mode === 'free' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode('free')}
          className="flex-1"
        >
          <Palette className="w-4 h-4 mr-2" />
          Free Mode
        </Button>
        <Button
          variant={mode === 'recommended' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode('recommended')}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Recommended
        </Button>
      </div>

      {mode === 'free' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <ColorWheel
              color1={primaryColor}
              color2={secondaryColor}
              onColor1Change={handlePrimaryColorChange}
              onColor2Change={handleSecondaryColorChange}
              size={280}
            />
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <div 
              className="h-20 rounded-lg border border-border"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` 
              }}
            />
            <p className="text-xs text-muted-foreground">
              Drag the markers on the color wheel to select your colors
            </p>
          </div>
        </div>
      )}

      {mode === 'recommended' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Choose your primary color</label>
            <div className="flex items-center gap-3">
              <div 
                className="w-16 h-16 rounded-xl border-2 border-primary shadow-lg"
                style={{ backgroundColor: selectedPrimary }}
              />
              <input
                type="color"
                value={selectedPrimary}
                onChange={(e) => {
                  setSelectedPrimary(e.target.value);
                  handlePrimaryColorChange(e.target.value);
                }}
                className="w-12 h-12 p-0 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <span className="text-sm font-mono text-muted-foreground">{selectedPrimary.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Recommended combinations</label>
            <div className="grid grid-cols-1 gap-3">
              {recommendedCombinations.map((combination, index) => {
                const isActive = colors.length >= combination.colors.length && 
                  colors.slice(0, combination.colors.length).every((c, i) => 
                    c.toLowerCase() === combination.colors[i].toLowerCase()
                  );
                
                return (
                  <button
                    key={combination.name}
                    onClick={() => applyRecommendedCombination(combination)}
                    className={`
                      relative overflow-hidden rounded-lg border p-3 text-left transition-all
                      hover:shadow-md hover:-translate-y-0.5
                      ${isActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{combination.name}</span>
                      {isActive && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex h-12 rounded-md overflow-hidden">
                      {combination.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {combination.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="bg-muted/20 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Current Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-1 bg-background rounded-lg p-1 pr-2 border border-border">
              <div 
                className="w-8 h-8 rounded-md"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono text-muted-foreground">{color.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
