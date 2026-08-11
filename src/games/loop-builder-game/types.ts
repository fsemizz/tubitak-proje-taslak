import type { LoopDirection } from '@/types/game';

export interface LoopCommandEntry {
  id: string;
  direction: LoopDirection;
  count: number;
}
