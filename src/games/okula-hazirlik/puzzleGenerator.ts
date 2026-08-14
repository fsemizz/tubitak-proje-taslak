import type { PuzzleSpec, PuzzleType, SchoolReadinessLevel } from './types';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ============================================================================
// Örüntü (sequence) — the correct answer is always computed from the same
// randomly-picked rule, never hardcoded, so there is always exactly one.
// ============================================================================
function generateSequencePuzzle(): PuzzleSpec {
  const ruleType = pick(['add', 'multiply', 'alternate'] as const);
  let terms: number[];
  let next: number;
  let hintText: string;

  if (ruleType === 'add') {
    const start = randInt(1, 10);
    const step = randInt(2, 5);
    terms = [start, start + step, start + 2 * step];
    next = start + 3 * step;
    hintText = `Her sayı bir öncekinden ${step} fazla.`;
  } else if (ruleType === 'multiply') {
    const start = randInt(1, 4);
    const mult = randInt(2, 3);
    terms = [start, start * mult, start * mult * mult];
    next = start * mult * mult * mult;
    hintText = `Her sayı bir öncekinin ${mult} katı.`;
  } else {
    const a = randInt(1, 9);
    const b = randInt(11, 19);
    terms = [a, b, a];
    next = b;
    hintText = `Sayılar ${a} ve ${b} arasında dönüşümlü gidiyor.`;
  }

  const correctAnswer = String(next);
  const distractors = new Set<string>();
  while (distractors.size < 2) {
    const delta = randInt(-3, 3) || 4;
    const candidate = String(Math.max(0, next + delta));
    if (candidate !== correctAnswer) distractors.add(candidate);
  }

  return {
    type: 'sequence',
    prompt: 'Çekmecenin şifresi bir örüntü. Sırayı tamamla.',
    hintText,
    sequence: terms.map(String),
    options: shuffle([correctAnswer, ...distractors]),
    correctAnswer,
  };
}

// ============================================================================
// Sıralı Seçim (orderedChoice) — each pool item has a fixed logical rank;
// whichever subset gets drawn, sorting by rank always gives one correct order.
// ============================================================================
const CLOTHING_POOL = [
  { id: 'underwear', label: 'İç Çamaşırı', icon: '🩲', rank: 1 },
  { id: 'socks', label: 'Çoraplar', icon: '🧦', rank: 2 },
  { id: 'undershirt', label: 'Fanila', icon: '👕', rank: 3 },
  { id: 'uniform', label: 'Okul Forması', icon: '👔', rank: 4 },
  { id: 'sweater', label: 'Kazak', icon: '🧶', rank: 5 },
  { id: 'shoes', label: 'Ayakkabılar', icon: '👟', rank: 6 },
  { id: 'coat', label: 'Mont', icon: '🧥', rank: 7 },
  { id: 'scarf', label: 'Atkı', icon: '🧣', rank: 8 },
  { id: 'hat', label: 'Bere', icon: '🧢', rank: 9 },
  { id: 'backpack', label: 'Sırt Çantası', icon: '🎒', rank: 10 },
];

function generateOrderedChoicePuzzle(itemCount: number): PuzzleSpec {
  const chosen = shuffle(CLOTHING_POOL).slice(0, itemCount);
  const sorted = [...chosen].sort((a, b) => a.rank - b.rank);
  return {
    type: 'orderedChoice',
    prompt: 'Kıyafetlerini doğru sırayla giy.',
    hintText: `Önce "${sorted[0].label}" ile başla, en son "${sorted[sorted.length - 1].label}" ile bitir.`,
    items: shuffle(chosen).map(({ id, label, icon }) => ({ id, label, icon })),
    correctOrder: sorted.map((i) => i.id),
  };
}

// ============================================================================
// Koşullu Kural (conditional) — the correct answer is derived from whichever
// branch of the if/else was randomly shown, never a fixed id.
// ============================================================================
const CONDITIONAL_POOL = [
  {
    rule: 'Hava yağmurluysa şemsiye al, güneşliyse şapka tak.',
    ifLabel: 'Yağmurlu',
    ifResult: { id: 'umbrella', label: 'Şemsiye Al', icon: '☂️' },
    elseLabel: 'Güneşli',
    elseResult: { id: 'hat', label: 'Şapka Tak', icon: '🧢' },
  },
  {
    rule: 'Saat sabahsa kahvaltı yap, öğleden sonraysa meyve ye.',
    ifLabel: 'Sabah',
    ifResult: { id: 'breakfast', label: 'Kahvaltı Yap', icon: '🍳' },
    elseLabel: 'Öğleden Sonra',
    elseResult: { id: 'fruit', label: 'Meyve Ye', icon: '🍎' },
  },
  {
    rule: 'Trafik ışığı kırmızıysa dur, yeşilse geç.',
    ifLabel: 'Kırmızı Işık',
    ifResult: { id: 'stop', label: 'Dur', icon: '🛑' },
    elseLabel: 'Yeşil Işık',
    elseResult: { id: 'go', label: 'Geç', icon: '🚦' },
  },
  {
    rule: 'Dışarısı soğuksa mont giy, sıcaksa tişört giy.',
    ifLabel: 'Soğuk',
    ifResult: { id: 'coat', label: 'Mont Giy', icon: '🧥' },
    elseLabel: 'Sıcak',
    elseResult: { id: 'tshirt', label: 'Tişört Giy', icon: '👕' },
  },
  {
    rule: 'Zil çalarsa derse gir, teneffüsse oyna.',
    ifLabel: 'Zil Çaldı',
    ifResult: { id: 'class', label: 'Derse Gir', icon: '🔔' },
    elseLabel: 'Teneffüs',
    elseResult: { id: 'play', label: 'Oyna', icon: '⚽' },
  },
];

