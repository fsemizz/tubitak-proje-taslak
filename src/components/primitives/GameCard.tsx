import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <Card
        className={cn(
          'h-full overflow-hidden py-0 shadow-md transition-all duration-300',
          'group-hover:-translate-y-1.5 group-hover:shadow-xl group-focus-visible:-translate-y-1.5 group-focus-visible:shadow-xl',
          'group-hover:ring-2 group-hover:ring-offset-2',
          theme.ring,
        )}
      >
        <div className={cn('relative flex h-24 items-center justify-between overflow-hidden bg-gradient-to-br px-5', theme.gradientFrom, theme.gradientTo)}>
          <div className="pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-white/15 blur-xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-4 size-24 rounded-full bg-white/10 blur-2xl" />
          <motion.div
            whileHover={{ rotate: -8, scale: 1.12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
            className="relative z-10 flex size-12 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm"
          >
            <Icon className="size-7 text-white drop-shadow-sm" strokeWidth={1.75} />
          </motion.div>
          <span className="relative z-10 rounded-full bg-white/25 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
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
