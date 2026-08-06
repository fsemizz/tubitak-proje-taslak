import type { ComponentType, LazyExoticComponent } from 'react';
import type { GameDefinition, GameLevel } from '@/types/game';
import type { LevelAttemptResultInput } from '@/types/result';

export interface GamePlayerProps<T extends GameLevel = GameLevel> {
  level: T;
  levelNumber: number;
  totalLevels: number;
  onComplete: (result: LevelAttemptResultInput) => void;
  onExit: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GameModule {
  definition: GameDefinition;
  levels: GameLevel[];
  PlayerComponent: LazyExoticComponent<ComponentType<GamePlayerProps<any>>>;
}
