import { cn } from '@/lib/utils';

interface KazanimChipProps {
  label: string;
  badgeBg?: string;
  badgeText?: string;
}

export function KazanimChip({ label, badgeBg = 'bg-muted', badgeText = 'text-muted-foreground' }: KazanimChipProps) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', badgeBg, badgeText)}>
      {label}
    </span>
  );
}
