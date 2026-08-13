import { Brain } from 'lucide-react';
import { ClueDeductionPuzzle } from './ClueDeductionPuzzle';
import { SequencePatternPuzzle } from './SequencePatternPuzzle';
import { OrderedChoicePuzzle } from './OrderedChoicePuzzle';
import { MatchingSchemaPuzzle } from './MatchingSchemaPuzzle';
import type { TaskStep } from '../types';

interface PuzzleScreenProps {
  taskStep: TaskStep;
  onSolved: () => void;
}

export function PuzzleScreen({ taskStep, onSolved }: PuzzleScreenProps) {
  const spec = taskStep.puzzle;
  if (!spec) return null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 py-6 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
          <Brain className="size-7" />
        </span>
        <h2 className="font-display text-xl font-extrabold text-foreground">Mini Bulmaca</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{spec.prompt}</p>
      </div>

      {spec.type === 'clue' && <ClueDeductionPuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'sequence' && <SequencePatternPuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'orderedChoice' && <OrderedChoicePuzzle spec={spec} onSolved={onSolved} />}
      {spec.type === 'matching' && <MatchingSchemaPuzzle spec={spec} onSolved={onSolved} />}
    </div>
  );
}
