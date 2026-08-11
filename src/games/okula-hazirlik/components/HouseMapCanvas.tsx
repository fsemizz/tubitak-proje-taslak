import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getObjectIcon } from '../objectIcons';
import type { HouseMap, Position } from '../types';

const CELL_SIZE = 62;
const DIR_ROTATE: Record<string, number> = { up: -90, right: 0, down: 90, left: 180 };

const ACCENT_STYLES: Record<HouseMap['accent'], { floor: string; border: string; icon: string; wash: string }> = {
  teal: { floor: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-600', wash: 'bg-teal-100/60' },
  sky: { floor: 'bg-sky-50', border: 'border-sky-200', icon: 'text-sky-600', wash: 'bg-sky-100/60' },
  amber: { floor: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', wash: 'bg-amber-100/60' },
  violet: { floor: 'bg-violet-50', border: 'border-violet-200', icon: 'text-violet-600', wash: 'bg-violet-100/60' },
};

interface HouseMapCanvasProps {
  map: HouseMap;
  characterPosition: Position;
  characterDirection: string;
  activeTargetObjectId?: string;
  /** Increment to trigger a wall-bump shake + red flash. */
  shakeToken?: number;
  /** Increment on each successful task step to trigger a celebratory pulse. */
  successToken?: number;
}

/**
 * The grid itself never rotates (spinning the whole board while navigating was confusing and made
 * it impossible to plan ahead). Only the character's own icon turns to show which way it's facing.
 */
export function HouseMapCanvas({
  map,
  characterPosition,
  characterDirection,
  activeTargetObjectId,
  shakeToken = 0,
  successToken = 0,
}: HouseMapCanvasProps) {
  const cols = map.grid[0]?.length ?? 0;
  const rows = map.grid.length;
  const accent = ACCENT_STYLES[map.accent];
  const width = cols * CELL_SIZE;
  const height = rows * CELL_SIZE;

  const [flash, setFlash] = useState<'error' | 'success' | null>(null);
  const isFirstShake = useRef(true);
  const isFirstSuccess = useRef(true);

  useEffect(() => {
    if (isFirstShake.current) {
      isFirstShake.current = false;
      return;
    }
    setFlash('error');
    const t = setTimeout(() => setFlash(null), 380);
    return () => clearTimeout(t);
  }, [shakeToken]);

  useEffect(() => {
    if (isFirstSuccess.current) {
      isFirstSuccess.current = false;
      return;
    }
    setFlash('success');
    const t = setTimeout(() => setFlash(null), 500);
    return () => clearTimeout(t);
  }, [successToken]);

  return (
    <div className={cn('overflow-x-auto rounded-2xl p-4 transition-colors', accent.wash)}>
      <motion.div
        key={shakeToken}
        initial={{ x: 0 }}
        animate={flash === 'error' ? { x: [0, -9, 8, -6, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.38 }}
        className="relative mx-auto"
        style={{ width, height }}
      >
        {flash && (
          <div
            className={cn(
              'pointer-events-none absolute -inset-3 z-20 rounded-2xl transition-opacity',
              flash === 'error' ? 'bg-rose-500/15' : 'bg-emerald-400/15',
            )}
          />
        )}

        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)` }}>
          {map.grid.map((row, r) =>
            row.map((cell, c) => {
              const object = cell.objectId ? map.objects.find((o) => o.id === cell.objectId) : null;
              const Icon = object ? getObjectIcon(object.icon) : null;
              const isActiveTarget = object && object.id === activeTargetObjectId;
              return (
                <div
                  key={`${r}-${c}`}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 rounded-lg border shadow-sm',
                    cell.type === 'wall' ? 'border-transparent bg-slate-800/85' : cn(accent.border, accent.floor),
                    isActiveTarget && 'ring-4 ring-amber-300/60',
                  )}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {Icon && (
                    <>
                      <span
                        className={cn(
                          'flex size-8 items-center justify-center rounded-full bg-white shadow-sm',
                          isActiveTarget ? 'text-amber-500' : accent.icon,
                        )}
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <span className="mt-0.5 max-w-full truncate px-0.5 text-[8px] font-bold text-foreground/70">
                        {object!.label}
                      </span>
                    </>
                  )}
                </div>
              );
            }),
          )}
        </div>

        <motion.div
          className="pointer-events-none absolute z-10 flex items-center justify-center"
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
          animate={{ left: characterPosition.col * CELL_SIZE, top: characterPosition.row * CELL_SIZE }}
          transition={{ type: 'tween', duration: 0.32, ease: 'easeInOut' }}
        >
          <div className="relative flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg ring-4 ring-white">
            <Bot className="size-6 transition-transform" style={{ transform: `rotate(${DIR_ROTATE[characterDirection] ?? 0}deg)` }} />
            {flash === 'success' && (
              <motion.span
                key={`sparkle-${successToken}`}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1.6, opacity: [0, 1, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute -right-2 -top-2 text-amber-400"
              >
                <Sparkles className="size-5 fill-amber-300" />
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
