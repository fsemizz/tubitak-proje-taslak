export interface LevelAttemptResult {
  levelId: string;
  levelOrder: number;
  isCorrect: boolean;
  attempts: number;
  pointsEarned: number;
  timeSpentSeconds: number;
}

export type LevelAttemptResultInput = LevelAttemptResult;

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
