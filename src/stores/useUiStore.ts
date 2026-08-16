import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;
  toggleSfx: () => void;
  toggleMusic: () => void;
  toggleReducedMotion: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sfxEnabled: true,
      musicEnabled: true,
      reducedMotion: false,
      toggleSfx: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: 'codekids.v1.ui',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
