'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  ColorHarmonyType, 
  recommendColors, 
  getAllRecommendations,
  hexToHsl,
  hslToHex
} from '@/lib/services/colorRecommendation';
import { 
  Wand2, 
  MousePointer2, 
  RefreshCcw,
  Check,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SelectionMode = 'free' | 'recommend';

interface ColorWheelProps {
  primaryColor: string;
  secondaryColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  onColorsChange?: (colors: string[]) => void;
  className?: string;
}

const harmonyOptions: { value: ColorHarmonyType; label: string; description: string }[] = [
  { value: 'complementary', label: '互补色', description: '高对比度，视觉冲击力强' },
  { value: 'analogous', label: '类似色', description: '和谐统一，自然舒适' },
  { value: 'triadic', label: '三角色', description: '平衡且富有活力' },
  { value: 'splitComplementary', label: '分裂互补', description: '对比强烈但更柔和' },
  { value: 'tetradic', label: '四角色', description: '丰富多样，适合复杂设计' },
  { value: 'square', label: '方形', description: '均衡稳定，现代感强' },
  { value: 'monochromatic', label: '单色', description: '简约优雅，层次分明' },
];

export function ColorWheel({
  primaryColor,
  secondaryColor,
  onPrimaryChange,
  onSecondaryChange,
  onColorsChange,
  className
}: ColorWheelProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [harmonyType, setHarmonyType] = useState<ColorHarmonyType>('complementary');
  const [isDragging, setIsDragging] = useState<'primary' | 'secondary' | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const wheelRef = useRef<SVGSVGElement>(null);

  const wheelRadius = 120;
  const centerX = 140;
  const centerY = 140;

  // 当主色或配色方案改变时，更新推荐颜色
  useEffect(() => {
    if (mode === 'recommend') {
      const recommended = recommendColors(primaryColor, harmonyType);
      setRecommendations(recommended);
      // 自动设置第二个颜色为第一个推荐色
      if (recommended.length > 0) {
        onSecondaryChange(recommended[0]);
      }
    }
  }, [primaryColor, harmonyType, mode, onSecondaryChange]);

  // 生成色轮渐变
  const generateWheelGradient = () => {
    const segments = 360;
    const gradientStops: string[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const hue = i;
      const color = `hsl(${hue}, 100%, 50%)`;
      const percentage = (i / segments) * 100;
      gradientStops.push(`${color} ${percentage}%`);
    }
    
    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  // 将颜色转换为色轮上的位置
  const colorToPosition = (color: string) => {
    const hsl = hexToHsl(color);
    const angle = (hsl.h - 90) * (Math.PI / 180); // -90度调整，使0度在顶部
    const distance = (hsl.s / 100) * wheelRadius;
    
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  };

  // 将位置转换为颜色
  const positionToColor = (x: number, y: number): string => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), wheelRadius);
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // 调整角度，使0度在顶部
    
    const saturation = Math.round((distance / wheelRadius) * 100);
    const hsl = { h: Math.round(angle), s: saturation, l: 50 };
    
    return hslToHex(hsl);
  };

  // 处理鼠标/触摸事件
  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current || !isDragging) return;
    
    const rect = wheelRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const color = positionToColor(x, y);
    
    if (isDragging === 'primary') {
      onPrimaryChange(color);
    } else if (isDragging === 'secondary' && mode === 'free') {
      onSecondaryChange(color);
    }
  }, [isDragging, mode, onPrimaryChange, onSecondaryChange]);

  const handleMouseDown = (type: 'primary' | 'secondary') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type);
  };

  const handleTouchStart = (type: 'primary' | 'secondary') => (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(type);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleInteraction]);

  const primaryPos = colorToPosition(primaryColor);
  const secondaryPos = colorToPosition(secondaryColor);

  // 应用推荐的颜色组合
  const applyRecommendation = (colors: string[]) => {
    if (colors.length >= 2) {
      onPrimaryChange(colors[0]);
      onSecondaryChange(colors[1]);
      if (onColorsChange) {
        onColorsChange(colors);
      }
    }
  };

  // 渲染单个选择器
  const renderSelector = (
    type: 'primary' | 'secondary',
    pos: { x: number; y: number },
    color: string,
    isLarge: boolean
  ) => {
    const isBeingDragged = isDragging === type;
    const canDrag = type === 'primary' || (type === 'secondary' && mode === 'free');
    
    return (
      <div
        className={cn(
          "absolute rounded-full flex items-center justify-center",
          canDrag && "cursor-grab active:cursor-grabbing",
          !canDrag && "cursor-default"
        )}
        style={{
          left: pos.x - (isLarge ? 16 : 14),
          top: pos.y - (isLarge ? 16 : 14),
          width: isLarge ? 32 : 28,
          height: isLarge ? 32 : 28,
          zIndex: isBeingDragged ? 100 : (isLarge ? 20 : 15),
          pointerEvents: 'auto',
        }}
        onMouseDown={canDrag ? handleMouseDown(type) : undefined}
        onTouchStart={canDrag ? handleTouchStart(type) : undefined}
      >
        {/* 外圈阴影 */}
        <div 
          className="absolute rounded-full"
          style={{
            width: isLarge ? 32 : 28,
            height: isLarge ? 32 : 28,
            border: '1px solid rgba(0,0,0,0.3)',
          }}
        />
        {/* 白色边框 */}
        <div 
          className="absolute rounded-full"
          style={{
            width: isLarge ? 28 : 24,
            height: isLarge ? 28 : 24,
            backgroundColor: 'white',
          }}
        />
        {/* 颜色圆点 */}
        <div 
          className="absolute rounded-full"
          style={{
            width: isLarge ? 24 : 20,
            height: isLarge ? 24 : 20,
            backgroundColor: color,
          }}
        />
        {/* 拖动时的发光效果 */}
        {isBeingDragged && (
          <div 
            className="absolute rounded-full"
            style={{
              width: isLarge ? 36 : 32,
              height: isLarge ? 36 : 32,
              boxShadow: `0 0 10px 2px ${color}80`,
              zIndex: -1,
            }}
          />
        )}
        {/* 锁定图标（推荐模式下的小圆点） */}
        {type === 'secondary' && mode === 'recommend' && (
          <span className="absolute text-[8px] select-none">🔒</span>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* 模式切换 */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setMode('free')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
            mode === 'free' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MousePointer2 className="w-4 h-4" />
          自由选择
        </button>
        <button
          onClick={() => setMode('recommend')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
            mode === 'recommend' 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wand2 className="w-4 h-4" />
          推荐选择
        </button>
      </div>

      {/* 色轮 */}
      <div className="relative flex justify-center">
        <div 
          className="relative rounded-full"
          style={{
            width: wheelRadius * 2 + 40,
            height: wheelRadius * 2 + 40,
            background: generateWheelGradient(),
            borderRadius: '50%',
            mask: `radial-gradient(transparent ${wheelRadius - 20}px, black ${wheelRadius - 20}px)`,
            WebkitMask: `radial-gradient(transparent ${wheelRadius - 20}px, black ${wheelRadius - 20}px)`,
          }}
        >
          {/* SVG 仅用于捕获事件，不渲染选择器 */}
          <svg
            ref={wheelRef}
            width={wheelRadius * 2 + 40}
            height={wheelRadius * 2 + 40}
            className="absolute inset-0"
            style={{ pointerEvents: 'all', opacity: 0 }}
          />
          
          {/* 使用 div 渲染选择器，确保层级控制 */}
          {renderSelector('secondary', secondaryPos, secondaryColor, false)}
          {renderSelector('primary', primaryPos, primaryColor, true)}
        </div>

        {/* 颜色预览 */}
        <div className="absolute -bottom-2 flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <div 
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-xs text-muted-foreground font-mono">{primaryColor}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <RefreshCcw className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div 
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="text-xs text-muted-foreground font-mono">{secondaryColor}</span>
          </div>
        </div>
      </div>

      {/* 推荐模式选项 */}
      {mode === 'recommend' && (
        <div className="space-y-3 pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>选择配色方案，系统将自动推荐最佳组合</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {harmonyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setHarmonyType(option.value)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  harmonyType === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{option.label}</span>
                  {harmonyType === option.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </button>
            ))}
          </div>

          {/* 推荐预览 */}
          {recommendations.length > 0 && (
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">推荐配色预览</p>
              <div className="flex gap-2">
                <div 
                  className="flex-1 h-12 rounded-lg border"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 自由模式提示 */}
      {mode === 'free' && (
        <div className="pt-8 text-center text-sm text-muted-foreground">
          <p>拖动色轮上的圆点自由选择颜色</p>
          <p className="text-xs mt-1">大圆点为主色，小圆点为次色</p>
        </div>
      )}
    </div>
  );
}

export default ColorWheel;
