import { cn } from '@/lib/utils';
import { CATEGORY_LABEL, type GameCategory } from '@/types/common';
import { CATEGORY_THEME } from '@/lib/constants';

interface CategoryFilterBarProps {
  categories: GameCategory[];
  selected: GameCategory | null;
  onSelect: (category: GameCategory | null) => void;
}

export function CategoryFilterBar({ categories, selected, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'tap-target rounded-full border px-3.5 py-1.5 text-sm font-semibold transition',
          selected === null
            ? 'border-foreground bg-foreground text-background'
            : 'border-border bg-card text-muted-foreground hover:border-foreground/30',
        )}
      >
        Tümü
      </button>
      {categories.map((category) => {
        const theme = CATEGORY_THEME[category];
        const isActive = selected === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              'tap-target rounded-full border px-3.5 py-1.5 text-sm font-semibold transition',
              isActive ? cn(theme.badgeBg, theme.badgeText, 'border-transparent') : 'border-border bg-card text-muted-foreground hover:border-foreground/30',
            )}
          >
            {CATEGORY_LABEL[category]}
          </button>
        );
      })}
    </div>
  );
}
