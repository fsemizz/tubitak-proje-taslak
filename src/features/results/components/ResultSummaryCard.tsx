import { Card, CardContent } from '@/components/ui/card';
import { CelebrationBurst } from '@/components/primitives/CelebrationBurst';
import { ConfettiBurst } from '@/components/primitives/ConfettiBurst';
import { ScoreBadge } from '@/components/primitives/ScoreBadge';
import { ScoreBreakdown } from './ScoreBreakdown';
import { formatDuration } from '@/lib/scoring';
import type { GameCompletionSummary } from '@/types/result';

interface ResultSummaryCardProps {
  summary: GameCompletionSummary;
}

const CONGRATS_MESSAGE: Record<1 | 2 | 3, string> = {
  1: 'Tamamladın! Biraz daha pratikle çok daha iyi olacaksın.',
  2: 'Harika iş çıkardın!',
  3: 'Muhteşem! Tüm yıldızları topladın!',
};

export function ResultSummaryCard({ summary }: ResultSummaryCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <ConfettiBurst trigger={1} />
      <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
        <CelebrationBurst />
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">{summary.gameTitle}</h1>
          <p className="mt-1 text-muted-foreground">{CONGRATS_MESSAGE[summary.starRating]}</p>
        </div>

        <ScoreBadge starRating={summary.starRating} totalPoints={summary.totalPoints} maxPoints={summary.maxPoints} />
        <p className="text-xs font-medium text-muted-foreground">
          Toplam süre: {formatDuration(summary.totalTimeSeconds)}
        </p>

        <div className="w-full pt-2 text-left">
          <ScoreBreakdown levelResults={summary.levelResults} />
        </div>
      </CardContent>
    </Card>
  );
}
