import { Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SkillRadarChart } from '@/components/primitives/SkillRadarChart';
import { formatDuration } from '@/lib/scoring';
import { cn } from '@/lib/utils';
import type { HouseNavMetrics } from '@/types/result';

interface HouseNavReportCardProps {
  metrics: HouseNavMetrics;
}

export function HouseNavReportCard({ metrics }: HouseNavReportCardProps) {
  const totalStars = metrics.levels.reduce((sum, l) => sum + l.starRating, 0);
  const maxStars = metrics.levels.length * 3;
  const overallStars = Math.max(1, Math.min(5, Math.round((totalStars / maxStars) * 5)));
  const totalTime = metrics.levels.reduce((sum, l) => sum + l.timeSpentSeconds, 0);
  const avgAttempts = Math.round((metrics.levels.reduce((sum, l) => sum + l.attempts, 0) / metrics.levels.length) * 10) / 10;
  const anyHint = metrics.levels.some((l) => l.hintUsed);

  const axes = [
    { label: 'Doğruluk', shortLabel: 'Doğruluk', value: metrics.dogrulukPct },
    { label: 'Planlama', shortLabel: 'Planlama', value: metrics.planlamaPct },
    { label: 'Yön Bulma', shortLabel: 'Yön Bulma', value: metrics.yonBulmaPct },
    { label: 'Problem Çözme', shortLabel: 'Problem Çözme', value: metrics.problemCozmePct },
    { label: 'Görev Tamamlama', shortLabel: 'Görev Tamamlama', value: metrics.gorevTamamlamaPct },
  ];

  return (
    <Card className="border-teal-200 bg-teal-50/40">
      <CardContent className="flex flex-col gap-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Trophy className="size-5 text-teal-600" />
            <h3 className="font-display text-lg font-extrabold text-teal-900">Okula Hazırlık Karnesi</h3>
            {metrics.schoolLevel && (
              <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                {metrics.schoolLevel === 'ilkokul' ? 'İlkokul' : 'Anaokulu'}
              </span>
            )}
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn('size-5', n <= overallStars ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted')}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <MetricBox label="Kodlama Becerisi Skoru" value={`${metrics.kbsScore}/100`} />
            <MetricBox label="Planlama" value={`%${metrics.planlamaPct}`} />
            <MetricBox label="Yön Bulma" value={`%${metrics.yonBulmaPct}`} />
            <MetricBox label="Deneme Sayısı (ort.)" value={`${avgAttempts}`} />
            <MetricBox label="İpucu Kullanımı" value={anyHint ? 'Kullandı' : 'Kullanmadı'} />
            <MetricBox label="Toplam Süre" value={formatDuration(totalTime)} />
          </div>
          <div className="flex items-center justify-center">
            <SkillRadarChart axes={axes} strokeColor="#0d9488" fillColor="rgba(13, 148, 136, 0.2)" size={240} />
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-teal-900">Seviye Bazlı Yıldızlar</h4>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {metrics.levels.map((l) => (
              <li
                key={l.levelId}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs font-medium text-teal-900"
              >
                <span>{l.levelLabel}</span>
                <span className="flex gap-0.5">
                  {[1, 2, 3].map((n) => (
                    <Star
                      key={n}
                      className={cn('size-3.5', n <= l.starRating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted')}
                    />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2.5">
      <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-extrabold text-foreground">{value}</p>
    </div>
  );
}
