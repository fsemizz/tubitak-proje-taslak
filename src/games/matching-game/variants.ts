import type { MatchPair } from '@/types/game';

interface MatchingVariant {
  pairs: MatchPair[];
}

const p = (id: string, left: string, right: string): MatchPair => ({ id, left: { label: left }, right: { label: right } });

const VARIANTS: Record<string, MatchingVariant[]> = {
  'match-1': [
    {
      pairs: [p('p1', '↑', 'İleri'), p('p2', '↓', 'Geri'), p('p3', '→', 'Sağa'), p('p4', '←', 'Sola'), p('p5', '⟲', 'Geri Dön')],
    },
    {
      pairs: [p('p1', '🐢', 'Yavaş'), p('p2', '🐇', 'Hızlı'), p('p3', '⏸', 'Duraklat'), p('p4', '▶', 'Devam Et'), p('p5', '⏹', 'Bitir')],
    },
  ],
  'match-2': [
    {
      pairs: [p('p1', '🚶', 'Yürü'), p('p2', '🦘', 'Zıpla'), p('p3', '✋', 'Dur'), p('p4', '🏃', 'Koş'), p('p5', '🧍', 'Bekle')],
    },
    {
      pairs: [p('p1', '🚴', 'Bisiklete bin'), p('p2', '🏊', 'Yüz'), p('p3', '🧗', 'Tırman'), p('p4', '🤸', 'Takla at'), p('p5', '💃', 'Dans et')],
    },
  ],
  'match-3': [
    {
      pairs: [p('p1', '▶', 'Başla'), p('p2', '⏹', 'Bitir'), p('p3', '◆', 'Karar'), p('p4', '▭', 'İşlem'), p('p5', '↻', 'Tekrarla')],
    },
    {
      pairs: [p('p1', '⬭', 'Başla/Bitir'), p('p2', '▱', 'Giriş/Çıkış'), p('p3', '⬡', 'Hazırlık'), p('p4', '➡', 'Akış Yönü'), p('p5', '⭕', 'Bağlantı')],
    },
  ],
  'match-4': [
    {
      pairs: [p('p1', '🔁', 'Tekrarla'), p('p2', '❓', 'Eğer'), p('p3', '🔀', 'Değilse'), p('p4', '🏁', 'Hedef'), p('p5', '✅', 'Doğru')],
    },
    {
      pairs: [p('p1', '⏱', 'Bekle'), p('p2', '🔂', 'Bir Kez Tekrarla'), p('p3', '➕', 'Ekle'), p('p4', '➖', 'Çıkar'), p('p5', '🎯', 'Hedefe Ulaş')],
    },
  ],
  'match-5': [
    {
      pairs: [
        p('p1', '↑', 'İleri'),
        p('p2', '↓', 'Geri'),
        p('p3', '🔁', 'Tekrarla'),
        p('p4', '❓', 'Eğer'),
        p('p5', '▶', 'Başla'),
        p('p6', '⏹', 'Bitir'),
        p('p7', '🏃', 'Koş'),
      ],
    },
    {
      pairs: [
        p('p1', '🐢', 'Yavaş'),
        p('p2', '🐇', 'Hızlı'),
        p('p3', '◆', 'Karar'),
        p('p4', '🔀', 'Değilse'),
        p('p5', '🚴', 'Bisiklete bin'),
        p('p6', '🎯', 'Hedefe Ulaş'),
        p('p7', '🧗', 'Tırman'),
      ],
    },
  ],
};

export function pickMatchingVariant(levelId: string): MatchingVariant {
  const options = VARIANTS[levelId];
  if (!options || options.length === 0) {
    throw new Error(`No matching-game variants defined for level "${levelId}"`);
  }
  return options[Math.floor(Math.random() * options.length)];
}
