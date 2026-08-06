import React from 'react';
import { StarRating } from './StarRating';
import { Lock, Play, CheckCircle } from 'lucide-react';

interface LevelSelectorProps {
  totalLevels: number;
  currentLevel: number;
  completedLevels?: number[]; // Tamamlanan seviye numaraları
  onSelectLevel: (levelNum: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  totalLevels,
  currentLevel,
  completedLevels = [],
  onSelectLevel,
}) => {
  return (
    <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto w-full">
      {Array.from({ length: totalLevels }).map((_, idx) => {
        const levelNum = idx + 1;
        const isCurrent = levelNum === currentLevel;
        const isCompleted = completedLevels.includes(levelNum);

        return (
          <button
            key={levelNum}
            onClick={() => onSelectLevel(levelNum)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
              isCurrent
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 font-black'
                : isCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 font-bold'
            }`}
          >
            {isCompleted && !isCurrent && (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 absolute top-2 right-2" />
            )}
            <span className="text-base">{levelNum}</span>
            <span className="text-[10px] mt-1 opacity-80 uppercase">Seviye</span>
          </button>
        );
      })}
    </div>
  );
};
