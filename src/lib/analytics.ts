import type { GameCompletionSummary } from '@/types/result';
import type { GameCategory } from '@/types/common';
import { CATEGORY_LABEL } from '@/types/common';
import type { StudentProfile } from '@/types/student';
import { gameRegistry } from '@/games/registry';
import type { RadarAxis } from '@/components/primitives/SkillRadarChart';

const PROFILE_CATEGORIES: GameCategory[] = ['sequencing', 'pattern', 'debugging', 'loops', 'conditionals'];

const SHORT_LABEL: Record<GameCategory, string> = {
  sequencing: 'Sıralama',
  pattern: 'Örüntü',
  debugging: 'Hata Ayıklama',
  loops: 'Döngü',
  conditionals: 'Koşul',
  matching: 'Eşleştirme',
  planning: 'Planlama',
};

export function computeCategorySkillProfile(results: GameCompletionSummary[]): RadarAxis[] {
  return PROFILE_CATEGORIES.map((category) => {
    const categoryResults = results.filter((r) => gameRegistry[r.gameId]?.definition.category === category);
    const value =
      categoryResults.length === 0
        ? 0
        : Math.round(
            categoryResults.reduce((sum, r) => sum + (r.totalPoints / r.maxPoints) * 100, 0) /
              categoryResults.length,
          );
    return { label: CATEGORY_LABEL[category], shortLabel: SHORT_LABEL[category], value };
  });
}

export function generatePedagogicalFeedback(
  studentFirstName: string,
  axes: RadarAxis[],
  kbsScore?: number,
): string {
  const hasAnyData = axes.some((a) => a.value > 0) || kbsScore !== undefined;
  if (!hasAnyData) {
    return `${studentFirstName} henüz bir oyun tamamlamadı. Başlangıç için "Sıralama Ustası" önerilir.`;
  }

  const sorted = [...axes].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  let feedback = `${studentFirstName}, en yüksek performansı %${Math.round(strongest.value)} ile ${strongest.label} alanında gösterdi.`;
  if (weakest.value < 70) {
    feedback += ` Gelişime açık alan olarak ${weakest.label} (%${Math.round(weakest.value)}) öne çıkıyor; bu alanda ek pratik önerilir.`;
  } else {
    feedback += ` Tüm alanlarda dengeli ve güçlü bir gelişim sergiliyor!`;
  }
  if (kbsScore !== undefined) {
    feedback += ` Okula Hazırlık oyunundaki Kodlama Becerisi Skoru: ${Math.round(kbsScore)}/100.`;
  }
  return feedback;
}

export interface ClassComparisonRow {
  studentId: string;
  studentName: string;
  gamesPlayed: number;
  averageStars: number;
  kbsScore: number | null;
}

export function computeClassComparison(
  students: StudentProfile[],
  allResults: GameCompletionSummary[],
): ClassComparisonRow[] {
  return students.map((student) => {
    const studentResults = allResults.filter((r) => r.studentId === student.id);
    const gamesPlayed = studentResults.length;
    const averageStars =
      gamesPlayed === 0
        ? 0
        : Math.round((studentResults.reduce((sum, r) => sum + r.starRating, 0) / gamesPlayed) * 10) / 10;
    const houseNavResult = studentResults.find((r) => r.houseNavMetrics);
    const kbsScore = houseNavResult?.houseNavMetrics?.kbsScore ?? null;

    return {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      gamesPlayed,
      averageStars,
      kbsScore,
    };
  });
}
