import type { AlgorithmStep } from '@/types/game';

interface DebugVariant {
  steps: AlgorithmStep[];
  buggyStepId: string;
  explanation: string;
}

const s = (id: string, label: string): AlgorithmStep => ({ id, label });

// Two interchangeable variants per level id — same step count/difficulty, different story, so
// replaying a level doesn't just show the memorized bug location.
const VARIANTS: Record<string, DebugVariant[]> = {
  'dbg-1': [
    {
      steps: [s('a', 'Musluğu aç'), s('b', 'Elleri suyla ıslat'), s('c', 'Elleri sabunla'), s('d', 'Elleri iyice ovala'), s('e', 'Havluyla kurula'), s('f', 'Elleri suyla durula')],
      buggyStepId: 'e',
      explanation: '"Havluyla kurula" adımı, eller durulanmadan önce yapılamaz. Bu adım "elleri suyla durula" adımından sonra gelmeli.',
    },
    {
      steps: [s('a', 'Ayakkabını ayağına geçir'), s('b', 'Bağcıkları çapraz yap'), s('c', 'Fiyonk bağla'), s('d', 'Bağcık uçlarını sıkıca çek'), s('e', 'Diğer ayakkabıyı giy'), s('f', 'Bağcıklarını bağla')],
      buggyStepId: 'c',
      explanation: '"Fiyonk bağla" adımı, bağcıklar çapraz yapılıp uçları sıkıca çekilmeden yapılamaz. Bu adım "bağcık uçlarını sıkıca çek" adımından sonra gelmeli.',
    },
  ],
  'dbg-2': [
    {
      steps: [s('a', '1 adım ileri git'), s('b', '1 adım ileri git'), s('c', 'Sağa dön'), s('d', '1 adım ileri git'), s('e', '1 adım ileri git')],
      buggyStepId: 'c',
      explanation: 'Yol düz olduğu için robotun dönmesine gerek yok. "Sağa dön" komutu robotu yoldan çıkarır.',
    },
    {
      steps: [s('a', '1 adım ileri git'), s('b', 'Sola dön'), s('c', '1 adım ileri git'), s('d', '1 adım ileri git'), s('e', '1 adım ileri git')],
      buggyStepId: 'b',
      explanation: 'Yol düz olduğu için robotun dönmesine gerek yok. "Sola dön" komutu robotu yoldan çıkarır.',
    },
  ],
  'dbg-3': [
    {
      steps: [s('a', 'Portakalları yıka'), s('b', 'Portakalları ikiye kes'), s('c', 'Portakalları sık'), s('d', 'Tuz ekle'), s('e', 'Bardağa koy'), s('f', 'İç')],
      buggyStepId: 'd',
      explanation: 'Meyve suyuna tuz eklenmez. Bu adım yanlış; "isteğe bağlı şeker ekle" olmalıydı.',
    },
    {
      steps: [s('a', 'Ekmek dilimlerini al'), s('b', 'Bir dilime reçel sür'), s('c', 'Diğer dilime tuz sür'), s('d', 'Dilimleri üst üste koy'), s('e', 'İkiye kes'), s('f', 'Tabağa koy')],
      buggyStepId: 'c',
      explanation: 'Reçelli sandviçe tuz sürülmez. Bu adım yanlış; "diğer dilime de reçel sür" olmalıydı.',
    },
  ],
  'dbg-4': [
    {
      steps: [s('a', '2 adım ileri git'), s('b', 'Sağa dön'), s('c', '1 adım ileri git'), s('d', 'Sağa dön'), s('e', '2 adım ileri git'), s('f', 'Sola dön'), s('g', '1 adım ileri git')],
      buggyStepId: 'd',
      explanation: 'İkinci "sağa dön" komutu robotu hedefin tam tersi yöne çevirir; burada "sola dön" olmalıydı.',
    },
    {
      steps: [s('a', '1 adım ileri git'), s('b', 'Sola dön'), s('c', '2 adım ileri git'), s('d', 'Sağa dön'), s('e', 'Sağa dön'), s('f', '1 adım ileri git'), s('g', 'Dur')],
      buggyStepId: 'e',
      explanation: 'Arka arkaya iki "sağa dön" robotu geri yöne çevirir; ikinci dönüş fazladan ve hatalı.',
    },
  ],
  'dbg-5': [
    {
      steps: [s('a', 'Sulama kabını doldur'), s('b', 'Bahçeye git'), s('c', 'Çiçeklere git'), s('d', 'Kabı ters çevirip boşalt'), s('e', 'Çiçekleri sula'), s('f', 'Kabı yerine koy'), s('g', 'Elleri yıka'), s('h', 'Ellerini kurula')],
      buggyStepId: 'd',
      explanation: 'Kap çiçeklere ulaşmadan boşaltılırsa çiçekler sulanamaz. Bu adım "çiçekleri sula" adımından sonra gelmeli.',
    },
    {
      steps: [s('a', 'Kitap çantasını hazırla'), s('b', 'Defterleri çantaya koy'), s('c', 'Kalemleri çantaya koy'), s('d', 'Çantayı sırtına tak'), s('e', 'Su matarasını doldur'), s('f', 'Matarayı çantaya koy'), s('g', 'Ayakkabılarını giy'), s('h', 'Evden çık')],
      buggyStepId: 'd',
      explanation: 'Çanta sırta takılmadan önce mataranın da içine konması gerekir. "Çantayı sırtına tak" adımı, "matarayı çantaya koy" adımından sonra gelmeli.',
    },
  ],
};

export function pickDebugVariant(levelId: string): DebugVariant {
  const options = VARIANTS[levelId];
  if (!options || options.length === 0) {
    throw new Error(`No debug-hunt variants defined for level "${levelId}"`);
  }
  return options[Math.floor(Math.random() * options.length)];
}
