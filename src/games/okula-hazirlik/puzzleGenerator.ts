import type { PuzzleSpec, PuzzleType, SchoolReadinessLevel } from './types';

/** 1 = early levels (order 1-2), 2 = mid levels (order 3-5), 3 = late levels (order 6-7) - the only difficulty signal generators receive. */
export type DifficultyTier = 1 | 2 | 3;

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
function generateSequencePuzzle(tier: DifficultyTier): PuzzleSpec {
  const ruleType = pick(['add', 'multiply', 'alternate'] as const);
  let terms: number[];
  let next: number;
  let hintText: string;

  if (ruleType === 'add') {
    const start = randInt(1, 10);
    const step = tier === 3 ? randInt(4, 9) : tier === 2 ? randInt(3, 6) : randInt(2, 5);
    terms = [start, start + step, start + 2 * step];
    next = start + 3 * step;
    hintText = `Her sayı bir öncekinden ${step} fazla.`;
  } else if (ruleType === 'multiply') {
    const start = randInt(1, 4);
    const mult = tier === 3 ? randInt(2, 4) : randInt(2, 3);
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

const HANDWASH_POOL = [
  { id: 'open-tap', label: 'Musluğu Aç', icon: '🚰', rank: 1 },
  { id: 'wet-hands', label: 'Elini Islat', icon: '💧', rank: 2 },
  { id: 'soap', label: 'Sabunla', icon: '🧼', rank: 3 },
  { id: 'scrub', label: 'Ellerini Ovala', icon: '🤲', rank: 4 },
  { id: 'rinse', label: 'Durula', icon: '🚿', rank: 5 },
  { id: 'close-tap', label: 'Musluğu Kapat', icon: '🚱', rank: 6 },
  { id: 'dry', label: 'Kurula', icon: '🧻', rank: 7 },
];

type OrderedChoicePool = 'clothing' | 'handwash';

function generateOrderedChoicePuzzle(itemCount: number, pool: OrderedChoicePool = 'clothing'): PuzzleSpec {
  const sourcePool = pool === 'handwash' ? HANDWASH_POOL : CLOTHING_POOL;
  const count = Math.min(itemCount, sourcePool.length);
  const chosen = shuffle(sourcePool).slice(0, count);
  const sorted = [...chosen].sort((a, b) => a.rank - b.rank);
  return {
    type: 'orderedChoice',
    prompt: pool === 'handwash' ? 'Ellerini doğru sırayla yıka.' : 'Kıyafetlerini doğru sırayla giy.',
    hintText: `Önce "${sorted[0].label}" ile başla, en son "${sorted[sorted.length - 1].label}" ile bitir.`,
    items: shuffle(chosen).map(({ id, label, icon }) => ({ id, label, icon })),
    correctOrder: sorted.map((i) => i.id),
  };
}

// ============================================================================
// Koşullu Kural (conditional) — the correct answer is derived from whichever
// branch of the if/else was randomly shown, never a fixed id.
// ============================================================================
const SIMPLE_CONDITIONAL_POOL = [
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

// Two-clause rules — the same if/else shape, but the rule sentence packs two conditions together, so
// picking the right outcome requires holding both clauses in mind instead of a single fact lookup.
const COMPLEX_CONDITIONAL_POOL = [
  {
    rule: 'Hem soğuksa hem karlıysa mont VE bere giy, sadece soğuksa yalnızca mont yeter.',
    ifLabel: 'Soğuk ve Karlı',
    ifResult: { id: 'coat-hat-combo', label: 'Mont ve Bere Giy', icon: '🧣' },
    elseLabel: 'Sadece Soğuk',
    elseResult: { id: 'coat-only', label: 'Sadece Mont Giy', icon: '🧥' },
  },
  {
    rule: 'Sabah olup canın açsa kahvaltı yap, sabah olsa da tok isen sadece süt iç.',
    ifLabel: 'Sabah ve Aç',
    ifResult: { id: 'full-breakfast', label: 'Kahvaltı Yap', icon: '🍳' },
    elseLabel: 'Sabah ve Tok',
    elseResult: { id: 'just-milk', label: 'Sadece Süt İç', icon: '🥛' },
  },
  {
    rule: 'Işık yeşilse ve yol boşsa geç, yeşil olsa da yoldan araç geçiyorsa bekle.',
    ifLabel: 'Yeşil Işık, Yol Boş',
    ifResult: { id: 'go-clear', label: 'Geç', icon: '🚦' },
    elseLabel: 'Yeşil Işık, Araç Var',
    elseResult: { id: 'wait-caution', label: 'Bekle', icon: '⏳' },
  },
  {
    rule: 'Zil çaldı ve elinde kitap yoksa önce kitabını al sonra derse gir, kitap yanındaysa direkt derse gir.',
    ifLabel: 'Zil Çaldı, Kitap Yok',
    ifResult: { id: 'get-book-first', label: 'Önce Kitabı Al', icon: '📚' },
    elseLabel: 'Zil Çaldı, Kitap Yanında',
    elseResult: { id: 'go-class-direct', label: 'Derse Gir', icon: '🔔' },
  },
  {
    rule: 'Dışarısı hem sıcak hem güneşliyse şapka VE gözlük tak, sıcak olsa da bulutluysa sadece şapka yeter.',
    ifLabel: 'Sıcak ve Güneşli',
    ifResult: { id: 'hat-sunglasses', label: 'Şapka ve Gözlük Tak', icon: '🕶️' },
    elseLabel: 'Sıcak ve Bulutlu',
    elseResult: { id: 'hat-only', label: 'Sadece Şapka Tak', icon: '🧢' },
  },
];

function generateConditionalPuzzle(tier: DifficultyTier): PuzzleSpec {
  const pool =
    tier === 1 ? SIMPLE_CONDITIONAL_POOL : tier === 2 ? [...SIMPLE_CONDITIONAL_POOL, ...COMPLEX_CONDITIONAL_POOL] : COMPLEX_CONDITIONAL_POOL;
  const optionCount = tier === 1 ? 3 : tier === 2 ? 4 : 5;

  const scenario = pick(pool);
  const showIf = Math.random() < 0.5;
  const situation = showIf ? scenario.ifLabel : scenario.elseLabel;
  const correct = showIf ? scenario.ifResult : scenario.elseResult;
  const wrong = showIf ? scenario.elseResult : scenario.ifResult;

  const distractors = new Map<string, { id: string; label: string; icon: string }>();
  const otherPool = pool.filter((s) => s !== scenario);
  while (distractors.size < optionCount - 2 && distractors.size < otherPool.length) {
    const otherScenario = pick(otherPool);
    const candidate = Math.random() < 0.5 ? otherScenario.ifResult : otherScenario.elseResult;
    if (candidate.id !== correct.id && candidate.id !== wrong.id) distractors.set(candidate.id, candidate);
  }

  return {
    type: 'conditional',
    prompt: 'Kuralı oku, durumu gör, doğru eylemi seç.',
    hintText: `Kural: "${scenario.rule}" Şu an durum: ${situation}.`,
    rule: scenario.rule,
    situation,
    options: shuffle([correct, wrong, ...distractors.values()]),
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

function generateLoopCountPuzzle(askTotal: boolean, tier: DifficultyTier): PuzzleSpec {
  const groupCount = tier === 3 ? randInt(3, 5) : randInt(2, 4);
  const itemsPerGroup = randInt(2, tier === 3 ? 6 : askTotal ? 5 : 4);
  const icon = pick(LOOP_ICONS);
  // Extra loose items outside the grouped boxes - only at the hardest tier, and only when the
  // question already asks for the grand total (otherwise there's nothing sensible to add them to).
  const extraItems = tier === 3 && askTotal && Math.random() < 0.6 ? randInt(1, 4) : 0;
  const total = groupCount * itemsPerGroup + extraItems;
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
      ? extraItems > 0
        ? `${groupCount} grup var, her grupta ${itemsPerGroup} tane, ayrıca ${extraItems} tane de dışarıda duruyor: (${groupCount} × ${itemsPerGroup}) + ${extraItems} = ${total}.`
        : `${groupCount} grup var, her grupta ${itemsPerGroup} tane: ${groupCount} × ${itemsPerGroup} = ${total}.`
      : `Her kutuda ${itemsPerGroup} tane var. Kutuları tek tek say.`,
    icon,
    groupCount,
    itemsPerGroup,
    askTotal,
    extraItems: extraItems > 0 ? extraItems : undefined,
    options: shuffle([correctAnswer, ...distractors]),
    correctAnswer,
  };
}

/** Single entry point OkulaHazirlikGameRoot calls for every miniPuzzle task step at level-start time. */
export function generatePuzzle(
  type: PuzzleType,
  schoolLevel: SchoolReadinessLevel,
  difficultyTier: DifficultyTier = 1,
  targetObjectId?: string,
): PuzzleSpec {
  const isIlkokul = schoolLevel === 'ilkokul';
  const tier = difficultyTier;
  switch (type) {
    case 'sequence':
      return generateSequencePuzzle(tier);
    case 'orderedChoice': {
      const pool: 'clothing' | 'handwash' = targetObjectId === 'sink' ? 'handwash' : 'clothing';
      const base = isIlkokul ? randInt(6, 7) : randInt(3, 4);
      const count = tier === 3 && isIlkokul ? base + 1 : base;
      return generateOrderedChoicePuzzle(count, pool);
    }
    case 'conditional':
      return generateConditionalPuzzle(tier);
    case 'matching': {
      const base = isIlkokul ? randInt(3, 4) : 3;
      const count = tier === 3 && isIlkokul ? base + 1 : base;
      return generateMatchingPuzzle(count);
    }
    case 'loopCount':
      return generateLoopCountPuzzle(isIlkokul, tier);
  }
}
