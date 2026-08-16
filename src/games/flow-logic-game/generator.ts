import { SIMPLE_TEMPLATES, LOOP_TEMPLATES, COMPLEX_TEMPLATES } from './scenarioPool';
import type { FlowBlock, FlowchartLevel } from '@/types/game';

export type FlowStructure = 'simple' | 'loop' | 'complex';

// Which structural shape each hand-authored level shell uses — the shell's own scenario/blocks/
// correctSequence are just a fallback; the player regenerates fresh content from the matching pool
// every time the level is entered (see FlowLogicGamePlayer.tsx).
export const LEVEL_STRUCTURE: Record<string, FlowStructure> = {
  'flow-1': 'simple',
  'flow-2': 'simple',
  'flow-3': 'loop',
  'flow-4': 'simple',
  'flow-5': 'complex',
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GeneratedContent {
  scenario: string;
  availableBlocks: FlowBlock[];
  correctSequence: string[];
}

function generateSimple(): GeneratedContent {
  const t = pick(SIMPLE_TEMPLATES);
  const availableBlocks: FlowBlock[] = [
    { id: 'cond-correct', label: t.condLabel, kind: 'condition' },
    { id: 'cond-distractor', label: t.distractorCondLabel, kind: 'condition' },
    { id: 'act-correct', label: t.actionLabel, kind: 'action' },
    { id: 'act-distractor', label: t.distractorActionLabel, kind: 'action' },
  ];
  return { scenario: t.scenario, availableBlocks, correctSequence: ['cond-correct', 'act-correct'] };
}

function generateLoop(): GeneratedContent {
  const t = pick(LOOP_TEMPLATES);
  const availableBlocks: FlowBlock[] = [
    { id: 'cond-correct', label: t.condLabel, kind: 'condition' },
    { id: 'cond-distractor', label: t.distractorCondLabel, kind: 'condition' },
    { id: 'loop-correct', label: `${t.loopCount} Kez Tekrarla`, kind: 'loop' },
    { id: 'loop-distractor', label: `${t.distractorLoopCount} Kez Tekrarla`, kind: 'loop' },
    { id: 'act-correct', label: t.actionLabel, kind: 'action' },
    { id: 'act-distractor', label: t.distractorActionLabel, kind: 'action' },
  ];
  return {
    scenario: t.scenario,
    availableBlocks,
    correctSequence: ['cond-correct', 'loop-correct', 'act-correct'],
  };
}

function generateComplex(): GeneratedContent {
  const t = pick(COMPLEX_TEMPLATES);
  const availableBlocks: FlowBlock[] = [
    { id: 'cond-correct', label: t.condLabel, kind: 'condition' },
    { id: 'cond-distractor', label: t.distractorCondLabel, kind: 'condition' },
    { id: 'act1-correct', label: t.action1Label, kind: 'action' },
    { id: 'act-distractor', label: t.distractorActionLabel, kind: 'action' },
    { id: 'loop-correct', label: `${t.loopCount} Kez Tekrarla`, kind: 'loop' },
    { id: 'loop-distractor', label: `${t.distractorLoopCount} Kez Tekrarla`, kind: 'loop' },
    { id: 'act2-correct', label: t.action2Label, kind: 'action' },
  ];
  return {
    scenario: t.scenario,
    availableBlocks,
    correctSequence: ['cond-correct', 'act1-correct', 'loop-correct', 'act2-correct'],
  };
}

/** Regenerates a level's playable content (scenario + blocks + answer) fresh from its template pool,
 * keeping the shell's metadata (id/title/points/instructions/etc.) untouched. Called once per level
 * entry so replays and repeat playthroughs see different — but always solvable — variants. */
export function generateFlowLevel(shell: FlowchartLevel): FlowchartLevel {
  const structure = LEVEL_STRUCTURE[shell.id] ?? 'simple';
  const content =
    structure === 'loop' ? generateLoop() : structure === 'complex' ? generateComplex() : generateSimple();
  return { ...shell, ...content };
}
