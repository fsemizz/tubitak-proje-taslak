import { useMemo, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Check, Lightbulb, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { pickSequencingVariant } from './variants';
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
  level: shell,
  onComplete,
}: GamePlayerProps<SequencingLevel>) {
  const sounds = useGameSounds();
  const level = useMemo(() => ({ ...shell, ...pickSequencingVariant(shell.id) }), [shell.id]);
  const [pool, setPool] = useState(() => shuffle(level.items));
  const [placed, setPlaced] = useState<typeof level.items>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  const [wrongToken, setWrongToken] = useState(0);
  const [hintedItemId, setHintedItemId] = useState<string | null>(null);
  const [hintedWrongPlacedId, setHintedWrongPlacedId] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const isComplete = placed.length === level.items.length;

  function placeItem(itemId: string) {
    const item = pool.find((i) => i.id === itemId);
    if (!item) return;
    setFeedback('idle');
    setHintedItemId(null);
    setHintedWrongPlacedId(null);
    setHintMessage(null);
    setPool((p) => p.filter((i) => i.id !== itemId));
    setPlaced((p) => [...p, item]);
  }

  function undoItem(itemId: string) {
    const item = placed.find((i) => i.id === itemId);
    if (!item) return;
    setFeedback('idle');
    setHintedWrongPlacedId(null);
    setHintMessage(null);
    setPlaced((p) => p.filter((i) => i.id !== itemId));
    setPool((p) => [...p, item]);
  }

  function reset() {
    setPool(shuffle(level.items));
    setPlaced([]);
    setFeedback('idle');
    setHintedItemId(null);
    setHintedWrongPlacedId(null);
    setHintMessage(null);
  }

  function useHint() {
    // First, check whether what's already placed still matches the correct order so far — if the
    // player placed an item out of order, the "next correct id" the old logic looked for may already
    // be sitting in `placed` instead of `pool`, which used to make the hint silently do nothing.
    const wrongIndex = placed.findIndex((item, idx) => item.id !== level.correctOrder[idx]);
    if (wrongIndex !== -1) {
      sounds.playHint();
      setHintUsed(true);
      setHintedItemId(null);
      setHintedWrongPlacedId(placed[wrongIndex].id);
      setHintMessage(`${wrongIndex + 1}. sıradaki adım yanlış olabilir — onu geri alıp tekrar dene.`);
      setTimeout(() => setHintedWrongPlacedId((cur) => (cur === placed[wrongIndex].id ? null : cur)), 2500);
      return;
    }
    const nextCorrectId = level.correctOrder[placed.length];
    if (!nextCorrectId || !pool.some((i) => i.id === nextCorrectId)) return;
    sounds.playHint();
    setHintUsed(true);
    setHintMessage(null);
    setHintedItemId(nextCorrectId);
    setTimeout(() => setHintedItemId((cur) => (cur === nextCorrectId ? null : cur)), 2500);
  }

  function checkAnswer() {
    const order = placed.map((i) => i.id);
    const isCorrect = order.every((id, idx) => id === level.correctOrder[idx]);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
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
      setFeedback('wrong');
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <ShakeOnError trigger={wrongToken}>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">Sıralaman (sürükleyerek de değiştirebilirsin):</p>
            </div>
            <Reorder.Group
              axis="y"
              values={placed}
              onReorder={setPlaced}
              className="flex min-h-16 flex-col gap-2 rounded-lg border-2 border-dashed border-border p-3"
            >
              <AnimatePresence>
                {placed.map((item, idx) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileDrag={{ scale: 1.03, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}
                    style={{ touchAction: 'none' }}
                    className={cn(
                      'tap-target flex w-full cursor-grab items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white shadow-sm active:cursor-grabbing',
                      hintedWrongPlacedId === item.id
                        ? 'animate-pulse bg-indigo-600 ring-2 ring-amber-400'
                        : 'bg-indigo-600',
                    )}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        undoItem(item.id);
                      }}
                      className="flex size-9 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
                      aria-label={`${item.label} adımını geri al`}
                    >
                      <X className="size-4" />
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
              {placed.length === 0 && (
                <p className="text-sm text-muted-foreground">Aşağıdaki adımlara sırayla dokun.</p>
              )}
            </Reorder.Group>
          </CardContent>
        </Card>
      </ShakeOnError>

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
              className={cn(
                'tap-target rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50',
                hintedItemId === item.id && 'animate-pulse border-amber-400 bg-amber-50 ring-2 ring-amber-300',
              )}
            >
              {item.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {(hintedItemId || hintMessage) && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" />
          İpucu: {hintMessage ?? 'Parlayan adım sırada bir sonraki olabilir!'}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> Sıra doğru değil, tekrar dene.
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className={cn(placed.length === 0 && 'opacity-50')}>
          <RotateCcw className="size-4" /> Sıfırla
        </Button>
        <Button variant="outline" onClick={useHint} disabled={placed.length >= level.items.length}>
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
        <Button onClick={checkAnswer} disabled={!isComplete} className="flex-1">
          <Check className="size-4" /> Kontrol Et
        </Button>
      </div>
    </div>
  );
}
