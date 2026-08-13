export interface Position {
  row: number;
  col: number;
}

export type HouseMapCellType = 'floor' | 'wall' | 'object';

export interface HouseMapCell {
  type: HouseMapCellType;
  objectId?: string;
}

export interface InteractiveObject {
  id: string;
  label: string;
  icon: string;
  position: Position;
}

export type HouseMapVariant = 'house' | 'room';

export interface HouseMap {
  roomId: string;
  label: string;
  /** 'house' renders as a whole-home floor plan (corridors + room blocks). 'room' renders as a single furnished room. */
  variant: HouseMapVariant;
  /** Tailwind accent used to tint the room floor/walls in the 'room' variant. */
  accent: 'teal' | 'sky' | 'amber' | 'violet';
  grid: HouseMapCell[][];
  objects: InteractiveObject[];
}

export type TaskStepKind = 'moveTo' | 'enterAt' | 'miniPuzzle';

/** A small, self-contained logic puzzle shown full-screen for a 'miniPuzzle' task step. */
export type PuzzleSpec =
  | { type: 'sequence'; prompt: string; sequence: string[]; options: string[]; correctAnswer: string }
  | { type: 'orderedChoice'; prompt: string; items: { id: string; label: string; icon: string }[]; correctOrder: string[] }
  | { type: 'clue'; prompt: string; options: { id: string; label: string; icon: string }[]; correctOptionId: string }
  | { type: 'matching'; prompt: string; pairs: { id: string; leftLabel: string; rightLabel: string }[] };

export interface TaskStep {
  kind: TaskStepKind;
  targetObjectId: string;
  /** Shown as a live "what to do next" hint before this step is done, e.g. "Elini yüzünü yıka". */
  actionLabel: string;
  /** Shown as a success toast once this step is completed, e.g. "Elini yüzünü yıkadın!". */
  feedbackLabel: string;
  /** Required for kind: 'miniPuzzle' - which logic puzzle to show and its data. */
  puzzle?: PuzzleSpec;
}

export type SchoolReadinessLevel = 'anaokulu' | 'ilkokul';

export interface HouseNavLevel {
  id: string;
  order: number;
  title: string;
  instructions: string;
  mapRoomId: string;
  startPosition: Position;
  taskSteps: TaskStep[];
  points: number;
}

export type CommandType = 'up' | 'down' | 'left' | 'right' | 'enter';

export interface CommandEntry {
  id: string;
  type: CommandType;
  count: number;
  /** Snapshot of the intended action's label at the moment it was queued, used for 'enter' entries. */
  actionLabel?: string;
}

