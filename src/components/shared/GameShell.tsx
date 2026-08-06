import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';
import { ArrowLeft, Clock, HelpCircle, RefreshCw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameShellProps {
  title: string;
  levelNumber: number;
  totalLevels: number;
  instructions: string;
  hint?: string;
  onResetLevel?: () => void;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  title,
  levelNumber,
  totalLevels,
  instructions,
  hint,
  onResetLevel,
  children,
}) => {
  const navigate = useNavigate();
  const { elapsedSeconds, isTimerRunning, tickTimer, resetGame } = useGameStore();
  const [showHintModal, setShowHintModal] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackToCatalog = () => {
    resetGame();
    navigate('/catalog');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Top Header Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 flex flex-wrap items-center justify-between gap-4">
        {/* Back button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToCatalog}
            className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors"
            title="Kataloğa Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{title}</h2>
              <span className="px-3 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                Seviye {levelNumber} / {totalLevels}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {instructions}
            </p>
          </div>
        </div>

        {/* Status Indicators (Timer & Actions) */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-2xl text-slate-700 dark:text-slate-300 font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Hint Button */}
          {hint && (
            <button
              onClick={() => setShowHintModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-xs font-bold transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">İpucu</span>
            </button>
          )}

          {/* Reset Level */}
          {onResetLevel && (
            <button
              onClick={onResetLevel}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors"
              title="Yeniden Başlat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Instruction banner for mobile */}
      <div className="sm:hidden bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 p-3.5 rounded-2xl text-xs font-semibold text-indigo-900 dark:text-indigo-200">
        💡 {instructions}
      </div>

      {/* Main Game Stage Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
        {children}
      </div>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-amber-200 dark:border-amber-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 font-bold">
                  💡
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">İpucu Al</h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200/50">
                {hint}
              </p>
              <button
                onClick={() => setShowHintModal(false)}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-colors"
              >
                Anladım, Teşekkürler!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
