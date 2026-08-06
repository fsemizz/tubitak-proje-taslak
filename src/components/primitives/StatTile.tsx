import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export function StatTile({ icon: Icon, label, value }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
