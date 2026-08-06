import type { HouseNavLevelMetric, HouseNavMetrics } from '@/types/result';

export function accuracyTierFromAttempts(attempts: number): 1 | 2 | 3 {
  if (attempts <= 1) return 1;
  if (attempts === 2) return 2;
  return 3;
}

export function calculateLevelStars(
  accuracyTier: 1 | 2 | 3,
  pathEfficiencyPct: number,
  hintUsed: boolean,
): 1 | 2 | 3 {
  let stars: 1 | 2 | 3;
  if (accuracyTier === 1 && pathEfficiencyPct >= 90) {
    stars = 3;
  } else if (accuracyTier <= 2 && pathEfficiencyPct >= 70) {
    stars = 2;
  } else {
    stars = 1;
  }
  if (hintUsed) {
    stars = Math.max(1, stars - 1) as 1 | 2 | 3;
  }
  return stars;
}

export function computeHouseNavMetrics(
  levelMetrics: HouseNavLevelMetric[],
  totalLevelsInGame: number,
): HouseNavMetrics {
  const n = levelMetrics.length || 1;

  const avgPathEfficiency = levelMetrics.reduce((sum, l) => sum + l.pathEfficiencyPct, 0) / n;
  const correctCommandRatio =
    (levelMetrics.filter((l) => l.enterErrors === 0 && l.orderErrors === 0).length / n) * 100;
  const avgUnnecessaryStepsPct =
    levelMetrics.reduce((sum, l) => {
      if (l.shortestPathLength <= 0) return sum;
      return sum + Math.min(100, (l.unnecessarySteps / l.shortestPathLength) * 100);
    }, 0) / n;
  const firstTrySuccessPct = (levelMetrics.filter((l) => l.attempts === 1).length / n) * 100;
  const noHintPct = (levelMetrics.filter((l) => !l.hintUsed).length / n) * 100;

  const kbsScore = Math.round(
    0.3 * avgPathEfficiency +
      0.25 * correctCommandRatio +
      0.2 * (100 - avgUnnecessaryStepsPct) +
      0.15 * firstTrySuccessPct +
      0.1 * noHintPct,
  );

  const dogrulukPct = Math.round(
    levelMetrics.reduce((sum, l) => {
      const tierScore = l.accuracyTier === 1 ? 100 : l.accuracyTier === 2 ? 70 : 40;
      return sum + tierScore;
    }, 0) / n,
  );
  const planlamaPct = Math.round((levelMetrics.filter((l) => l.planningSuccess).length / n) * 100);
  const yonBulmaPct = Math.round(avgPathEfficiency);
  const problemCozmePct = Math.round(
    levelMetrics.reduce((sum, l) => {
      const errorCount = l.orderErrors + l.enterErrors;
      return sum + Math.max(0, 100 - errorCount * 25);
    }, 0) / n,
  );
  const gorevTamamlamaPct = Math.round((levelMetrics.length / totalLevelsInGame) * 100);

  return {
    levels: levelMetrics,
    kbsScore,
    dogrulukPct,
    planlamaPct,
    yonBulmaPct,
    problemCozmePct,
    gorevTamamlamaPct,
  };
}
