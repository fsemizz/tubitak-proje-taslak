import { GitBranch, Repeat, Zap, Flag } from 'lucide-react';
import type { FlowBlockKind } from '@/types/game';

export interface BlockPaletteEntry {
  kind: FlowBlockKind;
  label: string;
  icon: typeof GitBranch;
}

/** The four block types offered in the palette — always the same set, every level. Difficulty comes
 * from how many of them the level's answer key requires and how they must be configured, not from
 * which types exist. */
export const BLOCK_PALETTE: BlockPaletteEntry[] = [
  { kind: 'condition', label: 'Eğer', icon: GitBranch },
  { kind: 'loop', label: 'Tekrarla', icon: Repeat },
  { kind: 'action', label: 'Eylem', icon: Zap },
  { kind: 'result', label: 'Sonucu Hesapla', icon: Flag },
];

export const OPERATOR_SYMBOL: Record<string, string> = {
  '>': '>',
  '>=': '≥',
  '<': '<',
  '<=': '≤',
  '==': '=',
};
