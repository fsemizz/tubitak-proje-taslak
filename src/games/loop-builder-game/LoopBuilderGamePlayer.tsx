import { useState } from 'react';
import { ArrowUp, Check, Flag, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GamePlayerProps } from '../types';
import type { LoopBlockType, LoopLevel, Position } from '@/types/game';

const BLOCK_LABEL: Record<LoopBlockType, string> = {
  forward1: '1 İleri',
  forward2: '2 İleri',
  forward3: '3 İleri',
  turnLeft: '⟲ Sola Dön',
  turnRight: '⟳ Sağa Dön',
  repeat2: '2 Kere Tekrarla',
  repeat3: '3 Kere Tekrarla',
  repeat4: '4 Kere Tekrarla',
};

const BLOCK_STEPS: Record<LoopBlockType, number> = {
  forward1: 1,
  forward2: 2,
  forward3: 3,
  turnLeft: 0,
  turnRight: 0,
  repeat2: 2,
  repeat3: 3,
  repeat4: 4,
};

const DIR_DELTA: Record<string, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const DIR_ORDER = ['up', 'right', 'down', 'left'] as const;
const DIR_ROTATE: Record<string, number> = { up: -90, right: 0, down: 90, left: 180 };

function turn(dir: string, way: 'left' | 'right'): string {
  const idx = DIR_ORDER.indexOf(dir as (typeof DIR_ORDER)[number]);
  const delta = way === 'right' ? 1 : -1;
  return DIR_ORDER[(idx + delta + 4) % 4];
}

interface SimResult {
  path: Position[];
  success: boolean;
  hitWall: boolean;
  finalDir: string;
}

function simulate(level: LoopLevel, plan: LoopBlockType[]): SimResult {
  let pos = { ...level.start };
  let dir: string = level.startDirection;
  const path: Position[] = [pos];
  const rows = level.grid.length;
  const cols = level.grid[0]?.length ?? 0;

  for (const block of plan) {
    if (block === 'turnLeft') {
      dir = turn(dir, 'left');
      continue;
    }
    if (block === 'turnRight') {
      dir = turn(dir, 'right');
      continue;
    }
    const steps = BLOCK_STEPS[block];
    const delta = DIR_DELTA[dir];
    for (let s = 0; s < steps; s++) {
      const next = { row: pos.row + delta.row, col: pos.col + delta.col };
      if (next.row < 0 || next.row >= rows || next.col < 0 || next.col >= cols) {
        return { path, success: false, hitWall: true, finalDir: dir };
      }
      if (level.grid[next.row][next.col] === 'wall') {
        return { path, success: false, hitWall: true, finalDir: dir };
      }
      pos = next;
      path.push(pos);
    }
  }

  const success = pos.row === level.goal.row && pos.col === level.goal.col;
  return { path, success, hitWall: false, finalDir: dir };
}

export default function LoopBuilderGamePlayer({
  level,
  onComplete,
}: GamePlayerProps<LoopLevel>) {
  const [plan, setPlan] = useState<LoopBlockType[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<SimResult | null>(null);
  const [startedAt] = useState(() => Date.now());

  const cols = level.grid[0]?.length ?? 0;

  function addBlock(block: LoopBlockType) {
    if (plan.length >= level.maxBlocks) return;
    setResult(null);
    setPlan((p) => [...p, block]);
  }

  function undoLast() {
    setResult(null);
    setPlan((p) => p.slice(0, -1));
  }

  function resetPlan() {
    setResult(null);
    setPlan([]);
  }

  function run() {
    const sim = simulate(level, plan);
    setResult(sim);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (sim.success) {
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
    }
  }

  const robotPos = result?.path[result.path.length - 1] ?? level.start;
  const robotDir = result?.finalDir ?? level.startDirection;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <div
        className="mx-auto grid gap-1 rounded-xl bg-emerald-50 p-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {level.grid.map((row, r) =>
          row.map((cell, c) => {
            const isRobot = robotPos.row === r && robotPos.col === c;
            const isGoal = level.goal.row === r && level.goal.col === c;
            return (
              <div
                key={`${r}-${c}`}
                className={cn(
                  'flex size-10 items-center justify-center rounded-md border text-emerald-700 sm:size-12',
                  cell === 'wall' ? 'border-transparent bg-emerald-900/70' : 'border-emerald-200 bg-white',
                )}
              >
                {isGoal && !isRobot && <Flag className="size-5 text-emerald-600" />}
                {isRobot && (
                  <ArrowUp
                    className="size-6 text-indigo-600 transition-transform"
                    style={{ transform: `rotate(${DIR_ROTATE[robotDir]}deg)` }}
                  />
                )}
              </div>
            );
          }),
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {level.availableBlocks.map((block) => (
          <button
            key={block}
            onClick={() => addBlock(block)}
            disabled={plan.length >= level.maxBlocks}
            className="tap-target rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-40"
          >
            {BLOCK_LABEL[block]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border-2 border-dashed border-border p-3">
        <span className="text-xs font-semibold text-muted-foreground">
          Plan ({plan.length}/{level.maxBlocks}):
        </span>
        {plan.map((block, idx) => (
          <span key={idx} className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white">
            {BLOCK_LABEL[block]}
          </span>
        ))}
        {plan.length === 0 && <span className="text-sm text-muted-foreground">Henüz blok eklemedin.</span>}
      </div>

      {result && !result.success && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <X className="size-4" /> {result.hitWall ? 'Duvara çarptın veya sınırın dışına çıktın.' : 'Hedefe ulaşamadın.'}
        </div>
      )}
      {result?.success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="size-4" /> Harika, hedefe ulaştın!
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={undoLast} disabled={plan.length === 0}>
          Geri Al
        </Button>
        <Button variant="outline" onClick={resetPlan} disabled={plan.length === 0}>
          <RotateCcw className="size-4" /> Sıfırla
        </Button>
        <Button onClick={run} disabled={plan.length === 0} className="flex-1">
          Çalıştır
        </Button>
      </div>
    </div>
  );
}
