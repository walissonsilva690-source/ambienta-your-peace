import { Heart, Play } from "lucide-react";
import { SceneItem } from "@/data/sceneCatalog";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
  scene: SceneItem;
  onPlay: (scene: SceneItem) => void;
}

export const SceneCard = ({ scene, onPlay }: Props) => {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(scene.id);

  return (
    <div className="group relative isolate overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:scale-[1.04] focus-within:scale-[1.04] hover:shadow-glow focus-within:shadow-glow">
      <button
        onClick={() => onPlay(scene)}
        aria-label={`Reproduzir ${scene.name}`}
        className="relative block aspect-video w-full overflow-hidden text-left"
      >
        <img
          src={scene.src}
          alt={scene.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Play badge */}
        <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-glow-soft transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
          <Play className="h-5 w-5 fill-current" />
        </span>

        <div className="absolute bottom-3 left-16 right-3">
          <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">{scene.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{scene.ambient}</p>
        </div>
      </button>

      {/* Favorite toggle (separate, so focus/click doesn't trigger play) */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(scene.id); }}
        aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={fav}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-foreground backdrop-blur transition-all duration-200 hover:bg-black/70 hover:scale-110"
      >
        <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-primary text-primary" : "text-foreground/80"}`} />
      </button>
    </div>
  );
};
