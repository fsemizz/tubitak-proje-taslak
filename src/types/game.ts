export type GameCategory = 
  | 'algorithm-sorting'
  | 'pattern-completion'
  | 'debug-detective'
  | 'loop-builder'
  | 'condition-quest';

export interface GameInfo {
  id: GameCategory;
  title: string;
  shortDescription: string;
  description: string;
  outcomes: string[]; // Hedef kazanımlar
  iconName: string;
  color: string;
  badge: string;
  recommendedGrade: string;
  totalLevels: number;
}

export interface LevelData<TConfig = any> {
  levelNumber: number;
  title: string;
  instructions: string;
  hint?: string;
  config: TConfig;
}
