import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buildTeacherStudentDetailPath } from '@/app/routePaths';
import { formatDuration } from '@/lib/scoring';
import type { GameCompletionSummary } from '@/types/result';

interface ResultsTableProps {
  results: GameCompletionSummary[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Öğrenci</TableHead>
          <TableHead>Oyun</TableHead>
          <TableHead>Puan</TableHead>
          <TableHead>Yıldız</TableHead>
          <TableHead>Süre</TableHead>
          <TableHead>Tarih</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((r) => (
          <TableRow key={r.id}>
            <TableCell>
              <Link to={buildTeacherStudentDetailPath(r.studentId)} className="font-medium text-indigo-700 hover:underline">
                {r.studentName}
              </Link>
            </TableCell>
            <TableCell>{r.gameTitle}</TableCell>
            <TableCell>
              {r.totalPoints}/{r.maxPoints}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="size-3.5 fill-amber-400" /> {r.starRating}
              </span>
            </TableCell>
            <TableCell>{formatDuration(r.totalTimeSeconds)}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(r.completedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
