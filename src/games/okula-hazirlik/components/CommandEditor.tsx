import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Minus, Plus, X, Play, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CommandEntry, CommandType } from '../types';

const ENTRY_ICON: Record<CommandType, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
  enter: Sparkles,
};

const ENTRY_LABEL: Record<CommandType, string> = {
  up: 'Yukarı',
  down: 'Aşağı',
  left: 'Sol',
  right: 'Sağ',
  enter: 'Eylemi yap',
};

interface CommandEditorProps {
  entries: CommandEntry[];
  onAddCommand: (type: CommandType) => void;
  onChangeCount: (id: string, delta: number) => void;
  onRemoveEntry: (id: string) => void;
  onClear: () => void;
  onRun: () => void;
  isRunning: boolean;
  activeEntryId?: string | null;
  /** Label of the action the player would trigger right now, e.g. "Elini yüzünü yıka". Undefined when the next step is just moving. */
  nextActionLabel?: string;
}

export function CommandEditor({
  entries,
  onAddCommand,
  onChangeCount,
  onRemoveEntry,
  onClear,
  onRun,
  isRunning,
  activeEntryId,
  nextActionLabel,
}: CommandEditorProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Komut Editörü</p>
        <div className="grid grid-cols-3 gap-1.5">
          <div />
          <DirButton icon={ArrowUp} onClick={() => onAddCommand('up')} disabled={isRunning} />
          <div />
          <DirButton icon={ArrowLeft} onClick={() => onAddCommand('left')} disabled={isRunning} />
          <DirButton icon={ArrowDown} onClick={() => onAddCommand('down')} disabled={isRunning} />
          <DirButton icon={ArrowRight} onClick={() => onAddCommand('right')} disabled={isRunning} />
        </div>
        {nextActionLabel && (
          <Button
            variant="outline"
            className="mt-2 w-full border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            onClick={() => onAddCommand('enter')}
            disabled={isRunning}
          >
            <Sparkles className="size-4" /> {nextActionLabel}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Komut Listesi ({entries.length})
        </p>
        <div className="flex max-h-56 flex-col gap-1 overflow-y-auto scrollbar-thin">
          {entries.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
              Henüz komut eklemedin.
            </p>
          )}
          {entries.map((entry) => {
            const Icon = ENTRY_ICON[entry.type];
            const isActive = entry.id === activeEntryId;
            return (
              <div
                key={entry.id}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm transition',
                  isActive ? 'border-teal-500 bg-teal-50' : 'border-border bg-background',
                )}
              >
                <Icon className={cn('size-4 shrink-0', entry.type === 'enter' ? 'text-amber-500' : 'text-teal-600')} />
                <span className="flex-1 font-medium text-foreground">
                  {entry.type === 'enter' ? (entry.actionLabel ?? ENTRY_LABEL.enter) : ENTRY_LABEL[entry.type]}
                  {entry.type !== 'enter' && entry.count > 1 ? ` x${entry.count}` : ''}
                </span>
                {entry.type !== 'enter' && !isRunning && (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onChangeCount(entry.id, -1)}
                      className="tap-target flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                    >
                      <Minus className="size-3" />
                    </button>
                    <button
                      onClick={() => onChangeCount(entry.id, 1)}
                      className="tap-target flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                )}
                {!isRunning && (
                  <button
                    onClick={() => onRemoveEntry(entry.id)}
                    className="tap-target flex size-6 items-center justify-center rounded text-rose-500 hover:bg-rose-50"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onClear} disabled={isRunning || entries.length === 0}>
          <Trash2 className="size-4" /> Temizle
        </Button>
        <Button onClick={onRun} disabled={isRunning || entries.length === 0} className="flex-1">
          <Play className="size-4" /> Çalıştır
        </Button>
      </div>
    </div>
  );
}

function DirButton({
  icon: Icon,
  onClick,
  disabled,
}: {
  icon: typeof ArrowUp;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tap-target flex h-11 items-center justify-center rounded-lg border border-border bg-background text-teal-700 shadow-sm transition hover:border-teal-400 hover:bg-teal-50 disabled:opacity-40"
    >
      <Icon className="size-5" />
    </button>
  );
}
