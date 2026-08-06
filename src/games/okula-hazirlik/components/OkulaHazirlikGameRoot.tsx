import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameHUD } from '@/features/game-player/components/GameHUD';
import { ExitConfirmDialog } from '@/features/game-player/components/ExitConfirmDialog';
import { HouseMapCanvas } from './HouseMapCanvas';
import { CommandEditor } from './CommandEditor';
import { LevelCompleteScreen } from './LevelCompleteScreen';
import { GameCompleteScreen } from './GameCompleteScreen';
import { houseNavLevels } from '../levels';
import { houseMaps } from '../houseMaps';
import { shortestPathLength } from '../pathfinding';
import { accuracyTierFromAttempts, calculateLevelStars, computeHouseNavMetrics } from '../scoring';
import { createId } from '@/lib/id';
import { calculateStarRating } from '@/lib/scoring';
import { useSessionStore } from '@/stores/useSessionStore';
import { resultsService } from '@/services/serviceProvider';
import { ROUTE_PATHS } from '@/app/routePaths';
import type { GameDefinition } from '@/types/game';
import type { GameCompletionSummary, HouseNavLevelMetric, LevelAttemptResult } from '@/types/result';
import type { CommandEntry, CommandType, Position } from '../types';

const DIR_DELTA: Record<string, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const STEP_DELAY_MS = 380;
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface OkulaHazirlikGameRootProps {
  game: GameDefinition;
}

type LevelPhase = 'playing' | 'levelComplete' | 'gameComplete';

