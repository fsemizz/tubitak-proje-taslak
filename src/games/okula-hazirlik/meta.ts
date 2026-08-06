import type { GameDefinition } from '@/types/game';
import { CATEGORY_THEME } from '@/lib/constants';

export const okulaHazirlikMeta: GameDefinition = {
  id: 'okula-hazirlik',
  title: 'Okula Hazırlık',
  shortDescription: 'Komutlarla evde dolaş, görevlerini tamamla ve okula git.',
  longDescription:
    'Öğrenci, ev haritasında bir komut editörü (yön okları + ENTER) ile karakteri yönetir. Gerçek hayattan görevleri (elini yıkama, kahvaltı yapma, çantasını hazırlama) sırayla tamamlayarak evden çıkıp okula gider. Her seviyede doğruluk, yol verimliliği ve planlama becerisi ölçülür; oyun sonunda tek bir Kodlama Becerisi Skoru (KBS) hesaplanır.',
  category: 'planning',
  icon: 'home',
  colorTheme: CATEGORY_THEME.planning,
  kazanimlar: [
    'Algoritmik düşünme ve adım adım planlama',
    'Yön kavramı ve konumsal (uzamsal) akıl yürütme',
    'Komutları verimli ve sırayla kullanma',
  ],
  minGrade: 0,
  maxGrade: 2,
  estimatedMinutes: 15,
  levelCount: 7,
  status: 'available',
};
