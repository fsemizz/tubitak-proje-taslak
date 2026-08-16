import { motion } from 'framer-motion';
import { AlertTriangle, Check, Minus, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BLOCK_PALETTE, OPERATOR_SYMBOL } from './blockPalette';
import type { PlacedBlock } from './evaluate';
import type { FlowComparisonOp, FlowPlacedBlockConfig, FlowVariable } from '@/types/game';

export type FlowBlockRunState = 'idle' | 'active' | 'passed' | 'error';

interface FlowBlockCardProps {
  block: PlacedBlock;
  index: number;
  variables: FlowVariable[];
  actionOptions: { id: string; label: string }[];
  operatorOptions: FlowComparisonOp[];
  state: FlowBlockRunState;
  errorHint?: string | null;
  disabled: boolean;
  onConfigChange: (config: FlowPlacedBlockConfig) => void;
  onRemove: () => void;
}

const STATE_STYLE: Record<FlowBlockRunState, string> = {
  idle: 'border-violet-200 bg-white',
  active: 'border-amber-400 bg-amber-50 ring-2 ring-amber-300 animate-pulse',
  passed: 'border-emerald-400 bg-emerald-50',
  error: 'border-rose-500 bg-rose-50 ring-2 ring-rose-300',
};

export function FlowBlockCard({
  block,
  index,
  variables,
  actionOptions,
  operatorOptions,
  state,
  errorHint,
  disabled,
  onConfigChange,
  onRemove,
}: FlowBlockCardProps) {
  const paletteEntry = BLOCK_PALETTE.find((p) => p.kind === block.kind)!;
  const Icon = paletteEntry.icon;

  function patch(partial: Partial<FlowPlacedBlockConfig>) {
    onConfigChange({ ...block.config, ...partial });
  }

  const selectedVariable = variables.find((v) => v.id === block.config.variableId);
  const liveConditionText =
    block.kind === 'condition' && selectedVariable && block.config.operator && block.config.compareValue !== undefined
      ? `${selectedVariable.label} (${selectedVariable.value}) ${OPERATOR_SYMBOL[block.config.operator]} ${block.config.compareValue} → ${evalCondition(
          selectedVariable.value,
          block.config.operator,
          block.config.compareValue,
        )
          ? 'Doğru'
          : 'Yanlış'}`
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn('flex w-full flex-col gap-2 rounded-xl border-2 p-3 shadow-sm transition-colors', STATE_STYLE[state])}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
          {index + 1}
        </span>
        <Icon className="size-4 shrink-0 text-violet-600" />
        <span className="text-sm font-bold text-violet-900">{paletteEntry.label}</span>
        {state === 'passed' && <Check className="size-4 text-emerald-600" />}
        {state === 'error' && <AlertTriangle className="size-4 text-rose-600" />}
        <div className="flex-1" />
        {!disabled && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Bloğu kaldır"
            className="tap-target flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {block.kind === 'condition' && (
        <div className="flex flex-wrap items-center gap-2 pl-8">
          <Select
            items={variables.map((v) => ({ label: v.label, value: v.id }))}
            value={block.config.variableId ?? ''}
            onValueChange={(v) => patch({ variableId: v ?? undefined })}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Değişken" />
            </SelectTrigger>
            <SelectContent>
              {variables.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            items={operatorOptions.map((op) => ({ label: OPERATOR_SYMBOL[op], value: op }))}
            value={block.config.operator ?? ''}
            onValueChange={(v) => patch({ operator: (v as FlowComparisonOp) ?? undefined })}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Karşılaştır" />
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map((op) => (
                <SelectItem key={op} value={op}>
                  {OPERATOR_SYMBOL[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            className="w-20"
            value={block.config.compareValue ?? ''}
            onChange={(e) => patch({ compareValue: e.target.value === '' ? undefined : Number(e.target.value) })}
            disabled={disabled}
            placeholder="Değer"
          />
        </div>
      )}

      {block.kind === 'loop' && (
        <div className="flex items-center gap-2 pl-8">
          <span className="text-sm text-muted-foreground">Kaç kez:</span>
          <div className="flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-1">
            <button
              type="button"
              onClick={() => patch({ loopCount: Math.max(1, (block.config.loopCount ?? 1) - 1) })}
              disabled={disabled}
              className="tap-target flex size-8 items-center justify-center rounded text-violet-700 hover:bg-violet-100 disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-violet-900">{block.config.loopCount ?? 1}</span>
            <button
              type="button"
              onClick={() => patch({ loopCount: (block.config.loopCount ?? 1) + 1 })}
              disabled={disabled}
              className="tap-target flex size-8 items-center justify-center rounded text-violet-700 hover:bg-violet-100 disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {block.kind === 'action' && (
        <div className="pl-8">
          <Select
            items={actionOptions.map((a) => ({ label: a.label, value: a.id }))}
            value={block.config.actionId ?? ''}
            onValueChange={(v) => patch({ actionId: v ?? undefined })}
            disabled={disabled}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Eylem seç" />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {liveConditionText && (state === 'active' || state === 'passed' || state === 'error') && (
        <p className="pl-8 text-xs font-semibold text-violet-700">{liveConditionText}</p>
      )}
      {state === 'error' && errorHint && (
        <p className="pl-8 text-xs font-semibold text-rose-700">{errorHint}</p>
      )}
    </motion.div>
  );
}

function evalCondition(actual: number, operator: FlowComparisonOp, compareValue: number): boolean {
  switch (operator) {
    case '>':
      return actual > compareValue;
    case '>=':
      return actual >= compareValue;
    case '<':
      return actual < compareValue;
    case '<=':
      return actual <= compareValue;
    case '==':
      return actual === compareValue;
  }
}
