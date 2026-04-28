import { Heart, Play } from "lucide-react";
import { Radio } from "@/data/radios";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
  radio: Radio;
  onPlay: (r: Radio) => void;
}

export const RadioCard = ({ radio, onPlay }: Props) => {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(`radio:${radio.id}`);
  const [from, to] = radio.gradient;

  return (
    <div className="group relative isolate w-[180px] shrink-0 sm:w-[200px]">
      <button
        onClick={() => onPlay(radio)}
        aria-label={`Ouvir ${radio.name}`}
        className="block w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:scale-[1.05] focus-visible:scale-[1.05] hover:shadow-glow focus-visible:shadow-glow"
      >
        {/* Fake logo tile */}
        <div
          className="relative grid aspect-[5/3] place-items-center overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, hsl(${from}) 0%, hsl(${to}) 100%)` }}
        >
          <span className="font-display text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl">
            {radio.short}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Info row */}
        <div className="flex items-center justify-between gap-2 p-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{radio.name}</h3>
            <p className="truncate text-xs text-muted-foreground">{radio.location}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow-soft transition-transform duration-200 group-hover:scale-110">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
      </button>

      {/* Favorite */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(`radio:${radio.id}`); }}
        aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={fav}
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-foreground backdrop-blur transition-all duration-200 hover:bg-black/70 hover:scale-110"
      >
        <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-primary text-primary" : "text-foreground/80"}`} />
      </button>
    </div>
  );
};
