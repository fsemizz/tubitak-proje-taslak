import type { LevelAttemptResult } from '@/types/result';

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
