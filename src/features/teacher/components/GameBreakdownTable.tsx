import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { GameCompletionSummary } from '@/types/result';

interface GameBreakdownTableProps {
  results: GameCompletionSummary[];
}

interface BreakdownRow {
  gameId: string;
  gameTitle: string;
  playCount: number;
  bestScorePct: number;
  avgScorePct: number;
  lastPlayedAt: string;
}

function buildBreakdown(results: GameCompletionSummary[]): BreakdownRow[] {
  const byGame = new Map<string, GameCompletionSummary[]>();
  for (const r of results) {
    const list = byGame.get(r.gameId) ?? [];
    list.push(r);
    byGame.set(r.gameId, list);
  }

  return Array.from(byGame.entries())
    .map(([gameId, list]) => {
      const scores = list.map((r) => (r.totalPoints / r.maxPoints) * 100);
      const lastPlayedAt = list.reduce((latest, r) => (r.completedAt > latest ? r.completedAt : latest), list[0].completedAt);
      return {
        gameId,
        gameTitle: list[0].gameTitle,
        playCount: list.length,
        bestScorePct: Math.round(Math.max(...scores)),
        avgScorePct: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
        lastPlayedAt,
      };
    })
    .sort((a, b) => b.playCount - a.playCount);
}

export function GameBreakdownTable({ results }: GameBreakdownTableProps) {
  const rows = buildBreakdown(results);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Oyun</TableHead>
          <TableHead>Kaç Kez Oynadı</TableHead>
          <TableHead>En İyi Puan</TableHead>
          <TableHead>Ortalama Puan</TableHead>
          <TableHead>Son Oynama</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.gameId}>
            <TableCell className="font-medium">{row.gameTitle}</TableCell>
            <TableCell>{row.playCount}</TableCell>
            <TableCell>%{row.bestScorePct}</TableCell>
            <TableCell>%{row.avgScorePct}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(row.lastPlayedAt).toLocaleDateString('tr-TR')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
