interface SimpleTemplate {
  scenario: string;
  condLabel: string;
  actionLabel: string;
  distractorCondLabel: string;
  distractorActionLabel: string;
}

interface LoopTemplate {
  scenario: string;
  condLabel: string;
  loopCount: number;
  actionLabel: string;
  distractorLoopCount: number;
  distractorCondLabel: string;
  distractorActionLabel: string;
}

interface ComplexTemplate {
  scenario: string;
  condLabel: string;
  action1Label: string;
  loopCount: number;
  action2Label: string;
  distractorLoopCount: number;
  distractorCondLabel: string;
  distractorActionLabel: string;
}

export const SIMPLE_TEMPLATES: SimpleTemplate[] = [
  {
    scenario: 'Karakterin önünde kırmızı bir engel var. Kural: Eğer engel kırmızıysa zıpla, değilse yürü.',
    condLabel: 'Eğer engel kırmızıysa',
    actionLabel: 'Zıpla',
    distractorCondLabel: 'Eğer engel maviyse',
    distractorActionLabel: 'Yürü',
  },
  {
    scenario: 'Trafik ışığı yeşil yandı. Kural: Eğer ışık yeşilse yürü, kırmızıysa dur.',
    condLabel: 'Eğer ışık yeşilse',
    actionLabel: 'Yürü',
    distractorCondLabel: 'Eğer ışık kırmızıysa',
    distractorActionLabel: 'Dur',
  },
  {
    scenario: 'Hava çok soğuk. Kural: Eğer hava soğuksa mont giy, değilse tişört giy.',
    condLabel: 'Eğer hava soğuksa',
    actionLabel: 'Mont giy',
    distractorCondLabel: 'Eğer hava sıcaksa',
    distractorActionLabel: 'Tişört giy',
  },
  {
    scenario: 'Çok susadın ve önünde bir bardak su var. Kural: Eğer susadıysan su iç.',
    condLabel: 'Eğer susadıysan',
    actionLabel: 'Su iç',
    distractorCondLabel: 'Eğer açsan',
    distractorActionLabel: 'Yemek ye',
  },
  {
    scenario: 'Gece oldu ve odada ortalık karardı. Kural: Eğer hava karardıysa ışığı aç.',
    condLabel: 'Eğer hava karardıysa',
    actionLabel: 'Işığı aç',
    distractorCondLabel: 'Eğer gündüzse',
    distractorActionLabel: 'Işığı kapat',
  },
  {
    scenario: 'Kitabının bir sayfası yırtıldı. Kural: Eğer kitap yırtıksa bant ile yapıştır.',
    condLabel: 'Eğer kitap yırtıksa',
    actionLabel: 'Bant ile yapıştır',
    distractorCondLabel: 'Eğer kitap sağlamsa',
    distractorActionLabel: 'Rafa koy',
  },
];

export const LOOP_TEMPLATES: LoopTemplate[] = [
  {
    scenario: 'Önünde 3 tane küçük engel var. Kural: Eğer engel varsa, 3 kez zıpla.',
    condLabel: 'Eğer engel varsa',
    loopCount: 3,
    actionLabel: 'Zıpla',
    distractorLoopCount: 5,
    distractorCondLabel: 'Eğer yol düzse',
    distractorActionLabel: 'Yürü',
  },
  {
    scenario: 'Bahçede 4 tane susamış çiçek var. Kural: Eğer çiçekler susamışsa, 4 kez su ver.',
    condLabel: 'Eğer çiçekler susamışsa',
    loopCount: 4,
    actionLabel: 'Su ver',
    distractorLoopCount: 2,
    distractorCondLabel: 'Eğer çiçekler ıslaksa',
    distractorActionLabel: 'Bekle',
  },
  {
    scenario: 'Önünde 5 basamaklı bir merdiven var. Kural: Eğer merdiven varsa, 5 kez basamak çık.',
    condLabel: 'Eğer merdiven varsa',
    loopCount: 5,
    actionLabel: 'Bir basamak çık',
    distractorLoopCount: 3,
    distractorCondLabel: 'Eğer asansör varsa',
    distractorActionLabel: 'Asansöre bin',
  },
];

export const COMPLEX_TEMPLATES: ComplexTemplate[] = [
  {
    scenario:
      'Yağmur yağıyor ve yolda 4 tane su birikintisi var. Kural: Eğer yağmur yağıyorsa şemsiyeni aç, sonra 4 kez su birikintisinin üzerinden atla.',
    condLabel: 'Eğer yağmur yağıyorsa',
    action1Label: 'Şemsiyeni aç',
    loopCount: 4,
    action2Label: 'Su birikintisinin üzerinden atla',
    distractorLoopCount: 2,
    distractorCondLabel: 'Eğer güneşliyse',
    distractorActionLabel: 'Güneş gözlüğü tak',
  },
  {
    scenario:
      'Kar yağıyor ve bahçede 3 kartopu yapman gerekiyor. Kural: Eğer kar yağıyorsa bere ve eldiven giy, sonra 3 kez kartopu yuvarla.',
    condLabel: 'Eğer kar yağıyorsa',
    action1Label: 'Bere ve eldiven giy',
    loopCount: 3,
    action2Label: 'Bir kartopu yuvarla',
    distractorLoopCount: 5,
    distractorCondLabel: 'Eğer yaz mevsimindeysen',
    distractorActionLabel: 'Mayo giy',
  },
];

export type { SimpleTemplate, LoopTemplate, ComplexTemplate };
