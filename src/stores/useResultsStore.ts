import { create } from 'zustand';
import type { GameCompletionSummary } from '@/types/result';
import { resultsService } from '@/services/serviceProvider';

interface ResultsState {
  allResults: GameCompletionSummary[];
  isLoading: boolean;
  hasLoaded: boolean;
  hydrate: () => Promise<void>;
}

export const useResultsStore = create<ResultsState>()((set, get) => ({
  allResults: [],
  isLoading: false,
  hasLoaded: false,

  hydrate: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    const allResults = await resultsService.listAllResults();
    set({ allResults, isLoading: false, hasLoaded: true });
  },
}));
