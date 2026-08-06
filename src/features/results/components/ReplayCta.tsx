import { Link } from 'react-router-dom';
import { Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/app/routePaths';

interface ReplayCtaProps {
  onReplay: () => void;
}

export function ReplayCta({ onReplay }: ReplayCtaProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="outline" className="flex-1" onClick={onReplay}>
        <RotateCcw className="size-4" /> Tekrar Oyna
      </Button>
      <Button className="flex-1" render={<Link to={ROUTE_PATHS.home} />} nativeButton={false}>
        <Home className="size-4" /> Oyun Kataloğuna Dön
      </Button>
    </div>
  );
}
