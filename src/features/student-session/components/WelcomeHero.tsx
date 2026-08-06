import { Rocket } from 'lucide-react';

export function WelcomeHero() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
        <Rocket className="size-8" />
      </span>
      <h1 className="font-display text-2xl font-extrabold text-foreground">Oyuna Başlamadan Önce</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Öğretmenin sonuçlarını görebilmesi için lütfen adını ve soyadını yaz.
      </p>
    </div>
  );
}
