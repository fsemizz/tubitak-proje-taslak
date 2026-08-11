import { useCallback, useRef } from 'react';

type ToneShape = 'sine' | 'triangle' | 'square';

interface ToneStep {
  freq: number;
  start: number;
  duration: number;
  gain?: number;
  shape?: ToneShape;
}

function getAudioContextClass(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

/** Small Web Audio synth for playful, dependency-free game SFX (no audio files to load/host). */
export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContextClass();
    }
    if (ctxRef.current.state === 'suspended') {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playTones = useCallback(
    (steps: ToneStep[]) => {
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      for (const step of steps) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = step.shape ?? 'sine';
        osc.frequency.value = step.freq;
        const peak = step.gain ?? 0.12;
        const t0 = now + step.start;
        const t1 = t0 + step.duration;
        gainNode.gain.setValueAtTime(0, t0);
        gainNode.gain.linearRampToValueAtTime(peak, t0 + Math.min(0.02, step.duration / 4));
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t1);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t1 + 0.02);
      }
    },
    [getCtx],
  );

  const playStep = useCallback(() => {
    playTones([{ freq: 420, start: 0, duration: 0.06, gain: 0.05, shape: 'triangle' }]);
  }, [playTones]);

  const playSuccessStep = useCallback(() => {
    playTones([
      { freq: 660, start: 0, duration: 0.1, gain: 0.1 },
      { freq: 880, start: 0.08, duration: 0.14, gain: 0.11 },
    ]);
  }, [playTones]);

  const playError = useCallback(() => {
    playTones([
      { freq: 220, start: 0, duration: 0.14, gain: 0.11, shape: 'square' },
      { freq: 160, start: 0.1, duration: 0.16, gain: 0.11, shape: 'square' },
    ]);
  }, [playTones]);

  const playLevelComplete = useCallback(() => {
    playTones([
      { freq: 523, start: 0, duration: 0.12, gain: 0.11 },
      { freq: 659, start: 0.1, duration: 0.12, gain: 0.11 },
      { freq: 784, start: 0.2, duration: 0.16, gain: 0.12 },
      { freq: 1046, start: 0.34, duration: 0.28, gain: 0.13 },
    ]);
  }, [playTones]);

  const playGameComplete = useCallback(() => {
    playTones([
      { freq: 523, start: 0, duration: 0.12, gain: 0.12 },
      { freq: 659, start: 0.12, duration: 0.12, gain: 0.12 },
      { freq: 784, start: 0.24, duration: 0.12, gain: 0.12 },
      { freq: 1046, start: 0.36, duration: 0.12, gain: 0.13 },
      { freq: 1318, start: 0.48, duration: 0.4, gain: 0.14 },
    ]);
  }, [playTones]);

  const playHint = useCallback(() => {
    playTones([{ freq: 500, start: 0, duration: 0.09, gain: 0.08, shape: 'triangle' }]);
  }, [playTones]);

  return { playStep, playSuccessStep, playError, playLevelComplete, playGameComplete, playHint };
}
