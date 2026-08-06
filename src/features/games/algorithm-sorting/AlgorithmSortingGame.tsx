import React, { useState, useEffect } from 'react';
import { GameShell } from '../../../components/shared/GameShell';
import { ResultScreen } from '../../../components/shared/ResultScreen';
import { GAME_LEVELS } from '../../../data/gamesData';
import { useGameStore } from '../../../stores/gameStore';
import { useResultStore } from '../../../stores/resultStore';
import { useAuthStore } from '../../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MoveUp, MoveDown, Sparkles } from 'lucide-react';

interface StepItem {
  id: string;
  text: string;
  emoji: string;
  correctPosition: number;
}

export const AlgorithmSortingGame: React.FC = () => {
  const { student } = useAuthStore();
  const { currentLevelNumber, elapsedSeconds, attemptsCount, startLevel, incrementAttempts, completeLevel, isCompleted, resetGame } = useGameStore();
  const { addResult } = useResultStore();

  const totalLevels = GAME_LEVELS['algorithm-sorting'].length;
  const currentConfig = GAME_LEVELS['algorithm-sorting'][currentLevelNumber - 1];

  const [currentSteps, setCurrentSteps] = useState<StepItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Level reset / initialization
  useEffect(() => {
    startLevel('algorithm-sorting', currentLevelNumber);
    // Shuffle steps for initial state
    const steps = [...currentConfig.config.targetOrder];
    // Mix steps randomly
    const shuffled = steps.sort(() => Math.random() - 0.5);
    setCurrentSteps(shuffled);
    setErrorMessage(null);
  }, [currentLevelNumber]);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSteps.length) return;

    const updated = [...currentSteps];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setCurrentSteps(updated);
    setErrorMessage(null);
  };

  const handleCheckSolution = () => {
    // Check if current order matches correctPosition 1..N
    const isCorrect = currentSteps.every((step, index) => step.correctPosition === index + 1);

    if (isCorrect) {
      // Calculate stars & score
      const stars = attemptsCount === 1 ? 3 : attemptsCount === 2 ? 2 : 1;
      const score = Math.max(100 - (attemptsCount - 1) * 20 - Math.floor(elapsedSeconds / 10), 50);

      completeLevel(stars, score);

      // Save result
      if (student) {
        addResult({
          studentId: student.id,
          studentName: `${student.name} ${student.surname}`,
          gameId: 'algorithm-sorting',
          gameTitle: 'Algoritma Sıralama',
          levelNumber: currentLevelNumber,
          score,
          stars,
          completionTimeSeconds: elapsedSeconds,
          attemptsCount,
        });
      }
    } else {
      incrementAttempts();
      setErrorMessage('Sıralamada bazı adımlar yanlış yerde görünüyor. Lütfen tekrar incele!');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelNumber < totalLevels) {
      useGameStore.setState({ currentLevelNumber: currentLevelNumber + 1 });
    }
  };

  const handleReplayLevel = () => {
    const steps = [...currentConfig.config.targetOrder].sort(() => Math.random() - 0.5);
    setCurrentSteps(steps);
    setErrorMessage(null);
    startLevel('algorithm-sorting', currentLevelNumber);
  };

  return (
    <GameShell
      title="Algoritma Sıralama"
      levelNumber={currentLevelNumber}
      totalLevels={totalLevels}
      instructions={currentConfig.instructions}
      hint={currentConfig.hint}
      onResetLevel={handleReplayLevel}
    >
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <ResultScreen
            stars={useGameStore.getState().stars}
            score={useGameStore.getState().score}
            elapsedSeconds={elapsedSeconds}
            attemptsCount={attemptsCount}
            hasNextLevel={currentLevelNumber < totalLevels}
            onNextLevel={handleNextLevel}
            onReplayLevel={handleReplayLevel}
            onBackToCatalog={resetGame}
          />
        ) : (
          <motion.div
            key={currentLevelNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-xl flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <span>{currentConfig.title}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Adımların yanındaki okları kullanarak kartları 1'den {currentSteps.length}'e doğru sıraya koy.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-2xl text-xs font-bold text-center"
              >
                ⚠️ {errorMessage}
              </motion.div>
            )}

            {/* Steps List */}
            <div className="w-full space-y-3">
              {currentSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <span className="text-2xl shrink-0">{step.emoji}</span>

                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex-1">
                    {step.text}
                  </span>

                  {/* Move Up/Down Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={() => moveStep(index, 'up')}
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-indigo-50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      title="Yukarı Taşı"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === currentSteps.length - 1}
                      onClick={() => moveStep(index, 'down')}
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-indigo-50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      title="Aşağı Taşı"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Check Button */}
            <button
              onClick={handleCheckSolution}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Sıralamayı Kontrol Et</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
};
