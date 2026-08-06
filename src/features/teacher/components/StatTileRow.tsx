import { StatTile } from '@/components/primitives/StatTile';
import { STAT_ICON } from '@/lib/constants';
import type { GameCompletionSummary } from '@/types/result';

interface StatTileRowProps {
  results: GameCompletionSummary[];
}

export function StatTileRow({ results }: StatTileRowProps) {
  const uniqueStudents = new Set(results.map((r) => r.studentId)).size;
  const totalPlays = results.length;
  const avgStars = totalPlays === 0 ? 0 : results.reduce((sum, r) => sum + r.starRating, 0) / totalPlays;
  const totalMinutes = Math.round(results.reduce((sum, r) => sum + r.totalTimeSeconds, 0) / 60);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile icon={STAT_ICON.students} label="Öğrenci" value={uniqueStudents} />
      <StatTile icon={STAT_ICON.trophy} label="Oynanan Oyun" value={totalPlays} />
      <StatTile icon={STAT_ICON.chart} label="Ortalama Yıldız" value={avgStars.toFixed(1)} />
      <StatTile icon={STAT_ICON.time} label="Toplam Süre (dk)" value={totalMinutes} />
    </div>
  );
}
