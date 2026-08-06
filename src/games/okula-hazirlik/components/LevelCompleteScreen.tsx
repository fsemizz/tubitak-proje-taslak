import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CelebrationBurst } from '@/components/primitives/CelebrationBurst';
import { cn } from '@/lib/utils';
import type { HouseNavLevelMetric } from '@/types/result';

const ACCURACY_LABEL: Record<1 | 2 | 3, string> = {
  1: 'İlk denemede',
  2: 'İkinci denemede',
  3: 'Üç ve üzeri denemede',
};

interface LevelCompleteScreenProps {
  metric: HouseNavLevelMetric;
  isLastLevel: boolean;
  onNext: () => void;
}

export function LevelCompleteScreen({ metric, isLastLevel, onNext }: LevelCompleteScreenProps) {
  const stats: { label: string; value: string }[] = [
    { label: 'Doğruluk', value: ACCURACY_LABEL[metric.accuracyTier] },
    { label: 'En Kısa Yol', value: `${metric.shortestPathLength} adım` },
    { label: 'Senin Yolun', value: `${metric.stepsUsed} adım` },
    { label: 'Yol Verimliliği', value: `%${Math.round(metric.pathEfficiencyPct)}` },
    { label: 'Kullanılan Komut', value: `${metric.commandEntriesUsed}` },
    { label: 'Gereksiz Adım', value: `${metric.unnecessarySteps}` },
    { label: 'Deneme Sayısı', value: `${metric.attempts}` },
    { label: 'İpucu', value: metric.hintUsed ? 'Kullandı' : 'Kullanmadı' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 py-6">
      <CelebrationBurst />
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Tebrikler!</h2>
        <p className="mt-1 text-muted-foreground">{metric.levelLabel} görevini tamamladın.</p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <Star
            key={n}
            className={cn('size-8', n <= metric.starRating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted')}
          />
        ))}
      </div>

      <Card className="w-full">
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 py-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-[11px] font-semibold text-muted-foreground">{s.label}</span>
              <span className="text-sm font-bold text-foreground">{s.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" onClick={onNext}>
        {isLastLevel ? 'Karneyi Gör' : 'Sonraki Seviye'} <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
