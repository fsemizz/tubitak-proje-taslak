import { useMemo, useState } from 'react';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { PuzzleSpec } from '../types';

interface MatchingSchemaPuzzleProps {
  spec: Extract<PuzzleSpec, { type: 'matching' }>;
  onSolved: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MatchingSchemaPuzzle({ spec, onSolved }: MatchingSchemaPuzzleProps) {
  const sounds = useGameSounds();
  const rightItems = useMemo(() => shuffle(spec.pairs), [spec.pairs]);

  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongPulse, setWrongPulse] = useState<{ left: string; right: string } | null>(null);
  const [wrongToken, setWrongToken] = useState(0);

  function pickLeft(id: string) {
    if (matchedIds.has(id)) return;
    setWrongPulse(null);
    setSelectedLeft(id);
  }

  function pickRight(pairId: string) {
    if (!selectedLeft || matchedIds.has(pairId)) return;

    if (selectedLeft === pairId) {
      sounds.playSuccessStep();
      const next = new Set(matchedIds);
      next.add(pairId);
      setMatchedIds(next);
      setSelectedLeft(null);
      if (next.size === spec.pairs.length) {
        setTimeout(onSolved, 500);
      }
    } else {
      sounds.playError();
      setWrongToken((t) => t + 1);
      setWrongPulse({ left: selectedLeft, right: pairId });
      setSelectedLeft(null);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ShakeOnError trigger={wrongToken} className="grid w-full grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        {spec.pairs.map((pair) => {
          const isMatched = matchedIds.has(pair.id);
          const isSelected = selectedLeft === pair.id;
          const isWrong = wrongPulse?.left === pair.id;
          return (
            <button
              key={pair.id}
              onClick={() => pickLeft(pair.id)}
              disabled={isMatched}
              className={cn(
                'tap-target rounded-lg border-2 bg-card px-3 py-2.5 text-center text-sm font-semibold shadow-sm transition',
                'border-border hover:border-violet-300',
                isSelected && 'border-violet-500 bg-violet-50',
                isMatched && 'border-emerald-500 bg-emerald-50 opacity-70',
                isWrong && 'border-rose-400 bg-rose-50',
              )}
            >
              {pair.leftLabel}
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
                'tap-target rounded-lg border-2 bg-card px-3 py-2.5 text-center text-sm font-medium shadow-sm transition',
                'border-border hover:border-violet-300',
                isMatched && 'border-emerald-500 bg-emerald-50 opacity-70',
                isWrong && 'border-rose-400 bg-rose-50',
              )}
            >
              {pair.rightLabel}
            </button>
          );
        })}
      </div>
      </ShakeOnError>
    </div>
  );
}
