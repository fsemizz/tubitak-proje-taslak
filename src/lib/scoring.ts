import type { LevelAttemptResult } from '@/types/result';

/**
 * Per-level star rating for the simple quiz-style games: correct solve + closeness to the target
 * duration + few attempts/no hint. Running over the target time never fails the level - it can only
 * pull a would-be 3-star run down to 2, same spirit as calculateLevelStars in okula-hazirlik/scoring.ts.
 */
export function calculateSimpleLevelStars(
  attempts: number,
  hintUsed?: boolean,
  timeSpentSeconds?: number,
  optimalDurationSeconds?: number,
): 1 | 2 | 3 {
  let stars: 1 | 2 | 3 = attempts <= 1 ? 3 : attempts === 2 ? 2 : 1;

  if (stars === 3 && optimalDurationSeconds && timeSpentSeconds !== undefined) {
    const withinTarget = timeSpentSeconds <= optimalDurationSeconds * 1.5;
    if (!withinTarget) stars = 2;
  }

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

/** Compact running-clock format for a live in-level timer badge, e.g. 7 -> "0:07", 83 -> "1:23". */
export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
