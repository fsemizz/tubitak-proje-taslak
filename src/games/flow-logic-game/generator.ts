import {
  CONDITION_ONLY_TEMPLATES,
  LOOP_ONLY_TEMPLATES,
  CONDITION_LOOP_TEMPLATES,
  CONDITION_LOOP_HARD_TEMPLATES,
  DOUBLE_STAGE_TEMPLATES,
} from './templates';
import type { FlowchartLevel } from '@/types/game';

export type FlowStructure = 'conditionOnly' | 'loopOnly' | 'conditionLoop' | 'conditionLoopHard' | 'doubleStage';

// Which structural shape each hand-authored level shell uses — the shell's own scenario/variables/
// expectedSteps are just a fallback; the player regenerates fresh content from the matching tier's
// template pool every time the level is entered (see FlowLogicGamePlayer.tsx).
export const LEVEL_STRUCTURE: Record<string, FlowStructure> = {
  'flow-1': 'conditionOnly',
  'flow-2': 'loopOnly',
  'flow-3': 'conditionLoop',
  'flow-4': 'conditionLoopHard',
  'flow-5': 'doubleStage',
};

const STRUCTURE_TEMPLATES = {
  conditionOnly: CONDITION_ONLY_TEMPLATES,
  loopOnly: LOOP_ONLY_TEMPLATES,
  conditionLoop: CONDITION_LOOP_TEMPLATES,
  conditionLoopHard: CONDITION_LOOP_HARD_TEMPLATES,
  doubleStage: DOUBLE_STAGE_TEMPLATES,
} as const;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Regenerates a level's playable content (scenario + variables + actions + answer key) fresh from
 * its structure's template pool, keeping the shell's metadata (id/title/points/instructions/etc.)
 * untouched. Called once per level entry so replays and repeat playthroughs see different — but
 * always solvable — variants. */
export function generateFlowLevel(shell: FlowchartLevel): FlowchartLevel {
  const structure = LEVEL_STRUCTURE[shell.id] ?? 'conditionOnly';
  const template = pick(STRUCTURE_TEMPLATES[structure]);
  return {
    ...shell,
    scenario: template.scenario,
    variables: template.variables,
    actionOptions: template.actionOptions,
    operatorOptions: template.operatorOptions,
    expectedSteps: template.expectedSteps,
    resultTemplate: template.resultTemplate,
  };
}
