import React, { useState, useEffect } from 'react';
import { GameShell } from '../../../components/shared/GameShell';
import { ResultScreen } from '../../../components/shared/ResultScreen';
import { GAME_LEVELS } from '../../../data/gamesData';
import { useGameStore } from '../../../stores/gameStore';
import { useResultStore } from '../../../stores/resultStore';
import { useAuthStore } from '../../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, GitFork } from 'lucide-react';

export const ConditionQuestGame: React.FC = () => {
  const { student } = useAuthStore();
  const { currentLevelNumber, elapsedSeconds, attemptsCount, startLevel, incrementAttempts, completeLevel, isCompleted, resetGame } = useGameStore();
  const { addResult } = useResultStore();

  const totalLevels = GAME_LEVELS['condition-quest'].length;
  const currentConfig = GAME_LEVELS['condition-quest'][currentLevelNumber - 1];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    startLevel('condition-quest', currentLevelNumber);
    setSelectedOptionId(null);
    setErrorMessage(null);
  }, [currentLevelNumber]);

  const handleCheckSolution = () => {
    if (!selectedOptionId) {
      setErrorMessage('Lütfen bir karar seçeneği belirle!');
      return;
    }

    const selectedOpt = currentConfig.config.options.find((opt: any) => opt.id === selectedOptionId);

    if (selectedOpt && selectedOpt.isCorrect) {
      const stars = attemptsCount === 1 ? 3 : attemptsCount === 2 ? 2 : 1;
      const score = Math.max(100 - (attemptsCount - 1) * 20 - Math.floor(elapsedSeconds / 10), 50);

      completeLevel(stars, score);

      if (student) {
        addResult({
          studentId: student.id,
          studentName: `${student.name} ${student.surname}`,
          gameId: 'condition-quest',
          gameTitle: 'Koşul Macerası',
          levelNumber: currentLevelNumber,
          score,
          stars,
          completionTimeSeconds: elapsedSeconds,
          attemptsCount,
        });
      }
    } else {
      incrementAttempts();
      setErrorMessage('Seçtiğin eylem verilen koşula uymuyor. Mantığı tekrar değerlendir!');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelNumber < totalLevels) {
      useGameStore.setState({ currentLevelNumber: currentLevelNumber + 1 });
    }
  };

  const handleReplayLevel = () => {
    setSelectedOptionId(null);
    setErrorMessage(null);
    startLevel('condition-quest', currentLevelNumber);
  };

  return (
    <GameShell
      title="Koşul Macerası (If-Else)"
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
                <GitFork className="w-5 h-5 text-cyan-500" />
                <span>{currentConfig.title}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Aşağıda verilen "EĞER" durumunu oku ve algoritmanın yapması gereken doğru kararı seç.
              </p>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-2xl text-xs font-bold text-center"
              >
                ⚠️ {errorMessage}
              </motion.div>
            )}

            {/* Condition Box */}
            <div className="w-full bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 p-6 rounded-3xl border border-cyan-200 dark:border-cyan-800 text-center shadow-inner">
              <span className="inline-block px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-black uppercase tracking-wider mb-2">
                ŞART / KOŞUL
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                {currentConfig.config.conditionText}
              </h4>
            </div>

            {/* Action Decision Options */}
            <div className="w-full space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-center">
                ... İSE Ne Yapmalısın?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentConfig.config.options.map((opt: any) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        setErrorMessage(null);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-500/25 scale-105 font-black'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-300 font-bold'
                      }`}
                    >
                      <span className="text-3xl mb-1">{opt.emoji}</span>
                      <span className="text-xs text-center">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCheckSolution}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Kararı Uygula</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
};