function generateConditionalPuzzle(): PuzzleSpec {
  const scenario = pick(CONDITIONAL_POOL);
  const showIf = Math.random() < 0.5;
  const situation = showIf ? scenario.ifLabel : scenario.elseLabel;
  const correct = showIf ? scenario.ifResult : scenario.elseResult;
  const wrong = showIf ? scenario.elseResult : scenario.ifResult;
  const otherPool = CONDITIONAL_POOL.filter((s) => s !== scenario);
  const otherScenario = pick(otherPool);
  const thirdOption = Math.random() < 0.5 ? otherScenario.ifResult : otherScenario.elseResult;

  return {
    type: 'conditional',
    prompt: 'Kuralı oku, durumu gör, doğru eylemi seç.',
    hintText: `Kural: "${scenario.rule}" Şu an durum: ${situation}.`,
    rule: scenario.rule,
    situation,
    options: shuffle([correct, wrong, thirdOption]),
    correctOptionId: correct.id,
  };
}

// ============================================================================
// Eşleştirme (matching) — subject → correct school supply, no reference card
// this time (general-knowledge inference, not copy-from-screen).
// ============================================================================
const SUBJECT_TOOL_POOL = [
  { id: 'math', leftLabel: 'Matematik', rightLabel: 'Hesap Makinesi' },
  { id: 'art', leftLabel: 'Resim', rightLabel: 'Boya Kutusu' },
  { id: 'pe', leftLabel: 'Beden Eğitimi', rightLabel: 'Spor Ayakkabısı' },
  { id: 'music', leftLabel: 'Müzik', rightLabel: 'Flüt' },
  { id: 'science', leftLabel: 'Fen Bilgisi', rightLabel: 'Büyüteç' },
  { id: 'turkish', leftLabel: 'Türkçe', rightLabel: 'Okuma Kitabı' },
  { id: 'social', leftLabel: 'Sosyal Bilgiler', rightLabel: 'Dünya Haritası' },
  { id: 'craft', leftLabel: 'Beceri Atölyesi', rightLabel: 'Makas' },
];

function generateMatchingPuzzle(pairCount: number): PuzzleSpec {
  const pairs = shuffle(SUBJECT_TOOL_POOL)
    .slice(0, pairCount)
    .map(({ id, leftLabel, rightLabel }) => ({ id, leftLabel, rightLabel }));
  const hintPair = pick(pairs);
  return {
    type: 'matching',
    prompt: 'Her dersin doğru malzemesini bulup eşleştir.',
    hintText: `"${hintPair.leftLabel}" dersi için "${hintPair.rightLabel}" gerekir.`,
    pairs,
  };
}

// ============================================================================
// Tekrar Sayma (loopCount) — repeated-group counting, answer computed from
// the same randomly drawn group/item counts.
// ============================================================================
const LOOP_ICONS = ['📚', '🎒', '✏️', '🍎', '⭐'];

function generateLoopCountPuzzle(askTotal: boolean): PuzzleSpec {
  const groupCount = randInt(2, 4);
  const itemsPerGroup = randInt(2, askTotal ? 5 : 4);
  const icon = pick(LOOP_ICONS);
  const total = groupCount * itemsPerGroup;
  const correctValue = askTotal ? total : groupCount;
  const correctAnswer = String(correctValue);

  const distractors = new Set<string>();
  while (distractors.size < 2) {
    const delta = randInt(-2, 2) || 3;
    const candidate = correctValue + delta;
    if (candidate > 0 && String(candidate) !== correctAnswer) distractors.add(String(candidate));
  }

  return {
    type: 'loopCount',
    prompt: askTotal ? 'Desende toplamda kaç tane var? Grupları say ve topla.' : 'Bu desende kaç grup var?',
    hintText: askTotal
      ? `${groupCount} grup var, her grupta ${itemsPerGroup} tane: ${groupCount} × ${itemsPerGroup} = ${total}.`
      : `Her kutuda ${itemsPerGroup} tane var. Kutuları tek tek say.`,
    icon,
    groupCount,
    itemsPerGroup,
    askTotal,
    options: shuffle([correctAnswer, ...distractors]),
    correctAnswer,
  };
}

/** Single entry point OkulaHazirlikGameRoot calls for every miniPuzzle task step at level-start time. */
export function generatePuzzle(type: PuzzleType, schoolLevel: SchoolReadinessLevel): PuzzleSpec {
  const isIlkokul = schoolLevel === 'ilkokul';
  switch (type) {
    case 'sequence':
      return generateSequencePuzzle();
    case 'orderedChoice':
      return generateOrderedChoicePuzzle(isIlkokul ? randInt(6, 7) : randInt(3, 4));
    case 'conditional':
      return generateConditionalPuzzle();
    case 'matching':
      return generateMatchingPuzzle(isIlkokul ? randInt(3, 4) : 3);
    case 'loopCount':
      return generateLoopCountPuzzle(isIlkokul);
  }
}
