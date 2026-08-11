import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Bot, Flag, Minus, Plus, Play, Trash2, Undo2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createId } from '@/lib/id';
import { useGameSounds } from '@/hooks/useGameSounds';
import type { GamePlayerProps } from '../types';
import type { LoopLevel, LoopDirection, Position } from '@/types/game';
import type { LoopCommandEntry } from './types';

const DIR_DELTA: Record<LoopDirection, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const DIR_ROTATE: Record<LoopDirection, number> = { up: -90, right: 0, down: 90, left: 180 };
const DIR_LABEL: Record<LoopDirection, string> = { up: 'Yukarı', down: 'Aşağı', left: 'Sol', right: 'Sağ' };
const DIR_ICON: Record<LoopDirection, typeof ArrowUp> = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };

const CELL_SIZE = 56;
const STEP_DELAY_MS = 320;
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function LoopBuilderGamePlayer({ level, onComplete }: GamePlayerProps<LoopLevel>) {
  const sounds = useGameSounds();
  const [entries, setEntries] = useState<LoopCommandEntry[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [robotPos, setRobotPos] = useState<Position>(level.start);
  const [robotDir, setRobotDir] = useState<LoopDirection>('right');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shakeToken, setShakeToken] = useState(0);
  const [successToken, setSuccessToken] = useState(0);
  const [startedAt] = useState(() => Date.now());

  const cols = level.grid[0]?.length ?? 0;

  const [flash, setFlash] = useState<'error' | 'success' | null>(null);
  const isFirstShake = useRef(true);
  const isFirstSuccess = useRef(true);
  useEffect(() => {
    if (isFirstShake.current) {
      isFirstShake.current = false;
      return;
    }
    setFlash('error');
    const t = setTimeout(() => setFlash(null), 380);
    return () => clearTimeout(t);
  }, [shakeToken]);
  useEffect(() => {
    if (isFirstSuccess.current) {
      isFirstSuccess.current = false;
      return;
    }
    setFlash('success');
    const t = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(t);
  }, [successToken]);

  function addCommand(direction: LoopDirection) {
    if (entries.length >= level.maxEntries || isRunning) return;
    setErrorMessage(null);
    setEntries((prev) => [...prev, { id: createId(), direction, count: 1 }]);
  }

  function changeCount(id: string, delta: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, count: Math.max(1, e.count + delta) } : e)));
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function undoLast() {
    setEntries((prev) => prev.slice(0, -1));
  }

  function clearEntries() {
    setEntries([]);
  }

  async function run() {
    if (entries.length === 0 || isRunning) return;
    setIsRunning(true);
    setErrorMessage(null);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Continue from wherever the robot actually is (not level.start) - a prior failed attempt may
    // have left it mid-grid, and the newly queued commands are relative to that real position.
    let pos = { ...robotPos };
    const rows = level.grid.length;
    let failed = false;
    let succeeded = false;

    outer: for (const entry of entries) {
      setActiveEntryId(entry.id);
      const delta = DIR_DELTA[entry.direction];
      for (let s = 0; s < entry.count; s++) {
        await sleep(STEP_DELAY_MS);
        const next = { row: pos.row + delta.row, col: pos.col + delta.col };
        if (next.row < 0 || next.row >= rows || next.col < 0 || next.col >= cols || level.grid[next.row][next.col] === 'wall') {
          failed = true;
          setRobotDir(entry.direction);
          break outer;
        }
        pos = next;
        setRobotPos(pos);
        setRobotDir(entry.direction);
        sounds.playStep();

        if (pos.row === level.goal.row && pos.col === level.goal.col) {
          succeeded = true;
          break outer;
        }
      }
    }

    setActiveEntryId(null);
    setEntries([]);
    setIsRunning(false);

    if (succeeded) {
      sounds.playSuccessStep();
      setSuccessToken((t) => t + 1);
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
      return;
    }

    sounds.playError();
    setErrorMessage(failed ? 'Duvara çarptın ya da sınırın dışına çıktın.' : 'Komutların bitti ama bayrağa ulaşamadın.');
    if (failed) setShakeToken((t) => t + 1);
  }

  const width = cols * CELL_SIZE;
  const height = level.grid.length * CELL_SIZE;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div>
        <h2 className="font-display text-xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-emerald-100/60 p-4">
            <motion.div
              key={shakeToken}
              initial={{ x: 0 }}
              animate={flash === 'error' ? { x: [0, -9, 8, -6, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.38 }}
              className="relative mx-auto"
              style={{ width, height }}
            >
              {flash && (
                <div
                  className={cn(
                    'pointer-events-none absolute -inset-3 z-20 rounded-2xl transition-opacity',
                    flash === 'error' ? 'bg-rose-500/15' : 'bg-emerald-400/15',
                  )}
                />
              )}
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)` }}>
                {level.grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isGoal = level.goal.row === r && level.goal.col === c;
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={cn(
                          'flex items-center justify-center rounded-lg border shadow-sm',
                          cell === 'wall' ? 'border-transparent bg-slate-800/85' : 'border-emerald-200 bg-white',
                        )}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      >
                        {isGoal && <Flag className="size-5 text-emerald-600" />}
                      </div>
                    );
                  }),
                )}
              </div>

              <motion.div
                className="pointer-events-none absolute z-10 flex items-center justify-center"
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                animate={{ left: robotPos.col * CELL_SIZE, top: robotPos.row * CELL_SIZE }}
                transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
              >
                <div className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg ring-4 ring-white">
                  <Bot className="size-5 transition-transform" style={{ transform: `rotate(${DIR_ROTATE[robotDir]}deg)` }} />
                  {flash === 'success' && (
                    <motion.span
                      key={`sparkle-${successToken}`}
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1.6, opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5 }}
                      className="absolute -right-2 -top-2 text-amber-400"
                    >
                      <Sparkles className="size-5 fill-amber-300" />
                    </motion.span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{errorMessage}</div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Komut Editörü</p>
            <div className="grid grid-cols-3 gap-1.5">
              <div />
              <DirButton direction="up" onClick={addCommand} disabled={isRunning || entries.length >= level.maxEntries} />
              <div />
              <DirButton direction="left" onClick={addCommand} disabled={isRunning || entries.length >= level.maxEntries} />
              <DirButton direction="down" onClick={addCommand} disabled={isRunning || entries.length >= level.maxEntries} />
              <DirButton direction="right" onClick={addCommand} disabled={isRunning || entries.length >= level.maxEntries} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Komut Listesi ({entries.length}/{level.maxEntries})
            </p>
            <div className="flex max-h-56 flex-col gap-1 overflow-y-auto scrollbar-thin">
              {entries.length === 0 && (
                <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                  Henüz komut eklemedin.
                </p>
              )}
              {entries.map((entry) => {
                const Icon = DIR_ICON[entry.direction];
                const isActive = entry.id === activeEntryId;
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm transition',
                      isActive ? 'border-emerald-500 bg-emerald-50' : 'border-border bg-background',
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-emerald-600" />
                    <span className="flex-1 font-medium text-foreground">
                      {DIR_LABEL[entry.direction]}
                      {entry.count > 1 ? ` x${entry.count}` : ''}
                    </span>
                    {!isRunning && (
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => changeCount(entry.id, -1)}
                          className="tap-target flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                        >
                          <Minus className="size-3" />
                        </button>
                        <button
                          onClick={() => changeCount(entry.id, 1)}
                          className="tap-target flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    )}
                    {!isRunning && (
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="tap-target flex size-6 items-center justify-center rounded text-rose-500 hover:bg-rose-50"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={undoLast} disabled={isRunning || entries.length === 0} title="Geri Al">
              <Undo2 className="size-4" />
            </Button>
            <Button variant="outline" onClick={clearEntries} disabled={isRunning || entries.length === 0}>
              <Trash2 className="size-4" /> Temizle
            </Button>
            <Button onClick={run} disabled={isRunning || entries.length === 0} className="flex-1">
              <Play className="size-4" /> Çalıştır
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DirButton({
  direction,
  onClick,
  disabled,
}: {
  direction: LoopDirection;
  onClick: (direction: LoopDirection) => void;
  disabled?: boolean;
}) {
  const Icon = DIR_ICON[direction];
  return (
    <button
      onClick={() => onClick(direction)}
      disabled={disabled}
      className="tap-target flex h-11 items-center justify-center rounded-lg border border-border bg-background text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-40"
    >
      <Icon className="size-5" />
    </button>
  );
}
