import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { cn } from '@/lib/utils';
import type { PuzzleSpec } from '../types';

interface OrderedChoicePuzzleProps {
  spec: Extract<PuzzleSpec, { type: 'orderedChoice' }>;
  onSolved: () => void;
}

export function OrderedChoicePuzzle({ spec, onSolved }: OrderedChoicePuzzleProps) {
  const sounds = useGameSounds();
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrongToken, setWrongToken] = useState(0);
  const [solved, setSolved] = useState(false);

  const remaining = spec.items.filter((i) => !placed.includes(i.id));

  function place(id: string) {
    if (solved) return;
    setPlaced((prev) => [...prev, id]);
  }

  function undo() {
    if (solved) return;
    setPlaced((prev) => prev.slice(0, -1));
  }

  function checkOrder() {
    if (placed.length !== spec.correctOrder.length) return;
    const isCorrect = placed.every((id, idx) => id === spec.correctOrder[idx]);
    if (isCorrect) {
      sounds.playSuccessStep();
      setSolved(true);
      setTimeout(onSolved, 700);
    } else {
      sounds.playError();
      setWrongToken((t) => t + 1);
      setPlaced([]);
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <ShakeOnError trigger={wrongToken} className="w-full">
        <div className="flex min-h-16 w-full flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-3">
          <AnimatePresence>
            {placed.map((id, idx) => {
              const item = spec.items.find((i) => i.id === id)!;
              return (
                <motion.span
                  key={id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-bold text-white shadow-sm"
                >
                  <span className="flex size-4 items-center justify-center rounded-full bg-white/25 text-[10px]">
                    {idx + 1}
                  </span>
                  {item.icon} {item.label}
                </motion.span>
              );
            })}
          </AnimatePresence>
          {placed.length === 0 && <p className="text-sm text-muted-foreground">Sırayla dokun.</p>}
        </div>
      </ShakeOnError>

      <div className="flex flex-wrap justify-center gap-2.5">
        {remaining.map((item) => (
          <button
            key={item.id}
            onClick={() => place(item.id)}
            disabled={solved}
            className={cn(
              'tap-target flex items-center gap-1.5 rounded-xl border-2 border-violet-200 bg-white px-3 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-400',
            )}
          >
            <span className="text-lg">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={undo} disabled={solved || placed.length === 0}>
          <RotateCcw className="size-4" /> Geri Al
        </Button>
        <Button onClick={checkOrder} disabled={solved || placed.length !== spec.items.length}>
          <Check className="size-4" /> Kontrol Et
        </Button>
      </div>
    </div>
  );
}
