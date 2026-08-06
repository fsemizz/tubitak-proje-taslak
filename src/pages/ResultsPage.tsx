import { Link, useLoaderData, useLocation, useNavigate, useParams, type LoaderFunctionArgs } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { ResultSummaryCard } from '@/features/results/components/ResultSummaryCard';
import { ReplayCta } from '@/features/results/components/ReplayCta';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Button } from '@/components/ui/button';
import { requireStudentLoader } from '@/app/routeGuards';
import { resultsService } from '@/services/serviceProvider';
import { useSessionStore } from '@/stores/useSessionStore';
import { buildGamePlayPath, ROUTE_PATHS } from '@/app/routePaths';
import type { GameCompletionSummary } from '@/types/result';

export async function gameResultsLoader(args: LoaderFunctionArgs) {
  requireStudentLoader(args);
  const gameSlug = args.params.gameSlug as string;
  const student = useSessionStore.getState().currentStudent;
  if (!student) return { latest: null };
  const results = await resultsService.listResultsByStudent(student.id);
  const latest = results.find((r) => r.gameId === gameSlug) ?? null;
  return { latest };
}

export default function ResultsPage() {
  const { latest } = useLoaderData() as { latest: GameCompletionSummary | null };
  const location = useLocation();
  const navigate = useNavigate();
  const { gameSlug } = useParams();
  const stateSummary = (location.state as { summary?: GameCompletionSummary } | null)?.summary;
  const summary = stateSummary ?? latest;

  if (!summary) {
    return (
      <div className="mx-auto max-w-md py-10">
        <EmptyState
          icon={Trophy}
          title="Henüz sonuç yok"
          description="Bu oyunu tamamladığında sonuçların burada görünecek."
          action={
            <Button render={<Link to={ROUTE_PATHS.home} />} nativeButton={false} size="sm">
              Kataloğa Dön
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5 py-6">
      <ResultSummaryCard summary={summary} />
      <ReplayCta onReplay={() => navigate(buildGamePlayPath(gameSlug ?? summary.gameId))} />
    </div>
  );
}
