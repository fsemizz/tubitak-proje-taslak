import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { ResultsTable } from '@/features/teacher/components/ResultsTable';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { EmptyState } from '@/components/primitives/EmptyState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { requireTeacherLoader } from '@/app/routeGuards';
import { resultsService, gameContentService } from '@/services/serviceProvider';
import { ClipboardList } from 'lucide-react';
import type { GameCompletionSummary } from '@/types/result';
import type { GameDefinition } from '@/types/game';

export async function teacherHistoryLoader() {
  requireTeacherLoader();
  const [results, games] = await Promise.all([
    resultsService.listAllResults(),
    gameContentService.listGames(),
  ]);
  return { results, games };
}

export default function TeacherHistoryPage() {
  const { results, games } = useLoaderData() as { results: GameCompletionSummary[]; games: GameDefinition[] };
  const [gameFilter, setGameFilter] = useState('all');

  const filtered = useMemo(
    () => (gameFilter === 'all' ? results : results.filter((r) => r.gameId === gameFilter)),
    [results, gameFilter],
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Oyun Geçmişi"
        description="Tüm öğrencilerin tamamladığı oyunlar."
        action={
          <Select value={gameFilter} onValueChange={(value) => setGameFilter(value ?? 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Oyun seç" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm oyunlar</SelectItem>
              {games.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Sonuç bulunamadı" description="Bu filtreyle eşleşen bir kayıt yok." />
      ) : (
        <ResultsTable results={filtered} />
      )}
    </div>
  );
}
