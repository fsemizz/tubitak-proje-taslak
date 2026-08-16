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

export type PuzzleType = 'sequence' | 'orderedChoice' | 'conditional' | 'matching' | 'loopCount';

/**
 * A small, self-contained logic puzzle shown full-screen for a 'miniPuzzle' task step. Every
 * variant carries `hintText` - generators know the answer when they build the spec, so the hint is
 * produced for free alongside it rather than authored separately.
 */
export type PuzzleSpec =
  | { type: 'sequence'; prompt: string; hintText: string; sequence: string[]; options: string[]; correctAnswer: string }
  | {
      type: 'orderedChoice';
      prompt: string;
      hintText: string;
      items: { id: string; label: string; icon: string }[];
      correctOrder: string[];
    }
  | {
      type: 'conditional';
      prompt: string;
      hintText: string;
      rule: string;
      situation: string;
      options: { id: string; label: string; icon: string }[];
      correctOptionId: string;
    }
  | { type: 'matching'; prompt: string; hintText: string; pairs: { id: string; leftLabel: string; rightLabel: string }[] }
  | {
      type: 'loopCount';
      prompt: string;
      hintText: string;
      icon: string;
      groupCount: number;
      itemsPerGroup: number;
      askTotal: boolean; // false = "how many groups", true = "how many items in total"
      /** Extra loose items outside the grouped boxes, only used at higher difficulty tiers - must be added to the total. */
      extraItems?: number;
      options: string[];
      correctAnswer: string;
    };

/** Symbolic reference to which generator builds this step's puzzle - the concrete PuzzleSpec is
 * produced fresh each time the level is entered (see mapGenerator.ts-style generation pattern). */
export interface TaskStep {
  kind: TaskStepKind;
  targetObjectId: string;
  /** Shown as a live "what to do next" hint before this step is done, e.g. "Elini yüzünü yıka". */
  actionLabel: string;
  /** Shown as a success toast once this step is completed, e.g. "Elini yüzünü yıkadın!". */
  feedbackLabel: string;
  /** Required for kind: 'miniPuzzle' - which generator produces this step's puzzle. */
  puzzleType?: PuzzleType;
}

export type SchoolReadinessLevel = 'anaokulu' | 'ilkokul';

export interface HouseNavLevel {
  id: string;
  order: number;
  title: string;
  instructions: string;
  mapRoomId: string;
  /**
   * Where the character starts, expressed symbolically since maps are regenerated fresh each time
   * the level is entered - object positions move around. Resolved against that fresh map's objects
   * at level-start time. Omit for room levels, which always start at the fixed entry corner (0,0).
   */
  startAtObjectId?: string;
  taskSteps: TaskStep[];
  points: number;
  /** Target completion time for the 3-star time-closeness bonus. Going over never fails the level. */
  optimalDurationSeconds: number;
  /** Fewest steps a correct solution needs (informational — shown alongside the live timer). */
  minSteps: number;
}

/** Static definition of an object a generated map places somewhere - the id/label/icon are fixed, position is not. */
export interface RoomObjectDef {
  id: string;
  label: string;
  icon: string;
}

export interface RoomDef {
  roomId: string;
  label: string;
  variant: HouseMapVariant;
  accent: HouseMap['accent'];
  size: number;
  objects: RoomObjectDef[];
}

export type CommandType = 'up' | 'down' | 'left' | 'right' | 'enter';

export interface CommandEntry {
  id: string;
  type: CommandType;
  count: number;
  /** Snapshot of the intended action's label at the moment it was queued, used for 'enter' entries. */
  actionLabel?: string;
}

