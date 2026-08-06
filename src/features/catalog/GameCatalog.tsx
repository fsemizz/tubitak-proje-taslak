import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAMES_LIST } from '../../data/gamesData';
import { GameCard } from '../../components/shared/GameCard';
import { useAuthStore } from '../../stores/authStore';
import { Search, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const GameCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = GAMES_LIST.filter(
    (game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Oyun Kataloğu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Hoş Geldin, {student ? student.name : 'Genç Kodlamacı'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-xl">
            Bugün hangi algoritma macerasına katılmak istersin? Aşağıdaki oyunlardan birini seç ve hemen oynamaya başla.
          </p>
        </div>

        <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-indigo-200">Katalog Durumu</p>
            <p className="text-sm font-black text-white">5 Farklı Kodlama Oyunu</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Etkinlikler ve Oyunlar</h3>
          <p className="text-xs text-slate-500 font-medium">Bilgisayarsız kodlama literatüründen özenle hazırlanmıştır.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Oyun ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:border-indigo-500 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GameCard game={game} onSelect={handleSelectGame} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
