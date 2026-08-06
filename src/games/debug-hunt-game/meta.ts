import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const debugMeta: GameDefinition = {
  id: 'debug-hunt-game',
  title: 'Hata Avcısı',
  shortDescription: 'Adım listesindeki hatalı adımı yakala.',
  longDescription:
    'Öğrenciler bir hedefe ulaşmayı engelleyen hatalı adımı bulup işaretler. Bu, programlamadaki "debugging" (hata ayıklama) becerisinin unplugged temelidir.',
  category: 'debugging',
  icon: 'debug',
  colorTheme: CATEGORY_THEME.debugging,
  kazanimlar: ['Hata tespiti (debugging)', 'Adım adım mantık yürütme', 'Sebep-sonuç ilişkisi kurma'],
  minGrade: 0,
  maxGrade: 2,
  estimatedMinutes: 6,
  levelCount: 5,
  status: 'available',
};
