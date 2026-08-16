import { useMemo, useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Check, GitBranch, Lightbulb, Repeat, RotateCcw, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { generateFlowLevel } from './generator';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { FlowBlock, FlowchartLevel } from '@/types/game';

const KIND_ICON: Record<FlowBlock['kind'], typeof GitBranch> = {
  condition: GitBranch,
  action: Zap,
  loop: Repeat,
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FlowLogicGamePlayer({ level: shell, onComplete }: GamePlayerProps<FlowchartLevel>) {
  const sounds = useGameSounds();
  // Fresh scenario/blocks/answer each time this level is entered — same template pool everyone
  // shares, but a randomly picked variant, so replays don't just show the memorized answer.
  const level = useMemo(() => generateFlowLevel(shell), [shell.id]);
  const [pool, setPool] = useState(() => shuffle(level.availableBlocks));
  const [placed, setPlaced] = useState<FlowBlock[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  const [wrongToken, setWrongToken] = useState(0);
  const [hintedBlockId, setHintedBlockId] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startedAt] = useState(() => Date.now());

  function addBlock(blockId: string) {
    const block = pool.find((b) => b.id === blockId);
    if (!block) return;
    setFeedback('idle');
    setHintedBlockId(null);
    setPool((p) => p.filter((b) => b.id !== blockId));
    setPlaced((p) => [...p, block]);
  }

  function removeBlock(blockId: string) {
    const block = placed.find((b) => b.id === blockId);
    if (!block) return;
    setFeedback('idle');
    setPlaced((p) => p.filter((b) => b.id !== blockId));
    setPool((p) => [...p, block]);
  }

  function reset() {
    setPool(shuffle(level.availableBlocks));
    setPlaced([]);
    setFeedback('idle');
    setHintedBlockId(null);
  }

  function useHint() {
    const nextCorrectId = level.correctSequence[placed.length];
    if (!nextCorrectId || !pool.some((b) => b.id === nextCorrectId)) return;
    sounds.playHint();
    setHintUsed(true);
    setHintedBlockId(nextCorrectId);
    setTimeout(() => setHintedBlockId((cur) => (cur === nextCorrectId ? null : cur)), 2500);
  }

  function checkAnswer() {
    const sequence = placed.map((b) => b.id);
    const isCorrect =
      sequence.length === level.correctSequence.length &&
      sequence.every((id, idx) => id === level.correctSequence[idx]);
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

      <Card className="border-violet-200 bg-violet-50">
        <CardContent className="flex items-start gap-3 py-5">
          <GitBranch className="mt-0.5 size-5 shrink-0 text-violet-600" />
          <p className="font-display text-lg font-semibold text-violet-900">{level.scenario}</p>
        </CardContent>
      </Card>

      <ShakeOnError trigger={wrongToken}>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-muted-foreground">Akışın:</p>
            <Reorder.Group
              axis="y"
              values={placed}
              onReorder={setPlaced}
              className="flex min-h-16 flex-col gap-2 rounded-lg border-2 border-dashed border-border p-3"
            >
              <AnimatePresence>
                {placed.map((block, idx) => {
                  const Icon = KIND_ICON[block.kind];
                  return (
                    <Reorder.Item
                      key={block.id}
                      value={block}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileDrag={{ scale: 1.03, boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}
                      style={{ touchAction: 'none' }}
                      className="tap-target flex w-full cursor-grab items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white shadow-sm active:cursor-grabbing"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs">
                        {idx + 1}
                      </span>
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1">{block.label}</span>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBlock(block.id);
                        }}
                        className="flex size-9 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
                        aria-label={`${block.label} bloğunu geri al`}
                      >
                        <X className="size-4" />
                      </button>
                    </Reorder.Item>
                  );
                })}
              </AnimatePresence>
              {placed.length === 0 && (
                <p className="text-sm text-muted-foreground">Aşağıdaki bloklardan gerekli olanlara sırayla dokun.</p>
              )}
            </Reorder.Group>
          </CardContent>
        </Card>
      </ShakeOnError>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {pool.map((block) => {
            const Icon = KIND_ICON[block.kind];
            return (
              <motion.button
                key={block.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => addBlock(block.id)}
                className={cn(
                  'tap-target flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-violet-400 hover:bg-violet-50',
                  hintedBlockId === block.id && 'animate-pulse border-amber-400 bg-amber-50 ring-2 ring-amber-300',
                )}
              >
                <Icon className="size-4 shrink-0 text-violet-600" />
                {block.label}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {hintedBlockId && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Parlayan blok sırada bir sonraki olabilir!
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> Akış doğru değil — gereksiz bir blok olabilir ya da sıra karışık. Tekrar dene.
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} className={cn(placed.length === 0 && 'opacity-50')}>
          <RotateCcw className="size-4" /> Sıfırla
        </Button>
        <Button variant="outline" onClick={useHint} disabled={placed.length >= level.correctSequence.length}>
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
        <Button onClick={checkAnswer} disabled={placed.length === 0} className="flex-1">
          <Check className="size-4" /> Çalıştır
        </Button>
      </div>
    </div>
  );
}
