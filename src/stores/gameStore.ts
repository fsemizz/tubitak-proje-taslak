import { create } from 'zustand';
import type { GameCategory } from '../types/game';

interface GameState {
  activeGameId: GameCategory | null;
  currentLevelNumber: number;
  score: number;
  stars: number;
  attemptsCount: number;
  elapsedSeconds: number;
  isTimerRunning: boolean;
  isCompleted: boolean;

  // Actions
  startLevel: (gameId: GameCategory, levelNumber: number) => void;
  incrementAttempts: () => void;
  completeLevel: (stars: number, score: number) => void;
  resetGame: () => void;
  tickTimer: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeGameId: null,
  currentLevelNumber: 1,
  score: 0,
  stars: 0,
  attemptsCount: 1,
  elapsedSeconds: 0,
  isTimerRunning: false,
  isCompleted: false,

  startLevel: (gameId: GameCategory, levelNumber: number) => {
    set({
      activeGameId: gameId,
      currentLevelNumber: levelNumber,
      score: 0,
      stars: 0,
      attemptsCount: 1,
      elapsedSeconds: 0,
      isTimerRunning: true,
      isCompleted: false,
    });
  },

  incrementAttempts: () => {
    set((state) => ({ attemptsCount: state.attemptsCount + 1 }));
  },

  completeLevel: (stars: number, score: number) => {
    set({
      stars,
      score,
      isTimerRunning: false,
      isCompleted: true,
    });
  },

  resetGame: () => {
    set({
      activeGameId: null,
      currentLevelNumber: 1,
      score: 0,
      stars: 0,
      attemptsCount: 1,
      elapsedSeconds: 0,
      isTimerRunning: false,
      isCompleted: false,
    });
  },

  tickTimer: () => {
    set((state) => {
      if (!state.isTimerRunning) return state;
      return { elapsedSeconds: state.elapsedSeconds + 1 };
    });
  },
}));
