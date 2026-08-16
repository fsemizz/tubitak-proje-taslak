import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShakeOnError } from '@/components/primitives/ShakeOnError';
import { ConfettiBurst } from '@/components/primitives/ConfettiBurst';
import { useGameSounds } from '@/hooks/useGameSounds';
import { pickPatternVariant } from './variants';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { PatternCell, PatternLevel } from '@/types/game';

const SHAPE_RADIUS: Record<string, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
  triangle: 'triangle',
};

interface ColorStop {
  from: string;
  to: string;
  glow: string;
}

const COLOR_PALETTE: Record<string, ColorStop> = {
  rose: { from: '#fb7185', to: '#e11d48', glow: 'rgba(225,29,72,0.4)' },
  red: { from: '#fb7185', to: '#e11d48', glow: 'rgba(225,29,72,0.4)' },
  blue: { from: '#60a5fa', to: '#2563eb', glow: 'rgba(37,99,235,0.4)' },
  emerald: { from: '#34d399', to: '#059669', glow: 'rgba(5,150,105,0.4)' },
  green: { from: '#34d399', to: '#059669', glow: 'rgba(5,150,105,0.4)' },
  amber: { from: '#fbbf24', to: '#d97706', glow: 'rgba(217,119,6,0.4)' },
  violet: { from: '#a78bfa', to: '#7c3aed', glow: 'rgba(124,58,237,0.4)' },
  pink: { from: '#f472b6', to: '#db2777', glow: 'rgba(219,39,119,0.4)' },
  sky: { from: '#38bdf8', to: '#0284c7', glow: 'rgba(2,132,199,0.4)' },
};

function resolveColor(key?: string): ColorStop {
  return COLOR_PALETTE[key ?? ''] ?? { from: '#c4b5fd', to: '#7c3aed', glow: 'rgba(124,58,237,0.35)' };
}

function ShapeSwatch({ shapeKey, colorKey, size = 32 }: { shapeKey?: string; colorKey?: string; size?: number }) {
  const color = resolveColor(colorKey);
  const gradient = `linear-gradient(145deg, ${color.from}, ${color.to})`;
  if (shapeKey === 'triangle') {
    return (
      <div
        className="triangle"
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size * 0.86,
          borderBottomColor: color.to,
          filter: `drop-shadow(0 3px 6px ${color.glow})`,
        }}
      />
    );
  }
  return (
    <div
      className={cn(SHAPE_RADIUS[shapeKey ?? 'square'] ?? 'rounded-lg', 'shadow-lg')}
      style={{ width: size, height: size, background: gradient, boxShadow: `0 4px 14px ${color.glow}` }}
    />
  );
}

