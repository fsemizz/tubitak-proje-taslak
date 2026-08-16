import type { PatternCell } from '@/types/game';

interface PatternVariant {
  sequence: PatternCell[];
  missingIndex: number;
  options: PatternCell[];
  correctOptionId: string;
}

const cell = (id: string, kind: PatternCell['kind'], value: string, label: string): PatternCell => ({
  id,
  kind,
  value,
  label,
});

const VARIANTS: Record<string, PatternVariant[]> = {
  'pat-1': [
    {
      sequence: [
        cell('s1', 'color', 'rose', 'kırmızı'),
        cell('s2', 'color', 'blue', 'mavi'),
        cell('s3', 'color', 'rose', 'kırmızı'),
        cell('s4', 'color', 'blue', 'mavi'),
        cell('s5', 'color', 'rose', 'kırmızı'),
        cell('s6', 'color', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'color', 'blue', 'mavi'),
        cell('opt-b', 'color', 'rose', 'kırmızı'),
        cell('opt-c', 'color', 'emerald', 'yeşil'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'color', 'emerald', 'yeşil'),
        cell('s2', 'color', 'amber', 'sarı'),
        cell('s3', 'color', 'emerald', 'yeşil'),
        cell('s4', 'color', 'amber', 'sarı'),
        cell('s5', 'color', 'emerald', 'yeşil'),
        cell('s6', 'color', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'color', 'amber', 'sarı'),
        cell('opt-b', 'color', 'emerald', 'yeşil'),
        cell('opt-c', 'color', 'blue', 'mavi'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'color', 'violet', 'mor'),
        cell('s2', 'color', 'pink', 'pembe'),
        cell('s3', 'color', 'sky', 'gökyüzü mavisi'),
        cell('s4', 'color', 'violet', 'mor'),
        cell('s5', 'color', 'pink', 'pembe'),
        cell('s6', 'color', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'color', 'sky', 'gökyüzü mavisi'),
        cell('opt-b', 'color', 'violet', 'mor'),
        cell('opt-c', 'color', 'rose', 'kırmızı'),
      ],
      correctOptionId: 'opt-a',
    },
  ],
  'pat-2': [
    {
      sequence: [
        cell('s1', 'shape', 'circle', 'daire'),
        cell('s2', 'shape', 'square', 'kare'),
        cell('s3', 'shape', 'triangle', 'üçgen'),
        cell('s4', 'shape', 'circle', 'daire'),
        cell('s5', 'shape', 'square', 'kare'),
        cell('s6', 'shape', 'triangle', 'üçgen'),
        cell('s7', 'shape', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'shape', 'circle', 'daire'),
        cell('opt-b', 'shape', 'triangle', 'üçgen'),
        cell('opt-c', 'shape', 'square', 'kare'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'shape', 'triangle', 'üçgen'),
        cell('s2', 'shape', 'circle', 'daire'),
        cell('s3', 'shape', 'square', 'kare'),
        cell('s4', 'shape', 'triangle', 'üçgen'),
        cell('s5', 'shape', 'circle', 'daire'),
        cell('s6', 'shape', 'square', 'kare'),
        cell('s7', 'shape', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'shape', 'triangle', 'üçgen'),
        cell('opt-b', 'shape', 'circle', 'daire'),
        cell('opt-c', 'shape', 'square', 'kare'),
      ],
      correctOptionId: 'opt-a',
    },
  ],
  'pat-3': [
    {
      sequence: [
        cell('s1', 'icon', '★', '1 yıldız'),
        cell('s2', 'icon', '★★', '2 yıldız'),
        cell('s3', 'icon', '★★★', '3 yıldız'),
        cell('s4', 'icon', '★★★★', '4 yıldız'),
        cell('s5', 'icon', '★★★★★', '5 yıldız'),
        cell('s6', 'icon', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'icon', '★★★★★★', '6 yıldız'),
        cell('opt-b', 'icon', '★★★', '3 yıldız'),
        cell('opt-c', 'icon', '★★★★★★★', '7 yıldız'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'icon', '♦', '1 elmas'),
        cell('s2', 'icon', '♦♦', '2 elmas'),
        cell('s3', 'icon', '♦♦♦', '3 elmas'),
        cell('s4', 'icon', '♦♦♦♦', '4 elmas'),
        cell('s5', 'icon', '♦♦♦♦♦', '5 elmas'),
        cell('s6', 'icon', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'icon', '♦♦♦♦♦♦', '6 elmas'),
        cell('opt-b', 'icon', '♦♦', '2 elmas'),
        cell('opt-c', 'icon', '♦♦♦♦♦♦♦', '7 elmas'),
      ],
      correctOptionId: 'opt-a',
    },
  ],
  'pat-4': [
    {
      sequence: [
        cell('s1', 'icon', 'rose:circle', 'kırmızı daire'),
        cell('s2', 'icon', 'blue:square', 'mavi kare'),
        cell('s3', 'icon', 'rose:circle', 'kırmızı daire'),
        cell('s4', 'icon', 'blue:square', 'mavi kare'),
        cell('s5', 'icon', 'rose:circle', 'kırmızı daire'),
        cell('s6', 'icon', 'blue:square', 'mavi kare'),
        cell('s7', 'icon', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'icon', 'rose:circle', 'kırmızı daire'),
        cell('opt-b', 'icon', 'blue:circle', 'mavi daire'),
        cell('opt-c', 'icon', 'rose:square', 'kırmızı kare'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'icon', 'emerald:square', 'yeşil kare'),
        cell('s2', 'icon', 'blue:circle', 'mavi daire'),
        cell('s3', 'icon', 'emerald:square', 'yeşil kare'),
        cell('s4', 'icon', 'blue:circle', 'mavi daire'),
        cell('s5', 'icon', 'emerald:square', 'yeşil kare'),
        cell('s6', 'icon', 'blue:circle', 'mavi daire'),
        cell('s7', 'icon', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'icon', 'emerald:square', 'yeşil kare'),
        cell('opt-b', 'icon', 'emerald:circle', 'yeşil daire'),
        cell('opt-c', 'icon', 'blue:square', 'mavi kare'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'icon', 'violet:circle', 'mor daire'),
        cell('s2', 'icon', 'pink:triangle', 'pembe üçgen'),
        cell('s3', 'icon', 'violet:circle', 'mor daire'),
        cell('s4', 'icon', 'pink:triangle', 'pembe üçgen'),
        cell('s5', 'icon', 'violet:circle', 'mor daire'),
        cell('s6', 'icon', 'pink:triangle', 'pembe üçgen'),
        cell('s7', 'icon', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'icon', 'violet:circle', 'mor daire'),
        cell('opt-b', 'icon', 'pink:circle', 'pembe daire'),
        cell('opt-c', 'icon', 'violet:triangle', 'mor üçgen'),
      ],
      correctOptionId: 'opt-a',
    },
  ],
  'pat-5': [
    {
      sequence: [
        cell('s1', 'shape', 'circle', 'daire'),
        cell('s2', 'shape', 'square', 'kare'),
        cell('s3', 'shape', 'triangle', 'üçgen'),
        cell('s4', 'shape', 'square', 'kare'),
        cell('s5', 'shape', 'square', 'kare'),
        cell('s6', 'shape', 'triangle', 'üçgen'),
        cell('s7', 'shape', 'square', 'kare'),
        cell('s8', 'shape', '', '?'),
      ],
      missingIndex: 7,
      options: [
        cell('opt-a', 'shape', 'circle', 'daire'),
        cell('opt-b', 'shape', 'triangle', 'üçgen'),
        cell('opt-c', 'shape', 'square', 'kare'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'shape', 'triangle', 'üçgen'),
        cell('s2', 'shape', 'circle', 'daire'),
        cell('s3', 'shape', 'square', 'kare'),
        cell('s4', 'shape', 'circle', 'daire'),
        cell('s5', 'shape', 'circle', 'daire'),
        cell('s6', 'shape', 'square', 'kare'),
        cell('s7', 'shape', 'circle', 'daire'),
        cell('s8', 'shape', '', '?'),
      ],
      missingIndex: 7,
      options: [
        cell('opt-a', 'shape', 'triangle', 'üçgen'),
        cell('opt-b', 'shape', 'square', 'kare'),
        cell('opt-c', 'shape', 'circle', 'daire'),
      ],
      correctOptionId: 'opt-a',
    },
  ],
};

export function pickPatternVariant(levelId: string): PatternVariant {
  const options = VARIANTS[levelId];
  if (!options || options.length === 0) {
    throw new Error(`No pattern-completion variants defined for level "${levelId}"`);
  }
  return options[Math.floor(Math.random() * options.length)];
}
