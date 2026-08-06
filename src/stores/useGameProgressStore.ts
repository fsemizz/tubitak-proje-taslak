import { create } from 'zustand';
import type { LevelAttemptResultInput } from '@/types/result';

type PlayStatus = 'idle' | 'playing' | 'completed';

interface GameProgressState {
  activeGameId: string | null;
  activeLevelIndex: number;
  levelResults: LevelAttemptResultInput[];
  status: PlayStatus;
  startGame: (gameId: string) => void;
  recordLevelResult: (result: LevelAttemptResultInput) => void;
  goToNextLevel: () => void;
  finishGame: () => void;
  resetProgress: () => void;
}

export const useGameProgressStore = create<GameProgressState>()((set) => ({
  activeGameId: null,
  activeLevelIndex: 0,
  levelResults: [],
  status: 'idle',

  startGame: (gameId) =>
    set({ activeGameId: gameId, activeLevelIndex: 0, levelResults: [], status: 'playing' }),

  recordLevelResult: (result) =>
    set((state) => ({ levelResults: [...state.levelResults, result] })),

  goToNextLevel: () => set((state) => ({ activeLevelIndex: state.activeLevelIndex + 1 })),

  finishGame: () => set({ status: 'completed' }),

  resetProgress: () =>
    set({ activeGameId: null, activeLevelIndex: 0, levelResults: [], status: 'idle' }),
}));
