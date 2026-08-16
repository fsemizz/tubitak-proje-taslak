import { lazy } from 'react';
import type { GameModule } from './types';
import type { GameDefinition } from '@/types/game';

import { sequencingMeta, sequencingLevels } from './sequencing-game';
import { patternMeta, patternLevels } from './pattern-completion-game';
import { debugMeta, debugLevels } from './debug-hunt-game';
import { loopMeta, loopLevels } from './loop-builder-game';
import { conditionalMeta, conditionalLevels } from './conditional-logic-game';
import { matchingMeta, matchingLevels } from './matching-game';
import { okulaHazirlikMeta } from './okula-hazirlik';
import { flowLogicMeta, flowLogicLevels } from './flow-logic-game';

export const gameRegistry: Record<string, GameModule> = {
  [sequencingMeta.id]: {
    definition: sequencingMeta,
    levels: sequencingLevels,
    PlayerComponent: lazy(() => import('./sequencing-game/SequencingGamePlayer')),
  },
  [patternMeta.id]: {
    definition: patternMeta,
    levels: patternLevels,
    PlayerComponent: lazy(() => import('./pattern-completion-game/PatternCompletionGamePlayer')),
  },
  [debugMeta.id]: {
    definition: debugMeta,
    levels: debugLevels,
    PlayerComponent: lazy(() => import('./debug-hunt-game/DebugHuntGamePlayer')),
  },
  [loopMeta.id]: {
    definition: loopMeta,
    levels: loopLevels,
    PlayerComponent: lazy(() => import('./loop-builder-game/LoopBuilderGamePlayer')),
  },
  [conditionalMeta.id]: {
    definition: conditionalMeta,
    levels: conditionalLevels,
    PlayerComponent: lazy(() => import('./conditional-logic-game/ConditionalLogicGamePlayer')),
  },
  [matchingMeta.id]: {
    definition: matchingMeta,
    levels: matchingLevels,
    PlayerComponent: lazy(() => import('./matching-game/MatchingGamePlayer')),
  },
  [flowLogicMeta.id]: {
    definition: flowLogicMeta,
    levels: flowLogicLevels,
    PlayerComponent: lazy(() => import('./flow-logic-game/FlowLogicGamePlayer')),
  },
  [okulaHazirlikMeta.id]: {
    definition: okulaHazirlikMeta,
    levels: [],
    RootComponent: lazy(() =>
      import('./okula-hazirlik/components/OkulaHazirlikGameRoot').then((m) => ({
        default: m.OkulaHazirlikGameRoot,
      })),
    ),
  },
};

export const gameList: GameDefinition[] = Object.values(gameRegistry).map((g) => g.definition);
