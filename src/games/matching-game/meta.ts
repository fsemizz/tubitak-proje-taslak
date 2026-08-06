import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const matchingMeta: GameDefinition = {
  id: 'matching-game',
  title: 'Eşleştirme Kâşifi',
  shortDescription: 'Komutları ve sembolleri doğru anlamlarıyla eşleştir.',
  longDescription:
    'Öğrenciler yön okları, komut ikonları ve algoritma sembollerini doğru anlamlarıyla eşleştirir. Bu, sembol-anlam ilişkisi kurma ve kısa süreli görsel hafızayı güçlendirir.',
  category: 'matching',
  icon: 'matching',
  colorTheme: CATEGORY_THEME.matching,
  kazanimlar: [
    'Sembol-anlam ilişkisi kurma',
    'Komut kartlarını sonuçlarıyla ilişkilendirme',
    'Kısa süreli görsel hafıza',
  ],
  minGrade: 0,
  maxGrade: 2,
  estimatedMinutes: 5,
  levelCount: 5,
  status: 'available',
};
