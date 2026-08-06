import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { SequencingLevel } from '@/types/game';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SequencingGamePlayer({
  level,
  onComplete,
}: GamePlayerProps<SequencingLevel>) {
  const [pool, setPool] = useState(() => shuffle(level.items));
  const [placed, setPlaced] = useState<typeof level.items>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  const [startedAt] = useState(() => Date.now());

  const isComplete = placed.length === level.items.length;

  function placeItem(itemId: string) {
    const item = pool.find((i) => i.id === itemId);
    if (!item) return;
    setFeedback('idle');
    setPool((p) => p.filter((i) => i.id !== itemId));
    setPlaced((p) => [...p, item]);
  }

  function undoItem(itemId: string) {
    const item = placed.find((i) => i.id === itemId);
    if (!item) return;
    setFeedback('idle');
    setPlaced((p) => p.filter((i) => i.id !== itemId));
    setPool((p) => [...p, item]);
  }

  function reset() {
    setPool(shuffle(level.items));
    setPlaced([]);
    setFeedback('idle');
  }

  function checkAnswer() {
    const order = placed.map((i) => i.id);
    const isCorrect = order.every((id, idx) => id === level.correctOrder[idx]);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
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
      setFeedback('wrong');
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Sıralaman:</p>
          <div className="flex min-h-16 flex-wrap gap-2 rounded-lg border-2 border-dashed border-border p-3">
            <AnimatePresence>
              {placed.map((item, idx) => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => undoItem(item.id)}
                  className="tap-target flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/25 text-xs">
                    {idx + 1}
                  </span>
                  {item.label}
                </motion.button>
              ))}
            </AnimatePresence>
            {placed.length === 0 && (
              <p className="text-sm text-muted-foreground">Aşağıdaki adımlara sırayla dokun.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {pool.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => placeItem(item.id)}
              className="tap-target rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              {item.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {feedback === 'wrong' && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> Sıra doğru değil, tekrar dene.
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className={cn(placed.length === 0 && 'opacity-50')}>
          <RotateCcw className="size-4" /> Sıfırla
        </Button>
        <Button onClick={checkAnswer} disabled={!isComplete} className="flex-1">
          <Check className="size-4" /> Kontrol Et
        </Button>
      </div>
    </div>
  );
}
