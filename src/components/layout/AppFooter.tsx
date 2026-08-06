import { APP_NAME } from '@/lib/constants';

export function AppFooter() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {APP_NAME} — Okul öncesi ve ilkokul öğrencileri için bilgisayarsız kodlama platformu.
      </div>
    </footer>
  );
}
