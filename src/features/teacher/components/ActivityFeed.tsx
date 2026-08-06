import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { buildTeacherStudentDetailPath } from '@/app/routePaths';
import type { GameCompletionSummary } from '@/types/result';

interface ActivityFeedProps {
  results: GameCompletionSummary[];
  limit?: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function ActivityFeed({ results, limit = 6 }: ActivityFeedProps) {
  const recent = results.slice(0, limit);

  return (
    <Card>
      <CardContent className="flex flex-col divide-y divide-border py-2">
        {recent.map((r) => (
          <Link
            key={r.id}
            to={buildTeacherStudentDetailPath(r.studentId)}
            className="flex items-center justify-between gap-3 px-2 py-3 text-sm transition hover:bg-muted/50"
          >
            <div>
              <p className="font-semibold text-foreground">{r.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {r.gameTitle} · {formatDate(r.completedAt)}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
              <Star className="size-4 fill-amber-400" /> {r.starRating}
            </span>
          </Link>
        ))}
        {recent.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">Henüz bir etkinlik yok.</p>
        )}
      </CardContent>
    </Card>
  );
}
