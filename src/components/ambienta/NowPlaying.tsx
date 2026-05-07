import album from "@/assets/album-jazz.jpg";
import { Music, Pause, Play, Loader2, AlertCircle } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

export const NowPlaying = () => {
  const { meta, status, isPlaying, toggle } = useAudioPlayer();

  // Idle state — show subtle placeholder
  if (!meta) {
    return (
      <div className="glass pointer-events-auto w-full rounded-2xl p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <Music className="h-4 w-4" />
          <span className="text-xs font-semibold tracking-wide">Now Playing</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Escolha um canal para começar a tocar.
        </p>
      </div>
    );
  }

  return (
    <div className="glass pointer-events-auto w-full rounded-2xl p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Music className="h-4 w-4" />
        <span className="text-xs font-semibold tracking-wide">Now Playing</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0">
          <img
            src={album}
            alt=""
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 rounded-xl object-cover ring-1 ring-border"
          />
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pausar" : "Tocar"}
            className="absolute inset-0 grid place-items-center rounded-xl bg-black/50 text-white opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary"
          >
            {status === "loading" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : status === "error" ? (
              <AlertCircle className="h-5 w-5 text-destructive-foreground" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {meta.track ?? meta.channelName}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {meta.artist ?? meta.description ?? "Stream contínuo · 24h"}
          </p>
          <div className="mt-2 flex h-5 items-end gap-[3px]">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className={`eq-bar w-[3px] rounded-sm bg-primary transition-opacity duration-300 ${
                  isPlaying ? "opacity-100" : "opacity-30"
                }`}
                style={{
                  height: `${30 + ((i * 13) % 70)}%`,
                  animationDelay: `${(i % 6) * 0.12}s`,
                  animationDuration: `${0.7 + (i % 4) * 0.2}s`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
