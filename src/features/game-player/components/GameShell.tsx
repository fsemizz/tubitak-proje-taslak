import { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHUD } from './GameHUD';
import { ExitConfirmDialog } from './ExitConfirmDialog';
import { CelebrationBurst } from '@/components/primitives/CelebrationBurst';
import { gameRegistry } from '@/games/registry';
import { useGameProgressStore } from '@/stores/useGameProgressStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { resultsService } from '@/services/serviceProvider';
import { useGameSounds } from '@/hooks/useGameSounds';
import { calculateStarRating, sumPoints, sumTime } from '@/lib/scoring';
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
  const { activeGameId, activeLevelIndex, levelResults, startGame, recordLevelResult, goToNextLevel, finishGame, resetProgress } =
    useGameProgressStore();

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [justAdvanced, setJustAdvanced] = useState(false);

  useEffect(() => {
    if (activeGameId !== game.id) {
      startGame(game.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  const PlayerComponent = gameRegistry[game.id]?.PlayerComponent;
  const currentLevel = levels[activeLevelIndex];

  async function handleComplete(result: LevelAttemptResultInput) {
    recordLevelResult(result);
    const allResults = [...levelResults, result];
    const isLastLevel = activeLevelIndex + 1 >= levels.length;

    if (isLastLevel && currentStudent) {
      finishGame();
      const totalPoints = sumPoints(allResults);
      const maxPoints = levels.reduce((sum, l) => sum + l.points, 0);
      const summary = await resultsService.submitGameCompletion({
        studentId: currentStudent.id,
        studentName: `${currentStudent.firstName} ${currentStudent.lastName}`,
        gameId: game.id,
        gameTitle: game.title,
        levelResults: allResults,
        totalPoints,
        maxPoints,
        starRating: calculateStarRating(totalPoints, maxPoints),
        totalTimeSeconds: sumTime(allResults),
      });
      sounds.playGameComplete();
      resetProgress();
      navigate(buildGameResultsPath(game.id), { state: { summary } });
      return;
    }

    sounds.playLevelComplete();
    setJustAdvanced(true);
    setTimeout(() => {
      goToNextLevel();
      setJustAdvanced(false);
    }, 900);
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
      />

      {justAdvanced ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <CelebrationBurst />
          <p className="font-display text-lg font-bold text-foreground">Harika! Sıradaki seviyeye geçiyorsun...</p>
        </div>
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
