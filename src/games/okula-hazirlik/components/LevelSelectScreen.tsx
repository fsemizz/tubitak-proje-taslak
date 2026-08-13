import { motion } from 'framer-motion';
import { Backpack, Baby } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SchoolReadinessLevel } from '../types';

interface LevelSelectScreenProps {
  studentFirstName: string;
  onSelect: (level: SchoolReadinessLevel) => void;
}

const OPTIONS: {
  level: SchoolReadinessLevel;
  emoji: string;
  icon: typeof Baby;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    level: 'anaokulu',
    emoji: '🐥',
    icon: Baby,
    title: 'Anaokulu',
    description: 'Küçük ev, kısa ve keyifli görevler.',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    level: 'ilkokul',
    emoji: '🎒',
    icon: Backpack,
    title: 'İlkokul',
    description: 'Daha büyük ev, gizli bulmacalar ve daha uzun bir yolculuk.',
    accent: 'from-teal-500 to-cyan-500',
  },
];

export function LevelSelectScreen({ studentFirstName, onSelect }: LevelSelectScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 py-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-display text-2xl font-extrabold text-foreground">Merhaba, {studentFirstName}! 🌟</h1>
        <p className="max-w-sm text-muted-foreground">Hangi maceraya hazırsın? Önce bir seviye seç.</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt.level}
            onClick={() => onSelect(opt.level)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:shadow-md',
            )}
          >
            <span
              className={cn(
                'flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-lg',
                opt.accent,
              )}
            >
              {opt.emoji}
            </span>
            <span className="font-display text-lg font-extrabold text-foreground">{opt.title}</span>
            <span className="text-center text-sm text-muted-foreground">{opt.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
