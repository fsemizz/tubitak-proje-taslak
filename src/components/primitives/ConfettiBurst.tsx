import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6'];
const PIECES = Array.from({ length: 18 }, (_, i) => i);

interface ConfettiBurstProps {
  trigger: number;
}

/** A short, dependency-free confetti burst — pieces fly outward from center and fade. Fires once per trigger change. */
export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  if (trigger === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((i) => {
        const angle = (i / PIECES.length) * Math.PI * 2;
        const distance = 90 + ((i * 37) % 60);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const color = COLORS[i % COLORS.length];
        const isSquare = i % 2 === 0;
        return (
          <motion.span
            key={`${trigger}-${i}`}
            className={isSquare ? 'absolute left-1/2 top-1/2 block size-2.5' : 'absolute left-1/2 top-1/2 block size-2.5 rounded-full'}
            style={{ backgroundColor: color }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x, y: y + 120, opacity: 0, rotate: 200 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
