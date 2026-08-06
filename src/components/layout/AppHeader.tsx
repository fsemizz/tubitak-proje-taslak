import { Link } from 'react-router-dom';
import { GraduationCap, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ROUTE_PATHS } from '@/app/routePaths';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={ROUTE_PATHS.home} className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <Sparkles className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-extrabold text-white">{APP_NAME}</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:block">
              Bilgisayarsız Kodlama Platformu
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold sm:flex',
              isOnline
                ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                : 'border-amber-500/30 bg-amber-500/15 text-amber-300',
            )}
          >
            {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
            {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            render={<Link to={ROUTE_PATHS.teacherLogin} />}
            nativeButton={false}
          >
            <GraduationCap className="size-4" />
            Öğretmen Girişi
          </Button>
        </div>
      </div>
    </header>
  );
}
