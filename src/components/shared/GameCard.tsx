import React from 'react';
import type { GameInfo } from '../../types/game';
import { ListOrdered, Shapes, Bug, Repeat, GitFork, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameCardProps {
  game: GameInfo;
  onSelect: (gameId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  ListOrdered: <ListOrdered className="w-8 h-8 text-white" />,
  Shapes: <Shapes className="w-8 h-8 text-white" />,
  Bug: <Bug className="w-8 h-8 text-white" />,
  Repeat: <Repeat className="w-8 h-8 text-white" />,
  GitFork: <GitFork className="w-8 h-8 text-white" />,
};

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Decorative background glow */}
      <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${game.color} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`} />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-3 transition-transform`}>
            {iconMap[game.iconName] || <ListOrdered className="w-8 h-8 text-white" />}
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {game.badge}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 font-medium">
          {game.shortDescription}
        </p>

        {/* Target Outcomes */}
        <div className="mb-6 space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900/60 dark:text-indigo-400 mb-1">
            Hedef Kazanımlar:
          </p>
          {game.outcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="line-clamp-1">{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs text-slate-500 font-semibold">
          {game.totalLevels} Seviye • <span className="text-indigo-600 dark:text-indigo-400">{game.recommendedGrade}</span>
        </div>

        <button
          onClick={() => onSelect(game.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r ${game.color} text-white text-xs font-black shadow-md hover:shadow-lg transition-all group-hover:gap-3`}
        >
          <span>Oyuna Başla</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
