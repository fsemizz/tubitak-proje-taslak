import React, { useState, useEffect } from 'react';
import { GameShell } from '../../../components/shared/GameShell';
import { ResultScreen } from '../../../components/shared/ResultScreen';
import { GAME_LEVELS } from '../../../data/gamesData';
import { useGameStore } from '../../../stores/gameStore';
import { useResultStore } from '../../../stores/resultStore';
import { useAuthStore } from '../../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Repeat } from 'lucide-react';

export const LoopBuilderGame: React.FC = () => {
  const { student } = useAuthStore();
  const { currentLevelNumber, elapsedSeconds, attemptsCount, startLevel, incrementAttempts, completeLevel, isCompleted, resetGame } = useGameStore();
  const { addResult } = useResultStore();

  const totalLevels = GAME_LEVELS['loop-builder'].length;
  const currentConfig = GAME_LEVELS['loop-builder'][currentLevelNumber - 1];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    startLevel('loop-builder', currentLevelNumber);
    setSelectedOptionId(null);
    setErrorMessage(null);
  }, [currentLevelNumber]);

  const handleCheckSolution = () => {
    if (!selectedOptionId) {
      setErrorMessage('Lütfen bir döngü seçeneği belirle!');
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
          gameId: 'loop-builder',
          gameTitle: 'Döngü Ustası',
          levelNumber: currentLevelNumber,
          score,
          stars,
          completionTimeSeconds: elapsedSeconds,
          attemptsCount,
        });
      }
    } else {
      incrementAttempts();
      setErrorMessage('Seçtiğin döngü sayısı tekrar eden adımlarla eşleşmiyor!');
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
    startLevel('loop-builder', currentLevelNumber);
  };

  return (
    <GameShell
      title="Döngü Ustası (Loops)"
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
                <Repeat className="w-5 h-5 text-emerald-500" />
                <span>{currentConfig.title}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Aşağıdaki uzun eylemi kısaltmak için en uygun döngü kutusunu seç.
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

            {/* Long Repeated Actions Display */}
            <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-200 dark:border-emerald-800 flex flex-col items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Tekrar Eden Adımlar:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: currentConfig.config.repeatCount }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-xs text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <span>{currentConfig.config.repeatedAction.emoji}</span>
                    <span>{currentConfig.config.repeatedAction.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loop Options */}
            <div className="w-full space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 text-center">
                Bunu Tek Bir Döngü Bloğuyla Nasıl Yazarsın?
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
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-105 font-black'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-300 font-bold'
                      }`}
                    >
                      <Repeat className={`w-6 h-6 mb-1 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                      <span className="text-xs text-center">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCheckSolution}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Döngüyü Çalıştır</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
};
