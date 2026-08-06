import { cn } from '@/lib/utils';
import type { GameCompletionSummary } from '@/types/result';

interface StudentScoreChartProps {
  results: GameCompletionSummary[];
}

export function StudentScoreChart({ results }: StudentScoreChartProps) {
  if (results.length === 0) return null;
  const sorted = [...results].sort((a, b) => a.completedAt.localeCompare(b.completedAt));

  return (
    <div className="flex items-end gap-2 overflow-x-auto pb-2">
      {sorted.map((r) => {
        const pct = Math.max(8, Math.round((r.totalPoints / r.maxPoints) * 100));
        return (
          <div key={r.id} className="flex w-14 shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-28 w-full items-end rounded-md bg-muted">
              <div
                className={cn('w-full rounded-md bg-gradient-to-t from-indigo-500 to-violet-400')}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="truncate text-[10px] font-medium text-muted-foreground" title={r.gameTitle}>
              {r.gameTitle.split(' ')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
