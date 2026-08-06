import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ROUTE_PATHS } from '@/app/routePaths';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={ROUTE_PATHS.home} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold text-foreground">{APP_NAME}</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          render={<Link to={ROUTE_PATHS.teacherLogin} />}
        >
          <GraduationCap className="size-4" />
          Öğretmen Girişi
        </Button>
      </div>
    </header>
  );
}
