import album from "@/assets/album-jazz.jpg";
import { Music } from "lucide-react";

export const NowPlaying = () => {
  return (
    <div className="glass pointer-events-auto w-[320px] rounded-2xl p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Music className="h-4 w-4" />
        <span className="text-xs font-semibold tracking-wide">Now Playing</span>
      </div>
      <div className="flex items-center gap-3">
        <img
          src={album}
          alt="Capa do álbum"
          width={64}
          height={64}
          loading="lazy"
          className="h-16 w-16 rounded-xl object-cover ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">Come Away With Me</h3>
          <p className="truncate text-xs text-muted-foreground">Norah Jones</p>
          <div className="mt-2 flex items-end gap-[3px] h-5">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className="eq-bar w-[3px] rounded-sm bg-primary"
                style={{
                  height: `${30 + ((i * 13) % 70)}%`,
                  animationDelay: `${(i % 6) * 0.12}s`,
                  animationDuration: `${0.7 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
