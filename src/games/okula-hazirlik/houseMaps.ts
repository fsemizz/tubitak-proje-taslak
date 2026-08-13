import type { HouseMap, HouseMapCell, InteractiveObject, Position } from './types';

function emptyGrid(rows: number, cols: number): HouseMapCell[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ type: 'floor' as const })));
}

function placeObjects(grid: HouseMapCell[][], objects: InteractiveObject[]): void {
  for (const obj of objects) {
    grid[obj.position.row][obj.position.col] = { type: 'object', objectId: obj.id };
  }
}

function placeWalls(grid: HouseMapCell[][], cells: Position[]): void {
  for (const c of cells) {
    grid[c.row][c.col] = { type: 'wall' };
  }
}

function pos(row: number, col: number): Position {
  return { row, col };
}

// --- Ana ev krokisi: 4 kapı bir koridor halkasıyla birbirine bağlı, ortadaki oda bloğundan geçilemez ---
const mainObjects: InteractiveObject[] = [
  { id: 'door-child-room', label: 'Çocuk Odası', icon: 'bed', position: pos(0, 0) },
  { id: 'door-bathroom', label: 'Banyo', icon: 'shower-head', position: pos(0, 4) },
  { id: 'door-kitchen', label: 'Mutfak', icon: 'utensils', position: pos(4, 0) },
  { id: 'door-exit', label: 'Çıkış Kapısı', icon: 'door-open', position: pos(4, 4) },
];
const mainGrid = emptyGrid(5, 5);
// Ortadaki 3x3 blok, evin dokunulamayan iç duvarlarını temsil eder. Yalnızca dış koridordan geçilebilir.
placeWalls(mainGrid, [
  pos(1, 1), pos(1, 2), pos(1, 3),
  pos(2, 1), pos(2, 2), pos(2, 3),
  pos(3, 1), pos(3, 2), pos(3, 3),
]);
placeObjects(mainGrid, mainObjects);

export const mainHouseMap: HouseMap = {
  roomId: 'main',
  label: 'Ev Haritası',
  variant: 'house',
  accent: 'teal',
  grid: mainGrid,
  objects: mainObjects,
};

// --- Banyo detay haritası ---
const bathroomObjects: InteractiveObject[] = [
  { id: 'sink', label: 'Lavabo', icon: 'droplets', position: pos(1, 1) },
  { id: 'shower', label: 'Duş', icon: 'shower-head', position: pos(1, 3) },
  { id: 'washing-machine', label: 'Çamaşır Makinesi', icon: 'washing-machine', position: pos(3, 0) },
  { id: 'bathroom-cabinet', label: 'Dolap', icon: 'archive', position: pos(3, 2) },
];
const bathroomGrid = emptyGrid(4, 4);
placeObjects(bathroomGrid, bathroomObjects);

export const bathroomMap: HouseMap = {
  roomId: 'bathroom',
  label: 'Banyo',
  variant: 'room',
  accent: 'sky',
  grid: bathroomGrid,
  objects: bathroomObjects,
};

// --- Mutfak detay haritası ---
const kitchenObjects: InteractiveObject[] = [
  { id: 'fridge', label: 'Buzdolabı', icon: 'refrigerator', position: pos(0, 3) },
  { id: 'table', label: 'Masa', icon: 'utensils', position: pos(2, 2) },
  { id: 'kitchen-cabinet', label: 'Dolap', icon: 'archive', position: pos(3, 0) },
  { id: 'balcony-door', label: 'Balkon Kapısı', icon: 'door-open', position: pos(3, 3) },
];
const kitchenGrid = emptyGrid(4, 4);
placeObjects(kitchenGrid, kitchenObjects);

export const kitchenMap: HouseMap = {
  roomId: 'kitchen',
  label: 'Mutfak',
  variant: 'room',
  accent: 'amber',
  grid: kitchenGrid,
  objects: kitchenObjects,
};

// --- Çocuk Odası detay haritası ---
const childRoomObjects: InteractiveObject[] = [
  { id: 'bed', label: 'Yatak', icon: 'bed', position: pos(0, 3) },
  { id: 'desk', label: 'Çalışma Masası', icon: 'lamp-desk', position: pos(2, 0) },
  { id: 'book', label: 'Kitap', icon: 'book', position: pos(2, 1) },
  { id: 'backpack', label: 'Okul Çantası', icon: 'backpack', position: pos(3, 3) },
  { id: 'child-cabinet', label: 'Dolap', icon: 'archive', position: pos(3, 0) },
];
const childRoomGrid = emptyGrid(4, 4);
placeObjects(childRoomGrid, childRoomObjects);

export const childRoomMap: HouseMap = {
  roomId: 'child-room',
  label: 'Çocuk Odası',
  variant: 'room',
  accent: 'violet',
  grid: childRoomGrid,
  objects: childRoomObjects,
};

export const houseMaps: Record<string, HouseMap> = {
  main: mainHouseMap,
  bathroom: bathroomMap,
  kitchen: kitchenMap,
  'child-room': childRoomMap,
};

// =====================================================================================
// İlkokul (7x7) haritaları — daha uzun, dolambaçlı koridor + büyütülmüş, çeldiricili odalar.
// =====================================================================================

