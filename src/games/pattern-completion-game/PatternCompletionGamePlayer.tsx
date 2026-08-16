import { useMemo, useState } from 'react';
import { Check, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { pickPatternVariant } from './variants';
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
  level: shell,
  onComplete,
}: GamePlayerProps<PatternLevel>) {
  const sounds = useGameSounds();
  const level = useMemo(() => ({ ...shell, ...pickPatternVariant(shell.id) }), [shell.id]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [wrongToken, setWrongToken] = useState(0);
  const [hintStage, setHintStage] = useState<0 | 1 | 2>(0);
  const [eliminatedOptionId, setEliminatedOptionId] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const isSolved = selected === level.correctOptionId;

  function choose(optionId: string) {
    if (isSolved) return;
    setSelected(optionId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (optionId === level.correctOptionId) {
      const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
      const pointsEarned = newAttempts === 1 && !hintUsed ? level.points : Math.round(level.points * 0.6);
      onComplete({
        levelId: level.id,
        levelOrder: level.order,
        isCorrect: true,
        attempts: newAttempts,
        pointsEarned,
        timeSpentSeconds,
        hintUsed,
      });
    } else {
      sounds.playError();
      setWrongToken((t) => t + 1);
      setFeedback('wrong');
    }
  }

  function useHint() {
    if (hintStage >= 2 || isSolved) return;
    sounds.playHint();
    setHintUsed(true);
    if (hintStage === 0) {
      const candidates = level.options.filter((o) => o.id !== level.correctOptionId && o.id !== eliminatedOptionId);
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setEliminatedOptionId(pick?.id ?? null);
      setHintStage(1);
    } else {
      setHintStage(2);
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
        {level.options.map((opt) => {
          const isHintEliminated = !isSolved && hintStage >= 1 && opt.id === eliminatedOptionId;
          const isHintRevealed = !isSolved && hintStage >= 2 && opt.id === level.correctOptionId;
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              className={cn(
                'tap-target rounded-xl border-2 p-2 transition',
                selected === opt.id && opt.id === level.correctOptionId && 'border-emerald-500 bg-emerald-50',
                selected === opt.id && opt.id !== level.correctOptionId && 'border-rose-400 bg-rose-50',
                selected !== opt.id && 'border-border hover:border-fuchsia-300',
                isHintEliminated && 'opacity-40',
                isHintRevealed && 'border-amber-400 bg-amber-50 ring-2 ring-amber-300',
              )}
            >
              <PatternCellView cell={opt} size="sm" />
            </button>
          );
        })}
      </ShakeOnError>

      {!isSolved && hintStage === 1 && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Soluk seçenek muhtemelen yanlış.
        </div>
      )}
      {!isSolved && hintStage === 2 && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Sarıyla işaretlenen seçenek doğru olabilir!
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> Doğru değil, başka bir seçenek dene.
        </div>
      )}
      {isSolved && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="size-4" /> Harika, doğru buldun!
        </div>
      )}

      {!isSolved && (
        <Button variant="outline" onClick={useHint} disabled={hintStage >= 2} className="self-center">
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
      )}
    </div>
  );
}
