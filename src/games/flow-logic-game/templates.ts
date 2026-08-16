import type { FlowComparisonOp, FlowExpectedStep, FlowVariable } from '@/types/game';

/** One hand-authored scenario. `generator.ts` picks a random template from the tier matching a level's
 * structure, and it becomes the level's full runtime content (variables/actions/operators/answer key). */
export interface FlowTemplate {
  scenario: string;
  variables: FlowVariable[];
  actionOptions: { id: string; label: string }[];
  operatorOptions: FlowComparisonOp[];
  expectedSteps: FlowExpectedStep[];
  resultTemplate: string;
}

const ALL_OPERATORS: FlowComparisonOp[] = ['>', '>=', '<', '<=', '=='];

// ============================================================================
// Tier: conditionOnly — Condition -> Action -> Result (flow-1, kolay)
// ============================================================================
export const CONDITION_ONLY_TEMPLATES: FlowTemplate[] = [
  {
    scenario: "Bahçede 7 tane elma var. Kural: Elma sayısı 5'ten fazlaysa hepsini topla.",
    variables: [
      { id: 'apple', label: 'Elma Sayısı', value: 7 },
      { id: 'pear', label: 'Armut Sayısı', value: 3 },
    ],
    actionOptions: [
      { id: 'collect', label: 'Elmaları Topla' },
      { id: 'water', label: 'Bahçeyi Sula' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'apple', operator: '>', compareValue: 5 } },
      { kind: 'action', config: { actionId: 'collect' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: 'Harika! Elmaların hepsini topladın.',
  },
  {
    scenario: "Sınıfta 4 tane kırık sandalye var. Kural: Kırık sandalye sayısı 2'den fazlaysa öğretmene haber ver.",
    variables: [
      { id: 'brokenChairs', label: 'Kırık Sandalye Sayısı', value: 4 },
      { id: 'students', label: 'Öğrenci Sayısı', value: 20 },
    ],
    actionOptions: [
      { id: 'tellTeacher', label: 'Öğretmene Haber Ver' },
      { id: 'sit', label: 'Yerine Otur' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'brokenChairs', operator: '>', compareValue: 2 } },
      { kind: 'action', config: { actionId: 'tellTeacher' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: 'Öğretmene haber verdin, sandalyeler tamir edilecek!',
  },
  {
    scenario: "Bugün hava sıcaklığı 30 derece. Kural: Sıcaklık 25'ten fazlaysa dondurma ye.",
    variables: [
      { id: 'temp', label: 'Hava Sıcaklığı', value: 30 },
      { id: 'humidity', label: 'Nem Oranı', value: 60 },
    ],
    actionOptions: [
      { id: 'eatIceCream', label: 'Dondurma Ye' },
      { id: 'wearCoat', label: 'Mont Giy' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'temp', operator: '>', compareValue: 25 } },
      { kind: 'action', config: { actionId: 'eatIceCream' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: 'Serinledin ve dondurmanın tadını çıkardın!',
  },
];

// ============================================================================
// Tier: loopOnly — Loop -> Action -> Result (flow-2, kolay)
// ============================================================================
export const LOOP_ONLY_TEMPLATES: FlowTemplate[] = [
  {
    scenario: 'Bahçede 5 tane susamış çiçek var. Her çiçeğe bir kez su vermelisin.',
    variables: [{ id: 'flowers', label: 'Çiçek Sayısı', value: 5 }],
    actionOptions: [
      { id: 'water', label: 'Su Ver' },
      { id: 'pick', label: 'Çiçeği Kopar' },
    ],
    operatorOptions: [],
    expectedSteps: [
      { kind: 'loop', config: { loopCount: 5 } },
      { kind: 'action', config: { actionId: 'water' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} çiçeğin hepsini suladın!',
  },
  {
    scenario: 'Önünde 4 basamaklı bir merdiven var. Her basamağı bir kez çıkmalısın.',
    variables: [{ id: 'stairs', label: 'Basamak Sayısı', value: 4 }],
    actionOptions: [
      { id: 'stepUp', label: 'Bir Basamak Çık' },
      { id: 'jump', label: 'Zıpla' },
    ],
    operatorOptions: [],
    expectedSteps: [
      { kind: 'loop', config: { loopCount: 4 } },
      { kind: 'action', config: { actionId: 'stepUp' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} basamağı da çıktın, tepedesin!',
  },
  {
    scenario: 'Masada 6 tane kirli tabak var. Her tabağı bir kez yıkamalısın.',
    variables: [{ id: 'plates', label: 'Tabak Sayısı', value: 6 }],
    actionOptions: [
      { id: 'wash', label: 'Tabağı Yıka' },
      { id: 'stack', label: 'Tabağı İstifle' },
    ],
    operatorOptions: [],
    expectedSteps: [
      { kind: 'loop', config: { loopCount: 6 } },
      { kind: 'action', config: { actionId: 'wash' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} tabağı da yıkadın, mutfak tertemiz!',
  },
];

// ============================================================================
// Tier: conditionLoop — Condition -> Loop -> Action -> Result (flow-3, orta)
// ============================================================================
export const CONDITION_LOOP_TEMPLATES: FlowTemplate[] = [
  {
    scenario: "Bahçede 6 tane elma ağacı var. Kural: Ağaç sayısı 4'ten fazlaysa, her ağacı bir kez sula.",
    variables: [
      { id: 'trees', label: 'Ağaç Sayısı', value: 6 },
      { id: 'flowers', label: 'Çiçek Sayısı', value: 2 },
    ],
    actionOptions: [
      { id: 'water', label: 'Ağacı Sula' },
      { id: 'cut', label: 'Dalları Kes' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'trees', operator: '>', compareValue: 4 } },
      { kind: 'loop', config: { loopCount: 6 } },
      { kind: 'action', config: { actionId: 'water' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} ağacın hepsini suladın, bahçe yeşerecek!',
  },
  {
    scenario: "Kütüphanede 5 tane dağınık kitap var. Kural: Kitap sayısı 3'ten fazlaysa, her kitabı bir kez rafa kaldır.",
    variables: [
      { id: 'books', label: 'Kitap Sayısı', value: 5 },
      { id: 'chairs', label: 'Sandalye Sayısı', value: 10 },
    ],
    actionOptions: [
      { id: 'shelve', label: 'Kitabı Rafa Kaldır' },
      { id: 'read', label: 'Kitabı Oku' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'books', operator: '>', compareValue: 3 } },
      { kind: 'loop', config: { loopCount: 5 } },
      { kind: 'action', config: { actionId: 'shelve' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} kitabı da rafa kaldırdın, kütüphane düzenli!',
  },
  {
    scenario: "Havuzda 7 tane plastik top var. Kural: Top sayısı 5'ten fazlaysa, her topu bir kez topla.",
    variables: [
      { id: 'balls', label: 'Top Sayısı', value: 7 },
      { id: 'towels', label: 'Havlu Sayısı', value: 3 },
    ],
    actionOptions: [
      { id: 'collect', label: 'Topu Topla' },
      { id: 'throw', label: 'Topu At' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'balls', operator: '>', compareValue: 5 } },
      { kind: 'loop', config: { loopCount: 7 } },
      { kind: 'action', config: { actionId: 'collect' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} topu da topladın, havuz bomboş!',
  },
];

// ============================================================================
// Tier: conditionLoopHard — same shape as conditionLoop, but wider operator use
// (>=, <=, ==) and an extra distractor variable (flow-4, orta/zor).
// ============================================================================
export const CONDITION_LOOP_HARD_TEMPLATES: FlowTemplate[] = [
  {
    scenario: "Sınıfta tam olarak 24 öğrenci var. Kural: Öğrenci sayısı 20'ye eşit veya fazlaysa, her öğrenciye bir kez kitap dağıt.",
    variables: [
      { id: 'students', label: 'Öğrenci Sayısı', value: 24 },
      { id: 'teachers', label: 'Öğretmen Sayısı', value: 2 },
      { id: 'chairs', label: 'Sandalye Sayısı', value: 24 },
    ],
    actionOptions: [
      { id: 'giveBook', label: 'Kitap Dağıt' },
      { id: 'giveChair', label: 'Sandalye Dağıt' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'students', operator: '>=', compareValue: 20 } },
      { kind: 'loop', config: { loopCount: 24 } },
      { kind: 'action', config: { actionId: 'giveBook' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} öğrenciye de kitap dağıttın, ders başlayabilir!',
  },
  {
    scenario: "Depoda tam olarak 15 kutu var. Kural: Kutu sayısı 15'e eşitse, her kutuyu bir kez etiketle.",
    variables: [
      { id: 'boxes', label: 'Kutu Sayısı', value: 15 },
      { id: 'shelves', label: 'Raf Sayısı', value: 5 },
      { id: 'workers', label: 'İşçi Sayısı', value: 3 },
    ],
    actionOptions: [
      { id: 'label', label: 'Kutuyu Etiketle' },
      { id: 'move', label: 'Kutuyu Taşı' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'boxes', operator: '==', compareValue: 15 } },
      { kind: 'loop', config: { loopCount: 15 } },
      { kind: 'action', config: { actionId: 'label' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} kutuyu da etiketledin, depo düzenli!',
  },
  {
    scenario: "Bahçıvanın 8 saksısı var. Kural: Saksı sayısı 10'dan azsa veya eşitse, her saksıya bir kez tohum ek.",
    variables: [
      { id: 'pots', label: 'Saksı Sayısı', value: 8 },
      { id: 'seeds', label: 'Tohum Paketi Sayısı', value: 20 },
      { id: 'trees', label: 'Ağaç Sayısı', value: 2 },
    ],
    actionOptions: [
      { id: 'plant', label: 'Tohum Ek' },
      { id: 'water', label: 'Saksıyı Sula' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'pots', operator: '<=', compareValue: 10 } },
      { kind: 'loop', config: { loopCount: 8 } },
      { kind: 'action', config: { actionId: 'plant' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: '{count} saksıya da tohum ektin, bahçe filizlenecek!',
  },
];

// ============================================================================
// Tier: doubleStage — Condition -> Action -> Condition -> Loop -> Action -> Result
// (flow-5, zor) — two checkpoints in a row, no true nesting but a longer chain
// that requires sustained attention.
// ============================================================================
export const DOUBLE_STAGE_TEMPLATES: FlowTemplate[] = [
  {
    scenario:
      "Bugün 8 tane bulut var ve yolda 5 su birikintisi oluştu. Kural 1: Bulut sayısı 5'ten fazlaysa şemsiyeni aç. Kural 2: Su birikintisi sayısı 3'ten fazlaysa, her birikintinin üzerinden bir kez atla.",
    variables: [
      { id: 'clouds', label: 'Bulut Sayısı', value: 8 },
      { id: 'puddles', label: 'Su Birikintisi Sayısı', value: 5 },
      { id: 'sunRays', label: 'Güneş Işını Sayısı', value: 1 },
    ],
    actionOptions: [
      { id: 'umbrella', label: 'Şemsiyeni Aç' },
      { id: 'jumpPuddle', label: 'Su Birikintisinin Üzerinden Atla' },
      { id: 'sunglasses', label: 'Güneş Gözlüğü Tak' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'clouds', operator: '>', compareValue: 5 } },
      { kind: 'action', config: { actionId: 'umbrella' } },
      { kind: 'condition', config: { variableId: 'puddles', operator: '>', compareValue: 3 } },
      { kind: 'loop', config: { loopCount: 5 } },
      { kind: 'action', config: { actionId: 'jumpPuddle' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: 'Şemsiyeni açtın ve {count} su birikintisinin üzerinden atladın!',
  },
  {
    scenario:
      "Sınıfta 12 öğrenci var ve masada 6 tane kırık kalem duruyor. Kural 1: Öğrenci sayısı 10'dan fazlaysa yoklama al. Kural 2: Kırık kalem sayısı 4'ten fazlaysa, her kalemi bir kez değiştir.",
    variables: [
      { id: 'students', label: 'Öğrenci Sayısı', value: 12 },
      { id: 'brokenPencils', label: 'Kırık Kalem Sayısı', value: 6 },
      { id: 'books', label: 'Kitap Sayısı', value: 30 },
    ],
    actionOptions: [
      { id: 'takeAttendance', label: 'Yoklama Al' },
      { id: 'replacePencil', label: 'Kalemi Değiştir' },
      { id: 'collectBooks', label: 'Kitapları Topla' },
    ],
    operatorOptions: ALL_OPERATORS,
    expectedSteps: [
      { kind: 'condition', config: { variableId: 'students', operator: '>', compareValue: 10 } },
      { kind: 'action', config: { actionId: 'takeAttendance' } },
      { kind: 'condition', config: { variableId: 'brokenPencils', operator: '>', compareValue: 4 } },
      { kind: 'loop', config: { loopCount: 6 } },
      { kind: 'action', config: { actionId: 'replacePencil' } },
      { kind: 'result', config: {} },
    ],
    resultTemplate: 'Yoklamayı aldın ve {count} kalemi değiştirdin, sınıf hazır!',
  },
];
