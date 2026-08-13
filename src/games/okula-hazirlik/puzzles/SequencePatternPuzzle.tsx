import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { PuzzleSpec } from '../types';

interface SequencePatternPuzzleProps {
  spec: Extract<PuzzleSpec, { type: 'sequence' }>;
  onSolved: () => void;
}

export function SequencePatternPuzzle({ spec, onSolved }: SequencePatternPuzzleProps) {
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
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {spec.sequence.map((item, i) => (
          <div
            key={i}
            className="flex size-14 items-center justify-center rounded-xl border-2 border-violet-200 bg-violet-50 text-xl font-extrabold text-violet-700 shadow-sm"
          >
            {item}
          </div>
        ))}
        <motion.div
          className={cn(
            'flex size-14 items-center justify-center rounded-xl border-2 border-dashed text-xl font-extrabold',
            solved ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-amber-400 bg-amber-50 text-amber-500',
          )}
          animate={solved ? { scale: [1, 1.2, 1] } : { scale: [1, 1.06, 1] }}
          transition={{ duration: solved ? 0.4 : 1.2, repeat: solved ? 0 : Infinity }}
        >
          {solved ? spec.correctAnswer : '?'}
        </motion.div>
      </div>

      <ShakeOnError trigger={wrongToken} className="flex flex-wrap justify-center gap-3">
        {spec.options.map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            disabled={solved}
            className={cn(
              'flex size-14 items-center justify-center rounded-xl border-2 text-lg font-bold shadow-sm transition',
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
