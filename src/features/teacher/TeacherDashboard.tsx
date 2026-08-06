import React, { useEffect, useState } from 'react';
import { useResultStore } from '../../stores/resultStore';
import { StarRating } from '../../components/shared/StarRating';
import { GraduationCap, Users, Trophy, Activity, Search, RefreshCw, Star, Clock, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const TeacherDashboard: React.FC = () => {
  const { results, studentStats, isLoading, fetchResults } = useResultStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const filteredResults = results.filter((res) => {
    const matchesSearch =
      res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.gameTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGameFilter === 'all' || res.gameId === selectedGameFilter;
    return matchesSearch && matchesGame;
  });

  const totalPlayedGames = results.length;
  const averagePlatformScore =
    results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0;
  const totalStarsEarned = results.reduce((acc, r) => acc + r.stars, 0);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins > 0 ? `${mins}dk ` : ''}${secs}sn`;
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Öğretmen & Yönetim Paneli</span>
          </div>
          <h1 className="text-3xl font-black">Öğrenci Gelişim & Performans Analizi</h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl">
            Öğrencilerinizin bilgisayarsız kodlama etkinliklerindeki skorlarını, sürelerini ve seviye ilerlemelerini buradan takip edebilirsiniz.
          </p>
        </div>

        <button
          onClick={() => fetchResults()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Verileri Yenile</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Aktif Öğrenci</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{studentStats.length}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Tamamlanan Oyun</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalPlayedGames}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Ortalama Başarı</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">%{averagePlatformScore}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Kazanılan Yıldız</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalStarsEarned}</p>
          </div>
        </motion.div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-950/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Son Oynanan Etkinlik Geçmişi</h3>
            <p className="text-xs text-slate-500 font-medium">Öğrencilerin son tamamladığı oyunlar ve skorları</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Game Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedGameFilter}
                onChange={(e) => setSelectedGameFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:outline-none"
              >
                <option value="all">Tüm Oyunlar</option>
                <option value="algorithm-sorting">Algoritma Sıralama</option>
                <option value="pattern-completion">Örüntü Tamamlama</option>
                <option value="debug-detective">Hata Dedektifi</option>
                <option value="loop-builder">Döngü Ustası</option>
                <option value="condition-quest">Koşul Macerası</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Öğrenci adı ara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Öğrenci Adı</th>
                <th className="py-3 px-4">Oyun & Seviye</th>
                <th className="py-3 px-4">Puan / Yıldız</th>
                <th className="py-3 px-4">Süre</th>
                <th className="py-3 px-4">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {res.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{res.studentName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">İlkokul</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold">{res.gameTitle}</p>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Seviye {res.levelNumber}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{res.score} Puan</span>
                        <StarRating stars={res.stars} size="sm" />
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {formatTime(res.completionTimeSeconds)}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">
                      {formatDate(res.completedAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    Henüz kayıtlı bir oyun sonucu bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
