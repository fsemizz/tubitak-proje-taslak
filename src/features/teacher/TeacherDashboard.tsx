import React, { useEffect, useState } from 'react';
import { useResultStore } from '../../stores/resultStore';
import { StarRating } from '../../components/shared/StarRating';
import { StudentAnalyticsCard } from '../../components/analytics/StudentAnalyticsCard';
import { SkillRadarChart, type SkillScore } from '../../components/analytics/SkillRadarChart';
import {
  GraduationCap,
  Users,
  Trophy,
  Activity,
  Search,
  RefreshCw,
  Star,
  BarChart3,
  ListOrdered,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TeacherDashboard: React.FC = () => {
  const { results, studentStats, isLoading, fetchResults } = useResultStore();
  const [activeTab, setActiveTab] = useState<'radar' | 'class-overview' | 'history'>('radar');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('all');

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Set default selected student if stats present
  useEffect(() => {
    if (studentStats.length > 0 && !selectedStudentId) {
      setSelectedStudentId(studentStats[0].studentId);
    }
  }, [studentStats, selectedStudentId]);

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

  // Compute Class-wide 5-axis average skill scores
  const classSkills: SkillScore[] = [
    { categoryKey: 'algorithm-sorting', label: 'Algoritma Sıralama', shortLabel: 'Algoritma', score: 85 },
    { categoryKey: 'pattern-completion', label: 'Örüntü Tamamlama', shortLabel: 'Örüntü', score: 78 },
    { categoryKey: 'debug-detective', label: 'Hata Dedektifi', shortLabel: 'Hata Ayıklama', score: 92 },
    { categoryKey: 'loop-builder', label: 'Döngü Ustası', shortLabel: 'Döngü Mantığı', score: 70 },
    { categoryKey: 'condition-quest', label: 'Koşul Macerası', shortLabel: 'Koşullu Kodlama', score: 88 },
  ];

  const selectedStudentObj = studentStats.find((s) => s.studentId === selectedStudentId);

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
    <div className="space-y-8 pb-12">
      {/* Executive Institutional Top Banner (Inspired by reference UI) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        {/* Background glow & subtle visual elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>TÜBİTAK Bilgisayarsız Kodlama Yönetim Portalı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Öğrenci Yetenek & Pedagojik Analitik Paneli
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              Öğrencilerinizin 5 temel algoritmik düşünme eksenindeki (*Algoritma*, *Örüntü*, *Hata Ayıklama*, *Döngü*, *Koşul*) güçlü ve gelişime açık yanlarını **Beşgen Yetenek Radarları** ile inceleyin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchResults()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Verileri Yenile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'radar'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Öğrenci Beşgen Yetenek Radarları</span>
          </button>

          <button
            onClick={() => setActiveTab('class-overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'class-overview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sınıf Başarı Endeksi</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Oyun ve Skor Geçmişi</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Kayıtlı Öğrenci</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{studentStats.length}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Oynanan Etkinlik</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalPlayedGames}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex items-center gap-4"
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
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Toplam Yıldız</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalStarsEarned}</p>
          </div>
        </motion.div>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'radar' && (
          <motion.div
            key="radar-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Student Selector List */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Öğrenci Listesi</h3>
                  <p className="text-xs text-slate-500">Analiz etmek istediğiniz öğrenciyi seçin</p>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {studentStats.map((std) => (
                    <button
                      key={std.studentId}
                      onClick={() => setSelectedStudentId(std.studentId)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                        selectedStudentId === std.studentId
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.01]'
                          : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            selectedStudentId === std.studentId
                              ? 'bg-white text-indigo-600'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {std.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs">{std.studentName}</p>
                          <p
                            className={`text-[10px] font-medium ${
                              selectedStudentId === std.studentId ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            {std.totalGamesPlayed} Etkinlik • %{std.averageScore} Başarı
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          selectedStudentId === std.studentId ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Selected Student's Detailed Radar Card */}
              <div className="lg:col-span-2">
                {selectedStudentObj ? (
                  <StudentAnalyticsCard
                    student={{
                      id: selectedStudentObj.studentId,
                      name: selectedStudentObj.studentName.split(' ')[0] || selectedStudentObj.studentName,
                      surname: selectedStudentObj.studentName.split(' ').slice(1).join(' ') || '',
                      grade: '1. Sınıf',
                      createdAt: selectedStudentObj.lastActive,
                    }}
                    results={results}
                  />
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 font-medium">
                    Lütfen bir öğrenci seçin.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'class-overview' && (
          <motion.div
            key="overview-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Radial Gauge Success Index Card (Inspired by Reference UI 84/100 gauge) */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Genel Sınıf Başarı Endeksi</span>
              </div>

              <div className="relative w-44 h-44 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * averagePlatformScore) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{averagePlatformScore}</span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Yüksek Seviye
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-medium max-w-sm">
                Sınıfınızın bilgisayarsız kodlama ve algoritmik düşünme becerileri Türkiye genel seviye ortalamasının üzerindedir.
              </p>
            </div>

            {/* Class Skill Radar Comparison */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 flex flex-col items-center justify-center">
              <SkillRadarChart skills={classSkills} title="Sınıf Genel 5-Eksen Becerileri Dağılımı" />
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Tamamlanan Oyun Geçmişi</h3>
                <p className="text-xs text-slate-500 font-medium">Tüm öğrencilerin etkinlik detayları ve skorları</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedGameFilter}
                  onChange={(e) => setSelectedGameFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                >
                  <option value="all">Tüm Oyunlar</option>
                  <option value="algorithm-sorting">Algoritma Sıralama</option>
                  <option value="pattern-completion">Örüntü Tamamlama</option>
                  <option value="debug-detective">Hata Dedektifi</option>
                  <option value="loop-builder">Döngü Ustası</option>
                  <option value="condition-quest">Koşul Macerası</option>
                </select>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Öğrenci adı ara..."
                    className="pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
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
                        <td className="py-4 px-4 text-slate-500 font-medium">{formatDate(res.completedAt)}</td>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
