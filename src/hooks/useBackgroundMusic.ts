import { useCallback, useEffect, useRef } from 'react';
import { useUiStore } from '@/stores/useUiStore';

export const MENU_TRACK_ID = 'menu';

/** How long to wait after the game-start jingle before background music fades in (jingle ~340ms + 0.5s gap). */
export const GAME_START_MUSIC_DELAY_MS = 850;

// Real royalty-free 8-bit tracks (user-supplied, public/music/) — one per game plus one for the home menu.
// Each <audio> element loops natively once it reaches the end, so tracks shorter than a play session
// simply restart from the beginning.
const TRACK_FILE: Record<string, string> = {
  [MENU_TRACK_ID]: 'persona.mp3',
  'sequencing-game': 'punky-troll.mp3',
  'pattern-completion-game': 'trippy-trip-trop.mp3',
  'debug-hunt-game': 'searching-for-a-body.mp3',
  'loop-builder-game': 'big-helmet.mp3',
  'conditional-logic-game': 'the-search.mp3',
  'matching-game': 'a-green-pig.mp3',
  'okula-hazirlik': 'pix-space-travel.mp3',
  'flow-logic-game': 'the-most-powerful-chicken.mp3',
};

function trackUrl(file: string): string {
  return `${import.meta.env.BASE_URL}music/${file}`;
}

/** Looping background music, one real audio track per game (plus the home menu), gated by musicEnabled. */
export function useBackgroundMusic() {
  const musicEnabled = useUiStore((s) => s.musicEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingTimeoutRef = useRef<number | null>(null);
  const desiredTrackIdRef = useRef<string | null>(null);
  // True only while the user has deliberately muted via the music toggle — distinguishes that pause
  // from an unrequested one (OS/browser audio-focus interruptions, media-session hiccups, etc.) so the
  // self-heal listener below doesn't immediately undo the mute.
  const userMutedRef = useRef(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.35;
      audio.addEventListener('pause', () => {
        if (desiredTrackIdRef.current && !audio.ended && !userMutedRef.current) {
          void audio.play().catch(() => {});
        }
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const clearPending = useCallback(() => {
    if (pendingTimeoutRef.current !== null) {
      window.clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
  }, []);

  const playNow = useCallback(
    (trackId: string) => {
      const file = TRACK_FILE[trackId];
      if (!file) return;
      userMutedRef.current = false;
      const audio = getAudio();
      const url = trackUrl(file);
      if (!audio.src.endsWith(url)) {
        audio.src = url;
      }
      void audio.play().catch(() => {
        // Autoplay can be blocked before the user has interacted with the page yet — harmless, the
        // next start()/toggle will retry once a gesture has unlocked audio.
      });
    },
    [getAudio],
  );

  const start = useCallback(
    (trackId: string, delayMs = 0) => {
      desiredTrackIdRef.current = trackId;
      clearPending();
      if (!musicEnabled) return;
      if (delayMs > 0) {
        pendingTimeoutRef.current = window.setTimeout(() => playNow(trackId), delayMs);
      } else {
        playNow(trackId);
      }
    },
    [musicEnabled, clearPending, playNow],
  );

  const stop = useCallback(() => {
    desiredTrackIdRef.current = null;
    clearPending();
    audioRef.current?.pause();
  }, [clearPending]);

  // Toggling the global music switch pauses/resumes whichever track is currently active.
  useEffect(() => {
    if (!musicEnabled) {
      userMutedRef.current = true;
      clearPending();
      audioRef.current?.pause();
      return;
    }
    if (desiredTrackIdRef.current) {
      playNow(desiredTrackIdRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicEnabled]);

  useEffect(
    () => () => {
      clearPending();
      audioRef.current?.pause();
    },
    [clearPending],
  );

  // Browsers block audio.play() until the page has had at least one real user gesture — the very
  // first start() call (e.g. menu music firing on page load) is silently rejected. Once the user
  // taps/clicks/presses a key anywhere, retry whatever we were trying to play; harmless no-op if
  // it's already playing or nothing was requested.
  useEffect(() => {
    function retryAfterGesture() {
      if (desiredTrackIdRef.current && audioRef.current?.paused && !userMutedRef.current) {
        playNow(desiredTrackIdRef.current);
      }
    }
    window.addEventListener('pointerdown', retryAfterGesture);
    window.addEventListener('keydown', retryAfterGesture);
    return () => {
      window.removeEventListener('pointerdown', retryAfterGesture);
      window.removeEventListener('keydown', retryAfterGesture);
    };
  }, [playNow]);

  return { start, stop };
}
