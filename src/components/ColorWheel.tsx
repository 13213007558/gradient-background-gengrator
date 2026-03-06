'use client';

import { useState, useCallback, useMemo } from 'react';
import chroma from 'chroma-js';

interface ColorWheelProps {
  color1: string;
  color2: string;
  onColor1Change: (color: string) => void;
  onColor2Change: (color: string) => void;
  size?: number;
}

export function ColorWheel({ 
  color1, 
  color2, 
  onColor1Change, 
  onColor2Change, 
  size = 280 
}: ColorWheelProps) {
  const [activePicker, setActivePicker] = useState<'color1' | 'color2' | null>(null);
  const padding = 30;
  const svgSize = size + padding * 2;
  const centerRadius = size * 0.15;
  const wheelRadius = size * 0.5 - 25;

  const color1Pos = useMemo(() => colorToPosition(color1, wheelRadius, size, padding), [color1, wheelRadius, size, padding]);
  const color2Pos = useMemo(() => colorToPosition(color2, wheelRadius, size, padding), [color2, wheelRadius, size, padding]);

  function colorToPosition(color: string, radius: number, size: number, padding: number) {
    const hsl = chroma(color).hsl();
    const hue = hsl[0] || 0;
    const saturation = hsl[1];
    
    const angle = (hue - 90) * (Math.PI / 180);
    const r = radius * saturation;
    const x = size / 2 + r * Math.cos(angle) + padding;
    const y = size / 2 + r * Math.sin(angle) + padding;
    
    return { x, y };
  }

  function positionToColor(x: number, y: number, radius: number, size: number, padding: number) {
    const centerX = size / 2 + padding;
    const centerY = size / 2 + padding;
    
    let dx = x - centerX;
    let dy = y - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const saturation = Math.min(1, distance / radius);
    
    let angle = Math.atan2(dy, dx);
    let hue = (angle * (180 / Math.PI) + 90 + 360) % 360;
    
    return chroma(hue, saturation, 0.6, 'hsl').hex();
  }

  function getLabelPosition(pos: { x: number; y: number }, size: number, padding: number) {
    const centerX = size / 2 + padding;
    const centerY = size / 2 + padding;
    const dx = pos.x - centerX;
    const dy = pos.y - centerY;
    const angle = Math.atan2(dy, dx);
    
    let labelY = pos.y - 24;
    let labelX = pos.x;
    
    if (dy < -size * 0.3) {
      labelY = pos.y + 32;
    }
    
    return { x: labelX, y: labelY };
  }

  const handleMouseDown = useCallback((picker: 'color1' | 'color2') => {
    setActivePicker(picker);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!activePicker) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * svgSize;
    const y = ((clientY - rect.top) / rect.height) * svgSize;
    
    const newColor = positionToColor(x, y, wheelRadius, size, padding);
    
    if (activePicker === 'color1') {
      onColor1Change(newColor);
    } else {
      onColor2Change(newColor);
    }
  }, [activePicker, size, svgSize, padding, wheelRadius, onColor1Change, onColor2Change]);

  const handleMouseUp = useCallback(() => {
    setActivePicker(null);
  }, []);

  const createWheelGradient = () => {
    const stops = [];
    for (let i = 0; i <= 360; i += 30) {
      const color = chroma(i, 1, 0.6, 'hsl').hex();
      stops.push(`${color} ${i}deg`);
    }
    return `conic-gradient(${stops.join(', ')})`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative"
        style={{ width: svgSize, height: svgSize }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="cursor-crosshair"
        >
          <defs>
            <radialGradient id="saturationGradient">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="wheelMask">
              <circle cx={size / 2 + padding} cy={size / 2 + padding} r={wheelRadius} fill="white" />
            </mask>
          </defs>
          
          <foreignObject 
            x={padding}
            y={padding}
            width={size} 
            height={size} 
            mask="url(#wheelMask)"
          >
            <div 
              style={{ 
                width: size, 
                height: size, 
                background: createWheelGradient(),
                borderRadius: '50%'
              }} 
            />
          </foreignObject>
          
          <circle 
            cx={size / 2 + padding} 
            cy={size / 2 + padding} 
            r={wheelRadius} 
            fill="url(#saturationGradient)" 
            mask="url(#wheelMask)"
          />
          
          <circle 
            cx={size / 2 + padding} 
            cy={size / 2 + padding} 
            r={centerRadius} 
            fill="#f5f5f5" 
            stroke="#e5e5e5" 
            strokeWidth="2"
          />

          <line
            x1={color1Pos.x}
            y1={color1Pos.y}
            x2={color2Pos.x}
            y2={color2Pos.y}
            stroke="#333"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />

          {(() => {
            const label1Pos = getLabelPosition(color1Pos, size, padding);
            const label2Pos = getLabelPosition(color2Pos, size, padding);
            
            return (
              <>
                <g
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown('color1'); }}
                  onTouchStart={(e) => { e.stopPropagation(); handleMouseDown('color1'); }}
                  style={{ cursor: 'grab' }}
                >
                  <circle
                    cx={color1Pos.x}
                    cy={color1Pos.y}
                    r={18}
                    fill="white"
                    stroke={color1}
                    strokeWidth="4"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                  />
                  <circle
                    cx={color1Pos.x}
                    cy={color1Pos.y}
                    r={10}
                    fill={color1}
                  />
                  <text
                    x={label1Pos.x}
                    y={label1Pos.y}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#333"
                  >
                    1
                  </text>
                </g>

                <g
                  onMouseDown={(e) => { e.stopPropagation(); handleMouseDown('color2'); }}
                  onTouchStart={(e) => { e.stopPropagation(); handleMouseDown('color2'); }}
                  style={{ cursor: 'grab' }}
                >
                  <circle
                    cx={color2Pos.x}
                    cy={color2Pos.y}
                    r={18}
                    fill="white"
                    stroke={color2}
                    strokeWidth="4"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                  />
                  <circle
                    cx={color2Pos.x}
                    cy={color2Pos.y}
                    r={10}
                    fill={color2}
                  />
                  <text
                    x={label2Pos.x}
                    y={label2Pos.y}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#333"
                  >
                    2
                  </text>
                </g>
              </>
            );
          })()}
        </svg>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: color1 }}
          />
          <input
            type="color"
            value={color1}
            onChange={(e) => onColor1Change(e.target.value)}
            className="w-10 h-10 p-0 rounded-lg cursor-pointer border-2 border-gray-300"
          />
          <span className="text-sm font-mono text-gray-600">{color1.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: color2 }}
          />
          <input
            type="color"
            value={color2}
            onChange={(e) => onColor2Change(e.target.value)}
            className="w-10 h-10 p-0 rounded-lg cursor-pointer border-2 border-gray-300"
          />
          <span className="text-sm font-mono text-gray-600">{color2.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
