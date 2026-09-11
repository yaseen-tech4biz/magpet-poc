import { create } from 'zustand';
import { calcResinHeld, calcContribLost, calcRejBill, formatInr } from '../utils/calculations';

export const useSettingsStore = create((set, get) => ({
  // Money Assumptions
  tph: 5.5,          // tonnes per hour (rPET line rate)
  resin: 85,         // ₹/kg (indicative market price)
  resinBenchmarkPrice: 85,
  contrib: 12,       // ₹/kg (contribution margin)
  outT: 3120,        // MTD output tonnes
  rejPct: 2.1,       // MTD rejection percentage

  // Preform weight per machine (Spec Section 6.5 & 10)
  machineWeights: {
    'H-01': 19.5,
    'H-02': 19.5,
    'H-03': 26.0,
    'H-04': 26.0,
    'S-01': 680.0,
    'S-02': 680.0
  },

  setTph: (val) => set({ tph: Math.max(0, Number(val) || 0) }),
  setResin: (val) => set({ resin: Math.max(0, Number(val) || 0), resinBenchmarkPrice: Math.max(0, Number(val) || 0) }),
  setResinBenchmarkPrice: (val) => set({ resin: Math.max(0, Number(val) || 0), resinBenchmarkPrice: Math.max(0, Number(val) || 0) }),
  setContrib: (val) => set({ contrib: Math.max(0, Number(val) || 0) }),
  setOutT: (val) => set({ outT: Math.max(0, Number(val) || 0) }),
  setRejPct: (val) => set({ rejPct: Math.max(0, Number(val) || 0) }),
  setMachineWeight: (machineId, weight) =>
    set((state) => ({
      machineWeights: {
        ...state.machineWeights,
        [machineId]: Math.max(0.1, Number(weight) || 0)
      }
    })),

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
}));

