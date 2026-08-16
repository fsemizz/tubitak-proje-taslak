import { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from './GameHUD';
import { ExitConfirmDialog } from './ExitConfirmDialog';
import { LevelCompleteInterstitial } from './LevelCompleteInterstitial';
import { gameRegistry } from '@/games/registry';
import { useGameProgressStore } from '@/stores/useGameProgressStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { resultsService } from '@/services/serviceProvider';
import { useGameSounds } from '@/hooks/useGameSounds';
import { useBackgroundMusic, GAME_START_MUSIC_DELAY_MS } from '@/hooks/useBackgroundMusic';
import { useLevelTimer } from '@/hooks/useLevelTimer';
import { calculateSimpleLevelStars, calculateStarRating, sumPoints, sumTime } from '@/lib/scoring';
import { buildGameResultsPath, ROUTE_PATHS } from '@/app/routePaths';
import type { GameDefinition, GameLevel } from '@/types/game';
import type { LevelAttemptResultInput } from '@/types/result';

interface GameShellProps {
  game: GameDefinition;
  levels: GameLevel[];
}

export function GameShell({ game, levels }: GameShellProps) {
  const navigate = useNavigate();
  const currentStudent = useSessionStore((s) => s.currentStudent);
  const sounds = useGameSounds();
  const music = useBackgroundMusic();
  const { activeGameId, activeLevelIndex, levelResults, startGame, recordLevelResult, goToNextLevel, finishGame, resetProgress } =
    useGameProgressStore();

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [pendingResult, setPendingResult] = useState<LevelAttemptResultInput | null>(null);

  useEffect(() => {
    if (activeGameId !== game.id) {
      startGame(game.id);
    }
    sounds.playGameStartJingle();
    music.start(game.id, GAME_START_MUSIC_DELAY_MS);
    return () => music.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  const PlayerComponent = gameRegistry[game.id]?.PlayerComponent;
  const currentLevel = levels[activeLevelIndex];
  const isLastLevel = activeLevelIndex + 1 >= levels.length;
  const liveElapsedSeconds = useLevelTimer(currentLevel?.id ?? activeLevelIndex);

  function handleComplete(result: LevelAttemptResultInput) {
    recordLevelResult(result);
    sounds.playLevelComplete();
    setPendingResult(result);
  }

  async function handleContinue() {
    if (!pendingResult) return;
    setPendingResult(null);

    if (isLastLevel && currentStudent) {
      finishGame();
      const totalPoints = sumPoints(levelResults);
      const maxPoints = levels.reduce((sum, l) => sum + l.points, 0);
      const summary = await resultsService.submitGameCompletion({
        studentId: currentStudent.id,
        studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
        gameId: game.id,
        gameTitle: game.title,
        levelResults,
        totalPoints,
        maxPoints,
        starRating: calculateStarRating(totalPoints, maxPoints),
        totalTimeSeconds: sumTime(levelResults),
      });
      sounds.playGameComplete();
      resetProgress();
      navigate(buildGameResultsPath(game.id), { state: { summary } });
      return;
    }

    goToNextLevel();
  }

  function handleExitConfirm() {
    resetProgress();
    setExitDialogOpen(false);
    navigate(ROUTE_PATHS.home);
  }

  if (!currentLevel || !PlayerComponent) return null;

  return (
    <div>
      <GameHUD
        game={game}
        totalLevels={levels.length}
        currentIndex={activeLevelIndex}
        onRequestExit={() => setExitDialogOpen(true)}
        timerSeconds={pendingResult ? undefined : liveElapsedSeconds}
        timerOptimalSeconds={currentLevel?.optimalDurationSeconds}
      />

      {pendingResult ? (
        <LevelCompleteInterstitial
          levelTitle={currentLevel.title}
          starRating={calculateSimpleLevelStars(
            pendingResult.attempts,
            pendingResult.hintUsed,
            pendingResult.timeSpentSeconds,
            currentLevel.optimalDurationSeconds,
          )}
          pointsEarned={pendingResult.pointsEarned}
          attempts={pendingResult.attempts}
          hintUsed={pendingResult.hintUsed}
          timeSpentSeconds={pendingResult.timeSpentSeconds}
          optimalDurationSeconds={currentLevel.optimalDurationSeconds}
          isLastLevel={isLastLevel}
          onNext={handleContinue}
        />
      ) : (
        <Suspense fallback={<div className="py-16 text-center text-muted-foreground">Yükleniyor…</div>}>
          <PlayerComponent
            key={currentLevel.id}
            level={currentLevel}
            levelNumber={activeLevelIndex + 1}
            totalLevels={levels.length}
            onComplete={handleComplete}
            onExit={() => setExitDialogOpen(true)}
          />
        </Suspense>
      )}

      <ExitConfirmDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen} onConfirm={handleExitConfirm} />
    </div>
  );
}