export function OkulaHazirlikGameRoot({ game }: OkulaHazirlikGameRootProps) {
  const navigate = useNavigate();
  const currentStudent = useSessionStore((s) => s.currentStudent);

  const [levelIndex, setLevelIndex] = useState(0);
  const [phase, setPhase] = useState<LevelPhase>('playing');
  const [entries, setEntries] = useState<CommandEntry[]>([]);
  const [characterPosition, setCharacterPosition] = useState<Position>(houseNavLevels[0].startPosition);
  const [characterDirection, setCharacterDirection] = useState('right');
  const [isRunning, setIsRunning] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [taskProgress, setTaskProgress] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [levelStartedAt, setLevelStartedAt] = useState(() => Date.now());
  const [gameStartedAt] = useState(() => Date.now());
  const [collectedMetrics, setCollectedMetrics] = useState<HouseNavLevelMetric[]>([]);
  const [lastLevelMetric, setLastLevelMetric] = useState<HouseNavLevelMetric | null>(null);
  const [finalSummary, setFinalSummary] = useState<{ metrics: ReturnType<typeof computeHouseNavMetrics> } | null>(
    null,
  );
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const level = houseNavLevels[levelIndex];
  const map = houseMaps[level.mapRoomId];
  const nextTaskStep = level.taskSteps[taskProgress];
  const activeTargetObjectId = nextTaskStep?.targetObjectId;

  function resetForLevel(index: number) {
    const lvl = houseNavLevels[index];
    setEntries([]);
    setCharacterPosition(lvl.startPosition);
    setCharacterDirection('right');
    setAttempts(0);
    setTaskProgress(0);
    setHintUsed(false);
    setErrorMessage(null);
    setFeedbackMessage(null);
    setLevelStartedAt(Date.now());
  }

  function addCommand(type: CommandType) {
    setEntries((prev) => [...prev, { id: createId(), type, count: 1 }]);
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
    if (!targetObject) return;
    if (characterPosition.row === targetObject.position.row && characterPosition.col === targetObject.position.col) {
      addCommand('enter');
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
      if (bestDir) addCommand(bestDir);
    }
    setHintUsed(true);
  }

  async function runCommands() {
    if (entries.length === 0 || isRunning) return;
    setIsRunning(true);
    setErrorMessage(null);
    setFeedbackMessage(null);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let pos = { ...characterPosition };
    let dir = characterDirection;
    let stepsUsed = 0;
    let enterErrors = 0;
    let orderErrors = 0;
    let progress = taskProgress;
    let failed: 'wall' | 'wrongEnter' | 'orderBroken' | 'incomplete' | null = null;
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

            if (isAtExpected) {
              setFeedbackMessage(expected.feedbackLabel);
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

        const expectedMove = level.taskSteps[progress];
        if (expectedMove?.kind === 'moveTo') {
          const obj = map.objects.find((o) => o.id === expectedMove.targetObjectId);
          if (obj && obj.position.row === pos.row && obj.position.col === pos.col) {
            setFeedbackMessage(expectedMove.feedbackLabel);
            progress += 1;
            setTaskProgress(progress);
            if (progress >= level.taskSteps.length) {
              succeeded = true;
              break outer;
            }
          }
        }
      }
    }

    setActiveEntryId(null);

    if (!succeeded && !failed) {
      failed = 'incomplete';
    }

    if (succeeded) {
      const waypoints: Position[] = [level.startPosition, ...level.taskSteps.map((t) => {
        const obj = map.objects.find((o) => o.id === t.targetObjectId)!;
        return obj.position;
      })];
      let shortest = 0;
      for (let i = 0; i < waypoints.length - 1; i++) {
        shortest += shortestPathLength(map, waypoints[i], waypoints[i + 1]);
      }
      const pathEfficiencyPct = stepsUsed > 0 ? Math.min(100, (shortest / stepsUsed) * 100) : 100;
      const accuracyTier = accuracyTierFromAttempts(newAttempts);
      const starRating = calculateLevelStars(accuracyTier, pathEfficiencyPct, hintUsed);

      const metric: HouseNavLevelMetric = {
        levelId: level.id,
        levelLabel: level.title,
        starRating,
        accuracyTier,
        pathEfficiencyPct,
        stepsUsed,
        shortestPathLength: shortest,
        unnecessarySteps: Math.max(0, stepsUsed - shortest),
        commandEntriesUsed: entries.length,
        enterErrors,
        orderErrors,
        attempts: newAttempts,
        hintUsed,
        planningSuccess: newAttempts === 1,
        timeSpentSeconds: Math.round((Date.now() - levelStartedAt) / 1000),
      };

      setLastLevelMetric(metric);
      setCollectedMetrics((prev) => [...prev, metric]);
      setIsRunning(false);
      setPhase('levelComplete');
      return;
    }

    const messages: Record<string, string> = {
      wall: 'Bu yönde duvar var ya da sınırın dışına çıktın. Komutlarını düzenleyip tekrar dene.',
      wrongEnter: 'Burada yapılacak bir görev yok. Doğru yere gidip tekrar ENTER dene.',
      orderBroken: 'Sırayı bozdun! Görevleri doğru sırayla yapmalısın.',
      incomplete: 'Komutların bitti ama görev tamamlanmadı. Daha fazla komut ekle.',
    };
    setErrorMessage(messages[failed ?? 'incomplete']);
    setIsRunning(false);
  }

  async function handleLevelNext() {
    if (levelIndex + 1 < houseNavLevels.length) {
      const nextIndex = levelIndex + 1;
      setLevelIndex(nextIndex);
      resetForLevel(nextIndex);
      setPhase('playing');
      return;
    }

    const metrics = computeHouseNavMetrics(collectedMetrics, houseNavLevels.length);
    setFinalSummary({ metrics });

    if (currentStudent) {
      const levelResults: LevelAttemptResult[] = collectedMetrics.map((m, idx) => ({
        levelId: m.levelId,
        levelOrder: idx + 1,
        isCorrect: true,
        attempts: m.attempts,
        pointsEarned: Math.round(houseNavLevels[idx].points * (m.starRating / 3)),
        timeSpentSeconds: m.timeSpentSeconds,
      }));
      const totalPoints = levelResults.reduce((s, r) => s + r.pointsEarned, 0);
      const maxPoints = houseNavLevels.reduce((s, l) => s + l.points, 0);
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
    setLevelIndex(0);
    setCollectedMetrics([]);
    setFinalSummary(null);
    resetForLevel(0);
    setPhase('playing');
  }

  function handleExitConfirm() {
    setExitDialogOpen(false);
    navigate(ROUTE_PATHS.home);
  }

  if (phase === 'gameComplete' && finalSummary) {
    const totalTimeSeconds = finalSummary.metrics.levels.reduce((s, l) => s + l.timeSpentSeconds, 0);
    return <GameCompleteScreen metrics={finalSummary.metrics} totalTimeSeconds={totalTimeSeconds} onReplay={handleReplay} />;
  }

  if (phase === 'levelComplete' && lastLevelMetric) {
    return (
      <LevelCompleteScreen
        metric={lastLevelMetric}
        isLastLevel={levelIndex + 1 >= houseNavLevels.length}
        onNext={handleLevelNext}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <GameHUD
        game={game}
        totalLevels={houseNavLevels.length}
        currentIndex={levelIndex}
        onRequestExit={() => setExitDialogOpen(true)}
      />

      <div>
        <h2 className="font-display text-xl font-extrabold text-foreground">{level.title}</h2>
        <p className="mt-1 text-muted-foreground">{level.instructions}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-3">
          <HouseMapCanvas
            map={map}
            characterPosition={characterPosition}
            characterDirection={characterDirection}
            activeTargetObjectId={activeTargetObjectId}
          />
          <Button variant="outline" size="sm" onClick={useHint} disabled={isRunning || !nextTaskStep} className="self-start">
            <Lightbulb className="size-4" /> İpucu Al
          </Button>
          {feedbackMessage && (
            <div className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
              {feedbackMessage}
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
        />
      </div>

      <ExitConfirmDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen} onConfirm={handleExitConfirm} />
    </div>
  );
}
