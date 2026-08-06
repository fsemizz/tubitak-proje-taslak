import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ROUTE_PATHS } from '@/app/routePaths';
import { useTeacherStore } from '@/stores/useTeacherStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: ROUTE_PATHS.teacherDashboard, label: 'Panel', icon: LayoutDashboard },
  { to: ROUTE_PATHS.teacherHistory, label: 'Oyun Geçmişi', icon: BarChart3 },
];

export function TeacherLayout() {
  const session = useTeacherStore((s) => s.session);
  const logout = useTeacherStore((s) => s.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTE_PATHS.home);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background sm:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-slate-800 bg-slate-900 px-4 py-5 text-white sm:w-56 sm:border-b-0 sm:border-r sm:py-6">
        <Link to={ROUTE_PATHS.home} className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <Sparkles className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold text-white">{APP_NAME}</span>
        </Link>

        <nav className="flex gap-1 sm:flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden flex-col gap-2 sm:flex">
          <p className="truncate text-xs font-medium text-slate-400">{session?.displayName}</p>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="size-4" /> Çıkış Yap
          </Button>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
