import { Link } from 'react-router-dom';
import { Clock3, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KazanimChip } from './KazanimChip';
import { CATEGORY_THEME, getGameIcon } from '@/lib/constants';
import { CATEGORY_LABEL } from '@/types/common';
import { buildGamePlayPath, buildStudentNameEntryPath } from '@/app/routePaths';
import type { GameDefinition } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: GameDefinition;
  hasActiveStudent: boolean;
}

export function GameCard({ game, hasActiveStudent }: GameCardProps) {
  const theme = CATEGORY_THEME[game.category];
  const Icon = getGameIcon(game.icon);
  const targetPath = hasActiveStudent
    ? buildGamePlayPath(game.id)
    : buildStudentNameEntryPath(game.id);

  return (
    <Link to={targetPath} className="group block h-full focus:outline-none">
      <Card className="h-full overflow-hidden py-0 transition-all group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:-translate-y-1 group-focus-visible:shadow-lg">
        <div className={cn('flex h-24 items-center justify-between bg-gradient-to-br px-5', theme.gradientFrom, theme.gradientTo)}>
          <Icon className="size-10 text-white/90" strokeWidth={1.75} />
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
            {CATEGORY_LABEL[game.category]}
          </span>
        </div>
        <CardContent className="flex flex-col gap-3 pb-5">
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground">{game.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{game.shortDescription}</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {game.kazanimlar.slice(0, 2).map((k) => (
              <KazanimChip key={k} label={k} badgeBg={theme.badgeBg} badgeText={theme.badgeText} />
            ))}
          </div>

          <div className="mt-1 flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="size-3.5" /> {game.levelCount} seviye
            </span>
            <span className="flex items-center gap-1">
              <Clock3 className="size-3.5" /> ~{game.estimatedMinutes} dk
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
