import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { pickDebugVariant } from './variants';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { DebugLevel } from '@/types/game';

export default function DebugHuntGamePlayer({
  level: shell,
  onComplete,
}: GamePlayerProps<DebugLevel>) {
  const sounds = useGameSounds();
  // Fresh steps/bug placement each time this level is entered — same difficulty, different story.
  const level = useMemo(() => ({ ...shell, ...pickDebugVariant(shell.id) }), [shell.id]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongToken, setWrongToken] = useState(0);
  const [hintStage, setHintStage] = useState<0 | 1 | 2>(0);
  const [eliminatedStepId, setEliminatedStepId] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startedAt] = useState(() => Date.now());

  function selectStep(stepId: string) {
    if (status === 'correct') return;
    setSelectedId(stepId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (stepId === level.buggyStepId) {
      setStatus('correct');
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
      setStatus('wrong');
    }
  }

  function useHint() {
    if (hintStage >= 2 || status === 'correct') return;
    sounds.playHint();
    setHintUsed(true);
    if (hintStage === 0) {
      const candidates = level.steps.filter((s) => s.id !== level.buggyStepId && s.id !== eliminatedStepId);
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setEliminatedStepId(pick?.id ?? null);
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

      <ShakeOnError trigger={wrongToken}>
        <ol className="flex flex-col gap-2">
          {level.steps.map((step, idx) => {
            const isSelected = selectedId === step.id;
            const isBuggyRevealed = status === 'correct' && step.id === level.buggyStepId;
            const isHintEliminated = status !== 'correct' && hintStage >= 1 && step.id === eliminatedStepId;
            const isHintRevealed = status !== 'correct' && hintStage >= 2 && step.id === level.buggyStepId;
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
                    isHintEliminated && 'border-emerald-200 bg-emerald-50/40 opacity-70',
                    isHintRevealed && 'border-amber-400 bg-amber-50 ring-2 ring-amber-300',
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {idx + 1}
                  </span>
                  {step.label}
                  {isBuggyRevealed && <Check className="ml-auto size-4 text-emerald-600" />}
                  {isHintEliminated && <span className="ml-auto text-[10px] font-bold text-emerald-600">muhtemelen doğru</span>}
                  {isHintRevealed && <Lightbulb className="ml-auto size-4 text-amber-600" />}
                </button>
              </li>
            );
          })}
        </ol>
      </ShakeOnError>

      {status !== 'correct' && hintStage === 1 && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Yeşille işaretlenen adım doğru görünüyor, diğerlerine bak.
        </div>
      )}
      {status !== 'correct' && hintStage === 2 && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Sarıyla işaretlenen adım hatalı olabilir!
        </div>
      )}
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

      {status !== 'correct' && (
        <Button variant="outline" onClick={useHint} disabled={hintStage >= 2} className="self-start">
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
      )}
    </div>
  );
}
