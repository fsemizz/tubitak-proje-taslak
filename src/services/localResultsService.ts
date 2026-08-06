import type { IResultsService } from './types';
import type {
  GameCompletionSummary,
  GameCompletionSummaryInput,
  ResultsFilter,
  StudentStats,
} from '@/types/result';
import { readJson, writeJson } from './storage/localStorageClient';
import { STORAGE_KEYS } from './storage/keys';
import { createId } from '@/lib/id';
import { seedResults } from '@/data/seed/seedResults';

function loadAll(): GameCompletionSummary[] {
  if (!readJson<boolean>(STORAGE_KEYS.seeded, false)) {
    writeJson(STORAGE_KEYS.results, seedResults);
    writeJson(STORAGE_KEYS.seeded, true);
    return seedResults;
  }
  return readJson<GameCompletionSummary[]>(STORAGE_KEYS.results, []);
}

export class LocalResultsService implements IResultsService {
  async submitGameCompletion(input: GameCompletionSummaryInput): Promise<GameCompletionSummary> {
    const all = loadAll();
    const summary: GameCompletionSummary = {
      ...input,
      id: createId(),
      completedAt: new Date().toISOString(),
    };
    const next = [...all, summary];
    writeJson(STORAGE_KEYS.results, next);
    return summary;
  }

  async listResultsByStudent(studentId: string): Promise<GameCompletionSummary[]> {
    return loadAll()
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }

  async listAllResults(filter?: ResultsFilter): Promise<GameCompletionSummary[]> {
    let results = loadAll();
    if (filter?.gameId) results = results.filter((r) => r.gameId === filter.gameId);
    if (filter?.studentId) results = results.filter((r) => r.studentId === filter.studentId);
    return results.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }

  async getStudentStats(studentId: string): Promise<StudentStats> {
    const results = await this.listResultsByStudent(studentId);
    if (results.length === 0) {
      return { studentId, gamesPlayed: 0, totalPoints: 0, averageStars: 0 };
    }
    const totalPoints = results.reduce((sum, r) => sum + r.totalPoints, 0);
    const averageStars = results.reduce((sum, r) => sum + r.starRating, 0) / results.length;
    return {
      studentId,
      gamesPlayed: results.length,
      totalPoints,
      averageStars: Math.round(averageStars * 10) / 10,
      lastPlayedAt: results[0].completedAt,
    };
  }
}
