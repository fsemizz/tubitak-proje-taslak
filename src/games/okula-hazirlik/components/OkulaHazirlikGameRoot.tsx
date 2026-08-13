import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, ChefHat, Home, Lightbulb, Rocket, ShowerHead, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GameHUD } from '@/features/game-player/components/GameHUD';
import { ExitConfirmDialog } from '@/features/game-player/components/ExitConfirmDialog';
import { HouseMapCanvas } from './HouseMapCanvas';
import { CommandEditor } from './CommandEditor';
import { LevelSelectScreen } from './LevelSelectScreen';
import { InventoryStrip } from './InventoryStrip';
import { PuzzleScreen } from '../puzzles/PuzzleScreen';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { GameCompleteScreen } from './GameCompleteScreen';
import { anaokuluLevels } from '../levels';
import { ilkokuluLevels } from '../levels7x7';
import { houseMaps, houseMaps7x7 } from '../houseMaps';
import { shortestPathLength } from '../pathfinding';
import { accuracyTierFromAttempts, calculateLevelStars, computeHouseNavMetrics } from '../scoring';
import { useGameSounds } from '@/hooks/useGameSounds';
import { createId } from '@/lib/id';
import { calculateStarRating } from '@/lib/scoring';
import { useSessionStore } from '@/stores/useSessionStore';
import { resultsService } from '@/services/serviceProvider';
import { ROUTE_PATHS } from '@/app/routePaths';
import type { GameDefinition } from '@/types/game';
import type { GameCompletionSummary, HouseNavLevelMetric, LevelAttemptResult } from '@/types/result';
import type { CommandEntry, CommandType, HouseNavLevel, Position, SchoolReadinessLevel } from '../types';

const DIR_DELTA: Record<string, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const ROOM_ICON: Record<string, typeof Bed> = {
  'child-room': Bed,
  bathroom: ShowerHead,
  kitchen: ChefHat,
  'child-room7': Bed,
  bathroom7: ShowerHead,
  kitchen7: ChefHat,
};

const DIR_LABEL_TR: Record<string, string> = {
  up: 'yukarı',
  down: 'aşağı',
  left: 'sola',
  right: 'sağa',
};

const STEP_DELAY_MS = 380;
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface OkulaHazirlikGameRootProps {
  game: GameDefinition;
}

type LevelPhase = 'selectingLevel' | 'playing' | 'levelComplete' | 'gameComplete';

