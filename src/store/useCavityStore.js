import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cavityWeightsData from '../data/cavityWeights.json';
import machinesData from '../data/machines.json';
import { useSettingsStore } from './useSettingsStore';

const getCavitiesForMachine = (machineCode, customTarget) => {
  const machineCavities = cavityWeightsData[machineCode] || {};
  return Object.keys(machineCavities)
    .sort((a, b) => Number(a) - Number(b))
    .map((num) => {
      const item = machineCavities[num];
      const dev = item.deviation;
      const target = typeof customTarget === 'number' && customTarget > 0 ? customTarget : item.target;
      return {
        cavityNumber: Number(num),
        deviation: Number(dev.toFixed(2)),
        target: target,
        currentWeight: Number((target + dev).toFixed(2))
      };
    });
};

export const useCavityStore = create(
  persist(
    (set, get) => ({
      selectedMachine: 'H-03',
      selectedCavity: 41,
      machines: machinesData,
      cavities: getCavitiesForMachine('H-03'),

      setSelectedMachine: (machineCode) => {
        const validMachine = machinesData.find((m) => m.code === machineCode) ? machineCode : 'H-03';
        const defaultCavity = validMachine === 'H-03' ? 41 : 1;
        const target = useSettingsStore.getState()?.machineWeights?.[validMachine];
        set({
          selectedMachine: validMachine,
          selectedCavity: defaultCavity,
          cavities: getCavitiesForMachine(validMachine, target)
        });
      },

      setSelectedCavity: (cavityNumber) => {
        set({ selectedCavity: Number(cavityNumber) });
      },

      refreshCavities: (machineCode, customTarget) => {
        const machine = machineCode || get().selectedMachine;
        const target = customTarget !== undefined ? customTarget : useSettingsStore.getState()?.machineWeights?.[machine];
        set({ cavities: getCavitiesForMachine(machine, target) });
      },

      getCurrentMachineInfo: () => {
        const { selectedMachine } = get();
        const mach = machinesData.find((m) => m.code === selectedMachine) || machinesData[2]; // default H-03
        const customWeight = useSettingsStore.getState()?.machineWeights?.[selectedMachine];
        return {
          ...mach,
          productWeight: customWeight !== undefined ? Number(customWeight) : mach.productWeight
        };
      },

      getCurrentDrift: () => {
        const { selectedMachine, selectedCavity } = get();
        const cavityEntry = cavityWeightsData[selectedMachine]?.[selectedCavity] || cavityWeightsData['H-03']?.['41'];
        if (!cavityEntry || !cavityEntry.history) {
          return [];
        }

        const customTarget = useSettingsStore.getState()?.machineWeights?.[selectedMachine] || cavityEntry.target;
        const baseTarget = cavityEntry.target || customTarget;
        const targetOffset = customTarget - baseTarget;

        const history = cavityEntry.history;
        // Group 63 shift records into 21 daily averages (3 shifts/day)
        const points = [];
        for (let i = 0; i < history.length; i += 3) {
          const chunk = history.slice(i, i + 3);
          const avg = chunk.reduce((sum, h) => sum + (h.weight + targetOffset), 0) / chunk.length;
          const dayIndex = Math.floor(i / 3) + 1;
          points.push({
            day: dayIndex,
            date: chunk[0]?.date || `Day ${dayIndex}`,
            label: dayIndex === 1 ? '21 d ago' : dayIndex === 21 ? 'today' : `D${dayIndex}`,
            weight: Number(avg.toFixed(3)),
            target: customTarget
          });
        }
        return points;
      },

      getCavityStats: () => {
        const { cavities } = get();
        let nominal = 0;
        let warning = 0;
        let critical = 0;

        cavities.forEach((c) => {
          const absDev = Math.abs(c.deviation);
          if (absDev <= 0.15) {
            nominal++;
          } else if (absDev <= 0.25) {
            warning++;
          } else {
            critical++;
          }
        });

        return {
          total: cavities.length,
          nominal,
          warning,
          critical
        };
      }
    }),
    {
      name: 'magpet_cavity_storage_v1',
      partialize: (state) => ({
        selectedMachine: state.selectedMachine,
        selectedCavity: state.selectedCavity
      })
    }
  )
);
