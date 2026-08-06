import { Lightbulb, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SkillRadarChart } from '@/components/primitives/SkillRadarChart';
import { computeCategorySkillProfile, generatePedagogicalFeedback } from '@/lib/analytics';
import type { GameCompletionSummary } from '@/types/result';

interface StudentSkillProfileCardProps {
  studentFirstName: string;
  results: GameCompletionSummary[];
  kbsScore?: number;
}

export function StudentSkillProfileCard({ studentFirstName, results, kbsScore }: StudentSkillProfileCardProps) {
  const axes = computeCategorySkillProfile(results);
  const hasData = axes.some((a) => a.value > 0);
  const sorted = [...axes].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const feedback = generatePedagogicalFeedback(studentFirstName, axes, kbsScore);

  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-900">
                Pedagojik Analiz ve Gelişim Önerisi
              </h4>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-700">{feedback}</p>
          </div>

          {hasData && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <TrendingUp className="size-4 text-emerald-600" /> En Güçlü Yanı
                </span>
                <span className="font-extrabold text-emerald-900">
                  {strongest.label} (%{Math.round(strongest.value)})
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-amber-800">
                  <Sparkles className="size-4 text-amber-600" /> Geliştirilebilir Yanı
                </span>
                <span className="font-extrabold text-amber-900">
                  {weakest.label} (%{Math.round(weakest.value)})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center rounded-xl border border-border bg-muted/30 p-4">
          <SkillRadarChart axes={axes} title="5-Eksenli Beceri Radarı" />
        </div>
      </CardContent>
    </Card>
  );
}
