import {
  ListOrdered,
  Shapes,
  Bug,
  Repeat,
  GitBranch,
  Puzzle,
  Home,
  Users,
  Trophy,
  Clock3,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';
import type { GameCategory } from '@/types/common';
import type { GameColorTheme, GameIconKey } from '@/types/game';

export const ICON_MAP: Record<GameIconKey, LucideIcon> = {
  sequencing: ListOrdered,
  pattern: Shapes,
  debug: Bug,
  loop: Repeat,
  conditional: GitBranch,
  matching: Puzzle,
  home: Home,
};

export function getGameIcon(key: GameIconKey): LucideIcon {
  return ICON_MAP[key] ?? Puzzle;
}

export const STAT_ICON = {
  students: Users,
  trophy: Trophy,
  time: Clock3,
  chart: BarChart3,
} as const;

export interface CategoryPalette extends GameColorTheme {
  badgeBg: string;
  badgeText: string;
  ring: string;
  solidBg: string;
}

export const CATEGORY_THEME: Record<GameCategory, CategoryPalette> = {
  sequencing: {
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-violet-500',
    accent: 'indigo',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-700',
    ring: 'ring-indigo-300',
    solidBg: 'bg-indigo-600',
  },
  pattern: {
    gradientFrom: 'from-fuchsia-500',
    gradientTo: 'to-pink-500',
    accent: 'fuchsia',
    badgeBg: 'bg-fuchsia-100',
    badgeText: 'text-fuchsia-700',
    ring: 'ring-fuchsia-300',
    solidBg: 'bg-fuchsia-600',
  },
  debugging: {
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-orange-500',
    accent: 'rose',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
    ring: 'ring-rose-300',
    solidBg: 'bg-rose-600',
  },
  loops: {
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-500',
    accent: 'emerald',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    ring: 'ring-emerald-300',
    solidBg: 'bg-emerald-600',
  },
  conditionals: {
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-yellow-500',
    accent: 'amber',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    ring: 'ring-amber-300',
    solidBg: 'bg-amber-600',
  },
  matching: {
    gradientFrom: 'from-sky-500',
    gradientTo: 'to-blue-500',
    accent: 'sky',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-700',
    ring: 'ring-sky-300',
    solidBg: 'bg-sky-600',
  },
  planning: {
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-cyan-500',
    accent: 'teal',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    ring: 'ring-teal-300',
    solidBg: 'bg-teal-600',
  },
};

export const APP_NAME = 'CodeKids';
export const TEACHER_DEMO_PASSCODE = 'ogretmen123';
