import { useState } from 'react';
import { Brain, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SequencePatternPuzzle } from './SequencePatternPuzzle';
import { OrderedChoicePuzzle } from './OrderedChoicePuzzle';
import { MatchingSchemaPuzzle } from './MatchingSchemaPuzzle';
import { ConditionalRulePuzzle } from './ConditionalRulePuzzle';
import { LoopCountPuzzle } from './LoopCountPuzzle';
import type { PuzzleSpec } from '../types';

interface PuzzleScreenProps {
  spec: PuzzleSpec;
  onSolved: () => void;
  onHintUsed: () => void;
}

export function PuzzleScreen({ spec, onSolved, onHintUsed }: PuzzleScreenProps) {
  const [hintShown, setHintShown] = useState(false);

  function useHint() {
    if (!hintShown) onHintUsed();
    setHintShown(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 py-6 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
          <Brain className="size-7" />
        </span>
        <h2 className="font-display text-xl font-extrabold text-foreground">Mini Bulmaca</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{spec.prompt}</p>
      </div>

      {spec.type === 'sequence' && <SequencePatternPuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'orderedChoice' && <OrderedChoicePuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'matching' && <MatchingSchemaPuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'conditional' && <ConditionalRulePuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'loopCount' && <LoopCountPuzzle spec={spec} onSolved={onSolved} />}

      <Button variant="outline" size="sm" onClick={useHint} className="self-center">
        <Lightbulb className="size-4" /> İpucu Al
      </Button>
      {hintShown && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700">
          <Lightbulb className="size-4 shrink-0" /> {spec.hintText}
        </div>
      )}
    </div>
  );
}
