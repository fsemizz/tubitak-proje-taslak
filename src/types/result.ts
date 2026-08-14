export interface LevelAttemptResult {
  levelId: string;
  levelOrder: number;
  isCorrect: boolean;
  attempts: number;
  pointsEarned: number;
  timeSpentSeconds: number;
  hintUsed?: boolean;
}

export type LevelAttemptResultInput = LevelAttemptResult;

export interface HouseNavLevelMetric {
  levelId: string;
  levelLabel: string;
  starRating: 1 | 2 | 3;
  accuracyTier: 1 | 2 | 3;
  pathEfficiencyPct: number;
  stepsUsed: number;
  shortestPathLength: number;
  unnecessarySteps: number;
  commandEntriesUsed: number;
  enterErrors: number;
  orderErrors: number;
  attempts: number;
  hintUsed: boolean;
  planningSuccess: boolean;
  /** How many separate "Çalıştır" runs it took to finish the level (fewer, bigger batches = better planning). */
  totalRunsUsed: number;
  /** taskSteps.length / totalRunsUsed, capped at 100 - rewards planning a whole step in one batch over trial-and-error single moves. */
  planningEfficiencyPct: number;
  timeSpentSeconds: number;
}

export interface HouseNavMetrics {
  levels: HouseNavLevelMetric[];
  kbsScore: number;
  dogrulukPct: number;
  planlamaPct: number;
  yonBulmaPct: number;
  problemCozmePct: number;
  gorevTamamlamaPct: number;
  /** Which Okula Hazırlık track was played - kept as a plain string union so this shared results
   * type doesn't need to depend on the game's own type module. */
  schoolLevel?: 'anaokulu' | 'ilkokul';
}

export interface GameCompletionSummary {
  id: string;
  studentId: string;
  studentName: string;
  gameId: string;
  gameTitle: string;
  levelResults: LevelAttemptResult[];
  totalPoints: number;
  maxPoints: number;
  starRating: 1 | 2 | 3;
  completedAt: string;
  totalTimeSeconds: number;
  houseNavMetrics?: HouseNavMetrics;
}

export type GameCompletionSummaryInput = Omit<GameCompletionSummary, 'id' | 'completedAt'>;

export interface ResultsFilter {
  gameId?: string;
  studentId?: string;
}

export interface StudentStats {
  studentId: string;
  gamesPlayed: number;
  totalPoints: number;
  averageStars: number;
  lastPlayedAt?: string;
}
