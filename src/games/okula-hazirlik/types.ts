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

export interface HouseMap {
  roomId: string;
  label: string;
  grid: HouseMapCell[][];
  objects: InteractiveObject[];
}

export type TaskStepKind = 'moveTo' | 'enterAt';

export interface TaskStep {
  kind: TaskStepKind;
  targetObjectId: string;
  feedbackLabel: string;
}

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
}

