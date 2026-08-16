import { useEffect, useState } from 'react';

/** Increasing per-level stopwatch in seconds. Resets to 0 whenever resetKey changes (e.g. level id). */
export function useLevelTimer(resetKey: string | number) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setElapsedSeconds(0);
    const interval = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resetKey]);

  return elapsedSeconds;
}
