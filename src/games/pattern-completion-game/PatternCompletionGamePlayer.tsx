import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { PatternCell, PatternLevel } from '@/types/game';

const SHAPE_MAP: Record<string, string> = {
  circle: 'rounded-full',
  square: 'rounded-md',
  triangle: 'triangle',
};

function ColorSwatch({ colorKey, shapeKey }: { colorKey?: string; shapeKey?: string }) {
  const bgClass =
    colorKey === 'red' ? 'bg-rose-400' : colorKey === 'blue' ? 'bg-blue-400' : 'bg-emerald-400';
  const textClass =
    colorKey === 'red' ? 'text-rose-400' : colorKey === 'blue' ? 'text-blue-400' : 'text-emerald-400';
  if (shapeKey === 'triangle') {
    return <div className={cn('size-8', textClass, 'triangle')} />;
  }
  return <div className={cn('size-8', bgClass, SHAPE_MAP[shapeKey ?? 'square'] ?? 'rounded-md')} />;
}

function PatternCellView({ cell, size = 'md' }: { cell: PatternCell; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'size-12' : 'size-14';

  if (!cell.value) {
    return (
      <div
        className={cn(
          dim,
          'flex items-center justify-center rounded-xl border-2 border-dashed border-fuchsia-300 bg-fuchsia-50 text-xl font-bold text-fuchsia-400',
        )}
      >
        ?
      </div>
    );
  }

  if (cell.kind === 'color') {
    return <div className={cn(dim, 'rounded-xl shadow-sm', cell.value)} />;
  }

  if (cell.kind === 'shape') {
    if (cell.value === 'triangle') {
      return (
        <div
          className={cn(dim, 'flex items-center justify-center')}
          title={cell.label}
        >
          <div className="triangle size-8 text-fuchsia-500" />
        </div>
      );
    }
    return (
      <div
        className={cn(dim, 'flex items-center justify-center')}
        title={cell.label}
      >
        <div className={cn('size-8 bg-fuchsia-500', SHAPE_MAP[cell.value] ?? 'rounded-md')} />
      </div>
    );
  }

  if (cell.kind === 'icon' && cell.value.includes(':')) {
    const [colorKey, shapeKey] = cell.value.split(':');
    return (
      <div className={cn(dim, 'flex items-center justify-center rounded-xl bg-muted')}>
        <ColorSwatch colorKey={colorKey} shapeKey={shapeKey} />
      </div>
    );
  }

  return (
    <div className={cn(dim, 'flex items-center justify-center rounded-xl bg-muted text-lg text-amber-500')}>
      {cell.value}
    </div>
  );
}

export default function PatternCompletionGamePlayer({
  level,
  onComplete,
}: GamePlayerProps<PatternLevel>) {
  const sounds = useGameSounds();
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [wrongToken, setWrongToken] = useState(0);
  const [startedAt] = useState(() => Date.now());

  function choose(optionId: string) {
    setSelected(optionId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (optionId === level.correctOptionId) {
      const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
      const pointsEarned = newAttempts === 1 ? level.points : Math.round(level.points * 0.6);
      onComplete({
        levelId: level.id,
        levelOrder: level.order,
        isCorrect: true,
        attempts: newAttempts,
        pointsEarned,
        timeSpentSeconds,
      });
    } else {
      sounds.playError();
      setWrongToken((t) => t + 1);
      setFeedback('wrong');
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-center gap-3 py-6">
          {level.sequence.map((cell) => (
            <PatternCellView key={cell.id} cell={cell} />
          ))}
        </CardContent>
      </Card>

      <ShakeOnError trigger={wrongToken} className="flex flex-wrap justify-center gap-4">
        {level.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => choose(opt.id)}
            className={cn(
              'tap-target rounded-xl border-2 p-2 transition',
              selected === opt.id && opt.id === level.correctOptionId && 'border-emerald-500 bg-emerald-50',
              selected === opt.id && opt.id !== level.correctOptionId && 'border-rose-400 bg-rose-50',
              selected !== opt.id && 'border-border hover:border-fuchsia-300',
            )}
          >
            <PatternCellView cell={opt} size="sm" />
          </button>
        ))}
      </ShakeOnError>

      {feedback === 'wrong' && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> Doğru değil, başka bir seçenek dene.
        </div>
      )}
      {selected === level.correctOptionId && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="size-4" /> Harika, doğru buldun!
        </div>
      )}
    </div>
  );
}
