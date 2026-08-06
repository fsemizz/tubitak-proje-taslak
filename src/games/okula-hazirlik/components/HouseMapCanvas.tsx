import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getObjectIcon } from '../objectIcons';
import type { HouseMap, Position } from '../types';

const CELL_SIZE = 60;
const DIR_ROTATE: Record<string, number> = { up: -90, right: 0, down: 90, left: 180 };

interface HouseMapCanvasProps {
  map: HouseMap;
  characterPosition: Position;
  characterDirection: string;
  activeTargetObjectId?: string;
}

export function HouseMapCanvas({
  map,
  characterPosition,
  characterDirection,
  activeTargetObjectId,
}: HouseMapCanvasProps) {
  const cols = map.grid[0]?.length ?? 0;
  const rows = map.grid.length;

  return (
    <div className="overflow-x-auto rounded-xl bg-teal-50 p-3">
      <div
        className="relative mx-auto"
        style={{ width: cols * CELL_SIZE, height: rows * CELL_SIZE }}
      >
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)` }}
        >
          {map.grid.map((row, r) =>
            row.map((cell, c) => {
              const object = cell.objectId ? map.objects.find((o) => o.id === cell.objectId) : null;
              const Icon = object ? getObjectIcon(object.icon) : null;
              const isActiveTarget = object && object.id === activeTargetObjectId;
              return (
                <div
                  key={`${r}-${c}`}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-md border text-teal-700',
                    cell.type === 'wall' ? 'border-transparent bg-teal-900/70' : 'border-teal-200 bg-white',
                    isActiveTarget && 'ring-2 ring-teal-500 ring-offset-1',
                  )}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {Icon && (
                    <>
                      <Icon className="size-5 text-teal-600" />
                      <span className="mt-0.5 max-w-full truncate px-0.5 text-[8px] font-semibold text-teal-700">
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
          className="pointer-events-none absolute flex items-center justify-center"
          style={{ width: CELL_SIZE, height: CELL_SIZE }}
          animate={{ left: characterPosition.col * CELL_SIZE, top: characterPosition.row * CELL_SIZE }}
          transition={{ type: 'tween', duration: 0.32, ease: 'easeInOut' }}
        >
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg">
            <Bot
              className="size-6 transition-transform"
              style={{ transform: `rotate(${DIR_ROTATE[characterDirection] ?? 0}deg)` }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
