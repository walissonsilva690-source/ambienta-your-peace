import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

export type NowPlayingMeta = {
  channelId: string;
  channelName: string;
  description?: string;
  /** Track title parsed from stream metadata, when available. */
  track?: string;
  /** Artist parsed from stream metadata, when available. */
  artist?: string;
};

type Status = "idle" | "loading" | "playing" | "error";

interface AudioPlayerValue {
  status: Status;
  meta: NowPlayingMeta | null;
  volume: number; // 0..1
  isPlaying: boolean;
  /** Start (or switch to) a continuous stream with crossfade. */
  play: (opts: { streamUrl: string } & NowPlayingMeta) => void;
  stop: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerValue | undefined>(undefined);

const FADE_MS = 600;
const STORAGE_KEY = "ambienta:player-volume";

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [meta, setMeta] = useState<NowPlayingMeta | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    const v = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(v) && v > 0 && v <= 1 ? v : 0.7;
  });

  // Persist volume
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(volume));
  }, [volume]);

  // Cancel any ongoing fade animation
  const cancelFade = () => {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  };

  // Animate audio.volume from `from` to `to` over `duration` ms
  const fadeTo = useCallback(
    (audio: HTMLAudioElement, from: number, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        cancelFade();
        const start = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - start) / duration);
          // ease-in-out
          const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased));
          if (k < 1) {
            fadeRafRef.current = requestAnimationFrame(step);
          } else {
            fadeRafRef.current = null;
            resolve();
          }
        };
        fadeRafRef.current = requestAnimationFrame(step);
      }),
    []
  );

  const ensureAudio = (): HTMLAudioElement => {
    if (!audioRef.current) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.preload = "none";
      a.volume = 0;
      a.addEventListener("playing", () => setStatus("playing"));
      a.addEventListener("waiting", () => setStatus("loading"));
      a.addEventListener("error", () => setStatus("error"));
      audioRef.current = a;
    }
    return audioRef.current;
  };

  const play: AudioPlayerValue["play"] = useCallback(
    async ({ streamUrl, ...nextMeta }) => {
      const audio = ensureAudio();
      const targetVol = volume;

      // If switching to a different stream, fade out current first.
      const switching = audio.src && !audio.paused;
      if (switching) {
        await fadeTo(audio, audio.volume, 0, FADE_MS);
        audio.pause();
      }

      setStatus("loading");
      setMeta(nextMeta);
      audio.src = streamUrl;
      audio.volume = 0;

      try {
        await audio.play();
        await fadeTo(audio, 0, targetVol, FADE_MS);
      } catch (err) {
        console.warn("Audio play failed", err);
        setStatus("error");
      }
    },
    [fadeTo, volume]
  );

  const stop = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await fadeTo(audio, audio.volume, 0, FADE_MS);
    audio.pause();
    setStatus("idle");
  }, [fadeTo]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) {
      audio.volume = 0;
      audio.play().then(() => fadeTo(audio, 0, volume, FADE_MS)).catch(() => setStatus("error"));
    } else {
      stop();
    }
  }, [fadeTo, stop, volume]);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      setVolumeState(clamped);
      const audio = audioRef.current;
      if (audio && !audio.paused) audio.volume = clamped;
    },
    []
  );

  // Cleanup on unmount (provider lives at app root, so effectively never)
  useEffect(() => () => {
    cancelFade();
    audioRef.current?.pause();
  }, []);

  const value: AudioPlayerValue = {
    status,
    meta,
    volume,
    isPlaying: status === "playing" || status === "loading",
    play,
    stop,
    toggle,
    setVolume,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
};
