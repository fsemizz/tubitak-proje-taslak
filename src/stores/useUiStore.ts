import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
  soundEnabled: boolean;
  reducedMotion: boolean;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      reducedMotion: false,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: 'codekids.v1.ui',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
