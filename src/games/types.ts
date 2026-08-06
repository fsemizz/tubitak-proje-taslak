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

export interface GameRootProps {
  game: GameDefinition;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GameModule {
  definition: GameDefinition;
  levels: GameLevel[];
  /** Standard single-file-per-level games render through GameShell with this. */
  PlayerComponent?: LazyExoticComponent<ComponentType<GamePlayerProps<any>>>;
  /** Games with a non-standard multi-level/campaign shape manage their own flow and render this instead. */
  RootComponent?: LazyExoticComponent<ComponentType<GameRootProps>>;
}
