import { create } from 'zustand';

const INITIAL_JOBS = [
  {
    id: 'BD-LIVE-1',
    a: 'WL-01',
    w: 'Friction washer 2 abnormal vibration',
    cause: 'Bearing failure',
    p: 'P2',
    state: 'IN_PROGRESS',
    tech: 'Prakash',
    shift: 'C',
    sinceHoursAgo: 2.4,
    startTime: Date.now() - 2.4 * 3600 * 1000,
    live: true,
    crit: true,
    holdReason: ''
  },
  {
    id: 'BD-LIVE-2',
    a: 'CV-03',
    w: 'Conveyor belt edge damage',
    cause: 'Belt damage',
    p: 'P3',
    state: 'ASSIGNED',
    tech: 'Bikash',
    shift: 'A',
    sinceHoursAgo: 3.8,
    startTime: Date.now() - 3.8 * 3600 * 1000,
    live: false,
    crit: false,
    holdReason: ''
  },
  {
    id: 'BD-LIVE-3',
    a: 'DR-02',
    w: 'Outlet temperature sensor erratic',
    cause: 'Sensor fault',
    p: 'P3',
    state: 'WAITING_SPARE',
    tech: 'Joydeep',
    shift: 'B',
    sinceHoursAgo: 4.5,
    startTime: Date.now() - 4.5 * 3600 * 1000,
    live: false,
    crit: false,
    holdReason: 'Awaiting PT100 RTD sensor replacement from store'
  }
];

const RESOLVED_JOBS = [
  {
    id: 'BD-RES-1',
    a: 'EX-02',
    w: 'Gearbox bearing over temperature',
    cause: '02:40 to 06:10 · Sunil (Shift C)',
    p: 'P1',
    state: 'RESOLVED_TODAY',
    tech: 'Sunil',
    shift: 'C',
    hrs: 3.5,
    isResolved: true
  }
];

export const useBreakdownStore = create((set, get) => ({
  activeJobs: INITIAL_JOBS,
  resolvedJobs: RESOLVED_JOBS,
  currentTime: Date.now(),

  tickTime: () => set({ currentTime: Date.now() }),

  // Move job state: ASSIGNED -> IN_PROGRESS -> WAITING_SPARE -> RESOLVED_TODAY
  updateJobState: (jobId, newState, holdReason = '') => {
    const { activeJobs, resolvedJobs, currentTime } = get();
    const jobIndex = activeJobs.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) return;
    const job = { ...activeJobs[jobIndex] };

    if (newState === 'RESOLVED_TODAY') {
      // Calculate final downtime duration in hours
      const finalHrs = Math.max(0.5, Number(((currentTime - job.startTime) / 3600000).toFixed(1)));
      const resolvedJob = {
        ...job,
        state: 'RESOLVED_TODAY',
        hrs: finalHrs,
        isResolved: true,
        cause: `Reported to Resolved in ${finalHrs} h · ${job.tech || 'Team'}`
      };

      set({
        activeJobs: activeJobs.filter((j) => j.id !== jobId),
        resolvedJobs: [resolvedJob, ...resolvedJobs]
      });
    } else {
      job.state = newState;
      if (holdReason) job.holdReason = holdReason;
      if (newState === 'IN_PROGRESS') job.holdReason = '';

      const updated = [...activeJobs];
      updated[jobIndex] = job;
      set({ activeJobs: updated });
    }
  },

  // Report New Breakdown in Real Time
  reportBreakdown: (assetCode, workDesc, cause, priority = 'P2', technician = 'Ramesh') => {
    const newJob = {
      id: 'BD-' + Math.floor(1000 + Math.random() * 9000),
      a: assetCode,
      w: workDesc,
      cause: cause,
      p: priority,
      state: 'ASSIGNED',
      tech: technician,
      sinceHoursAgo: 0.1,
      startTime: Date.now(),
      live: true,
      crit: priority === 'P1' || assetCode.startsWith('EX') || assetCode.startsWith('WL'),
      holdReason: ''
    };

    set({ activeJobs: [newJob, ...get().activeJobs] });
  },

  // Reset to initial demo state
  resetBreakdowns: () => {
    set({
      activeJobs: INITIAL_JOBS,
      resolvedJobs: RESOLVED_JOBS,
      currentTime: Date.now()
    });
  }
}));
