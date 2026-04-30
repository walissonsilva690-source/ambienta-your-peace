import { Loader2, Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

/**
 * Floating transport controls — appears when a stream is loaded.
 * Provides Play/Pause, Mute, Stop and a volume slider.
 * Designed to be touch-friendly and remote-control navigable.
 */
export const PlayerControls = () => {
  const { status, meta, isPlaying, toggle, stop, volume, setVolume } =
    useAudioPlayer();

  // Remember last non-zero volume so unmute restores it.
  const lastVolumeRef = useRef<number>(volume > 0 ? volume : 0.7);
  const [showVolume, setShowVolume] = useState(false);

  if (!meta) return null;

  const muted = volume === 0;

  const handleMute = () => {
    if (muted) {
      setVolume(lastVolumeRef.current || 0.7);
    } else {
      lastVolumeRef.current = volume;
      setVolume(0);
    }
  };

  const handleVolume = (v: number) => {
    if (v > 0) lastVolumeRef.current = v;
    setVolume(v);
  };

  const subtitle = meta.artist
    ? `${meta.artist} — ${meta.track ?? meta.channelName}`
    : meta.track ?? meta.description ?? "Stream contínuo · 24h";

  return (
    <div
      role="region"
      aria-label="Controles de reprodução"
      className="glass pointer-events-auto fixed bottom-24 left-1/2 z-40 flex w-[min(92vw,440px)] -translate-x-1/2 items-center gap-3 rounded-2xl px-3 py-2 shadow-card sm:bottom-28"
    >
      {/* Track info */}
      <div className="min-w-0 flex-1 px-1">
        <p className="truncate text-xs font-semibold text-foreground">
          ♪ {meta.channelName}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
      </div>

      {/* Volume (popover-style slider) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowVolume((s) => !s)}
          onBlur={(e) => {
            // Close if focus leaves the whole volume cluster
            if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
              setShowVolume(false);
            }
          }}
          aria-label="Volume"
          aria-expanded={showVolume}
          className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        {showVolume && (
          <div
            className="glass absolute bottom-full left-1/2 mb-2 flex h-32 -translate-x-1/2 flex-col items-center justify-center rounded-xl px-2 py-3 shadow-card"
            onMouseLeave={() => setShowVolume(false)}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => handleVolume(parseFloat(e.target.value))}
              aria-label="Ajustar volume"
              className="h-24 w-2 cursor-pointer accent-primary [writing-mode:vertical-lr] [direction:rtl]"
            />
          </div>
        )}
      </div>

      {/* Mute toggle */}
      <button
        type="button"
        onClick={handleMute}
        aria-label={muted ? "Ativar som" : "Silenciar"}
        aria-pressed={muted}
        className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {muted ? <VolumeX className="h-5 w-5 text-destructive" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* Play / Pause — primary */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pausar" : "Tocar"}
        className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
      >
        {status === "loading" ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Play className="h-5 w-5 fill-current translate-x-[1px]" />
        )}
      </button>

      {/* Stop */}
      <button
        type="button"
        onClick={stop}
        aria-label="Parar"
        className="grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-white/10 hover:text-destructive focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Square className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
};
