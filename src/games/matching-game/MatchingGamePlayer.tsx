import { useMemo, useRef, useState } from 'react';
import { BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { useGameSounds } from '@/hooks/useGameSounds';
import { pickMatchingVariant } from './variants';
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
  level: shell,
  onComplete,
}: GamePlayerProps<MatchingLevel>) {
  const sounds = useGameSounds();
  const level = useMemo(() => ({ ...shell, ...pickMatchingVariant(shell.id) }), [shell.id]);
  const leftItems = useMemo(() => shuffle(level.pairs), [level.pairs]);
  const rightItems = useMemo(() => shuffle(level.pairs), [level.pairs]);

  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongPulse, setWrongPulse] = useState<{ left: string; right: string } | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [wrongToken, setWrongToken] = useState(0);
  const [hintedPairId, setHintedPairId] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [symbolGuideOpen, setSymbolGuideOpen] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const completedRef = useRef(false);

  function pickLeft(id: string) {
    if (matchedIds.has(id)) return;
    setWrongPulse(null);
    setHintedPairId(null);
    setSelectedLeft(id);
  }

  function pickRight(pairId: string) {
    if (!selectedLeft || matchedIds.has(pairId)) return;

    if (selectedLeft === pairId) {
      sounds.playSuccessStep();
      const nextMatched = new Set(matchedIds);
      nextMatched.add(pairId);
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setHintedPairId(null);

      if (nextMatched.size === level.pairs.length && !completedRef.current) {
        completedRef.current = true;
        const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
        const attempts = wrongCount + 1;
        const pointsEarned = wrongCount === 0 && !hintUsed ? level.points : Math.round(level.points * 0.6);
        onComplete({
          levelId: level.id,
          levelOrder: level.order,
          isCorrect: true,
          attempts,
          pointsEarned,
          timeSpentSeconds,
          hintUsed,
        });
      }
    } else {
      sounds.playError();
      setWrongToken((t) => t + 1);
      setWrongCount((c) => c + 1);
      setWrongPulse({ left: selectedLeft, right: pairId });
      setSelectedLeft(null);
    }
  }

  function useHint() {
    let leftId = selectedLeft;
    if (!leftId) {
      const firstUnmatched = level.pairs.find((p) => !matchedIds.has(p.id));
      if (!firstUnmatched) return;
      leftId = firstUnmatched.id;
      setSelectedLeft(leftId);
    }
    sounds.playHint();
    setHintUsed(true);
    setHintedPairId(leftId);
    const target = leftId;
    setTimeout(() => setHintedPairId((cur) => (cur === target ? null : cur)), 2500);
  }

  function openSymbolGuide() {
    sounds.playHint();
    setHintUsed(true);
    setSymbolGuideOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <ShakeOnError trigger={wrongToken} className="grid grid-cols-2 gap-4">
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
            const isHinted = hintedPairId === pair.id;
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
                  isHinted && 'animate-pulse border-amber-400 bg-amber-50 ring-2 ring-amber-300',
                )}
              >
                {pair.right.label}
              </button>
            );
          })}
        </div>
      </ShakeOnError>

      {hintedPairId && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: Parlayan kart doğru eşleşme olabilir!
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        {matchedIds.size}/{level.pairs.length} eşleşme tamamlandı
      </p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={useHint} className="flex-1">
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
        <Button variant="outline" onClick={openSymbolGuide} className="flex-1">
          <BookOpen className="size-4" /> Sembol Rehberi
        </Button>
      </div>

      <Dialog open={symbolGuideOpen} onOpenChange={setSymbolGuideOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sembol Rehberi</DialogTitle>
            <DialogDescription>
              Bu semboller ne anlama geliyor, öğrenmek için istediğin zaman buraya bakabilirsin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {level.pairs.map((pair) => (
              <div
                key={pair.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2"
              >
                <span className="text-lg font-semibold text-foreground">{pair.left.label}</span>
                <span className="text-sm font-medium text-muted-foreground">{pair.right.label}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