export function OkulaHazirlikGameRoot({ game }: OkulaHazirlikGameRootProps) {
  const navigate = useNavigate();
  const currentStudent = useSessionStore((s) => s.currentStudent);
  const sounds = useGameSounds();

  const [schoolLevel, setSchoolLevel] = useState<SchoolReadinessLevel>('anaokulu');
  const [introOpen, setIntroOpen] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [phase, setPhase] = useState<LevelPhase>('selectingLevel');
  const [entries, setEntries] = useState<CommandEntry[]>([]);
  const [characterPosition, setCharacterPosition] = useState<Position>(anaokuluLevels[0].startPosition);
  const [characterDirection, setCharacterDirection] = useState('right');
  const [isRunning, setIsRunning] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [taskProgress, setTaskProgress] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [shakeToken, setShakeToken] = useState(0);
  const [successToken, setSuccessToken] = useState(0);
  const [levelStartedAt, setLevelStartedAt] = useState(() => Date.now());
  const [gameStartedAt] = useState(() => Date.now());

  // Tracks totals across every attempt made on the current level (not just the final, successful run).
  const [cumulativeSteps, setCumulativeSteps] = useState(0);
  const [cumulativeCommands, setCumulativeCommands] = useState(0);
  const [cumulativeEnterErrors, setCumulativeEnterErrors] = useState(0);
  const [cumulativeOrderErrors, setCumulativeOrderErrors] = useState(0);
  const [totalRunsUsed, setTotalRunsUsed] = useState(0);
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [puzzleOpen, setPuzzleOpen] = useState(false);

  const [collectedMetrics, setCollectedMetrics] = useState<HouseNavLevelMetric[]>([]);
  const [lastLevelMetric, setLastLevelMetric] = useState<HouseNavLevelMetric | null>(null);
  const [finalSummary, setFinalSummary] = useState<{ metrics: ReturnType<typeof computeHouseNavMetrics> } | null>(
    null,
  );
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const levels: HouseNavLevel[] = schoolLevel === 'ilkokul' ? ilkokuluLevels : anaokuluLevels;
  const maps = schoolLevel === 'ilkokul' ? houseMaps7x7 : houseMaps;
  const level = levels[levelIndex];
  const map = maps[level.mapRoomId];
  const nextTaskStep = level.taskSteps[taskProgress];
  const activeTargetObjectId = nextTaskStep?.targetObjectId;
  const studentFirstName = currentStudent?.firstName?.trim() || 'Kahraman';

  function resetForLevel(index: number, activeLevels: HouseNavLevel[]) {
    const lvl = activeLevels[index];
    setEntries([]);
    setCharacterPosition(lvl.startPosition);
    setCharacterDirection('right');
    setAttempts(0);
    setTaskProgress(0);
    setHintUsed(false);
    setHintMessage(null);
    setErrorMessage(null);
    setFeedbackMessage(null);
    setCumulativeSteps(0);
    setCumulativeCommands(0);
    setCumulativeEnterErrors(0);
    setCumulativeOrderErrors(0);
    setTotalRunsUsed(0);
    setCollectedItems([]);
    setPuzzleOpen(false);
    setLevelStartedAt(Date.now());
  }

  function handleSelectSchoolLevel(chosen: SchoolReadinessLevel) {
    setSchoolLevel(chosen);
    setLevelIndex(0);
    resetForLevel(0, chosen === 'ilkokul' ? ilkokuluLevels : anaokuluLevels);
    setCollectedMetrics([]);
    setIntroOpen(true);
    setPhase('playing');
  }

  function addCommand(type: CommandType) {
    const actionLabel = type === 'enter' ? nextTaskStep?.actionLabel : undefined;
    setEntries((prev) => [...prev, { id: createId(), type, count: 1, actionLabel }]);
    setHintMessage(null);
  }

  function changeCount(id: string, delta: number) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, count: Math.max(1, e.count + delta) } : e)),
    );
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function clearEntries() {
    setEntries([]);
  }

  function useHint() {
    const targetObject = map.objects.find((o) => o.id === activeTargetObjectId);
    if (!targetObject || !nextTaskStep) return;

    if (characterPosition.row === targetObject.position.row && characterPosition.col === targetObject.position.col) {
      setHintMessage(`İpucu: Tam doğru yerdesin! Şimdi "${nextTaskStep.actionLabel}" düğmesine bas.`);
    } else {
      const directions: CommandType[] = ['up', 'down', 'left', 'right'];
      let bestDir: CommandType | null = null;
      let bestDist = Infinity;
      for (const dir of directions) {
        const delta = DIR_DELTA[dir];
        const next = { row: characterPosition.row + delta.row, col: characterPosition.col + delta.col };
        if (next.row < 0 || next.row >= map.grid.length || next.col < 0 || next.col >= map.grid[0].length) continue;
        if (map.grid[next.row][next.col].type === 'wall') continue;
        const dist = shortestPathLength(map, next, targetObject.position);
        if (dist < bestDist) {
          bestDist = dist;
          bestDir = dir;
        }
      }
      if (bestDir) {
        setHintMessage(`İpucu: Bir adım ${DIR_LABEL_TR[bestDir]} gitmeyi dene, hedefe yaklaşacaksın!`);
      }
    }
    sounds.playHint();
    setHintUsed(true);
  }

  function finishLevelSuccess(
    totalSteps: number,
    totalCommands: number,
    totalEnterErrors: number,
    totalOrderErrors: number,
    totalRuns: number,
  ) {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const waypoints: Position[] = [level.startPosition, ...level.taskSteps.map((t) => {
      const obj = map.objects.find((o) => o.id === t.targetObjectId)!;
      return obj.position;
    })];
    let shortest = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      shortest += shortestPathLength(map, waypoints[i], waypoints[i + 1]);
    }
    const pathEfficiencyPct = totalSteps > 0 ? Math.min(100, (shortest / totalSteps) * 100) : 100;
    // Rewards batching a whole step into one run over splitting it into many trial-and-error single moves.
    const planningEfficiencyPct = Math.min(100, (level.taskSteps.length / Math.max(1, totalRuns)) * 100);
    const accuracyTier = accuracyTierFromAttempts(newAttempts);
    const starRating = calculateLevelStars(accuracyTier, pathEfficiencyPct, hintUsed, planningEfficiencyPct);

    const metric: HouseNavLevelMetric = {
      levelId: level.id,
      levelLabel: level.title,
      starRating,
      accuracyTier,
      pathEfficiencyPct,
      stepsUsed: totalSteps,
      shortestPathLength: shortest,
      unnecessarySteps: Math.max(0, totalSteps - shortest),
      commandEntriesUsed: totalCommands,
      enterErrors: totalEnterErrors,
      orderErrors: totalOrderErrors,
      attempts: newAttempts,
      hintUsed,
      planningSuccess: newAttempts === 1,
      totalRunsUsed: totalRuns,
      planningEfficiencyPct,
      timeSpentSeconds: Math.round((Date.now() - levelStartedAt) / 1000),
    };

    setLastLevelMetric(metric);
    setCollectedMetrics((prev) => [...prev, metric]);
    setIsRunning(false);
    setPhase('levelComplete');
  }

  function handlePuzzleSolved() {
    if (!nextTaskStep) return;
    setPuzzleOpen(false);
    setFeedbackMessage(nextTaskStep.feedbackLabel);
    setCollectedItems((prev) => [...prev, nextTaskStep.feedbackLabel]);
    sounds.playSuccessStep();
    setSuccessToken((t) => t + 1);
    const newProgress = taskProgress + 1;
    setTaskProgress(newProgress);
    if (newProgress >= level.taskSteps.length) {
      finishLevelSuccess(cumulativeSteps, cumulativeCommands, cumulativeEnterErrors, cumulativeOrderErrors, totalRunsUsed);
    }
  }

  async function runCommands() {
    if (entries.length === 0 || isRunning) return;
    setIsRunning(true);
    setErrorMessage(null);
    setFeedbackMessage(null);
    setHintMessage(null);

    let pos = { ...characterPosition };
    let dir = characterDirection;
    let stepsUsed = 0;
    let enterErrors = 0;
    let orderErrors = 0;
    let progress = taskProgress;
    // Only a genuine mistake (walked into a wall, pressed the action in the wrong place, or broke the
    // required order) counts as a failed attempt. Simply running out of queued commands mid-task does
    // not - everything done so far was correct, the player just needs to queue more.
    let failed: 'wall' | 'wrongEnter' | 'orderBroken' | null = null;
    let succeeded = false;

    outer: for (const entry of entries) {
      const repeat = entry.type === 'enter' ? 1 : entry.count;
      for (let i = 0; i < repeat; i++) {
        setActiveEntryId(entry.id);
        await sleep(STEP_DELAY_MS);

        if (entry.type === 'enter') {
          const expected = level.taskSteps[progress];
          const matchAny = level.taskSteps.find((t) => {
            const obj = map.objects.find((o) => o.id === t.targetObjectId);
            return obj && obj.position.row === pos.row && obj.position.col === pos.col;
          });

          if (expected) {
            const expectedObj = map.objects.find((o) => o.id === expected.targetObjectId);
            const isAtExpected =
              expectedObj && expectedObj.position.row === pos.row && expectedObj.position.col === pos.col;

            if (isAtExpected && expected.kind === 'miniPuzzle') {
              // Opens the puzzle overlay; progress only advances once the puzzle itself is solved
              // via handlePuzzleSolved(). This must be an explicit state flip, not just "character
              // happens to be standing on the target cell" - arriving there via plain movement
              // should not pop the puzzle open on its own.
              setPuzzleOpen(true);
              break outer;
            }

            if (isAtExpected) {
              setFeedbackMessage(expected.feedbackLabel);
              setCollectedItems((prev) => [...prev, expected.feedbackLabel]);
              sounds.playSuccessStep();
              setSuccessToken((t) => t + 1);
              progress += 1;
              setTaskProgress(progress);
              if (progress >= level.taskSteps.length) {
                succeeded = true;
                break outer;
              }
              continue;
            }
          }

          if (matchAny) {
            orderErrors += 1;
            failed = 'orderBroken';
          } else {
            enterErrors += 1;
            failed = 'wrongEnter';
          }
          break outer;
        }

        dir = entry.type;
        setCharacterDirection(dir);
        const delta = DIR_DELTA[dir];
        const next = { row: pos.row + delta.row, col: pos.col + delta.col };
        const rows = map.grid.length;
        const cols = map.grid[0]?.length ?? 0;
        if (next.row < 0 || next.row >= rows || next.col < 0 || next.col >= cols || map.grid[next.row][next.col].type === 'wall') {
          failed = 'wall';
          break outer;
        }
        pos = next;
        stepsUsed += 1;
        setCharacterPosition(pos);
        sounds.playStep();

        const expectedMove = level.taskSteps[progress];
        if (expectedMove?.kind === 'moveTo') {
          const obj = map.objects.find((o) => o.id === expectedMove.targetObjectId);
          if (obj && obj.position.row === pos.row && obj.position.col === pos.col) {
            setFeedbackMessage(expectedMove.feedbackLabel);
            setCollectedItems((prev) => [...prev, expectedMove.feedbackLabel]);
            sounds.playSuccessStep();
            setSuccessToken((t) => t + 1);
            progress += 1;
            setTaskProgress(progress);
            if (progress >= level.taskSteps.length) {
              succeeded = true;
              break outer;
            }
          }
        }
        // 'miniPuzzle' steps never auto-trigger on arrival - the player must explicitly run the
        // "✨ [Görevi Yap]" action command once there, same as 'enterAt' steps.
      }
    }

    setActiveEntryId(null);
    // Always start the next attempt with an empty queue: leaving old commands in place made a fresh
    // command silently combine with the previous (already-tried) ones on the next run.
    setEntries([]);

    // Roll this run's totals into the level's running totals regardless of outcome - steps and
    // commands used are real progress either way, not just on the final winning run.
    const totalSteps = cumulativeSteps + stepsUsed;
    const totalCommands = cumulativeCommands + entries.length;
    const totalEnterErrors = cumulativeEnterErrors + enterErrors;
    const totalOrderErrors = cumulativeOrderErrors + orderErrors;
    const totalRuns = totalRunsUsed + 1;
    setCumulativeSteps(totalSteps);
    setCumulativeCommands(totalCommands);
    setCumulativeEnterErrors(totalEnterErrors);
    setCumulativeOrderErrors(totalOrderErrors);
    setTotalRunsUsed(totalRuns);

    if (succeeded) {
      finishLevelSuccess(totalSteps, totalCommands, totalEnterErrors, totalOrderErrors, totalRuns);
      return;
    }

    if (failed) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const messages: Record<'wall' | 'wrongEnter' | 'orderBroken', string> = {
        wall: '🤔 Bu yönde duvar var ya da sınırın dışına çıktın. Komutlarını düzenleyip tekrar dene.',
        wrongEnter: '🤔 Burada yapılacak bir görev yok. Doğru yere gidip tekrar dene.',
        orderBroken: '🤔 Sırayı bozdun! Görevleri doğru sırayla yapmalısın.',
      };
      setErrorMessage(messages[failed]);
      sounds.playError();
      if (failed === 'wall') {
        setShakeToken((t) => t + 1);
      }
    }
    // Otherwise: the queue simply ran out before finishing every step, but nothing done was wrong -
    // no error sound/banner, no attempt penalty. The success feedback from the completed steps (if
    // any) stays on screen, and the "Şimdi yapman gereken" banner already points to what's next.

    setIsRunning(false);
  }

  async function handleLevelNext() {
    if (levelIndex + 1 < levels.length) {
      const nextIndex = levelIndex + 1;
      setLevelIndex(nextIndex);
      resetForLevel(nextIndex, levels);
      setPhase('playing');
      return;
    }

    const metrics = computeHouseNavMetrics(collectedMetrics, levels.length);
    setFinalSummary({ metrics });

    if (currentStudent) {
      const levelResults: LevelAttemptResult[] = collectedMetrics.map((m, idx) => ({
        levelId: m.levelId,
        levelOrder: idx + 1,
        isCorrect: true,
        attempts: m.attempts,
        pointsEarned: Math.round(levels[idx].points * (m.starRating / 3)),
        timeSpentSeconds: m.timeSpentSeconds,
      }));
      const totalPoints = levelResults.reduce((s, r) => s + r.pointsEarned, 0);
      const maxPoints = levels.reduce((s, l) => s + l.points, 0);
      const totalTimeSeconds = Math.round((Date.now() - gameStartedAt) / 1000);

      const input: Omit<GameCompletionSummary, 'id' | 'completedAt'> = {
        studentId: currentStudent.id,
        studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
        gameId: game.id,
        gameTitle: game.title,
        levelResults,
        totalPoints,
        maxPoints,
        starRating: calculateStarRating(totalPoints, maxPoints),
        totalTimeSeconds,
        houseNavMetrics: metrics,
      };
      await resultsService.submitGameCompletion(input);
    }

    setPhase('gameComplete');
  }

  function handleReplay() {
    setPhase('selectingLevel');
    setCollectedMetrics([]);
    setFinalSummary(null);
  }

  function handleExitConfirm() {
    setExitDialogOpen(false);
    navigate(ROUTE_PATHS.home);
  }

  if (phase === 'selectingLevel') {
    return <LevelSelectScreen studentFirstName={studentFirstName} onSelect={handleSelectSchoolLevel} />;
  }

  if (phase === 'gameComplete' && finalSummary) {
    const totalTimeSeconds = finalSummary.metrics.levels.reduce((s, l) => s + l.timeSpentSeconds, 0);
    return (
      <GameCompleteScreen
        metrics={finalSummary.metrics}
        totalTimeSeconds={totalTimeSeconds}
        studentFirstName={studentFirstName}
        onReplay={handleReplay}
        onPlayGameComplete={sounds.playGameComplete}
      />
    );
  }

  if (phase === 'levelComplete' && lastLevelMetric) {
    return (
      <LevelCompleteScreen
        metric={lastLevelMetric}
        isLastLevel={levelIndex + 1 >= levels.length}
        onNext={handleLevelNext}
        onPlayLevelComplete={sounds.playLevelComplete}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <GameHUD
        game={game}
        totalLevels={levels.length}
        currentIndex={levelIndex}
        onRequestExit={() => setExitDialogOpen(true)}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-foreground">{level.title}</h2>
          <p className="mt-1 text-muted-foreground">{level.instructions}</p>
        </div>
        <InventoryStrip items={collectedItems} />
      </div>

      {puzzleOpen && nextTaskStep ? (
        <PuzzleScreen taskStep={nextTaskStep} onSolved={handlePuzzleSolved} />
      ) : (
        <>
          {nextTaskStep && (
            <div className="flex items-center gap-2.5 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-teal-800">
              <Target className="size-5 shrink-0 text-teal-600" />
              <p className="text-sm font-bold">Şimdi yapman gereken: {nextTaskStep.actionLabel}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">
                {map.variant === 'house' ? (
                  <>
                    <Home className="size-3.5 text-teal-600" /> Ev Krokisi Görünümü
                  </>
                ) : (
                  <>
                    {(() => {
                      const RoomIcon = ROOM_ICON[map.roomId] ?? Home;
                      return <RoomIcon className="size-3.5 text-teal-600" />;
                    })()}{' '}
                    {map.label} İçindesin
                  </>
                )}
              </div>
              <HouseMapCanvas
                map={map}
                characterPosition={characterPosition}
                characterDirection={characterDirection}
                activeTargetObjectId={activeTargetObjectId}
                shakeToken={shakeToken}
                successToken={successToken}
              />
              <Button variant="outline" size="sm" onClick={useHint} disabled={isRunning || !nextTaskStep} className="self-start">
                <Lightbulb className="size-4" /> İpucu Al
              </Button>
              {hintMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
                  <Lightbulb className="size-4 shrink-0" /> {hintMessage}
                </div>
              )}
              {feedbackMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                  <Sparkles className="size-4 shrink-0" /> {feedbackMessage}
                </div>
              )}
              {errorMessage && (
                <div className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700">{errorMessage}</div>
              )}
            </div>

            <CommandEditor
              entries={entries}
              onAddCommand={addCommand}
              onChangeCount={changeCount}
              onRemoveEntry={removeEntry}
              onClear={clearEntries}
              onRun={runCommands}
              isRunning={isRunning}
              activeEntryId={activeEntryId}
              nextActionLabel={
                nextTaskStep?.kind === 'enterAt' || nextTaskStep?.kind === 'miniPuzzle'
                  ? nextTaskStep.actionLabel
                  : undefined
              }
            />
          </div>
        </>
      )}

      <ExitConfirmDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen} onConfirm={handleExitConfirm} />

      <Dialog open={introOpen} onOpenChange={setIntroOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
              <Rocket className="size-7" />
            </div>
            <DialogTitle className="text-center font-display text-xl font-extrabold text-foreground">
              Harika seçim, {studentFirstName}! {schoolLevel === 'ilkokul' ? '🎒' : '🐥'}
            </DialogTitle>
            <DialogDescription className="text-center text-sm leading-relaxed text-muted-foreground">
              Bugün seninle birlikte okula hazırlanacağız! Evinde küçük görevlerin var: elini yüzünü yıka, kahvaltını
              yap, çantanı hazırla ve kapıdan çık. Her bölümde oklarla kahramanı yönlendireceksin ve bir görevi
              tamamlayacaksın. Takılırsan "İpucu Al" düğmesine basabilirsin. Hazırsan başlayalım {studentFirstName},
              sen yaparsın! 💪
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button size="lg" className="w-full" onClick={() => setIntroOpen(false)}>
              <Rocket className="size-4" /> Hadi Başlayalım!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
