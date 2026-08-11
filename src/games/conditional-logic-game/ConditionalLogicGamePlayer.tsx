import { useState } from 'react';
import { Check, GitBranch, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { ConditionalLevel } from '@/types/game';

export default function ConditionalLogicGamePlayer({
  level,
  onComplete,
}: GamePlayerProps<ConditionalLevel>) {
  const sounds = useGameSounds();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongToken, setWrongToken] = useState(0);
  const [startedAt] = useState(() => Date.now());

  function choose(branchId: string) {
    if (status === 'correct') return;
    setSelectedId(branchId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (branchId === level.correctBranchId) {
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
      sounds.playError();
      setWrongToken((t) => t + 1);
      setStatus('wrong');
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
              )}
            >
              <p className="font-semibold text-foreground">{branch.label}</p>
            </button>
          );
        })}
      </ShakeOnError>

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
    </div>
  );
}
