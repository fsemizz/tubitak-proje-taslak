import { Sparkles, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CATEGORY_THEME, getGameIcon } from '@/lib/constants';
import { CATEGORY_LABEL } from '@/types/common';
import { gameList } from '@/games/registry';
import { cn } from '@/lib/utils';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
}

export function OnboardingModal({ open, onOpenChange, onDismiss }: OnboardingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
            <Sparkles className="size-7" />
          </div>
          <DialogTitle className="text-center font-display text-xl font-extrabold text-foreground">
            CodeKids'e Hoş Geldin!
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed text-muted-foreground">
            Her oyun farklı bir düşünme becerisini geliştirir. Hangi oyunun hangi beceriyi çalıştırdığına
            göz at, sonra istediğinle başla!
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-80 grid-cols-2 gap-2.5 overflow-y-auto scrollbar-thin p-1 sm:grid-cols-3">
          {gameList.map((game) => {
            const theme = CATEGORY_THEME[game.category];
            const Icon = getGameIcon(game.icon);
            return (
              <div
                key={game.id}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center"
              >
                <span className={cn('flex size-9 items-center justify-center rounded-lg text-white', theme.solidBg)}>
                  <Icon className="size-4.5" />
                </span>
                <p className="text-xs font-bold text-foreground">{game.title}</p>
                <p className="text-[10px] font-medium text-muted-foreground">{CATEGORY_LABEL[game.category]}</p>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="size-4" /> Atla
          </Button>
          <Button onClick={onDismiss}>
            <Sparkles className="size-4" /> Harika, Başlayalım!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
