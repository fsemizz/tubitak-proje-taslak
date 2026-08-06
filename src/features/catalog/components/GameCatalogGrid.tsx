import { GameCard } from '@/components/primitives/GameCard';
import { EmptyState } from '@/components/primitives/EmptyState';
import { SearchX } from 'lucide-react';
import type { GameDefinition } from '@/types/game';

interface GameCatalogGridProps {
  games: GameDefinition[];
  hasActiveStudent: boolean;
}

export function GameCatalogGrid({ games, hasActiveStudent }: GameCatalogGridProps) {
  if (games.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="Bu kategoride oyun bulunamadı"
        description="Başka bir kategori seçmeyi dene."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} hasActiveStudent={hasActiveStudent} />
      ))}
    </div>
  );
}
