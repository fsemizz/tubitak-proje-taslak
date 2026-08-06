import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelStepper } from '@/components/primitives/LevelStepper';
import type { GameDefinition } from '@/types/game';

interface GameHUDProps {
  game: GameDefinition;
  totalLevels: number;
  currentIndex: number;
  onRequestExit: () => void;
}

export function GameHUD({ game, totalLevels, currentIndex, onRequestExit }: GameHUDProps) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-extrabold text-foreground">{game.title}</h1>
        <Button variant="ghost" size="sm" onClick={onRequestExit}>
          <LogOut className="size-4" /> Çık
        </Button>
      </div>
      <LevelStepper total={totalLevels} currentIndex={currentIndex} />
    </div>
  );
}
