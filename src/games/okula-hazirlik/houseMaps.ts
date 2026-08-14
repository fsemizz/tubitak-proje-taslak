import type { RoomDef } from './types';

// Static room definitions: which objects exist where, and the room's visual style. Positions are
// NOT here anymore - mapGenerator.ts assigns them fresh (but always solvable) each time a level
// starts, so the same content produces a different layout every playthrough.

const mainRoomObjects = [
  { id: 'door-child-room', label: 'Çocuk Odası', icon: 'bed' },
  { id: 'door-bathroom', label: 'Banyo', icon: 'shower-head' },
  { id: 'door-kitchen', label: 'Mutfak', icon: 'utensils' },
  { id: 'door-exit', label: 'Çıkış Kapısı', icon: 'door-open' },
];

const bathroomObjects = [
  { id: 'sink', label: 'Lavabo', icon: 'droplets' },
  { id: 'shower', label: 'Duş', icon: 'shower-head' },
  { id: 'washing-machine', label: 'Çamaşır Makinesi', icon: 'washing-machine' },
  { id: 'bathroom-cabinet', label: 'Dolap', icon: 'archive' },
];

const kitchenObjects = [
  { id: 'fridge', label: 'Buzdolabı', icon: 'refrigerator' },
  { id: 'table', label: 'Masa', icon: 'utensils' },
  { id: 'kitchen-cabinet', label: 'Dolap', icon: 'archive' },
  { id: 'balcony-door', label: 'Balkon Kapısı', icon: 'door-open' },
];

const childRoomObjects = [
  { id: 'bed', label: 'Yatak', icon: 'bed' },
  { id: 'wardrobe', label: 'Gardırop', icon: 'shirt' },
  { id: 'desk', label: 'Çalışma Masası', icon: 'lamp-desk' },
  { id: 'book', label: 'Kitap', icon: 'book' },
  { id: 'backpack', label: 'Okul Çantası', icon: 'backpack' },
  { id: 'child-cabinet', label: 'Dolap', icon: 'archive' },
];

export const anaokuluRoomDefs: Record<string, RoomDef> = {
  main: { roomId: 'main', label: 'Ev Haritası', variant: 'house', accent: 'teal', size: 5, objects: mainRoomObjects },
  bathroom: { roomId: 'bathroom', label: 'Banyo', variant: 'room', accent: 'sky', size: 4, objects: bathroomObjects },
  kitchen: { roomId: 'kitchen', label: 'Mutfak', variant: 'room', accent: 'amber', size: 4, objects: kitchenObjects },
  'child-room': {
    roomId: 'child-room',
    label: 'Çocuk Odası',
    variant: 'room',
    accent: 'violet',
    size: 4,
    objects: childRoomObjects,
  },
};

// --- İlkokul (7x7 ana harita, 5x5 büyütülmüş odalar) — daha uzun rotalar + çeldiricili eşyalar ---

const mainRoomObjects7 = mainRoomObjects;

const bathroomObjects7 = [
  ...bathroomObjects,
  { id: 'laundry-basket', label: 'Çamaşır Sepeti', icon: 'shirt' },
];

const kitchenObjects7 = [
  ...kitchenObjects,
  { id: 'fruit-bowl', label: 'Meyve Kasesi', icon: 'apple' },
];

const childRoomObjects7 = [
  { id: 'bed', label: 'Yatak', icon: 'bed' },
  { id: 'wardrobe', label: 'Gardırop', icon: 'shirt' },
  { id: 'desk', label: 'Çalışma Masası', icon: 'lamp-desk' },
  { id: 'backpack', label: 'Okul Çantası', icon: 'backpack' },
  { id: 'toy-box', label: 'Oyuncak Kutusu', icon: 'box' },
];

export const ilkokuluRoomDefs: Record<string, RoomDef> = {
  main7: { roomId: 'main7', label: 'Ev Haritası (Büyük)', variant: 'house', accent: 'teal', size: 7, objects: mainRoomObjects7 },
  bathroom7: { roomId: 'bathroom7', label: 'Banyo', variant: 'room', accent: 'sky', size: 5, objects: bathroomObjects7 },
  kitchen7: { roomId: 'kitchen7', label: 'Mutfak', variant: 'room', accent: 'amber', size: 5, objects: kitchenObjects7 },
  'child-room7': {
    roomId: 'child-room7',
    label: 'Çocuk Odası',
    variant: 'room',
    accent: 'violet',
    size: 5,
    objects: childRoomObjects7,
  },
};
