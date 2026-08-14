import type { HouseMap, HouseMapCell, InteractiveObject, Position, RoomDef, SchoolReadinessLevel } from './types';
import { anaokuluRoomDefs, ilkokuluRoomDefs } from './houseMaps';

function emptyGrid(size: number): HouseMapCell[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ({ type: 'floor' as const })));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DELTAS: Position[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

/** True if every anchor is reachable from every other anchor through non-wall cells. */
function anchorsConnected(grid: HouseMapCell[][], anchors: Position[]): boolean {
  const size = grid.length;
  const visited = new Set<string>();
  const queue: Position[] = [anchors[0]];
  visited.add(`${anchors[0].row},${anchors[0].col}`);

  while (queue.length > 0) {
    const pos = queue.shift()!;
    for (const d of DELTAS) {
      const next = { row: pos.row + d.row, col: pos.col + d.col };
      const key = `${next.row},${next.col}`;
      if (next.row < 0 || next.row >= size || next.col < 0 || next.col >= size) continue;
      if (grid[next.row][next.col].type === 'wall') continue;
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push(next);
    }
  }

  return anchors.every((a) => visited.has(`${a.row},${a.col}`));
}

/**
 * Shared wall-carving core for both map variants: only ever commits a wall if every anchor stays
 * mutually reachable afterward, so the result is solvable by construction, never by retrying.
 */
function carveWalls(grid: HouseMapCell[][], anchors: Position[], density: number): void {
  const size = grid.length;
  const isAnchor = (r: number, c: number) => anchors.some((p) => p.row === r && p.col === c);
  const interior: Position[] = [];
  const border: Position[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isAnchor(r, c)) continue;
      const onBorder = r === 0 || r === size - 1 || c === 0 || c === size - 1;
      (onBorder ? border : interior).push({ row: r, col: c });
    }
  }
  // Interior cells first (keeps the familiar "blocked middle, walkable ring" feel most of the time)
  // while still landing on a different shape every time; border cells fill in if density needs more.
  const candidates = [...shuffle(interior), ...shuffle(border)];
  const targetWalls = Math.floor((size * size - anchors.length) * density);

  let placed = 0;
  for (const cell of candidates) {
    if (placed >= targetWalls) break;
    grid[cell.row][cell.col] = { type: 'wall' };
    if (anchorsConnected(grid, anchors)) {
      placed++;
    } else {
      grid[cell.row][cell.col] = { type: 'floor' };
    }
  }
}

/** One cell per quadrant, biased to the outer border so doors read as entrances into a corridor loop. */
function pickSpreadPositions(size: number, count: number): Position[] {
  const halfR = Math.ceil(size / 2);
  const halfC = Math.ceil(size / 2);
  const quadrants = [
    { rows: [0, halfR - 1], cols: [0, halfC - 1] },
    { rows: [0, halfR - 1], cols: [halfC, size - 1] },
    { rows: [halfR, size - 1], cols: [0, halfC - 1] },
    { rows: [halfR, size - 1], cols: [halfC, size - 1] },
  ];

  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const q = quadrants[i % quadrants.length];
    const candidates: Position[] = [];
    for (let r = q.rows[0]; r <= q.rows[1]; r++) {
      for (let c = q.cols[0]; c <= q.cols[1]; c++) {
        const onBorder = r === 0 || r === size - 1 || c === 0 || c === size - 1;
        const taken = positions.some((p) => p.row === r && p.col === c);
        if (onBorder && !taken) candidates.push({ row: r, col: c });
      }
    }
    const pool = candidates.length > 0 ? candidates : [{ row: q.rows[0], col: q.cols[0] }];
    positions.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return positions;
}

function generateHouseVariant(def: RoomDef): HouseMap {
  const size = def.size;
  const grid = emptyGrid(size);
  const doorPositions = pickSpreadPositions(size, def.objects.length);

  const wallDensity = size <= 5 ? 0.28 : 0.42;
  carveWalls(grid, doorPositions, wallDensity);

  const objects: InteractiveObject[] = def.objects.map((o, i) => ({ ...o, position: doorPositions[i] }));
  for (const obj of objects) {
    grid[obj.position.row][obj.position.col] = { type: 'object', objectId: obj.id };
  }

  return { roomId: def.roomId, label: def.label, variant: 'house', accent: def.accent, grid, objects };
}

function generateRoomVariant(def: RoomDef): HouseMap {
  const size = def.size;
  const grid = emptyGrid(size);

  const freeCells: Position[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r === 0 && c === 0) continue; // reserved entry corner, kept clear so it never overlaps an object
      freeCells.push({ row: r, col: c });
    }
  }
  const shuffled = shuffle(freeCells);

  const objects: InteractiveObject[] = def.objects.map((o, i) => ({ ...o, position: shuffled[i] }));
  for (const obj of objects) {
    grid[obj.position.row][obj.position.col] = { type: 'object', objectId: obj.id };
  }

  // The entry corner plus every object are anchors: the player must always be able to reach each
  // item from the door and from every other item, no matter which cells the walls land on.
  const anchors: Position[] = [{ row: 0, col: 0 }, ...objects.map((o) => o.position)];
  const roomWallDensity = size <= 4 ? 0.16 : 0.22;
  carveWalls(grid, anchors, roomWallDensity);

  return { roomId: def.roomId, label: def.label, variant: 'room', accent: def.accent, grid, objects };
}

function generateHouseMap(def: RoomDef): HouseMap {
  return def.variant === 'house' ? generateHouseVariant(def) : generateRoomVariant(def);
}

/** Fresh, always-solvable maps for every room in the given track - a new layout every call. */
export function generateHouseMaps(schoolLevel: SchoolReadinessLevel): Record<string, HouseMap> {
  const defs = schoolLevel === 'ilkokul' ? ilkokuluRoomDefs : anaokuluRoomDefs;
  const result: Record<string, HouseMap> = {};
  for (const key of Object.keys(defs)) {
    result[key] = generateHouseMap(defs[key]);
  }
  return result;
}
