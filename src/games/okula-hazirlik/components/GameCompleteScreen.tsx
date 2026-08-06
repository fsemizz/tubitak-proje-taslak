import { Link } from 'react-router-dom';
import { Home, Star, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CelebrationBurst } from '@/components/primitives/CelebrationBurst';
import { SkillRadarChart } from '@/components/primitives/SkillRadarChart';
import { formatDuration } from '@/lib/scoring';
import { ROUTE_PATHS } from '@/app/routePaths';
import { cn } from '@/lib/utils';
import type { HouseNavMetrics } from '@/types/result';

interface GameCompleteScreenProps {
  metrics: HouseNavMetrics;
  totalTimeSeconds: number;
  onReplay: () => void;
}

export function GameCompleteScreen({ metrics, totalTimeSeconds, onReplay }: GameCompleteScreenProps) {
  const totalStars = metrics.levels.reduce((sum, l) => sum + l.starRating, 0);
  const maxStars = metrics.levels.length * 3;
  const totalCommands = metrics.levels.reduce((sum, l) => sum + l.commandEntriesUsed, 0);
  const successPct = Math.round((totalStars / maxStars) * 100);

  const axes = [
    { label: 'Doğruluk', shortLabel: 'Doğruluk', value: metrics.dogrulukPct },
    { label: 'Planlama', shortLabel: 'Planlama', value: metrics.planlamaPct },
    { label: 'Yön Bulma', shortLabel: 'Yön Bulma', value: metrics.yonBulmaPct },
    { label: 'Problem Çözme', shortLabel: 'Problem Çözme', value: metrics.problemCozmePct },
    { label: 'Görev Tamamlama', shortLabel: 'Görev Tamamlama', value: metrics.gorevTamamlamaPct },
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-6">
      <CelebrationBurst />
      <div className="text-center">
        <h1 className="font-display text-2xl font-extrabold text-foreground">
          Okula Hazırlık Görevi Tamamlandı!
        </h1>
        <p className="mt-1 text-muted-foreground">Harika iş çıkardın, okula gitmeye hazırsın.</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Toplam Yıldız" value={`${totalStars}/${maxStars}`} />
        <MiniStat label="Toplam Süre" value={formatDuration(totalTimeSeconds)} />
        <MiniStat label="Toplam Komut" value={`${totalCommands}`} />
        <MiniStat label="Başarı" value={`%${successPct}`} />
      </div>

      <Card className="w-full border-teal-200 bg-teal-50/50">
        <CardContent className="flex flex-col items-center gap-3 py-6">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-teal-600" />
            <h2 className="font-display text-lg font-bold text-teal-900">
              Kodlama Becerisi Skoru (KBS): {metrics.kbsScore}/100
            </h2>
          </div>
          <SkillRadarChart axes={axes} strokeColor="#0d9488" fillColor="rgba(13, 148, 136, 0.2)" />
        </CardContent>
      </Card>

      <div className="w-full">
        <h3 className="mb-2 text-sm font-bold text-foreground">Seviye Bazlı Yıldızlar</h3>
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
          {metrics.levels.map((l) => (
            <li key={l.levelId} className="flex items-center justify-between bg-card px-4 py-2.5 text-sm">
              <span className="font-medium text-foreground">{l.levelLabel}</span>
              <span className="flex gap-0.5">
                {[1, 2, 3].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      'size-4',
                      n <= l.starRating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted',
                    )}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={onReplay}>
          <RotateCcw className="size-4" /> Tekrar Oyna
        </Button>
        <Button className="flex-1" render={<Link to={ROUTE_PATHS.home} />} nativeButton={false}>
          <Home className="size-4" /> Oyun Kataloğuna Dön
        </Button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 text-center">
      <p className="font-display text-lg font-extrabold text-foreground">{value}</p>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
