import { cn } from '@/lib/utils';

interface LevelStepperProps {
  total: number;
  currentIndex: number;
}

export function LevelStepper({ total, currentIndex }: LevelStepperProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-2 rounded-full transition-all',
            i < currentIndex && 'w-4 bg-emerald-500',
            i === currentIndex && 'w-6 bg-indigo-600',
            i > currentIndex && 'w-2 bg-muted',
          )}
        />
      ))}
    </div>
  );
}
