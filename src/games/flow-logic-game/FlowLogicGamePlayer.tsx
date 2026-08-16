import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, Reorder, type PanInfo } from 'framer-motion';
import { AlertTriangle, Check, Flag, GitBranch, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfettiBurst } from '@/components/primitives/ConfettiBurst';
import { useGameSounds } from '@/hooks/useGameSounds';
import { createId } from '@/lib/id';
import { cn } from '@/lib/utils';
import { BLOCK_PALETTE } from './blockPalette';
import { FlowBlockCard, type FlowBlockRunState } from './FlowBlockCard';
import { evaluateRun, type PlacedBlock } from './evaluate';
import { generateFlowLevel } from './generator';
import type { GamePlayerProps } from '../types';
import type { FlowBlockKind, FlowchartLevel, FlowPlacedBlockConfig } from '@/types/game';

const RUN_STEP_DELAY_MS = 750;

export default function FlowLogicGamePlayer({ level: shell, onComplete }: GamePlayerProps<FlowchartLevel>) {
  const sounds = useGameSounds();
  // Fresh scenario/variables/actions/answer key each time this level is entered — same template pool
  // everyone shares, but a randomly picked variant, so replays don't just show the memorized answer.
  const level = useMemo(() => generateFlowLevel(shell), [shell.id]);

  const [placed, setPlaced] = useState<PlacedBlock[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [preRunHint, setPreRunHint] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  const [running, setRunning] = useState(false);
  const [runStepIndex, setRunStepIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [missingSlotHint, setMissingSlotHint] = useState<string | null>(null);
  const [haltedAtError, setHaltedAtError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confettiToken, setConfettiToken] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);

  const runResult = useMemo(
    () => (running ? evaluateRun(placed, level.expectedSteps, level.variables) : null),
    // Deliberately recomputed once per run (see runProgram) — placed/level don't need to be deps here
    // since editing while running already clears run state back to idle via clearRunState.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [running],
  );

  const locked = running && !haltedAtError && !completed;

  function clearRunState() {
    setRunning(false);
    setRunStepIndex(0);
    setErrorIndex(null);
    setMissingSlotHint(null);
    setHaltedAtError(false);
    setCompleted(false);
  }

  function addBlock(kind: FlowBlockKind) {
    if (locked) return;
    const config: FlowPlacedBlockConfig = kind === 'loop' ? { loopCount: 1 } : {};
    setPlaced((p) => [...p, { instanceId: createId(), kind, config }]);
    setPreRunHint(null);
    clearRunState();
  }

  function removeBlock(instanceId: string) {
    if (locked) return;
    setPlaced((p) => p.filter((b) => b.instanceId !== instanceId));
    clearRunState();
  }

  function updateBlockConfig(instanceId: string, config: FlowPlacedBlockConfig) {
    setPlaced((p) => p.map((b) => (b.instanceId === instanceId ? { ...b, config } : b)));
    clearRunState();
  }

  function reset() {
    setPlaced([]);
    setPreRunHint(null);
    clearRunState();
  }

  function handlePaletteDragEnd(kind: FlowBlockKind, info: PanInfo) {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    if (distance < 10) return; // short tap — onClick handles it instead
    // The browser fires a synthetic click on this same chip right after the drag's pointerup — swallow
    // just that one, then clear the flag so it never blocks a later click on a *different* chip.
    suppressClickRef.current = true;
    setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const { x, y } = info.point;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      addBlock(kind);
    }
  }

  function handlePaletteClick(kind: FlowBlockKind) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    addBlock(kind);
  }

  function requestHint() {
    if (locked || placed.length === 0) return;
    const result = evaluateRun(placed, level.expectedSteps, level.variables);
    sounds.playHint();
    setHintUsed(true);
    setPreRunHint(result.firstErrorIndex === null ? 'Akışın doğru görünüyor! "Çalıştır" butonuna basabilirsin.' : result.errorHint);
  }

  function runProgram() {
    if (locked || placed.length === 0) return;
    setAttempts((a) => a + 1);
    setPreRunHint(null);
    setErrorIndex(null);
    setMissingSlotHint(null);
    setHaltedAtError(false);
    setCompleted(false);
    setRunStepIndex(0);
    setRunning(true);
  }

  // Step-by-step run animation — advances one block at a time, halting at the first mismatch found
  // by evaluateRun (computed once per run, above).
  useEffect(() => {
    if (!running || haltedAtError || completed || !runResult) return;
    const timer = setTimeout(() => {
      if (runResult.firstErrorIndex === runStepIndex) {
        if (runStepIndex < placed.length) {
          setErrorIndex(runStepIndex);
        } else {
          setMissingSlotHint(runResult.errorHint);
        }
        sounds.playError();
        setHaltedAtError(true);
        return;
      }
      if (runStepIndex >= placed.length) {
        setCompleted(true);
        return;
      }
      sounds.playSuccessStep();
      setRunStepIndex((i) => i + 1);
    }, RUN_STEP_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, runStepIndex, haltedAtError, completed, runResult, placed.length]);

  // Fires once the run reaches the end with no errors.
  useEffect(() => {
    if (!completed) return;
    sounds.playLevelComplete();
    setConfettiToken((t) => t + 1);
    const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
    const pointsEarned = attempts === 1 && !hintUsed ? level.points : Math.round(level.points * 0.6);
    const timer = setTimeout(() => {
      onComplete({
        levelId: level.id,
        levelOrder: level.order,
        isCorrect: true,
        attempts,
        pointsEarned,
        timeSpentSeconds,
        hintUsed,
      });
    }, 1400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  function cardState(idx: number): FlowBlockRunState {
    if (errorIndex === idx) return 'error';
    if (!running) return 'idle';
    if (idx < runStepIndex) return 'passed';
    if (idx === runStepIndex) return 'active';
    return 'idle';
  }

  const loopBlock = placed.find((b) => b.kind === 'loop');
  const resultText = level.resultTemplate.replace('{count}', String(loopBlock?.config.loopCount ?? ''));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <ConfettiBurst trigger={confettiToken} />
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

      <Card>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Programın (üstten alta çalışır):</p>
          <div ref={canvasRef} className="rounded-lg border-2 border-dashed border-border p-3">
            <Reorder.Group
              axis="y"
              values={placed}
              onReorder={(next) => {
                if (locked) return;
                setPlaced(next);
                clearRunState();
              }}
              className="flex min-h-16 flex-col gap-2"
            >
              <AnimatePresence>
                {placed.map((block, idx) => (
                  <Reorder.Item
                    key={block.instanceId}
                    value={block}
                    layout
                    style={{ touchAction: locked ? 'auto' : 'none' }}
                    drag={locked ? false : undefined}
                  >
                    <FlowBlockCard
                      block={block}
                      index={idx}
                      variables={level.variables}
                      actionOptions={level.actionOptions}
                      operatorOptions={level.operatorOptions}
                      state={cardState(idx)}
                      errorHint={errorIndex === idx ? runResult?.errorHint : null}
                      disabled={locked}
                      onConfigChange={(config) => updateBlockConfig(block.instanceId, config)}
                      onRemove={() => removeBlock(block.instanceId)}
                    />
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
            {placed.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aşağıdaki blokları buraya sürükle ya da dokun. "Sonucu Hesapla" bloğu ile bitirmelisin.
              </p>
            )}
            {missingSlotHint && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border-2 border-dashed border-rose-400 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                <AlertTriangle className="size-4 shrink-0" /> {missingSlotHint}
              </div>
            )}
          </div>

          <p className="text-sm font-semibold text-muted-foreground">Bloklar:</p>
          <div className="flex flex-wrap gap-2">
            {BLOCK_PALETTE.map((entry) => {
              const Icon = entry.icon;
              return (
                <motion.div
                  key={entry.kind}
                  drag={locked ? false : true}
                  dragSnapToOrigin
                  dragElastic={0.15}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.08, boxShadow: '0 8px 20px rgba(0,0,0,0.2)', zIndex: 10 }}
                  onDragEnd={(_e, info) => handlePaletteDragEnd(entry.kind, info)}
                  onClick={() => handlePaletteClick(entry.kind)}
                  style={{ touchAction: 'none' }}
                  className={cn(
                    'tap-target flex cursor-grab select-none items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-violet-400 hover:bg-violet-50 active:cursor-grabbing',
                    locked && 'pointer-events-none opacity-50',
                  )}
                >
                  <Icon className="size-4 shrink-0 text-violet-600" />
                  {entry.label}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {completed && (
        <Card className="border-emerald-300 bg-emerald-50">
          <CardContent className="flex items-center gap-3 py-4">
            <Flag className="size-5 shrink-0 text-emerald-600" />
            <p className="font-display text-base font-bold text-emerald-800">{resultText}</p>
          </CardContent>
        </Card>
      )}

      {preRunHint && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> İpucu: {preRunHint}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={reset} disabled={locked} className={cn(placed.length === 0 && 'opacity-50')}>
          <RotateCcw className="size-4" /> Sıfırla
        </Button>
        <Button variant="outline" onClick={requestHint} disabled={locked || placed.length === 0}>
          <Lightbulb className="size-4" /> İpucu Al
        </Button>
        <Button onClick={runProgram} disabled={locked || placed.length === 0 || completed} className="flex-1">
          <Check className="size-4" /> Çalıştır
        </Button>
      </div>
    </div>
  );
}
