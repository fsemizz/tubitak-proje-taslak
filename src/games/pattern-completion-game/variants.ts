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
        cell('s1', 'color', 'bg-rose-400', 'kırmızı'),
        cell('s2', 'color', 'bg-blue-400', 'mavi'),
        cell('s3', 'color', 'bg-rose-400', 'kırmızı'),
        cell('s4', 'color', 'bg-blue-400', 'mavi'),
        cell('s5', 'color', 'bg-rose-400', 'kırmızı'),
        cell('s6', 'color', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'color', 'bg-blue-400', 'mavi'),
        cell('opt-b', 'color', 'bg-rose-400', 'kırmızı'),
        cell('opt-c', 'color', 'bg-emerald-400', 'yeşil'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'color', 'bg-emerald-400', 'yeşil'),
        cell('s2', 'color', 'bg-amber-400', 'sarı'),
        cell('s3', 'color', 'bg-emerald-400', 'yeşil'),
        cell('s4', 'color', 'bg-amber-400', 'sarı'),
        cell('s5', 'color', 'bg-emerald-400', 'yeşil'),
        cell('s6', 'color', '', '?'),
      ],
      missingIndex: 5,
      options: [
        cell('opt-a', 'color', 'bg-amber-400', 'sarı'),
        cell('opt-b', 'color', 'bg-emerald-400', 'yeşil'),
        cell('opt-c', 'color', 'bg-blue-400', 'mavi'),
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
        cell('s1', 'icon', 'red:circle', 'kırmızı daire'),
        cell('s2', 'icon', 'blue:square', 'mavi kare'),
        cell('s3', 'icon', 'red:circle', 'kırmızı daire'),
        cell('s4', 'icon', 'blue:square', 'mavi kare'),
        cell('s5', 'icon', 'red:circle', 'kırmızı daire'),
        cell('s6', 'icon', 'blue:square', 'mavi kare'),
        cell('s7', 'icon', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'icon', 'red:circle', 'kırmızı daire'),
        cell('opt-b', 'icon', 'blue:circle', 'mavi daire'),
        cell('opt-c', 'icon', 'red:square', 'kırmızı kare'),
      ],
      correctOptionId: 'opt-a',
    },
    {
      sequence: [
        cell('s1', 'icon', 'green:square', 'yeşil kare'),
        cell('s2', 'icon', 'blue:circle', 'mavi daire'),
        cell('s3', 'icon', 'green:square', 'yeşil kare'),
        cell('s4', 'icon', 'blue:circle', 'mavi daire'),
        cell('s5', 'icon', 'green:square', 'yeşil kare'),
        cell('s6', 'icon', 'blue:circle', 'mavi daire'),
        cell('s7', 'icon', '', '?'),
      ],
      missingIndex: 6,
      options: [
        cell('opt-a', 'icon', 'green:square', 'yeşil kare'),
        cell('opt-b', 'icon', 'green:circle', 'yeşil daire'),
        cell('opt-c', 'icon', 'blue:square', 'mavi kare'),
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
