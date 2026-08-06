import { Check, X } from 'lucide-react';
import type { LevelAttemptResult } from '@/types/result';

interface ScoreBreakdownProps {
  levelResults: LevelAttemptResult[];
}

export function ScoreBreakdown({ levelResults }: ScoreBreakdownProps) {
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
      {levelResults.map((r) => (
        <li key={r.levelId} className="flex items-center justify-between gap-3 bg-card px-4 py-2.5 text-sm">
          <span className="flex items-center gap-2 font-medium text-foreground">
            {r.isCorrect ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <X className="size-4 text-rose-500" />
            )}
            Seviye {r.levelOrder}
          </span>
          <span className="text-muted-foreground">
            {r.attempts} deneme · {r.pointsEarned} puan
          </span>
        </li>
      ))}
    </ul>
  );
}
