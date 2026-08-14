import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, GitBranch } from 'lucide-react';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { PuzzleSpec } from '../types';

interface ConditionalRulePuzzleProps {
  spec: Extract<PuzzleSpec, { type: 'conditional' }>;
  onSolved: () => void;
}

export function ConditionalRulePuzzle({ spec, onSolved }: ConditionalRulePuzzleProps) {
  const sounds = useGameSounds();
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [solvedId, setSolvedId] = useState<string | null>(null);
  const [wrongToken, setWrongToken] = useState(0);

  function choose(id: string) {
    if (solvedId || wrongIds.has(id)) return;
    if (id === spec.correctOptionId) {
      sounds.playSuccessStep();
      setSolvedId(id);
      setTimeout(onSolved, 700);
      return;
    }
    sounds.playError();
    setWrongToken((t) => t + 1);
    setWrongIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full rounded-xl border-2 border-dashed border-violet-300 bg-violet-50/60 p-3 text-center">
        <p className="mb-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">
          <GitBranch className="size-3.5" /> Kural
        </p>
        <p className="text-sm font-semibold text-violet-900">{spec.rule}</p>
        <p className="mt-2 text-sm">
          Şu an durum: <span className="font-bold text-violet-700">{spec.situation}</span>
        </p>
      </div>

      <ShakeOnError trigger={wrongToken} className="grid grid-cols-3 gap-3">
        {spec.options.map((opt) => {
          const isWrong = wrongIds.has(opt.id);
          const isSolved = solvedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={!!solvedId || isWrong}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 shadow-sm transition',
                isSolved
                  ? 'border-emerald-500 bg-emerald-50'
                  : isWrong
                    ? 'border-border bg-muted/50 opacity-40'
                    : 'border-violet-200 bg-violet-50 hover:border-violet-400',
              )}
            >
              <motion.span className="text-4xl" animate={isSolved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
                {opt.icon}
              </motion.span>
              <span className="text-sm font-semibold text-foreground">{opt.label}</span>
              {isSolved && <Check className="size-4 text-emerald-600" />}
            </button>
          );
        })}
      </ShakeOnError>
    </div>
  );
}
