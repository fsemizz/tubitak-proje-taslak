import type { HouseNavLevel } from './types';

export const houseNavLevels: HouseNavLevel[] = [
  {
    id: 'okul-1',
    order: 1,
    title: 'Banyoya Git',
    instructions: 'Komutları kullanarak karakteri Banyo kapısına götür.',
    mapRoomId: 'main',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'moveTo', targetObjectId: 'door-bathroom', actionLabel: 'Banyo kapısına git', feedbackLabel: 'Banyoya ulaştın!' },
    ],
    points: 10,
  },
  {
    id: 'okul-2',
    order: 2,
    title: 'Elini Yüzünü Yıka',
    instructions: 'Lavaboya git ve elini yüzünü yıka.',
    mapRoomId: 'bathroom',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'enterAt', targetObjectId: 'sink', actionLabel: 'Elini yüzünü yıka', feedbackLabel: 'Elini yüzünü yıkadın!' },
    ],
    points: 15,
  },
  {
    id: 'okul-3',
    order: 3,
    title: 'Mutfağa Git',
    instructions: 'Komutları kullanarak karakteri Mutfak kapısına götür.',
    mapRoomId: 'main',
    startPosition: { row: 0, col: 4 },
    taskSteps: [
      { kind: 'moveTo', targetObjectId: 'door-kitchen', actionLabel: 'Mutfak kapısına git', feedbackLabel: 'Mutfağa ulaştın!' },
    ],
    points: 10,
  },
  {
    id: 'okul-4',
    order: 4,
    title: 'Kahvaltı Yap',
    instructions: 'Masanın yanına git ve kahvaltı yap.',
    mapRoomId: 'kitchen',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'enterAt', targetObjectId: 'table', actionLabel: 'Kahvaltı yap', feedbackLabel: 'Kahvaltı yaptın!' },
    ],
    points: 15,
  },
  {
    id: 'okul-5',
    order: 5,
    title: 'Çocuk Odasına Git',
    instructions: 'Komutları kullanarak karakteri Çocuk Odası kapısına götür.',
    mapRoomId: 'main',
    startPosition: { row: 4, col: 0 },
    taskSteps: [
      { kind: 'moveTo', targetObjectId: 'door-child-room', actionLabel: 'Çocuk Odası kapısına git', feedbackLabel: 'Çocuk odasına ulaştın!' },
    ],
    points: 10,
  },
  {
    id: 'okul-6',
    order: 6,
    title: 'Çantanı Hazırla',
    instructions: 'Önce kitabı al, sonra çantaya git ve kitabı çantaya koy. Sıra önemli!',
    mapRoomId: 'child-room',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'enterAt', targetObjectId: 'book', actionLabel: 'Kitabı al', feedbackLabel: 'Kitabı aldın!' },
      { kind: 'enterAt', targetObjectId: 'backpack', actionLabel: 'Çantayı bul', feedbackLabel: 'Çantayı buldun!' },
      { kind: 'enterAt', targetObjectId: 'backpack', actionLabel: 'Kitabı çantaya koy', feedbackLabel: 'Kitabı çantaya koydun!' },
    ],
    points: 20,
  },
  {
    id: 'okul-7',
    order: 7,
    title: 'Evden Çık',
    instructions: 'Çıkış kapısına git ve evden çık.',
    mapRoomId: 'main',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'enterAt', targetObjectId: 'door-exit', actionLabel: 'Evden çık', feedbackLabel: 'Okula gitmeye hazırsın!' },
    ],
    points: 20,
  },
];
