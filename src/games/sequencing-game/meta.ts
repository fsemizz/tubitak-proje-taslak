import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const sequencingMeta: GameDefinition = {
  id: 'sequencing-game',
  title: 'Sıralama Ustası',
  shortDescription: 'Günlük bir işi doğru adım sırasına diz.',
  longDescription:
    'Öğrenciler günlük hayattan tanıdık bir işi (diş fırçalama, okula hazırlanma gibi) oluşturan adımları doğru mantıksal sıraya koyar. Bu, bir algoritmanın "sıralı adımlardan" oluştuğu fikrinin temelini oluşturur.',
  category: 'sequencing',
  icon: 'sequencing' as const,
  colorTheme: CATEGORY_THEME.sequencing,
  kazanimlar: [
    'Bir işi adımlara ayırabilme',
    'Adımların mantıksal sırasını kurabilme',
    '"Önce–sonra" ilişkisini kavrama',
  ],
  minGrade: 0,
  maxGrade: 2,
  estimatedMinutes: 8,
  levelCount: 6,
  status: 'available',
};
