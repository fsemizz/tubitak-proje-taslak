import { useMemo, useState } from 'react';
import { Check, GitBranch, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { pickConditionalVariant } from './variants';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { ConditionalLevel } from '@/types/game';

export default function ConditionalLogicGamePlayer({
  level: shell,
  onComplete,
}: GamePlayerProps<ConditionalLevel>) {
  const sounds = useGameSounds();
  const level = useMemo(() => ({ ...shell, ...pickConditionalVariant(shell.id) }), [shell.id]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongToken, setWrongToken] = useState(0);
  const [hintStage, setHintStage] = useState<0 | 1 | 2>(0);
  const [eliminatedBranchId, setEliminatedBranchId] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startedAt] = useState(() => Date.now());

  function choose(branchId: string) {
    if (status === 'correct') return;
    setSelectedId(branchId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (branchId === level.correctBranchId) {
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
      const candidates = level.branches.filter((b) => b.id !== level.correctBranchId && b.id !== eliminatedBranchId);
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setEliminatedBranchId(pick?.id ?? null);
      setHintStage(1);
    } else {
      setHintStage(2);
    }
  }

  const selectedBranch = level.branches.find((b) => b.id === selectedId);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 py-5">
          <GitBranch className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <p className="font-display text-lg font-semibold text-amber-900">{level.scenario}</p>
        </CardContent>
      </Card>

      <ShakeOnError trigger={wrongToken} className="grid gap-3 sm:grid-cols-2">
        {level.branches.map((branch) => {
          const isSelected = selectedId === branch.id;
          const isCorrectReveal = status === 'correct' && branch.id === level.correctBranchId;
          const isHintEliminated = status !== 'correct' && hintStage >= 1 && branch.id === eliminatedBranchId;
          const isHintRevealed = status !== 'correct' && hintStage >= 2 && branch.id === level.correctBranchId;
          return (
            <button
              key={branch.id}
              onClick={() => choose(branch.id)}
              disabled={status === 'correct'}
              className={cn(
                'tap-target rounded-xl border-2 bg-card p-4 text-left shadow-sm transition',
                'border-border hover:border-amber-300',
                isSelected && status === 'wrong' && 'border-rose-400 bg-rose-50',
                isCorrectReveal && 'border-emerald-500 bg-emerald-50',
                isHintEliminated && 'border-slate-200 bg-slate-50 opacity-60',
                isHintRevealed && 'border-amber-400 bg-amber-50 ring-2 ring-amber-300',
              )}
            >
              <p className="font-semibold text-foreground">{branch.label}</p>
              {isHintEliminated && <p className="mt-1 text-[10px] font-bold text-slate-500">muhtemelen yanlış</p>}
            </button>
          );
        })}
      </ShakeOnError>

      {status !== 'correct' && hintStage === 1 && (
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Soluk seçenek muhtemelen yanlış, diğerlerine bak.
        </div>
      )}
      {status !== 'correct' && hintStage === 2 && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Sarıyla işaretlenen seçenek doğru olabilir!
        </div>
      )}
      {status === 'wrong' && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> {selectedBranch?.description}
        </div>
      )}
      {status === 'correct' && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="size-4" /> {selectedBranch?.description}
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
