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
    instructions: 'Robotu düz bir çizgide hedefe ulaştır. "3 kere ileri git" bloğunu deneyebilirsin.',
    points: 10,
    type: 'loop',
    grid: makeGrid(1, 3),
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 2 },
    startDirection: 'right',
    maxBlocks: 3,
    availableBlocks: ['forward1', 'forward3'],
  },
  {
    id: 'loop-2',
    gameId: GAME_ID,
    order: 2,
    title: 'Tek Dönüşlü Yol',
    difficulty: 'kolay',
    instructions: 'Robot bir kez dönerek hedefe ulaşmalı. Tekrar bloğu + dönüş bloğunu birlikte kullan.',
    points: 10,
    type: 'loop',
    grid: makeGrid(3, 3),
    start: { row: 0, col: 0 },
    goal: { row: 2, col: 2 },
    startDirection: 'right',
    maxBlocks: 4,
    availableBlocks: ['forward1', 'forward2', 'turnLeft', 'turnRight'],
  },
  {
    id: 'loop-3',
    gameId: GAME_ID,
    order: 3,
    title: 'Kare Çizen Robot',
    difficulty: 'orta',
    instructions: 'Robotu başladığı yere geri dönecek şekilde bir kare çizdirerek yürüt.',
    points: 15,
    type: 'loop',
    grid: makeGrid(3, 3),
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 0 },
    startDirection: 'right',
    maxBlocks: 8,
    availableBlocks: ['forward1', 'forward2', 'turnLeft', 'turnRight'],
  },
  {
    id: 'loop-4',
    gameId: GAME_ID,
    order: 4,
    title: 'İki Tekrar Bloğu',
    difficulty: 'orta',
    instructions: 'İki farklı tekrar bloğunu (ileri x3 ve ileri x2) bir dönüşle birleştirerek hedefe ulaş.',
    points: 15,
    type: 'loop',
    grid: makeGrid(3, 5),
    start: { row: 0, col: 0 },
    goal: { row: 2, col: 3 },
    startDirection: 'right',
    maxBlocks: 3,
    availableBlocks: ['forward2', 'forward3', 'turnLeft', 'turnRight'],
  },
  {
    id: 'loop-5',
    gameId: GAME_ID,
    order: 5,
    title: 'Engelli Yol',
    difficulty: 'zor',
    instructions: 'Duvarlara çarpmadan, mümkün olan en az blokla hedefe ulaş.',
    points: 20,
    type: 'loop',
    grid: makeGrid(4, 4, [
      [0, 2],
      [1, 2],
    ]),
    start: { row: 0, col: 0 },
    goal: { row: 0, col: 3 },
    startDirection: 'right',
    maxBlocks: 6,
    availableBlocks: ['forward1', 'forward2', 'turnLeft', 'turnRight'],
  },
];
