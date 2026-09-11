import React from 'react';
import { motion } from 'framer-motion';
import { useCavityStore } from '../../../store/useCavityStore';

export const CavityGrid = () => {
  const { cavities, selectedCavity, setSelectedCavity, selectedMachine } = useCavityStore();

  const getCellBg = (dev, is4Cavity) => {
    const abs = Math.abs(dev);
    // For 680g jar preforms, scale threshold slightly for tolerance
    const normalLimit = is4Cavity ? 0.5 : 0.15;
    const warningLimit = is4Cavity ? 1.0 : 0.25;

    if (abs <= normalLimit) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200';
    }
    if (abs <= warningLimit) {
      return 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200';
    }
    if (dev > 0) {
      return 'bg-rose-100 text-rose-900 border-rose-400 font-bold hover:bg-rose-200';
    }
    return 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200';
  };

  const is4Cavity = cavities.length <= 4;
  const is96Cavity = cavities.length === 96;

  return (
    <div>
      {/* Dynamic Cavity Matrix Grid */}
      {is4Cavity ? (
        /* ABS Semi-Automatic 4-Cavity Layout (Large Tactile Inspection Tiles) */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
          {cavities.map((c) => {
            const isSelected = selectedCavity === c.cavityNumber;
            return (
              <motion.button
                key={c.cavityNumber}
                onClick={() => setSelectedCavity(c.cavityNumber)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  getCellBg(c.deviation, true)
                } ${
                  isSelected
                    ? 'ring-2 ring-[#143a72] ring-offset-2 shadow-md'
                    : 'shadow-2xs'
                }`}
              >
                <div className="font-mono text-xs text-slate-500 uppercase font-semibold">
                  Jar Cavity
                </div>
                <div className="font-heading font-bold text-2xl text-slate-900 my-1">
                  #{c.cavityNumber}
                </div>
                <div className="font-mono text-xs font-semibold mt-1">
                  {c.currentWeight.toFixed(1)} g
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  dev: {c.deviation >= 0 ? '+' : ''}{c.deviation.toFixed(2)} g
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        /* Husky High-Density Cavity Matrix (96 or 72 cavities) */
        <div className={`grid gap-1.5 sm:gap-2 ${
          is96Cavity ? 'grid-cols-8 sm:grid-cols-12' : 'grid-cols-6 sm:grid-cols-12'
        }`}>
          {cavities.map((c, idx) => {
            const isSelected = selectedCavity === c.cavityNumber;
            const isPlantedStory = selectedMachine === 'H-03' && (c.cavityNumber === 41 || c.cavityNumber === 42);

            return (
              <motion.button
                key={c.cavityNumber}
                onClick={() => setSelectedCavity(c.cavityNumber)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isSelected ? 1.08 : 1, opacity: 1 }}
                transition={{
                  delay: Math.min(idx * 0.005, 0.4),
                  duration: 0.25,
                  ease: 'easeOut'
                }}
                whileHover={{ scale: 1.15, zIndex: 20 }}
                whileTap={{ scale: 0.94 }}
                className={`aspect-square rounded-md flex flex-col items-center justify-center font-mono text-xs border transition-all cursor-pointer relative ${
                  getCellBg(c.deviation, false)
                } ${
                  isSelected
                    ? 'ring-2 ring-[#143a72] ring-offset-1 z-10 shadow-md font-bold'
                    : 'shadow-2xs'
                } ${
                  isPlantedStory ? 'ring-2 ring-rose-500 ring-offset-1 animate-pulse' : ''
                }`}
                title={`Cavity ${c.cavityNumber}: ${c.deviation > 0 ? '+' : ''}${c.deviation}g (Target: ${c.target}g)`}
              >
                <span>{c.cavityNumber}</span>
                {isPlantedStory && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Legend & Summary Footer */}
      <div className="flex flex-wrap gap-4 mt-5 text-xs text-slate-600 items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 inline-block" />
            <span>nominal (within ±{is4Cavity ? '0.50' : '0.15'} g)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 inline-block" />
            <span>warning drift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-400 inline-block" />
            <span className="font-semibold text-rose-700">heavy drift (action needed)</span>
          </div>
        </div>

        <span className="font-mono text-[11px] text-slate-400">
          Showing {cavities.length} cavities
        </span>
      </div>
    </div>
  );
};
