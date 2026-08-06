import React, { useState, useEffect } from 'react';
import { GameShell } from '../../../components/shared/GameShell';
import { ResultScreen } from '../../../components/shared/ResultScreen';
import { GAME_LEVELS } from '../../../data/gamesData';
import { useGameStore } from '../../../stores/gameStore';
import { useResultStore } from '../../../stores/resultStore';
import { useAuthStore } from '../../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';

export const PatternCompletionGame: React.FC = () => {
  const { student } = useAuthStore();
  const { currentLevelNumber, elapsedSeconds, attemptsCount, startLevel, incrementAttempts, completeLevel, isCompleted, resetGame } = useGameStore();
  const { addResult } = useResultStore();

  const totalLevels = GAME_LEVELS['pattern-completion'].length;
  const currentConfig = GAME_LEVELS['pattern-completion'][currentLevelNumber - 1];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    startLevel('pattern-completion', currentLevelNumber);
    setSelectedOptionId(null);
    setErrorMessage(null);
  }, [currentLevelNumber]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setErrorMessage(null);
  };

  const handleCheckSolution = () => {
    if (!selectedOptionId) {
      setErrorMessage('Lütfen önce bir seçenek seç!');
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
          gameId: 'pattern-completion',
          gameTitle: 'Örüntü Tamamlama',
          levelNumber: currentLevelNumber,
          score,
          stars,
          completionTimeSeconds: elapsedSeconds,
          attemptsCount,
        });
      }
    } else {
      incrementAttempts();
      setErrorMessage('Bu seçenek örüntünün kuralına uymuyor. Tekrar düşün!');
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
    startLevel('pattern-completion', currentLevelNumber);
  };

  return (
    <GameShell
      title="Örüntü Tamamlama"
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
            className="w-full max-w-xl flex flex-col items-center gap-8"
          >
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {currentConfig.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Örüntüdeki düzeni fark et ve soru işareti yerine gelecek doğru simgeyi işaretle.
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

            {/* Pattern Display Box */}
            <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner w-full">
              {currentConfig.config.sequence.map((item: any, idx: number) => {
                const isTarget = item.type === 'target';
                const selectedOpt = currentConfig.config.options.find((opt: any) => opt.id === selectedOptionId);

                return (
                  <div
                    key={idx}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-3xl sm:text-4xl shadow-md border-2 transition-all ${
                      isTarget
                        ? selectedOptionId
                          ? 'bg-indigo-100 border-indigo-500 animate-pulse text-slate-900'
                          : 'bg-amber-100 border-amber-400 text-amber-600 animate-bounce'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <span>{isTarget && selectedOpt ? selectedOpt.value : item.value}</span>
                    <span className="text-[10px] font-bold text-slate-500 mt-1">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Options */}
            <div className="w-full space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-center">
                Soru İşareti (?) Yerine Ne Gelmeli?
              </p>
              <div className="grid grid-cols-3 gap-4">
                {currentConfig.config.options.map((opt: any) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 font-black'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300 font-bold'
                      }`}
                    >
                      <span className="text-4xl mb-1">{opt.value}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleCheckSolution}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Cevabı Kontrol Et</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
};
