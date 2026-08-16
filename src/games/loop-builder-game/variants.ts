import type { GridCellType, Position } from '@/types/game';

interface LoopVariant {
  grid: GridCellType[][];
  start: Position;
  goal: Position;
}

function makeGrid(rows: number, cols: number, walls: [number, number][] = []): GridCellType[][] {
  const grid: GridCellType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'empty' as GridCellType),
  );
  for (const [r, c] of walls) {
    grid[r][c] = 'wall';
  }
  return grid;
}

// Every variant below is hand-verified solvable within that level's maxEntries budget (see
// levels.ts) — same shape of challenge, different layout, so replaying doesn't just repeat the
// memorized solution.
const VARIANTS: Record<string, LoopVariant[]> = {
  'loop-1': [
    { grid: makeGrid(1, 3), start: { row: 0, col: 0 }, goal: { row: 0, col: 2 } },
    { grid: makeGrid(1, 3), start: { row: 0, col: 2 }, goal: { row: 0, col: 0 } },
  ],
  'loop-2': [
    { grid: makeGrid(3, 3, [[1, 1]]), start: { row: 0, col: 0 }, goal: { row: 2, col: 2 } },
    { grid: makeGrid(3, 3, [[0, 1]]), start: { row: 0, col: 0 }, goal: { row: 2, col: 2 } },
  ],
  'loop-3': [
    { grid: makeGrid(3, 3, [[1, 1]]), start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: makeGrid(3, 3, [[1, 1]]), start: { row: 2, col: 2 }, goal: { row: 2, col: 2 } },
  ],
  'loop-4': [
    {
      grid: makeGrid(3, 5, [
        [0, 2],
        [1, 2],
      ]),
      start: { row: 0, col: 0 },
      goal: { row: 2, col: 3 },
    },
    {
      grid: makeGrid(3, 5, [
        [0, 3],
        [1, 3],
      ]),
      start: { row: 0, col: 0 },
      goal: { row: 2, col: 4 },
    },
  ],
  'loop-5': [
    {
      grid: makeGrid(4, 4, [
        [0, 2],
        [1, 2],
      ]),
      start: { row: 0, col: 0 },
      goal: { row: 0, col: 3 },
    },
    {
      grid: makeGrid(4, 4, [
        [0, 1],
        [1, 1],
      ]),
      start: { row: 0, col: 0 },
      goal: { row: 0, col: 3 },
    },
  ],
};

export function pickLoopVariant(levelId: string): LoopVariant {
  const options = VARIANTS[levelId];
  if (!options || options.length === 0) {
    throw new Error(`No loop-builder variants defined for level "${levelId}"`);
  }
  return options[Math.floor(Math.random() * options.length)];
}
