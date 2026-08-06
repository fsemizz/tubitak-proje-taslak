import { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { DebugLevel } from '@/types/game';

export default function DebugHuntGamePlayer({
  level,
  onComplete,
}: GamePlayerProps<DebugLevel>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [startedAt] = useState(() => Date.now());

  function selectStep(stepId: string) {
    if (status === 'correct') return;
    setSelectedId(stepId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (stepId === level.buggyStepId) {
      setStatus('correct');
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
      setStatus('wrong');
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <ol className="flex flex-col gap-2">
        {level.steps.map((step, idx) => {
          const isSelected = selectedId === step.id;
          const isBuggyRevealed = status === 'correct' && step.id === level.buggyStepId;
          return (
            <li key={step.id}>
              <button
                onClick={() => selectStep(step.id)}
                disabled={status === 'correct'}
                className={cn(
                  'tap-target flex w-full items-center gap-3 rounded-lg border-2 bg-card px-4 py-3 text-left text-sm font-medium shadow-sm transition',
                  'border-border hover:border-rose-300',
                  isSelected && status === 'wrong' && 'border-rose-400 bg-rose-50',
                  isBuggyRevealed && 'border-emerald-500 bg-emerald-50',
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {idx + 1}
                </span>
                {step.label}
                {isBuggyRevealed && <Check className="ml-auto size-4 text-emerald-600" />}
              </button>
            </li>
          );
        })}
      </ol>

      {status === 'wrong' && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> Bu adım hatalı değil, başka bir adıma bak.
        </div>
      )}
      {status === 'correct' && (
        <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>{level.explanation}</span>
        </div>
      )}
    </div>
  );
}
