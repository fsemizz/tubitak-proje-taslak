import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ExitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ExitConfirmDialog({ open, onOpenChange, onConfirm }: ExitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Oyundan çıkmak istiyor musun?</DialogTitle>
          <DialogDescription>Bu oyundaki ilerlemen kaydedilmeyecek.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Devam Et
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Evet, Çık
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
