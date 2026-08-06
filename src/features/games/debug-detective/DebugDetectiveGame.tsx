import React, { useState, useEffect } from 'react';
import { GameShell } from '../../../components/shared/GameShell';
import { ResultScreen } from '../../../components/shared/ResultScreen';
import { GAME_LEVELS } from '../../../data/gamesData';
import { useGameStore } from '../../../stores/gameStore';
import { useResultStore } from '../../../stores/resultStore';
import { useAuthStore } from '../../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Bug, ShieldAlert } from 'lucide-react';

export const DebugDetectiveGame: React.FC = () => {
  const { student } = useAuthStore();
  const { currentLevelNumber, elapsedSeconds, attemptsCount, startLevel, incrementAttempts, completeLevel, isCompleted, resetGame } = useGameStore();
  const { addResult } = useResultStore();

  const totalLevels = GAME_LEVELS['debug-detective'].length;
  const currentConfig = GAME_LEVELS['debug-detective'][currentLevelNumber - 1];

  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedCorrectionIndex, setSelectedCorrectionIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    startLevel('debug-detective', currentLevelNumber);
    setSelectedStepId(null);
    setSelectedCorrectionIndex(null);
    setErrorMessage(null);
  }, [currentLevelNumber]);

  const handleCheckSolution = () => {
    if (!selectedStepId) {
      setErrorMessage('Lütfen öncelikle hatalı olduğunu düşündüğün adımı seç!');
      return;
    }

    if (selectedCorrectionIndex === null) {
      setErrorMessage('Lütfen hatayı düzeltmek için doğru çözümü de seç!');
      return;
    }

    const selectedStep = currentConfig.config.steps.find((s: any) => s.id === selectedStepId);
    // Index 0 is the correct fix option in our mock data
    const isCorrectFix = selectedCorrectionIndex === 0;

    if (selectedStep && selectedStep.isBuggy && isCorrectFix) {
      const stars = attemptsCount === 1 ? 3 : attemptsCount === 2 ? 2 : 1;
      const score = Math.max(100 - (attemptsCount - 1) * 20 - Math.floor(elapsedSeconds / 10), 50);

      completeLevel(stars, score);

      if (student) {
        addResult({
          studentId: student.id,
          studentName: `${student.name} ${student.surname}`,
          gameId: 'debug-detective',
          gameTitle: 'Hata Dedektifi',
          levelNumber: currentLevelNumber,
          score,
          stars,
          completionTimeSeconds: elapsedSeconds,
          attemptsCount,
        });
      }
    } else {
      incrementAttempts();
      setErrorMessage('Doğru hatayı veya doğru düzeltmeyi bulamadın. Algoritmayı tekrar incele!');
    }
  };

  const handleNextLevel = () => {
    if (currentLevelNumber < totalLevels) {
      useGameStore.setState({ currentLevelNumber: currentLevelNumber + 1 });
    }
  };

  const handleReplayLevel = () => {
    setSelectedStepId(null);
    setSelectedCorrectionIndex(null);
    setErrorMessage(null);
    startLevel('debug-detective', currentLevelNumber);
  };

  return (
    <GameShell
      title="Hata Dedektifi (Debugging)"
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
                <Bug className="w-5 h-5 text-amber-500" />
                <span>{currentConfig.title}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                1. Aşama: Hatalı olan adımı tıkla. 2. Aşama: Doğru düzeltmeyi seç.
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

            {/* Step 1: Select Buggy Step */}
            <div className="w-full space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                1. Adım: Hangi Adım Mantıksız / Hatalı?
              </p>
              <div className="space-y-2.5">
                {currentConfig.config.steps.map((step: any) => {
                  const isSelected = selectedStepId === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setSelectedStepId(step.id);
                        setErrorMessage(null);
                      }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-lg shadow-amber-500/25 scale-[1.01]'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{step.emoji}</span>
                      <span className="text-xs sm:text-sm font-bold flex-1">{step.text}</span>
                      {isSelected && <ShieldAlert className="w-5 h-5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Fix */}
            {selectedStepId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="w-full space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  2. Adım: Hatayı Nasıl Düzeltiriz?
                </p>
                <div className="space-y-2">
                  {currentConfig.config.correctionOptions.map((optText: string, idx: number) => {
                    const isSelected = selectedCorrectionIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCorrectionIndex(idx);
                          setErrorMessage(null);
                        }}
                        className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        ✅ {optText}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <button
              onClick={handleCheckSolution}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>Hatayı Ayıkla & Düzelt</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
};
