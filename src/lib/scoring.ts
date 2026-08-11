import type { LevelAttemptResult } from '@/types/result';

/** Per-level star rating for the simple quiz-style games: fewer attempts and no hint use earns more stars. */
export function calculateSimpleLevelStars(attempts: number, hintUsed?: boolean): 1 | 2 | 3 {
  let stars: 1 | 2 | 3 = attempts <= 1 ? 3 : attempts === 2 ? 2 : 1;
  if (hintUsed) stars = Math.max(1, stars - 1) as 1 | 2 | 3;
  return stars;
}

export function calculateStarRating(totalPoints: number, maxPoints: number): 1 | 2 | 3 {
  if (maxPoints <= 0) return 1;
  const ratio = totalPoints / maxPoints;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

export function sumPoints(results: LevelAttemptResult[]): number {
  return results.reduce((sum, r) => sum + r.pointsEarned, 0);
}

export function sumTime(results: LevelAttemptResult[]): number {
  return results.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} sn`;
  return `${minutes} dk ${seconds} sn`;
}
