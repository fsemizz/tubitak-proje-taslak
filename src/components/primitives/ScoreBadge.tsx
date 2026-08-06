import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  starRating: 1 | 2 | 3;
  totalPoints: number;
  maxPoints: number;
  size?: 'sm' | 'md';
}

export function ScoreBadge({ starRating, totalPoints, maxPoints, size = 'md' }: ScoreBadgeProps) {
  const starSize = size === 'sm' ? 'size-4' : 'size-6';
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <Star
            key={n}
            className={cn(starSize, n <= starRating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted')}
          />
        ))}
      </div>
      <span className={cn('font-display font-extrabold text-foreground', size === 'sm' ? 'text-sm' : 'text-2xl')}>
        {totalPoints} / {maxPoints} puan
      </span>
    </div>
  );
}