// --- Ana ev krokisi (7x7): dış koridor halkası + üst kenarda zorunlu bir iç sapma (dolambaç) ---
const mainObjects7: InteractiveObject[] = [
  { id: 'door-child-room', label: 'Çocuk Odası', icon: 'bed', position: pos(0, 0) },
  { id: 'door-bathroom', label: 'Banyo', icon: 'shower-head', position: pos(0, 6) },
  { id: 'door-kitchen', label: 'Mutfak', icon: 'utensils', position: pos(6, 0) },
  { id: 'door-exit', label: 'Çıkış Kapısı', icon: 'door-open', position: pos(6, 6) },
];
const mainGrid7 = emptyGrid(7, 7);
// Ortadaki 5x5 blok evin iç duvarlarını temsil eder; sadece dış koridordan geçilebilir.
placeWalls(mainGrid7, [
  pos(1, 1), pos(2, 1), pos(3, 1), pos(4, 1), pos(5, 1),
  pos(1, 5), pos(2, 5), pos(3, 5), pos(4, 5), pos(5, 5),
  pos(2, 2), pos(2, 3), pos(2, 4),
  pos(3, 2), pos(3, 3), pos(3, 4),
  pos(4, 2), pos(4, 3), pos(4, 4),
  pos(5, 2), pos(5, 3), pos(5, 4),
]);
// Üst kenarın ortasını kapatıp (0,3) - koridoru bir adım içeri (satır 1) sapmaya zorluyor: dolambaç.
placeWalls(mainGrid7, [pos(0, 3)]);
placeObjects(mainGrid7, mainObjects7);

export const mainHouseMap7x7: HouseMap = {
  roomId: 'main7',
  label: 'Ev Haritası (Büyük)',
  variant: 'house',
  accent: 'teal',
  grid: mainGrid7,
  objects: mainObjects7,
};

// --- Banyo (5x5, çeldiricili) ---
const bathroomObjects7: InteractiveObject[] = [
  { id: 'sink', label: 'Lavabo', icon: 'droplets', position: pos(1, 1) },
  { id: 'shower', label: 'Duş', icon: 'shower-head', position: pos(1, 3) },
  { id: 'washing-machine', label: 'Çamaşır Makinesi', icon: 'washing-machine', position: pos(3, 1) },
  { id: 'bathroom-cabinet', label: 'Dolap', icon: 'archive', position: pos(3, 3) },
  { id: 'laundry-basket', label: 'Çamaşır Sepeti', icon: 'shirt', position: pos(4, 4) },
];
const bathroomGrid7 = emptyGrid(5, 5);
placeObjects(bathroomGrid7, bathroomObjects7);

export const bathroomMap7x7: HouseMap = {
  roomId: 'bathroom7',
  label: 'Banyo',
  variant: 'room',
  accent: 'sky',
  grid: bathroomGrid7,
  objects: bathroomObjects7,
};

// --- Mutfak (5x5, çeldiricili) ---
const kitchenObjects7: InteractiveObject[] = [
  { id: 'fridge', label: 'Buzdolabı', icon: 'refrigerator', position: pos(0, 3) },
  { id: 'table', label: 'Masa', icon: 'utensils', position: pos(2, 2) },
  { id: 'kitchen-cabinet', label: 'Dolap', icon: 'archive', position: pos(3, 0) },
  { id: 'balcony-door', label: 'Balkon Kapısı', icon: 'door-open', position: pos(3, 4) },
  { id: 'fruit-bowl', label: 'Meyve Kasesi', icon: 'apple', position: pos(4, 4) },
];
const kitchenGrid7 = emptyGrid(5, 5);
placeObjects(kitchenGrid7, kitchenObjects7);

export const kitchenMap7x7: HouseMap = {
  roomId: 'kitchen7',
  label: 'Mutfak',
  variant: 'room',
  accent: 'amber',
  grid: kitchenGrid7,
  objects: kitchenObjects7,
};

// --- Çocuk Odası (5x5, çeldiricili) — giyinme, örüntü ve eşleştirme bulmacaları burada tetiklenir ---
const childRoomObjects7: InteractiveObject[] = [
  { id: 'bed', label: 'Yatak', icon: 'bed', position: pos(0, 4) },
  { id: 'wardrobe', label: 'Gardırop', icon: 'shirt', position: pos(2, 2) },
  { id: 'desk', label: 'Çalışma Masası', icon: 'lamp-desk', position: pos(2, 0) },
  { id: 'backpack', label: 'Okul Çantası', icon: 'backpack', position: pos(4, 4) },
  { id: 'toy-box', label: 'Oyuncak Kutusu', icon: 'box', position: pos(4, 0) },
];
const childRoomGrid7 = emptyGrid(5, 5);
placeObjects(childRoomGrid7, childRoomObjects7);

export const childRoomMap7x7: HouseMap = {
  roomId: 'child-room7',
  label: 'Çocuk Odası',
  variant: 'room',
  accent: 'violet',
  grid: childRoomGrid7,
  objects: childRoomObjects7,
};

export const houseMaps7x7: Record<string, HouseMap> = {
  main7: mainHouseMap7x7,
  bathroom7: bathroomMap7x7,
  kitchen7: kitchenMap7x7,
  'child-room7': childRoomMap7x7,
};
