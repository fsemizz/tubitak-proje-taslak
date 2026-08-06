import type { GameCategory, Difficulty } from './common';

export type GameStatus = 'available' | 'comingSoon';

export type GameIconKey = 'sequencing' | 'pattern' | 'debug' | 'loop' | 'conditional' | 'matching';

export interface GameColorTheme {
  gradientFrom: string;
  gradientTo: string;
  accent: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: GameCategory;
  icon: GameIconKey;
  colorTheme: GameColorTheme;
  kazanimlar: string[];
  minGrade: number;
  maxGrade: number;
  estimatedMinutes: number;
  levelCount: number;
  status: GameStatus;
}

interface LevelBase {
  id: string;
  gameId: string;
  order: number;
  title: string;
  difficulty: Difficulty;
  instructions: string;
  points: number;
}

export interface SequenceItem {
  id: string;
  label: string;
  icon?: string;
}

export interface SequencingLevel extends LevelBase {
  type: 'sequencing';
  items: SequenceItem[];
  correctOrder: string[];
}

export interface PatternCell {
  id: string;
  kind: 'color' | 'shape' | 'icon';
  value: string;
  label?: string;
}

export interface PatternLevel extends LevelBase {
  type: 'pattern';
  sequence: PatternCell[];
  missingIndex: number;
  options: PatternCell[];
  correctOptionId: string;
}

export interface AlgorithmStep {
  id: string;
  label: string;
}

export interface DebugLevel extends LevelBase {
  type: 'debug';
  steps: AlgorithmStep[];
  buggyStepId: string;
  explanation: string;
}

export interface Position {
  row: number;
  col: number;
}

export type GridCellType = 'empty' | 'wall' | 'start' | 'goal';

export type LoopBlockType =
  | 'forward1'
  | 'forward2'
  | 'forward3'
  | 'turnLeft'
  | 'turnRight'
  | 'repeat2'
  | 'repeat3'
  | 'repeat4';

export interface LoopLevel extends LevelBase {
  type: 'loop';
  grid: GridCellType[][];
  start: Position;
  goal: Position;
  startDirection: 'up' | 'down' | 'left' | 'right';
  maxBlocks: number;
  availableBlocks: LoopBlockType[];
}

export interface ConditionalBranch {
  id: string;
  label: string;
  description: string;
}

export interface ConditionalLevel extends LevelBase {
  type: 'conditional';
  scenario: string;
  branches: ConditionalBranch[];
  correctBranchId: string;
}

export interface MatchPair {
  id: string;
  left: { label: string; icon?: string };
  right: { label: string; icon?: string };
}

export interface MatchingLevel extends LevelBase {
  type: 'matching';
  pairs: MatchPair[];
}

export type GameLevel =
  | SequencingLevel
  | PatternLevel
  | DebugLevel
  | LoopLevel
  | ConditionalLevel
  | MatchingLevel;

export type GameLevelType = GameLevel['type'];
