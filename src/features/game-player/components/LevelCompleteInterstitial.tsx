import { ArrowRight, Clock3, Lightbulb, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CelebrationBurst } from '@/components/primitives/CelebrationBurst';
import { ConfettiBurst } from '@/components/primitives/ConfettiBurst';
import { formatDuration } from '@/lib/scoring';
import { cn } from '@/lib/utils';

interface LevelCompleteInterstitialProps {
  levelTitle: string;
  starRating: 1 | 2 | 3;
  pointsEarned: number;
  attempts: number;
  hintUsed?: boolean;
  timeSpentSeconds?: number;
  optimalDurationSeconds?: number;
  isLastLevel: boolean;
  onNext: () => void;
}

/** Shown after every level in every game: a quick "how did you do" beat before moving on. */
export function LevelCompleteInterstitial({
  levelTitle,
  starRating,
  pointsEarned,
  attempts,
  hintUsed,
  timeSpentSeconds,
  optimalDurationSeconds,
  isLastLevel,
  onNext,
}: LevelCompleteInterstitialProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-5 py-10">
      <ConfettiBurst trigger={1} />
      <CelebrationBurst />
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Tebrikler! 🎉</h2>
        <p className="mt-1 text-muted-foreground">{levelTitle} tamamlandı.</p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <Star
            key={n}
            className={cn('size-9', n <= starRating ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'fill-muted text-muted')}
          />
        ))}
      </div>

      <Card className="w-full">
        <CardContent className="flex flex-col gap-3 py-5">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 shrink-0 text-amber-500" />
            <span className="text-sm font-bold text-foreground">{pointsEarned} puan kazandın</span>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            {attempts === 1 ? 'İlk denemede başardın!' : `${attempts}. denemede başardın.`}
          </div>
          {timeSpentSeconds !== undefined && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Clock3 className="size-3.5 shrink-0" />
              Süren: {formatDuration(timeSpentSeconds)}
              {optimalDurationSeconds !== undefined && ` (hedef: ${formatDuration(optimalDurationSeconds)})`}
            </div>
          )}
          {hintUsed && (
            <div className="flex items-center gap-2 text-xs font-medium text-amber-600">
              <Lightbulb className="size-3.5 shrink-0" /> İpucu kullandın
            </div>
          )}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" onClick={onNext}>
        {isLastLevel ? 'Karneyi Gör' : 'Sonraki Seviye'} <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
