import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { radioBrowser } from "@/lib/radioBrowser";
import { fetchIcyMetadata } from "@/lib/icyMetadata";

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

interface PlayOpts extends NowPlayingMeta {
  /** Primary stream URL */
  streamUrl: string;
  /** Optional explicit fallback URLs (tried in order) */
  fallback?: string[];
  /** Optional Radio Browser tag for emergency rescue when all URLs fail */
  rescueTag?: string;
}

interface AudioPlayerValue {
  status: Status;
  meta: NowPlayingMeta | null;
  volume: number; // 0..1
  isPlaying: boolean;
  /** URL currently being played (after fallback resolution) */
  currentUrl: string | null;
  /** Start (or switch to) a continuous stream with crossfade + fallback. */
  play: (opts: PlayOpts) => void;
  /** Pause the stream but keep meta (so controls remain visible). */
  pause: () => void;
  /** Stop and clear meta — controls disappear. */
  stop: () => void;
  toggle: () => void;
  setVolume: (v: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerValue | undefined>(undefined);

const FADE_MS = 600;
const STREAM_TIMEOUT_MS = 10_000;
const STORAGE_KEY = "ambienta:player-volume";

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  /** Increments on every new play() call so stale async work can self-cancel. */
  const playTokenRef = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [meta, setMeta] = useState<NowPlayingMeta | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    const v = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(v) && v > 0 && v <= 1 ? v : 0.7;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(volume));
  }, [volume]);

  const cancelFade = () => {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  };

  const fadeTo = useCallback(
    (audio: HTMLAudioElement, from: number, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        cancelFade();
        const start = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - start) / duration);
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
    [],
  );

  const ensureAudio = (): HTMLAudioElement => {
    if (!audioRef.current) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.preload = "none";
      a.volume = 0;
      audioRef.current = a;
    }
    return audioRef.current;
  };

  /**
   * Try to start `url` on `audio`. Resolves true if "playing" event fires
   * within STREAM_TIMEOUT_MS, false otherwise. Self-cancels when token changes.
   */
  const tryStream = (
    audio: HTMLAudioElement,
    url: string,
    token: number,
  ): Promise<boolean> =>
    new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("error", onError);
        audio.removeEventListener("stalled", onError);
        window.clearTimeout(timer);
      };
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(ok);
      };
      const onPlaying = () => {
        if (token !== playTokenRef.current) return finish(false);
        finish(true);
      };
      const onError = () => finish(false);
      const timer = window.setTimeout(() => finish(false), STREAM_TIMEOUT_MS);

      audio.addEventListener("playing", onPlaying, { once: true });
      audio.addEventListener("error", onError, { once: true });

      try {
        audio.src = url;
        audio.load();
        audio.play().catch(() => finish(false));
      } catch {
        finish(false);
      }
    });

  const play: AudioPlayerValue["play"] = useCallback(
    async ({ streamUrl, fallback = [], rescueTag, ...nextMeta }) => {
      const token = ++playTokenRef.current;
      const audio = ensureAudio();
      const targetVol = volume;

      // Crossfade out current stream (if any)
      if (audio.src && !audio.paused) {
        await fadeTo(audio, audio.volume, 0, FADE_MS);
        audio.pause();
      }
      if (token !== playTokenRef.current) return; // superseded

      setStatus("loading");
      // Reset track/artist — they belong to the previous stream
      setMeta({ ...nextMeta, track: undefined, artist: undefined });
      audio.volume = 0;

      // Build candidate list: primary → explicit fallbacks → rescue (Radio Browser)
      const candidates = [streamUrl, ...fallback];

      for (const url of candidates) {
        if (token !== playTokenRef.current) return;
        const ok = await tryStream(audio, url, token);
        if (token !== playTokenRef.current) return;
        if (ok) {
          setCurrentUrl(url);
          setStatus("playing");
          await fadeTo(audio, 0, targetVol, FADE_MS);
          // wire up 'waiting'/'error' → mark loading/error for live UI
          audio.onwaiting = () => playTokenRef.current === token && setStatus("loading");
          audio.onplaying = () => playTokenRef.current === token && setStatus("playing");
          audio.onerror = () => playTokenRef.current === token && setStatus("error");
          return;
        }
      }

      // Rescue: ask Radio Browser for similar stations by tag
      if (rescueTag) {
        try {
          const stations = await radioBrowser.byTag(rescueTag, 5);
          if (token !== playTokenRef.current) return;
          for (const s of stations) {
            const url = s.url_resolved || s.url;
            if (!url) continue;
            const ok = await tryStream(audio, url, token);
            if (token !== playTokenRef.current) return;
            if (ok) {
              setCurrentUrl(url);
              setStatus("playing");
              setMeta({ ...nextMeta, description: `via ${s.name}` });
              await fadeTo(audio, 0, targetVol, FADE_MS);
              return;
            }
          }
        } catch (err) {
          console.warn("Radio Browser rescue failed", err);
        }
      }

      if (token === playTokenRef.current) setStatus("error");
    },
    [fadeTo, volume],
  );

  const stop = useCallback(async () => {
    playTokenRef.current++; // cancel any pending fallbacks
    const audio = audioRef.current;
    if (!audio) return;
    await fadeTo(audio, audio.volume, 0, FADE_MS);
    audio.pause();
    setStatus("idle");
    setCurrentUrl(null);
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

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    const audio = audioRef.current;
    if (audio && !audio.paused) audio.volume = clamped;
  }, []);

  // ICY metadata polling — read StreamTitle from the live stream via edge proxy.
  // Only runs while we have a currentUrl + status playing/loading. Updates meta
  // only when track/artist actually change to avoid re-render churn.
  useEffect(() => {
    if (!currentUrl) return;
    if (status !== "playing" && status !== "loading") return;

    const ctrl = new AbortController();
    let cancelled = false;

    const tick = async () => {
      const data = await fetchIcyMetadata(currentUrl, ctrl.signal);
      if (cancelled) return;
      const nextTrack = data?.title?.trim() || undefined;
      const nextArtist = data?.artist?.trim() || undefined;
      setMeta((prev) => {
        if (!prev) return prev;
        if (prev.track === nextTrack && prev.artist === nextArtist) return prev;
        return { ...prev, track: nextTrack, artist: nextArtist };
      });
    };

    // Initial read after a short delay (let the stream connect first)
    const initial = window.setTimeout(tick, 1500);
    const interval = window.setInterval(tick, 25_000);

    return () => {
      cancelled = true;
      ctrl.abort();
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [currentUrl, status]);

  // MediaSession — remote control / Android TV media keys
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (meta) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: meta.track || meta.channelName,
        artist: meta.artist || meta.description || "Ambienta",
        album: "Ambienta",
      });
    }
    navigator.mediaSession.setActionHandler?.("play", () => toggle());
    navigator.mediaSession.setActionHandler?.("pause", () => toggle());
    navigator.mediaSession.setActionHandler?.("stop", () => stop());
  }, [meta, toggle, stop]);

  useEffect(
    () => () => {
      cancelFade();
      audioRef.current?.pause();
    },
    [],
  );

  const value: AudioPlayerValue = {
    status,
    meta,
    volume,
    isPlaying: status === "playing" || status === "loading",
    currentUrl,
    play,
    stop,
    toggle,
    setVolume,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
};

/** Safe fallback so a missing provider never crashes the UI tree. */
const FALLBACK: AudioPlayerValue = {
  status: "idle",
  meta: null,
  volume: 0.7,
  isPlaying: false,
  currentUrl: null,
  play: () => {},
  stop: () => {},
  toggle: () => {},
  setVolume: () => {},
};

export const useAudioPlayer = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    if (import.meta.env.DEV) {
      console.warn("useAudioPlayer used outside AudioPlayerProvider — using inert fallback");
    }
    return FALLBACK;
  }
  return ctx;
};
