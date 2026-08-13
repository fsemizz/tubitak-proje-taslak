import type { HouseNavLevel } from './types';

export const ilkokuluLevels: HouseNavLevel[] = [
  {
    id: 'ilk-1',
    order: 1,
    title: 'Banyoya Git',
    instructions: 'Ev daha büyük! Komutları kullanarak karakteri Banyo kapısına götür.',
    mapRoomId: 'main7',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'moveTo', targetObjectId: 'door-bathroom', actionLabel: 'Banyo kapısına git', feedbackLabel: 'Banyoya ulaştın!' },
    ],
    points: 10,
  },
  {
    id: 'ilk-2',
    order: 2,
    title: 'Elini Yüzünü Yıka',
    instructions: 'Lavaboya git ve elini yüzünü yıka. Dikkat, odada seni oyalayacak eşyalar da var!',
    mapRoomId: 'bathroom7',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'enterAt', targetObjectId: 'sink', actionLabel: 'Elini yüzünü yıka', feedbackLabel: 'Elini yüzünü yıkadın!' },
    ],
    points: 15,
  },
  {
    id: 'ilk-3',
    order: 3,
    title: 'Mutfağa Git',
    instructions: 'Koridorda bir dolambaç var, dikkatli ilerle. Karakteri Mutfak kapısına götür.',
    mapRoomId: 'main7',
    startPosition: { row: 0, col: 6 },
    taskSteps: [
      { kind: 'moveTo', targetObjectId: 'door-kitchen', actionLabel: 'Mutfak kapısına git', feedbackLabel: 'Mutfağa ulaştın!' },
    ],
    points: 10,
  },
  {
    id: 'ilk-4',
    order: 4,
    title: 'Kahvaltı Yap',
    instructions: 'Masanın yanına git ve beslenme çantana ne koyacağını akıllıca seç.',
    mapRoomId: 'kitchen7',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      {
        kind: 'miniPuzzle',
        targetObjectId: 'table',
        actionLabel: 'Beslenme çantanı hazırla',
        feedbackLabel: 'Kahvaltı yaptın!',
        puzzle: {
          type: 'clue',
          prompt: 'Beslenme çantana meyve olan ama kırmızı olmayanı koy.',
          options: [
            { id: 'apple', label: 'Kırmızı Elma', icon: '🍎' },
            { id: 'cherry', label: 'Kiraz', icon: '🍒' },
            { id: 'banana', label: 'Muz', icon: '🍌' },
          ],
          correctOptionId: 'banana',
        },
      },
    ],
    points: 15,
  },
  {
    id: 'ilk-5',
    order: 5,
    title: 'Çocuk Odasına Git',
    instructions: 'Komutları kullanarak karakteri Çocuk Odası kapısına götür.',
    mapRoomId: 'main7',
    startPosition: { row: 6, col: 0 },
    taskSteps: [
      { kind: 'moveTo', targetObjectId: 'door-child-room', actionLabel: 'Çocuk Odası kapısına git', feedbackLabel: 'Çocuk odasına ulaştın!' },
    ],
    points: 10,
  },
  {
    id: 'ilk-6',
    order: 6,
    title: 'Çantanı Hazırla',
    instructions: 'Önce giyin, sonra masadaki şifreyi çözüp kitabını al, en son çantanı doğru hazırla. Sıra önemli!',
    mapRoomId: 'child-room7',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      {
        kind: 'miniPuzzle',
        targetObjectId: 'wardrobe',
        actionLabel: 'Kıyafetlerini giy',
        feedbackLabel: 'Doğru sırayla giyindin!',
        puzzle: {
          type: 'orderedChoice',
          prompt: 'Hava yağmurlu! Kıyafetlerini doğru sırayla giy.',
          items: [
            { id: 'underwear', label: 'İç Çamaşırı', icon: '🩲' },
            { id: 'uniform', label: 'Okul Forması', icon: '👕' },
            { id: 'raincoat', label: 'Yağmurluk', icon: '🧥' },
          ],
          correctOrder: ['underwear', 'uniform', 'raincoat'],
        },
      },
      {
        kind: 'miniPuzzle',
        targetObjectId: 'desk',
        actionLabel: 'Çekmecenin şifresini çöz',
        feedbackLabel: 'Kitabı buldun!',
        puzzle: {
          type: 'sequence',
          prompt: 'Çekmecenin şifresi bir örüntü. Sırayı tamamla.',
          sequence: ['2', '4', '8'],
          options: ['10', '12', '16'],
          correctAnswer: '16',
        },
      },
      {
        kind: 'miniPuzzle',
        targetObjectId: 'backpack',
        actionLabel: 'Çantanı hazırla',
        feedbackLabel: 'Çantanı doğru hazırladın!',
        puzzle: {
          type: 'matching',
          prompt: 'Ders programına göre doğru kitapları çantana koy.',
          pairs: [
            { id: 'mon', leftLabel: 'Pazartesi', rightLabel: 'Matematik Kitabı' },
            { id: 'tue', leftLabel: 'Salı', rightLabel: 'Resim Kitabı' },
            { id: 'wed', leftLabel: 'Çarşamba', rightLabel: 'Fen Kitabı' },
          ],
        },
      },
    ],
    points: 30,
  },
  {
    id: 'ilk-7',
    order: 7,
    title: 'Evden Çık',
    instructions: 'Çıkış kapısına git ve evden çık.',
    mapRoomId: 'main7',
    startPosition: { row: 0, col: 0 },
    taskSteps: [
      { kind: 'enterAt', targetObjectId: 'door-exit', actionLabel: 'Evden çık', feedbackLabel: 'Okula gitmeye hazırsın!' },
    ],
    points: 20,
  },
];
