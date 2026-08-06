import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES_LIST } from '../../data/gamesData';
import { LevelSelector } from '../../components/shared/LevelSelector';
import { useGameStore } from '../../stores/gameStore';
import { ArrowLeft, CheckCircle2, Play, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const GameDetailView: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { startLevel } = useGameStore();

  const game = GAMES_LIST.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Oyun bulunamadı.</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm"
        >
          Kataloğa Dön
        </button>
      </div>
    );
  }

  const handleSelectLevel = (levelNum: number) => {
    startLevel(game.id, levelNum);
    navigate(`/play/${game.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/catalog')}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Tüm Oyunlara Dön</span>
      </button>

      {/* Main Game Header Banner */}
      <div className={`bg-gradient-to-br ${game.color} rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            {game.badge}
          </span>
          <span className="text-xs font-extrabold bg-black/20 px-3 py-1 rounded-full">
            Önerilen: {game.recommendedGrade}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black">{game.title}</h1>
        <p className="text-sm text-white/90 font-medium max-w-2xl leading-relaxed">
          {game.description}
        </p>

        {/* Outcomes Box */}
        <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2 mt-4">
          <p className="text-[11px] font-black uppercase tracking-wider text-white/80">
            🎯 Hedef Kazanımlar:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {game.outcomes.map((out, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{out}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level Selection Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 space-y-6 text-center">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Seviye Seçimi</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Başlamak istediğin seviyeye tıkla ({game.totalLevels} Seviye Mevcut)
          </p>
        </div>

        <LevelSelector
          totalLevels={game.totalLevels}
          currentLevel={1}
          onSelectLevel={handleSelectLevel}
        />

        <div className="pt-4">
          <button
            onClick={() => handleSelectLevel(1)}
            className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${game.color} text-white font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2`}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>1. Seviyeden Başla</span>
          </button>
        </div>
      </div>
    </div>
  );
};
