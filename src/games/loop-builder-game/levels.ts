import type { LoopLevel, GridCellType } from '@/types/game';

const GAME_ID = 'loop-builder-game';

function makeGrid(rows: number, cols: number, walls: [number, number][] = []): GridCellType[][] {
  const grid: GridCellType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'empty' as GridCellType),
  );
  for (const [r, c] of walls) {
    grid[r][c] = 'wall';
  }
  return grid;
}

export const loopLevels: LoopLevel[] = [
  {
    id: 'loop-1',
    gameId: GAME_ID,
    order: 1,
    title: 'Düz Yol',
    difficulty: 'kolay',
    instructions: 'Robotu düz bir çizgide bayrağa ulaştır. Sağa okuna 2 kere bas ya da sayısını 2 yap.',
    points: 10,
    optimalDurationSeconds: 30,
    minSteps: 2,
    type: 'loop',
    grid: makeGrid(1, 3),
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 2 },
    maxEntries: 3,
  },
  {
    id: 'loop-2',
    gameId: GAME_ID,
    order: 2,
    title: 'Köşeyi Dönen Yol',
    difficulty: 'kolay',
    instructions: 'Robotu önce sağa, sonra aşağı yönlendirerek bayrağa ulaştır. Ortadaki engelin üzerinden geçemezsin.',
    points: 10,
    optimalDurationSeconds: 45,
    minSteps: 3,
    type: 'loop',
    grid: makeGrid(3, 3, [[1, 1]]),
    start: { row: 0, col: 0 },
    goal: { row: 2, col: 2 },
    maxEntries: 4,
  },
  {
    id: 'loop-3',
    gameId: GAME_ID,
    order: 3,
    title: 'Kare Çizen Robot',
    difficulty: 'orta',
    instructions: 'Robotu, ortadaki engelin etrafından dolaşıp başladığı yere dönecek şekilde bir kare çizdirerek yürüt.',
    points: 15,
    optimalDurationSeconds: 70,
    minSteps: 4,
    type: 'loop',
    grid: makeGrid(3, 3, [[1, 1]]),
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 0 },
    maxEntries: 6,
  },
  {
    id: 'loop-4',
    gameId: GAME_ID,
    order: 4,
    title: 'Uzun Koridor',
    difficulty: 'orta',
    instructions: 'Önündeki duvarın etrafından dolaş. Sayı arttırma düğmesini kullanarak az sayıda komutla bayrağa ulaş.',
    points: 15,
    optimalDurationSeconds: 55,
    minSteps: 3,
    type: 'loop',
    grid: makeGrid(3, 5, [
      [0, 2],
      [1, 2],
    ]),
    start: { row: 0, col: 0 },
    goal: { row: 2, col: 3 },
    maxEntries: 3,
  },
  {
    id: 'loop-5',
    gameId: GAME_ID,
    order: 5,
    title: 'Engelli Yol',
    difficulty: 'zor',
    instructions: 'Duvarlara çarpmadan, mümkün olan en az komutla bayrağa ulaş.',
    points: 20,
    optimalDurationSeconds: 70,
    minSteps: 4,
    type: 'loop',
    grid: makeGrid(4, 4, [
      [0, 2],
      [1, 2],
    ]),
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 3 },
    maxEntries: 4,
  },
];
