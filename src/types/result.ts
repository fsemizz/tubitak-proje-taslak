export interface LevelAttemptResult {
  levelId: string;
  levelOrder: number;
  isCorrect: boolean;
  attempts: number;
  pointsEarned: number;
  timeSpentSeconds: number;
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
