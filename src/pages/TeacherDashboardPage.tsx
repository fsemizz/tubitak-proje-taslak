import { useLoaderData } from 'react-router-dom';
import { StatTileRow } from '@/features/teacher/components/StatTileRow';
import { ActivityFeed } from '@/features/teacher/components/ActivityFeed';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { requireTeacherLoader } from '@/app/routeGuards';
import { resultsService } from '@/services/serviceProvider';
import { useTeacherStore } from '@/stores/useTeacherStore';
import type { GameCompletionSummary } from '@/types/result';

export async function teacherDashboardLoader() {
  requireTeacherLoader();
  const results = await resultsService.listAllResults();
  return { results };
}

export default function TeacherDashboardPage() {
  const { results } = useLoaderData() as { results: GameCompletionSummary[] };
  const session = useTeacherStore((s) => s.session);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-foreground">
          Hoş geldin, {session?.displayName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Sınıfının genel durumuna göz at.</p>
      </div>

      <StatTileRow results={results} />

      <div className="flex flex-col gap-4">
        <SectionHeading title="Son Etkinlikler" description="En son tamamlanan oyunlar." />
        <ActivityFeed results={results} />
      </div>
    </div>
  );
}
