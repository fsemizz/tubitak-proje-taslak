import type { GameCategory } from './game';

export interface GameResult {
  id: string;
  studentId: string;
  studentName: string;
  gameId: GameCategory;
  gameTitle: string;
  levelNumber: number;
  score: number; // 0-100
  stars: number; // 1-3
  completionTimeSeconds: number;
  attemptsCount: number;
  completedAt: string;
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  totalStars: number;
  lastActive: string;
}
