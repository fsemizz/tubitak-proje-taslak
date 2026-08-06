import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const loopMeta: GameDefinition = {
  id: 'loop-builder-game',
  title: 'Döngü Ustası',
  shortDescription: 'Tekrar bloklarıyla robotu hedefe ulaştır.',
  longDescription:
    'Öğrenciler bir ızgara üzerinde robotu hedefe ulaştırmak için "tekrar" (döngü) blokları kullanır. Tek tek komut yerine "N kere ilerle" gibi tekrar bloklarını kullanmak, döngü mantığının unplugged temelini oluşturur.',
  category: 'loops',
  icon: 'loop',
  colorTheme: CATEGORY_THEME.loops,
  kazanimlar: [
    'Tekrar eden işlemleri fark etme',
    '"N kere yap" (döngü) kavramını kullanma',
    'Verimli komut kurma',
  ],
  minGrade: 1,
  maxGrade: 2,
  estimatedMinutes: 7,
  levelCount: 5,
  status: 'available',
};
