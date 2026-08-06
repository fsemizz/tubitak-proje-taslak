import React, { useEffect } from 'react';
import { StarRating } from './StarRating';
import { Trophy, RefreshCw, ArrowRight, Home, Clock, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultScreenProps {
  stars: number;
  score: number;
  elapsedSeconds: number;
  attemptsCount: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onBackToCatalog: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  stars,
  score,
  elapsedSeconds,
  attemptsCount,
  hasNextLevel,
  onNextLevel,
  onReplayLevel,
  onBackToCatalog,
}) => {
  const getFeedbackMessage = () => {
    if (stars === 3) return { title: 'Harika İş Çıkardın! 🎉', desc: 'Tam bir algoritma ustasısın!' };
    if (stars === 2) return { title: 'Çok İyi Başardın! ⭐', desc: 'Biraz daha hızlı yapabilirsin!' };
    return { title: 'Tebrikler! 👍', desc: 'Denemeye devam et, giderek güçleniyorsun!' };
  };

  const feedback = getFeedbackMessage();

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins > 0 ? `${mins} dk ` : ''}${secs} sn`;
  };

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      className="flex flex-col items-center text-center max-w-md w-full py-4 space-y-6"
    >
      {/* Trophy / Star Header */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-900 shadow-xl shadow-amber-500/30">
          <Trophy className="w-12 h-12 text-slate-900 animate-bounce" />
        </div>
      </div>

      {/* Stars Display */}
      <div className="flex justify-center">
        <StarRating stars={stars} size="xl" />
      </div>

      {/* Message */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {feedback.title}
        </h3>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {feedback.desc}
        </p>
      </div>

      {/* Stats Summary Box */}
      <div className="grid grid-cols-3 gap-3 w-full bg-slate-50 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Puan</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{score}</span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-200 dark:border-slate-700">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Süre
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{formatTime(elapsedSeconds)}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
            <Hash className="w-3 h-3" /> Deneme
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{attemptsCount} Kere</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
        {hasNextLevel ? (
          <button
            onClick={onNextLevel}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Sonraki Seviyeye Geç</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onBackToCatalog}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Kataloğa Dön</span>
          </button>
        )}

        <div className="flex items-center gap-2 w-full">
          <button
            onClick={onReplayLevel}
            className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yeniden Oyna</span>
          </button>
          <button
            onClick={onBackToCatalog}
            className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Katalog</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
