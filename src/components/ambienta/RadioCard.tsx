import { Heart, Play, Pause, Loader2, Radio as RadioIcon } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import { LiveRadio } from "@/lib/radioBrowser";

interface Props {
  radio: LiveRadio;
}

export const RadioCard = ({ radio }: Props) => {
  const { isFavorite, toggle } = useFavorites();
  const { meta, status } = useAudioPlayer();
  const { open } = useRadioPlayer();
  const [imgError, setImgError] = useState(false);

  const fav = isFavorite(`radio:${radio.id}`);
  const isCurrent = meta?.channelId === radio.id;
  const isLoading = isCurrent && status === "loading";
  const isPlaying = isCurrent && status === "playing";

  const handlePlay = () => open(radio);

  const short = radio.name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase() || "FM";

  return (
    <div className="group relative isolate w-full">
      <button
        onClick={handlePlay}
        aria-label={`Ouvir ${radio.name}`}
        aria-pressed={isPlaying}
        className={`block w-full overflow-hidden rounded-2xl border bg-card/40 text-left shadow-card backdrop-blur transition-all duration-300 hover:scale-[1.04] hover:shadow-glow focus-visible:scale-[1.04] focus-visible:shadow-glow ${
          isCurrent ? "border-primary ring-2 ring-primary/60" : "border-white/10"
        }`}
      >
        {/* Logo plate — bright background to make station logos pop */}
        <div className="relative grid aspect-[16/9] place-items-center overflow-hidden bg-white">
          {radio.favicon && !imgError ? (
            <img
              src={radio.favicon}
              alt={`Logo ${radio.name}`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="max-h-[70%] max-w-[75%] object-contain"
            />
          ) : (
            <span className="font-display text-3xl font-extrabold tracking-tight text-foreground/80 sm:text-4xl">
              {short}
            </span>
          )}
          {radio.bitrate > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
              {radio.bitrate} kbps
            </span>
          )}
        </div>

        {/* Footer: name + location + play */}
        <div className="flex items-center justify-between gap-2 bg-card/70 p-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{radio.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{radio.location}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow-soft transition-transform duration-200 group-hover:scale-110">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
          </span>
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle(`radio:${radio.id}`);
        }}
        aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={fav}
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-black/70"
      >
        <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-primary text-primary" : "text-white/80"}`} />
      </button>
    </div>
  );
};

export const RadioCardSkeleton = () => (
  <div className="w-full animate-pulse">
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/40 shadow-card">
      <div className="aspect-[16/9] bg-white/80" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-2/3 rounded bg-muted/60" />
        <div className="h-2.5 w-1/2 rounded bg-muted/40" />
      </div>
    </div>
  </div>
);

export const RadioEmpty = ({ message }: { message: string }) => (
  <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
    <RadioIcon className="h-10 w-10 opacity-50" aria-hidden />
    <p className="text-sm">{message}</p>
  </div>
);
