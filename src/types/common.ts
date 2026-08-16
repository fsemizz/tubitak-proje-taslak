export type GameCategory =
  | 'sequencing'
  | 'pattern'
  | 'debugging'
  | 'loops'
  | 'conditionals'
  | 'matching'
  | 'planning'
  | 'flowLogic';

export type Difficulty = 'kolay' | 'orta' | 'zor';

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
};

export const CATEGORY_LABEL: Record<GameCategory, string> = {
  sequencing: 'Sıralama',
  pattern: 'Örüntü',
  debugging: 'Hata Ayıklama',
  loops: 'Döngü',
  conditionals: 'Koşullu Düşünme',
  matching: 'Eşleştirme',
  planning: 'Planlama & Yön Bulma',
  flowLogic: 'Koşullu Mantık & Akış Algısı',
};
