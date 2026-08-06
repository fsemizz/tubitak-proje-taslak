import { useLoaderData, useNavigation, useRevalidator } from 'react-router-dom';
import { GraduationCap, RefreshCw } from 'lucide-react';
import { StatTileRow } from '@/features/teacher/components/StatTileRow';
import { ActivityFeed } from '@/features/teacher/components/ActivityFeed';
import { ClassComparisonTable } from '@/features/teacher/components/ClassComparisonTable';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { Button } from '@/components/ui/button';
import { requireTeacherLoader } from '@/app/routeGuards';
import { resultsService, teacherService } from '@/services/serviceProvider';
import { useTeacherStore } from '@/stores/useTeacherStore';
import { APP_NAME } from '@/lib/constants';
import type { GameCompletionSummary } from '@/types/result';
import type { StudentProfile } from '@/types/student';

export async function teacherDashboardLoader() {
  requireTeacherLoader();
  const [results, students] = await Promise.all([
    resultsService.listAllResults(),
    teacherService.listStudents(),
  ]);
  return { results, students };
}

export default function TeacherDashboardPage() {
  const { results, students } = useLoaderData() as { results: GameCompletionSummary[]; students: StudentProfile[] };
  const session = useTeacherStore((s) => s.session);
  const revalidator = useRevalidator();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' || revalidator.state === 'loading';

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 size-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300">
              <GraduationCap className="size-4" />
              <span>{APP_NAME} Öğretmen Portalı</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Hoş geldin, {session?.displayName}
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-300">
              Öğrencilerinin 5 eksenli algoritmik düşünme becerilerini ve Okula Hazırlık oyunundaki Kodlama Becerisi
              Skorlarını (KBS) buradan takip edebilirsin.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            onClick={() => revalidator.revalidate()}
          >
            <RefreshCw className={isLoading ? 'size-4 animate-spin' : 'size-4'} /> Verileri Yenile
          </Button>
        </div>
      </div>

      <StatTileRow results={results} />

      <div className="flex flex-col gap-4">
        <SectionHeading title="Sınıf Karşılaştırması" description="Tüm öğrenciler bir arada." />
        <ClassComparisonTable students={students} results={results} />
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeading title="Son Etkinlikler" description="En son tamamlanan oyunlar." />
        <ActivityFeed results={results} />
      </div>
    </div>
  );
}
