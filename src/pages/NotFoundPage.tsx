import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ROUTE_PATHS } from '@/app/routePaths';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-16">
      <EmptyState
        icon={CompassIcon}
        title="Sayfa bulunamadı"
        description="Aradığın sayfa taşınmış veya hiç var olmamış olabilir."
        action={
          <Button render={<Link to={ROUTE_PATHS.home} />} size="sm">
            Ana Sayfaya Dön
          </Button>
        }
      />
    </div>
  );
}
