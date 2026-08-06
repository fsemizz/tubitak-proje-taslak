import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const patternMeta: GameDefinition = {
  id: 'pattern-completion-game',
  title: 'Örüntü Ustası',
  shortDescription: 'Şekil ve renk dizisindeki eksik parçayı bul.',
  longDescription:
    'Öğrenciler bir örüntüdeki kuralı fark edip eksik parçayı doğru şekilde tamamlar. Bu beceri, kod okurken tekrar eden yapıları ve kuralları fark etmenin temelidir.',
  category: 'pattern',
  icon: 'pattern',
  colorTheme: CATEGORY_THEME.pattern,
  kazanimlar: ['Örüntü/düzen tanıma', 'Kural çıkarımı yapabilme', 'Tahmin ve doğrulama'],
  minGrade: 0,
  maxGrade: 2,
  estimatedMinutes: 5,
  levelCount: 5,
  status: 'available',
};
