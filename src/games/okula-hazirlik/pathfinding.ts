import type { HouseMap, Position } from './types';

const DELTAS: Position[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

export function shortestPathLength(map: HouseMap, from: Position, to: Position): number {
  const rows = map.grid.length;
  const cols = map.grid[0]?.length ?? 0;
  const visited = new Set<string>();
  const queue: { pos: Position; dist: number }[] = [{ pos: from, dist: 0 }];
  visited.add(`${from.row},${from.col}`);

  while (queue.length > 0) {
    const { pos, dist } = queue.shift()!;
    if (pos.row === to.row && pos.col === to.col) return dist;

    for (const d of DELTAS) {
      const next = { row: pos.row + d.row, col: pos.col + d.col };
      const key = `${next.row},${next.col}`;
      if (next.row < 0 || next.row >= rows || next.col < 0 || next.col >= cols) continue;
      if (map.grid[next.row][next.col].type === 'wall') continue;
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push({ pos: next, dist: dist + 1 });
    }
  }

  return Infinity;
}
