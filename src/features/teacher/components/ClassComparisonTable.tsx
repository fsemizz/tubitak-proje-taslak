import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { buildTeacherStudentDetailPath } from '@/app/routePaths';
import { computeClassComparison, type ClassComparisonRow } from '@/lib/analytics';
import type { GameCompletionSummary } from '@/types/result';
import type { StudentProfile } from '@/types/student';

type SortKey = 'studentName' | 'gamesPlayed' | 'averageStars' | 'kbsScore';

interface ClassComparisonTableProps {
  students: StudentProfile[];
  results: GameCompletionSummary[];
}

export function ClassComparisonTable({ students, results }: ClassComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('kbsScore');
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    const base = computeClassComparison(students, results);
    const sorted = [...base].sort((a, b) => {
      const av = a[sortKey] ?? -1;
      const bv = b[sortKey] ?? -1;
      if (typeof av === 'string' || typeof bv === 'string') {
        return String(av).localeCompare(String(bv), 'tr');
      }
      return (av as number) - (bv as number);
    });
    return sortDesc ? sorted.reverse() : sorted;
  }, [students, results, sortKey, sortDesc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead label="Öğrenci" onClick={() => toggleSort('studentName')} />
          <SortableHead label="Oynanan Oyun" onClick={() => toggleSort('gamesPlayed')} />
          <SortableHead label="Ortalama Yıldız" onClick={() => toggleSort('averageStars')} />
          <SortableHead label="KBS (Okula Hazırlık)" onClick={() => toggleSort('kbsScore')} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row: ClassComparisonRow) => (
          <TableRow key={row.studentId}>
            <TableCell>
              <Link
                to={buildTeacherStudentDetailPath(row.studentId)}
                className="font-medium text-indigo-700 hover:underline"
              >
                {row.studentName}
              </Link>
            </TableCell>
            <TableCell>{row.gamesPlayed}</TableCell>
            <TableCell>{row.averageStars || '—'}</TableCell>
            <TableCell>{row.kbsScore !== null ? `${row.kbsScore}/100` : '—'}</TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              Henüz öğrenci verisi yok.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function SortableHead({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <TableHead>
      <button onClick={onClick} className="flex items-center gap-1 hover:text-foreground">
        {label} <ArrowUpDown className="size-3" />
      </button>
    </TableHead>
  );
}
