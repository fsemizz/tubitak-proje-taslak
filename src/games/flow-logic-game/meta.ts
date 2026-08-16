import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const flowLogicMeta: GameDefinition = {
  id: 'flow-logic-game',
  title: 'Akış Ustası',
  shortDescription: 'Koşul, eylem ve döngü bloklarını doğru sırayla dizerek küçük bir akış kur.',
  longDescription:
    'Öğrenciler bir senaryoyu okuyup hangi koşul, eylem ve "N kez tekrarla" bloklarının gerçekten gerekli olduğuna karar verir, gereksiz blokları eler ve doğru sırayla dizer. Bu, if-else ve döngü mantığının bir arada kullanıldığı akış şeması (flowchart) düşüncesinin unplugged temelidir.',
  category: 'flowLogic',
  icon: 'flow',
  colorTheme: CATEGORY_THEME.flowLogic,
  kazanimlar: [
    'Koşullu mantık ve akış algısı',
    'Gerekli/gereksiz bilgiyi ayırt etme',
    'Koşul ve döngüyü birlikte kullanabilme',
  ],
  minGrade: 1,
  maxGrade: 2,
  estimatedMinutes: 8,
  levelCount: 5,
  status: 'available',
};
