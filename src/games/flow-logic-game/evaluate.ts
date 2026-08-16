import type { FlowBlockKind, FlowExpectedStep, FlowPlacedBlockConfig, FlowVariable } from '@/types/game';

export interface PlacedBlock {
  instanceId: string;
  kind: FlowBlockKind;
  config: FlowPlacedBlockConfig;
}

export type FlowErrorKind = 'kind-mismatch' | 'missing' | 'extra' | 'config-mismatch';

export interface EvaluationResult {
  /** Index into `placed` where the run must stop (or `placed.length`/`expected.length` for a missing step) — null if the whole program is correct. */
  firstErrorIndex: number | null;
  errorKind: FlowErrorKind | null;
  errorHint: string | null;
}

const KIND_LABEL: Record<FlowBlockKind, string> = {
  condition: 'Eğer',
  loop: 'Tekrarla',
  action: 'Eylem',
  result: 'Sonucu Hesapla',
};

function configMatches(kind: FlowBlockKind, placed: FlowPlacedBlockConfig, expected: FlowPlacedBlockConfig): boolean {
  switch (kind) {
    case 'condition':
      return (
        placed.variableId === expected.variableId &&
        placed.operator === expected.operator &&
        placed.compareValue === expected.compareValue
      );
    case 'loop':
      return placed.loopCount === expected.loopCount;
    case 'action':
      return placed.actionId === expected.actionId;
    case 'result':
      return true;
  }
}

function configHint(kind: FlowBlockKind, expected: FlowPlacedBlockConfig, variables: FlowVariable[]): string {
  switch (kind) {
    case 'condition': {
      const variable = variables.find((v) => v.id === expected.variableId);
      return variable
        ? `Senaryoda "${variable.label}" ile ilgili sayıya tekrar bak ve doğru değişkeni, karşılaştırmayı seç.`
        : 'Değişkeni ve karşılaştırmayı tekrar kontrol et.';
    }
    case 'loop':
      return 'Kaç kez tekrar etmen gerektiğini senaryoda tekrar oku.';
    case 'action':
      return 'Hangi eylemi yapman istendiğini tekrar oku.';
    case 'result':
      return '';
  }
}

/** Single source of truth for both the step-by-step run animation and the contextual hint system —
 * walks placed blocks against the answer key one position at a time and stops at the first mismatch. */
export function evaluateRun(placed: PlacedBlock[], expected: FlowExpectedStep[], variables: FlowVariable[]): EvaluationResult {
  const length = Math.max(placed.length, expected.length);
  for (let i = 0; i < length; i++) {
    if (i >= expected.length) {
      return {
        firstErrorIndex: i,
        errorKind: 'extra',
        errorHint: 'Fazladan bir blok var, programın buradan sonrasını kaldır.',
      };
    }
    if (i >= placed.length) {
      return {
        firstErrorIndex: i,
        errorKind: 'missing',
        errorHint: `Programın eksik — buraya bir "${KIND_LABEL[expected[i].kind]}" bloğu eklemelisin.`,
      };
    }
    if (placed[i].kind !== expected[i].kind) {
      return {
        firstErrorIndex: i,
        errorKind: 'kind-mismatch',
        errorHint: `Bu adımda bir "${KIND_LABEL[expected[i].kind]}" bloğu olmalı, sen "${KIND_LABEL[placed[i].kind]}" koydun.`,
      };
    }
    if (!configMatches(placed[i].kind, placed[i].config, expected[i].config)) {
      return {
        firstErrorIndex: i,
        errorKind: 'config-mismatch',
        errorHint: configHint(placed[i].kind, expected[i].config, variables),
      };
    }
  }
  return { firstErrorIndex: null, errorKind: null, errorHint: null };
}
