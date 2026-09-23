import React from 'react';
import { motion } from 'framer-motion';

export const StackedBarChart = ({
  weeks = [],
  defectColors = ['#dc2626', '#0284c7', '#d97706', '#9333ea', '#2563eb'],
  width = 640,
  height = 230
}) => {
  if (!weeks || weeks.length === 0) return null;

  const totals = weeks.map((w) => w.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals, 1);

  const step = (width - 70) / weeks.length;
  const barWidth = step * 0.6;
  const baseY = height - 28;

  // Grid steps
  const gridSteps = 3;
  const gridLines = [];
  for (let s = 0; s <= gridSteps; s++) {
    const v = (max * s) / gridSteps;
    const y = baseY - ((height - 48) * s) / gridSteps;
    gridLines.push({ y, val: Math.round(v) });
  }

  return (
    <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid lines */}
      {gridLines.map((gl, i) => (
        <g key={i}>
          <line
            x1="48"
            x2={width - 12}
            y1={gl.y}
            y2={gl.y}
            strokeWidth="1"
            className="stroke-slate-200 dark:stroke-slate-800 transition-colors"
          />
          <text
            x="42"
            y={gl.y + 3.5}
            textAnchor="end"
            className="font-mono text-[10px] fill-slate-400 dark:fill-slate-500 transition-colors"
          >
            {gl.val}
          </text>
        </g>
      ))}

      {/* Animated Stacked Bars */}
      {weeks.map((wk, i) => {
        let currentY = baseY;
        const x = 50 + i * step + (step - barWidth) / 2;

        return (
          <g key={i}>
            {wk.map((val, dIdx) => {
              const segHeight = ((height - 48) * val) / max;
              currentY -= segHeight;
              const targetY = currentY;

              return (
                <motion.rect
                  key={dIdx}
                  x={x}
                  width={barWidth}
                  fill={defectColors[dIdx]}
                  opacity="0.92"
                  rx="1.5"
                  initial={{ height: 0, y: baseY }}
                  animate={{ height: segHeight, y: targetY }}
                  transition={{
                    duration: 0.85,
                    delay: i * 0.08 + dIdx * 0.03,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              );
            })}

            {/* Week label */}
            <motion.text
              initial={{ opacity: 0, y: height }}
              animate={{ opacity: 1, y: height - 10 }}
              transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
              x={x + barWidth / 2}
              textAnchor="middle"
              className="font-mono text-[11px] font-medium fill-slate-500 dark:fill-slate-400 transition-colors"
            >
              W{i + 1}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
};
export default StackedBarChart;
