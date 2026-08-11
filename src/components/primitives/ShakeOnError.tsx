import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ShakeOnErrorProps {
  /** Increment this on every wrong answer to replay the shake. */
  trigger: number;
  children: ReactNode;
  className?: string;
}

/** Wraps game-answer areas to give a quick, playful shake when the player picks wrong. */
export function ShakeOnError({ trigger, children, className }: ShakeOnErrorProps) {
  return (
    <motion.div
      key={trigger}
      initial={{ x: 0 }}
      animate={trigger > 0 ? { x: [0, -8, 8, -6, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
