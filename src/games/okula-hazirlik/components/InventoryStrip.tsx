import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface InventoryStripProps {
  items: string[];
}

export function InventoryStrip({ items }: InventoryStripProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Envanterin</span>
      <AnimatePresence>
        {items.map((item, idx) => (
          <motion.span
            key={`${item}-${idx}`}
            initial={{ opacity: 0, scale: 0.4, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
          >
            <CheckCircle2 className="size-3" /> {item}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
