import { useState } from 'react';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { PuzzleSpec } from '../types';

interface LoopCountPuzzleProps {
  spec: Extract<PuzzleSpec, { type: 'loopCount' }>;
  onSolved: () => void;
}

export function LoopCountPuzzle({ spec, onSolved }: LoopCountPuzzleProps) {
  const sounds = useGameSounds();
  const [solved, setSolved] = useState(false);
  const [wrongToken, setWrongToken] = useState(0);
  const [wrongOption, setWrongOption] = useState<string | null>(null);

  function choose(option: string) {
    if (solved) return;
    if (option === spec.correctAnswer) {
      sounds.playSuccessStep();
      setSolved(true);
      setTimeout(onSolved, 700);
      return;
    }
    sounds.playError();
    setWrongToken((t) => t + 1);
    setWrongOption(option);
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {Array.from({ length: spec.groupCount }).map((_, groupIdx) => (
          <div
            key={groupIdx}
            className="flex items-center gap-1 rounded-xl border-2 border-violet-200 bg-violet-50 px-2.5 py-2 shadow-sm"
          >
            {Array.from({ length: spec.itemsPerGroup }).map((_, itemIdx) => (
              <span key={itemIdx} className="text-2xl leading-none">
                {spec.icon}
              </span>
            ))}
          </div>
        ))}
        {!!spec.extraItems && (
          <div className="flex items-center gap-1 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-2.5 py-2 shadow-sm">
            {Array.from({ length: spec.extraItems }).map((_, itemIdx) => (
              <span key={itemIdx} className="text-2xl leading-none">
                {spec.icon}
              </span>
            ))}
          </div>
        )}
      </div>
      {!!spec.extraItems && (
        <p className="-mt-3 text-xs font-semibold text-amber-700">
          Kutuların dışında duran {spec.extraItems} taneyi de unutma!
        </p>
      )}

      <ShakeOnError trigger={wrongToken} className="flex flex-wrap justify-center gap-3">
        {spec.options.map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            disabled={solved}
            className={cn(
              'tap-target flex size-14 items-center justify-center rounded-xl border-2 text-lg font-bold shadow-sm transition',
              solved && opt === spec.correctAnswer
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : wrongOption === opt
                  ? 'border-rose-300 bg-rose-50 text-rose-500'
                  : 'border-violet-200 bg-white text-violet-700 hover:border-violet-400',
            )}
          >
            {opt}
          </button>
        ))}
      </ShakeOnError>
    </div>
  );
}
