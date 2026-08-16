import { Timer } from 'lucide-react';
import { formatClock } from '@/lib/scoring';
import { cn } from '@/lib/utils';

interface LevelTimerBadgeProps {
  elapsedSeconds: number;
  optimalDurationSeconds?: number;
  className?: string;
}

export function LevelTimerBadge({ elapsedSeconds, optimalDurationSeconds, className }: LevelTimerBadgeProps) {
  const overTarget = optimalDurationSeconds !== undefined && elapsedSeconds > optimalDurationSeconds * 1.5;

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums',
        overTarget ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-border bg-muted/60 text-muted-foreground',
        className,
      )}
      title={optimalDurationSeconds ? `Hedef süre: ${formatClock(optimalDurationSeconds)}` : undefined}
    >
      <Timer className="size-3.5" />
      {formatClock(elapsedSeconds)}
    </span>
  );
}
