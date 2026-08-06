import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TEACHER_DEMO_PASSCODE } from '@/lib/constants';

interface TeacherLoginFormProps {
  onSubmit: (displayName: string, passcode: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function TeacherLoginForm({ onSubmit, isLoading, error }: TeacherLoginFormProps) {
  const [displayName, setDisplayName] = useState('');
  const [passcode, setPasscode] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(displayName, passcode);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Ad Soyad</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Örn. Ayşe Öğretmen"
          autoFocus
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="passcode">Şifre</Label>
        <Input
          id="passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Demo şifre"
          required
        />
        <p className="text-xs text-muted-foreground">Demo şifre: {TEACHER_DEMO_PASSCODE}</p>
      </div>

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      <Button type="submit" size="lg" className="mt-2" disabled={isLoading}>
        <LogIn className="size-4" /> Giriş Yap
      </Button>
    </form>
  );
}
