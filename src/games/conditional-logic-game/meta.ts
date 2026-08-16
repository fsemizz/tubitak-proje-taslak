import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const conditionalMeta: GameDefinition = {
  id: 'conditional-logic-game',
  title: 'Eğer-O Zaman Dedektifi',
  shortDescription: 'Duruma göre doğru davranışı seç.',
  longDescription:
    'Öğrenciler bir duruma ("eğer") göre doğru eylemi ("o zaman") seçer. Bu, programlamadaki koşullu ifadelerin (if-then) unplugged temelidir.',
  category: 'conditionals',
  icon: 'conditional',
  colorTheme: CATEGORY_THEME.conditionals,
  kazanimlar: [
    'Koşullu düşünme ("eğer... o zaman...")',
    'Durumları değerlendirip karar verme',
    'Basit karar ağaçları kurma',
  ],
  minGrade: 0,
  maxGrade: 2,
  estimatedMinutes: 6,
  levelCount: 6,
  status: 'available',
};
