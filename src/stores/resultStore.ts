import { create } from 'zustand';
import type { GameResult, StudentStats } from '../types/result';
import { apiService } from '../services/api';

interface ResultState {
  results: GameResult[];
  studentStats: StudentStats[];
  isLoading: boolean;

  // Actions
  fetchResults: () => Promise<void>;
  addResult: (result: Omit<GameResult, 'id' | 'completedAt'>) => Promise<GameResult>;
}

export const useResultStore = create<ResultState>((set) => ({
  results: [],
  studentStats: [],
  isLoading: false,

  fetchResults: async () => {
    set({ isLoading: true });
    try {
      const results = await apiService.getResults();
      const studentStats = await apiService.getStudentStats();
      set({ results, studentStats, isLoading: false });
    } catch (e) {
      console.error('Failed to fetch results', e);
      set({ isLoading: false });
    }
  },

  addResult: async (resultData) => {
    const saved = await apiService.saveGameResult(resultData);
    const results = await apiService.getResults();
    const studentStats = await apiService.getStudentStats();
    set({ results, studentStats });
    return saved;
  },
}));
