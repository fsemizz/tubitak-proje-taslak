import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

export function CelebrationBurst() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg"
    >
      <motion.div
        animate={{ rotate: [0, -12, 12, -8, 0] }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <PartyPopper className="size-9" />
      </motion.div>
    </motion.div>
  );
}