function PatternCellView({ cell, size = 'md', celebrate = false }: { cell: PatternCell; size?: 'sm' | 'md'; celebrate?: boolean }) {
  const dim = size === 'sm' ? 'size-12' : 'size-14';

  if (!cell.value) {
    return (
      <div
        className={cn(
          dim,
          'flex items-center justify-center rounded-2xl border-2 border-dashed border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 to-violet-50 text-2xl font-black text-fuchsia-400',
        )}
      >
        ?
      </div>
    );
  }

  let inner: React.ReactNode;
  if (cell.kind === 'color') {
    const color = resolveColor(cell.value);
    inner = (
      <div
        className="size-full rounded-2xl"
        style={{
          background: `linear-gradient(145deg, ${color.from}, ${color.to})`,
          boxShadow: `0 6px 16px ${color.glow}`,
        }}
      />
    );
  } else if (cell.kind === 'shape') {
    inner = (
      <div className="flex size-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100" title={cell.label}>
        <ShapeSwatch shapeKey={cell.value} colorKey="violet" size={size === 'sm' ? 26 : 32} />
      </div>
    );
  } else if (cell.kind === 'icon' && cell.value.includes(':')) {
    const [colorKey, shapeKey] = cell.value.split(':');
    inner = (
      <div className="flex size-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
        <ShapeSwatch shapeKey={shapeKey} colorKey={colorKey} size={size === 'sm' ? 26 : 32} />
      </div>
    );
  } else {
    inner = (
      <div className="flex size-full items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-lg text-amber-500">
        {cell.value}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(dim, 'relative')}
      animate={celebrate ? { scale: [1, 1.18, 1], rotate: [0, -6, 6, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {inner}
    </motion.div>
  );
}

export default function PatternCompletionGamePlayer({
  level: shell,
  onComplete,
}: GamePlayerProps<PatternLevel>) {
  const sounds = useGameSounds();
  const level = useMemo(() => ({ ...shell, ...pickPatternVariant(shell.id) }), [shell.id]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [wrongToken, setWrongToken] = useState(0);
  const [confettiToken, setConfettiToken] = useState(0);
  const [hintStage, setHintStage] = useState<0 | 1 | 2>(0);
  const [eliminatedOptionId, setEliminatedOptionId] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const isSolved = selected === level.correctOptionId;

  function choose(optionId: string) {
    if (isSolved) return;
    setSelected(optionId);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (optionId === level.correctOptionId) {
      sounds.playSuccessStep();
      setConfettiToken((t) => t + 1);
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

  function useHint() {
    if (hintStage >= 2 || isSolved) return;
    sounds.playHint();
    setHintUsed(true);
    if (hintStage === 0) {
      const candidates = level.options.filter((o) => o.id !== level.correctOptionId && o.id !== eliminatedOptionId);
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setEliminatedOptionId(pick?.id ?? null);
      setHintStage(1);
    } else {
      setHintStage(2);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <Card className="relative overflow-hidden border-fuchsia-200/70 bg-gradient-to-br from-fuchsia-50/70 via-violet-50/50 to-sky-50/70">
        <ConfettiBurst trigger={confettiToken} />
        <CardContent className="flex flex-wrap items-center justify-center gap-3 py-7">
          {level.sequence.map((cell, idx) => (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.06, type: 'spring', stiffness: 300, damping: 18 }}
            >
              <PatternCellView cell={cell} celebrate={isSolved && !cell.value} />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <ShakeOnError trigger={wrongToken} className="flex flex-wrap justify-center gap-4">
        {level.options.map((opt) => {
          const isHintEliminated = !isSolved && hintStage >= 1 && opt.id === eliminatedOptionId;
          const isHintRevealed = !isSolved && hintStage >= 2 && opt.id === level.correctOptionId;
          const isCorrectSelected = selected === opt.id && opt.id === level.correctOptionId;
          return (
            <motion.button
              key={opt.id}
              onClick={() => choose(opt.id)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'tap-target rounded-2xl border-2 bg-card p-2.5 shadow-sm transition-colors',
                selected === opt.id && opt.id === level.correctOptionId && 'border-emerald-500 bg-emerald-50',
                selected === opt.id && opt.id !== level.correctOptionId && 'border-rose-400 bg-rose-50',
                selected !== opt.id && 'border-border hover:border-fuchsia-300',
                isHintEliminated && 'opacity-40',
                isHintRevealed && 'border-amber-400 bg-amber-50 ring-2 ring-amber-300',
              )}
            >
              <PatternCellView cell={opt} size="sm" celebrate={isCorrectSelected} />
            </motion.button>
          );
        })}
      </ShakeOnError>

      <AnimatePresence>
        {!isSolved && hintStage === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-600"
          >
            <Lightbulb className="size-4 shrink-0" /> İpucu: Soluk seçenek muhtemelen yanlış.
          </motion.div>
        )}
        {!isSolved && hintStage === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700"
          >
            <Lightbulb className="size-4 shrink-0" /> İpucu: Sarıyla işaretlenen seçenek doğru olabilir!
          </motion.div>
        )}
        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            <X className="size-4" /> Doğru değil, başka bir seçenek dene.
          </motion.div>
        )}
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm font-bold text-emerald-700"
          >
            <Check className="size-4" /> Harika, doğru buldun!
          </motion.div>
        )}
      </AnimatePresence>

      {!isSolved && (
        <Button variant="outline" onClick={useHint} disabled={hintStage >= 2} className="self-center">
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
      )}
    </div>
  );
}
