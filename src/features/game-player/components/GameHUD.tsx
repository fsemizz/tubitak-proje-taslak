import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelStepper } from '@/components/primitives/LevelStepper';
import { SoundControls } from '@/components/primitives/SoundControls';
import { LevelTimerBadge } from '@/components/primitives/LevelTimerBadge';
import { CATEGORY_THEME, getGameIcon } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { GameDefinition } from '@/types/game';

interface GameHUDProps {
  game: GameDefinition;
  totalLevels: number;
  currentIndex: number;
  onRequestExit: () => void;
  timerSeconds?: number;
  timerOptimalSeconds?: number;
}

export function GameHUD({
  game,
  totalLevels,
  currentIndex,
  onRequestExit,
  timerSeconds,
  timerOptimalSeconds,
}: GameHUDProps) {
  const theme = CATEGORY_THEME[game.category];
  const Icon = getGameIcon(game.icon);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('flex size-8 items-center justify-center rounded-lg text-white', theme.solidBg)}>
            <Icon className="size-4" />
          </span>
          <h1 className="font-display text-lg font-extrabold text-foreground">{game.title}</h1>
          {timerSeconds !== undefined && (
            <LevelTimerBadge elapsedSeconds={timerSeconds} optimalDurationSeconds={timerOptimalSeconds} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <SoundControls />
          <Button variant="ghost" size="sm" onClick={onRequestExit}>
            <LogOut className="size-4" /> Çık
          </Button>
        </div>
      </div>
      <LevelStepper total={totalLevels} currentIndex={currentIndex} />
    </div>
  );
}
