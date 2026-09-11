import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const DialGauge = ({ pct = 62, size = 120 }) => {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference * (1 - pct / 100);

  const strokeColor = pct >= 80 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';

  // Animate count-up number smoothly from 0 to pct
  const springValue = useSpring(0, {
    stiffness: 45,
    damping: 15,
    duration: 1.4
  });

  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    springValue.set(pct);
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayPct(Math.round(latest));
    });
    return () => unsubscribe();
  }, [pct, springValue]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 110 110" className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="9"
        />
        {/* Animated active ring with Framer Motion */}
        <motion.circle
          cx="55"
          cy="55"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1]
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-2xl font-bold tracking-tight"
          style={{ color: strokeColor }}
        >
          {displayPct}%
        </motion.span>
      </div>
    </div>
  );
};
