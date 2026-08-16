import { Music, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/stores/useUiStore';
import { cn } from '@/lib/utils';

interface SoundControlsProps {
  size?: 'sm' | 'default';
  /** Pass e.g. "text-white hover:bg-white/10 hover:text-white" when placed on a dark header. */
  buttonClassName?: string;
}

export function SoundControls({ size = 'sm', buttonClassName }: SoundControlsProps) {
  const musicEnabled = useUiStore((s) => s.musicEnabled);
  const sfxEnabled = useUiStore((s) => s.sfxEnabled);
  const toggleMusic = useUiStore((s) => s.toggleMusic);
  const toggleSfx = useUiStore((s) => s.toggleSfx);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size={size === 'sm' ? 'icon-sm' : 'icon'}
        onClick={toggleMusic}
        aria-label={musicEnabled ? 'Müziği kapat' : 'Müziği aç'}
        aria-pressed={musicEnabled}
        title={musicEnabled ? 'Müziği kapat' : 'Müziği aç'}
        className={cn(buttonClassName)}
      >
        <Music className={musicEnabled ? 'size-4' : 'size-4 opacity-40'} />
        <span className="sr-only">{musicEnabled ? 'Müzik açık' : 'Müzik kapalı'}</span>
      </Button>
      <Button
        variant="ghost"
        size={size === 'sm' ? 'icon-sm' : 'icon'}
        onClick={toggleSfx}
        aria-label={sfxEnabled ? 'Sesi kapat' : 'Sesi aç'}
        aria-pressed={sfxEnabled}
        title={sfxEnabled ? 'Sesi kapat' : 'Sesi aç'}
        className={cn(buttonClassName)}
      >
        {sfxEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4 opacity-40" />}
        <span className="sr-only">{sfxEnabled ? 'Ses açık' : 'Ses kapalı'}</span>
      </Button>
    </div>
  );
}
