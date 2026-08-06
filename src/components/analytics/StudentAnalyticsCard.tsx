import React from 'react';
import type { StudentProfile } from '../../types/user';
import type { GameResult } from '../../types/result';
import { SkillRadarChart, type SkillScore } from './SkillRadarChart';
import { Award, Trophy, Clock, Target, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';

interface StudentAnalyticsCardProps {
  student: StudentProfile;
  results: GameResult[];
}

const CATEGORY_MAP: Record<string, { label: string; shortLabel: string }> = {
  'algorithm-sorting': { label: 'Algoritma Sıralama', shortLabel: 'Algoritma' },
  'pattern-completion': { label: 'Örüntü Tamamlama', shortLabel: 'Örüntü' },
  'debug-detective': { label: 'Hata Dedektifi', shortLabel: 'Hata Ayıklama' },
  'loop-builder': { label: 'Döngü Ustası', shortLabel: 'Döngü Mantığı' },
  'condition-quest': { label: 'Koşul Macerası', shortLabel: 'Koşullu Kodlama' },
};

export const StudentAnalyticsCard: React.FC<StudentAnalyticsCardProps> = ({ student, results }) => {
  // Filter student results
  const studentResults = results.filter(
    (r) =>
      r.studentId === student.id ||
      r.studentName.toLowerCase().trim() === `${student.name} ${student.surname}`.toLowerCase().trim()
  );

  // Compute 5-axis skill scores
  const skillScores: SkillScore[] = Object.keys(CATEGORY_MAP).map((catKey) => {
    const catResults = studentResults.filter((r) => r.gameId === catKey);
    let avgScore = 0;
    if (catResults.length > 0) {
      avgScore = Math.round(catResults.reduce((sum, r) => sum + r.score, 0) / catResults.length);
    } else {
      // Default baseline for unplayed games to make radar chart visible
      avgScore = 30;
    }
    return {
      categoryKey: catKey,
      label: CATEGORY_MAP[catKey].label,
      shortLabel: CATEGORY_MAP[catKey].shortLabel,
      score: avgScore,
    };
  });

  const totalPlayed = studentResults.length;
  const totalStars = studentResults.reduce((acc, curr) => acc + curr.stars, 0);
  const avgScore = totalPlayed > 0 ? Math.round(studentResults.reduce((acc, curr) => acc + curr.score, 0) / totalPlayed) : 0;
  const totalTimeSeconds = studentResults.reduce((acc, curr) => acc + curr.completionTimeSeconds, 0);

  // Find strongest & area for growth
  const sortedSkills = [...skillScores].sort((a, b) => b.score - a.score);
  const strongestSkill = sortedSkills[0];
  const weakestSkill = sortedSkills[sortedSkills.length - 1];

  // Pedagogical analysis text generator
  const getPedagogicalFeedback = () => {
    if (totalPlayed === 0) {
      return `${student.name} henüz oyun oynamadı. Algoritma Sıralama oyunu ile başlaması tavsiye edilir.`;
    }

    let feedback = `${student.name}, en yüksek performansı %${strongestSkill.score} puan ile **${strongestSkill.label}** alanında gösterdi. `;
    if (weakestSkill.score < 70) {
      feedback += `Gelişime açık alan olarak **${weakestSkill.label}** (%${weakestSkill.score}) öne çıkmaktadır. Bu alanda 2 ekstra seviye pratik yapması önerilir.`;
    } else {
      feedback += `Tüm bilgisayarsız kodlama becerilerinde oldukça yüksek ve dengeli bir gelişim sergilemektedir!`;
    }
    return feedback;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-900/5">
      {/* Header Profile Info */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {student.name} {student.surname}
            </h3>
            <span className="inline-block px-2.5 py-0.5 mt-1 text-xs font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {student.grade || '1. Sınıf'}
            </span>
          </div>
        </div>

        {/* Total Score Badge */}
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400">Ortalama Başarı</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">%{avgScore}</p>
        </div>
      </div>

      {/* Grid Layout: Stats + Skill Radar + Diagnostic Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left: Quick Stat Widgets */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-black text-slate-900 dark:text-white">{totalStars}</p>
              <p className="text-[10px] font-bold text-slate-400">Toplanan Yıldız</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <Target className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <p className="text-lg font-black text-slate-900 dark:text-white">{totalPlayed}</p>
              <p className="text-[10px] font-bold text-slate-400">Tamamlanan Oyun</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-lg font-black text-slate-900 dark:text-white">
                {Math.floor(totalTimeSeconds / 60)}d {totalTimeSeconds % 60}s
              </p>
              <p className="text-[10px] font-bold text-slate-400">Toplam Süre</p>
            </div>
          </div>

          {/* Diagnostic Pedagogical Report */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                Pedagojik Analiz ve Gelişim Önerisi
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {getPedagogicalFeedback()}
            </p>
          </div>

          {/* Strongest & Growth Areas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> En Güçlü Yanı:
              </span>
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
                {strongestSkill.label} (%{strongestSkill.score})
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs">
              <span className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-600" /> Geliştirilebilir Yanı:
              </span>
              <span className="font-extrabold text-amber-900 dark:text-amber-200">
                {weakestSkill.label} (%{weakestSkill.score})
              </span>
            </div>
          </div>
        </div>

        {/* Right: 5-Axis Radar Chart */}
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
          <SkillRadarChart skills={skillScores} title="5-Eksenli Bilgisayarsız Kodlama Yetenek Radarı" />
        </div>
      </div>
    </div>
  );
};
