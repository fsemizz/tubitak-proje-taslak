import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Lightbulb, Footprints, Route, ListChecks, RotateCw, Timer, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CelebrationBurst } from '@/components/primitives/CelebrationBurst';
import { formatDuration } from '@/lib/scoring';
import { cn } from '@/lib/utils';
import type { HouseNavLevelMetric } from '@/types/result';

const ACCURACY_LABEL: Record<1 | 2 | 3, string> = {
  1: 'İlk denemede',
  2: 'İkinci denemede',
  3: 'Üç ve üzeri denemede',
};

interface LevelCompleteScreenProps {
  metric: HouseNavLevelMetric;
  optimalDurationSeconds?: number;
  isLastLevel: boolean;
  onNext: () => void;
  onPlayLevelComplete?: () => void;
}

export function LevelCompleteScreen({
  metric,
  optimalDurationSeconds,
  isLastLevel,
  onNext,
  onPlayLevelComplete,
}: LevelCompleteScreenProps) {
  useEffect(() => {
    onPlayLevelComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats: { label: string; value: string; icon: typeof Star }[] = [
    {
      label: 'Süre',
      value: optimalDurationSeconds
        ? `${formatDuration(metric.timeSpentSeconds)} (hedef: ${formatDuration(optimalDurationSeconds)})`
        : formatDuration(metric.timeSpentSeconds),
      icon: Timer,
    },
    { label: 'Doğruluk', value: ACCURACY_LABEL[metric.accuracyTier], icon: ListChecks },
    { label: 'En Kısa Yol', value: `${metric.shortestPathLength} adım`, icon: Route },
    { label: 'Senin Toplam Yolun', value: `${metric.stepsUsed} adım`, icon: Footprints },
    { label: 'Yol Verimliliği', value: `%${Math.round(metric.pathEfficiencyPct)}`, icon: RotateCw },
    { label: 'Planlama Verimliliği', value: `%${Math.round(metric.planningEfficiencyPct)}`, icon: Layers },
    { label: 'Kullanılan Komut', value: `${metric.commandEntriesUsed}`, icon: ListChecks },
    { label: 'Gereksiz Adım', value: `${metric.unnecessarySteps}`, icon: Footprints },
    { label: 'Çalıştırma Sayısı', value: `${metric.totalRunsUsed}`, icon: Timer },
    { label: 'Deneme Sayısı', value: `${metric.attempts}`, icon: Timer },
    { label: 'İpucu', value: metric.hintUsed ? 'Kullandı' : 'Kullanmadı', icon: Lightbulb },
  ];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 py-6">
      <CelebrationBurst />
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-foreground">Tebrikler! 🎉</h2>
        <p className="mt-1 text-muted-foreground">{metric.levelLabel} görevini tamamladın.</p>
      </div>

      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <motion.span
            key={n}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: n * 0.12, type: 'spring', stiffness: 300, damping: 14 }}
          >
            <Star
              className={cn('size-9', n <= metric.starRating ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'fill-muted text-muted')}
            />
          </motion.span>
        ))}
      </div>

      <Card className="w-full border-teal-200 bg-teal-50/40">
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4 py-5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-start gap-2">
              <s.icon className="mt-0.5 size-4 shrink-0 text-teal-600" />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-muted-foreground">{s.label}</span>
                <span className="text-sm font-bold text-foreground">{s.value}</span>
              </div>
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
