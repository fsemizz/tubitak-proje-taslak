import { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { MatchingLevel } from '@/types/game';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MatchingGamePlayer({
  level,
  onComplete,
}: GamePlayerProps<MatchingLevel>) {
  const leftItems = useMemo(() => shuffle(level.pairs), [level.pairs]);
  const rightItems = useMemo(() => shuffle(level.pairs), [level.pairs]);

  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongPulse, setWrongPulse] = useState<{ left: string; right: string } | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const completedRef = useRef(false);

  function pickLeft(id: string) {
    if (matchedIds.has(id)) return;
    setWrongPulse(null);
    setSelectedLeft(id);
  }

  function pickRight(pairId: string) {
    if (!selectedLeft || matchedIds.has(pairId)) return;

    if (selectedLeft === pairId) {
      const nextMatched = new Set(matchedIds);
      nextMatched.add(pairId);
      setMatchedIds(nextMatched);
      setSelectedLeft(null);

      if (nextMatched.size === level.pairs.length && !completedRef.current) {
        completedRef.current = true;
        const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
        const attempts = wrongCount + 1;
        const pointsEarned = wrongCount === 0 ? level.points : Math.round(level.points * 0.6);
        onComplete({
          levelId: level.id,
          levelOrder: level.order,
          isCorrect: true,
          attempts,
          pointsEarned,
          timeSpentSeconds,
        });
      }
    } else {
      setWrongCount((c) => c + 1);
      setWrongPulse({ left: selectedLeft, right: pairId });
      setSelectedLeft(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {leftItems.map((pair) => {
            const isMatched = matchedIds.has(pair.id);
            const isSelected = selectedLeft === pair.id;
            const isWrong = wrongPulse?.left === pair.id;
            return (
              <button
                key={pair.id}
                onClick={() => pickLeft(pair.id)}
                disabled={isMatched}
                className={cn(
                  'tap-target rounded-lg border-2 bg-card px-3 py-3 text-center text-lg font-semibold shadow-sm transition',
                  'border-border hover:border-sky-300',
                  isSelected && 'border-sky-500 bg-sky-50',
                  isMatched && 'border-emerald-500 bg-emerald-50 opacity-70',
                  isWrong && 'border-rose-400 bg-rose-50',
                )}
              >
                {pair.left.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rightItems.map((pair) => {
            const isMatched = matchedIds.has(pair.id);
            const isWrong = wrongPulse?.right === pair.id;
            return (
              <button
                key={pair.id}
                onClick={() => pickRight(pair.id)}
                disabled={isMatched}
                className={cn(
                  'tap-target rounded-lg border-2 bg-card px-3 py-3 text-center text-sm font-medium shadow-sm transition',
                  'border-border hover:border-sky-300',
                  isMatched && 'border-emerald-500 bg-emerald-50 opacity-70',
                  isWrong && 'border-rose-400 bg-rose-50',
                )}
              >
                {pair.right.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {matchedIds.size}/{level.pairs.length} eşleşme tamamlandı
      </p>
    </div>
  );
}
