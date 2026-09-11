import React from 'react';
import { motion } from 'framer-motion';

export const LineChart = ({
  data = [],
  width = 640,
  height = 210,
  color = '#d97706',
  band = null, // e.g. [1.5, 1.8]
  dots = false,
  unit = '',
  dp = 1,
  xl = null, // ['60 d ago', 'today']
  minVal = null,
  maxVal = null
}) => {
  if (!data || data.length === 0) return null;

  const min = minVal ?? Math.min(...data);
  const max = maxVal ?? Math.max(...data);
  const range = max - min || 1;

  const px = (i) => 38 + (i * (width - 54)) / (data.length - 1);
  const py = (v) => 16 + (height - 44) * (1 - (v - min) / range);

  // Convert points to SVG path syntax for Framer Motion pathLength animation
  const pathD = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`)
    .join(' ');

  const areaD = `${pathD} L ${px(data.length - 1).toFixed(1)} ${(height - 28).toFixed(1)} L ${px(0).toFixed(1)} ${(height - 28).toFixed(1)} Z`;

  // Grid steps
  const steps = 3;
  const gridLines = [];
  for (let s = 0; s <= steps; s++) {
    const v = min + (range * s) / steps;
    const y = py(v);
    gridLines.push({ y, val: v.toFixed(dp) });
  }

  const gradientId = `line-grad-${color.replace('#', '')}-${width}`;

  return (
    <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0.00" />
        </linearGradient>
      </defs>

      {/* Target tolerance band */}
      {band && (
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.8 }}
          x="38"
          y={py(band[1])}
          width={width - 54}
          height={Math.max(2, py(band[0]) - py(band[1]))}
          fill="#10b981"
        />
      )}

      {/* Grid lines and y-axis labels */}
      {gridLines.map((gl, i) => (
        <g key={i}>
          <line
            x1="38"
            x2={width - 16}
            y1={gl.y}
            y2={gl.y}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <text
            x="32"
            y={gl.y + 3.5}
            textAnchor="end"
            className="font-mono text-[10px] fill-slate-400"
          >
            {gl.val}{unit}
          </text>
        </g>
      ))}

      {/* Gradient Area Fill under the curve */}
      <motion.path
        d={areaD}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />

      {/* Animated Main Trend Line from 0 to full length */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1]
        }}
      />

      {/* Sequential animated dots */}
      {dots && data.map((v, i) => (
        <motion.circle
          key={i}
          cx={px(i)}
          cy={py(v)}
          r="2.5"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.2 + (i / data.length) * 0.9,
            duration: 0.25,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* X-axis labels */}
      {xl && (
        <>
          <text x="38" y={height - 4} className="font-mono text-[10px] fill-slate-400">
            {xl[0]}
          </text>
          <text x={width - 16} y={height - 4} textAnchor="end" className="font-mono text-[10px] fill-slate-400">
            {xl[1]}
          </text>
        </>
      )}
    </svg>
  );
};
