import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDemoStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      isMinimized: false,
      activeTab: 'guide', // 'guide' | 'scenarios'
      moduleFilter: 'ALL', // 'ALL' | 'A' | 'B' | 'SHORT'
      currentStepIdx: 0,
      completedStepIds: [1],
      isAutoPlay: false,
      countdown: 8,

      setIsOpen: (isOpen) => set({ isOpen }),
      setIsMinimized: (isMinimized) => set({ isMinimized }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setModuleFilter: (moduleFilter) => set({ moduleFilter }),
      
      setCurrentStepIdx: (idx) => {
        const completed = new Set(get().completedStepIds || []);
        completed.add(idx + 1);
        set({ 
          currentStepIdx: Math.max(0, idx), 
          completedStepIds: Array.from(completed),
          countdown: 8 
        });
      },

      setCountdown: (countdown) => set({ countdown }),
      setIsAutoPlay: (isAutoPlay) => set({ isAutoPlay }),

      // Navigate forward without losing data
      nextStep: (totalSteps) => {
        const { currentStepIdx, completedStepIds } = get();
        if (currentStepIdx < totalSteps - 1) {
          const nextIdx = currentStepIdx + 1;
          const completed = new Set(completedStepIds || []);
          completed.add(currentStepIdx + 1);
          completed.add(nextIdx + 1);
          set({
            currentStepIdx: nextIdx,
            completedStepIds: Array.from(completed),
            countdown: 8
          });
          return nextIdx;
        }
        return currentStepIdx;
      },

      // Navigate backward without losing data
      prevStep: () => {
        const { currentStepIdx } = get();
        if (currentStepIdx > 0) {
          const prevIdx = currentStepIdx - 1;
          set({
            currentStepIdx: prevIdx,
            countdown: 8
          });
          return prevIdx;
        }
        return currentStepIdx;
      },

      // Jump to a specific step
      jumpToStep: (idx) => {
        const completed = new Set(get().completedStepIds || []);
        completed.add(idx + 1);
        set({
          currentStepIdx: Math.max(0, idx),
          completedStepIds: Array.from(completed),
          countdown: 8
        });
      },

      // Explicit Reset: ONLY resets flow to Step 1 when user clicks Start Over / Restart
      restartGuide: () => {
        set({
          currentStepIdx: 0,
          completedStepIds: [1],
          isAutoPlay: false,
          countdown: 8
        });
      }
    }),
    {
      name: 'magpet_guided_flow_state_v1',
      partialize: (state) => ({
        isOpen: state.isOpen,
        isMinimized: state.isMinimized,
        activeTab: state.activeTab,
        moduleFilter: state.moduleFilter,
        currentStepIdx: state.currentStepIdx,
        completedStepIds: state.completedStepIds
      })
    }
  )
);
