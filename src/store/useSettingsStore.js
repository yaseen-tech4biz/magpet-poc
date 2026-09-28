import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calcResinHeld, calcContribLost, calcRejBill, formatInr } from '../utils/calculations';

const DEFAULT_WEIGHTS = {
  'H-01': 19.5,
  'H-02': 19.5,
  'H-03': 26.0,
  'H-04': 26.0,
  'S-01': 680.0,
  'S-02': 680.0
};

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Money Assumptions
      tph: 5.5,          // tonnes per hour (rPET line rate)
      resin: 85,         // ₹/kg (indicative market price)
      resinBenchmarkPrice: 85,
      contrib: 12,       // ₹/kg (contribution margin)
      outT: 3120,        // MTD output tonnes
      rejPct: 2.1,       // MTD rejection percentage

      // Preform weight per machine (Spec Section 6.5 & 10)
      machineWeights: DEFAULT_WEIGHTS,

      setTph: (val) => set({ tph: Math.max(0, Number(val) || 0) }),
      setResin: (val) => set({ resin: Math.max(0, Number(val) || 0), resinBenchmarkPrice: Math.max(0, Number(val) || 0) }),
      setResinBenchmarkPrice: (val) => set({ resin: Math.max(0, Number(val) || 0), resinBenchmarkPrice: Math.max(0, Number(val) || 0) }),
      setContrib: (val) => set({ contrib: Math.max(0, Number(val) || 0) }),
      setOutT: (val) => set({ outT: Math.max(0, Number(val) || 0) }),
      setRejPct: (val) => set({ rejPct: Math.max(0, Number(val) || 0) }),
      setMachineWeight: (machineId, weight) => {
        const num = typeof weight === 'number' ? weight : parseFloat(weight);
        const safeVal = isNaN(num) ? weight : Math.max(0.1, num);
        set((state) => ({
          machineWeights: {
            ...state.machineWeights,
            [machineId]: safeVal
          }
        }));
      },

      resetSettings: () => set({
        tph: 5.5,
        resin: 85,
        resinBenchmarkPrice: 85,
        contrib: 12,
        outT: 3120,
        rejPct: 2.1,
        machineWeights: DEFAULT_WEIGHTS
      }),

      // Reactive dynamic calculations
      getResinHeld: (hrs) => {
        const { tph, resin } = get();
        return calcResinHeld(hrs, tph, resin);
      },

      getContribLost: (hrs) => {
        const { tph, contrib } = get();
        return calcContribLost(hrs, tph, contrib);
      },

      getRejBill: () => {
        const { outT, rejPct, resin } = get();
        return calcRejBill(outT, rejPct, resin);
      },

      formatResinHeld: (hrs) => {
        return formatInr(get().getResinHeld(hrs));
      },

      formatContribLost: (hrs) => {
        return formatInr(get().getContribLost(hrs));
      },

      formatRejBill: () => {
        return formatInr(get().getRejBill());
      },

      formatRejBillAnnual: () => {
        return formatInr(get().getRejBill() * 12);
      }
    }),
    {
      name: 'magpet_settings_storage_v1',
      partialize: (state) => ({
        tph: state.tph,
        resin: state.resin,
        resinBenchmarkPrice: state.resinBenchmarkPrice,
        contrib: state.contrib,
        outT: state.outT,
        rejPct: state.rejPct,
        machineWeights: state.machineWeights
      })
    }
  )
);
