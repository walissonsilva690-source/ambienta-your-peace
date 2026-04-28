import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import jazzHero from "@/assets/channel-jazz-hero.jpg";
import { featuredChannel } from "@/data/channels";

interface Props {
  onPlay: () => void;
}

export const ChannelHero = ({ onPlay }: Props) => {
  return (
    <article className="relative isolate mb-10 overflow-hidden rounded-3xl border border-border shadow-card">
      <img
        src={jazzHero}
        alt={featuredChannel.name}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

      <div className="relative z-10 flex min-h-[260px] flex-col justify-center gap-3 p-6 sm:min-h-[320px] sm:p-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Em destaque · 24h
        </span>
        <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl">
          {featuredChannel.name}
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          {featuredChannel.description}
        </p>
        <div className="mt-2">
          <Button
            size="lg"
            onClick={onPlay}
            className="h-12 rounded-xl bg-gradient-primary px-6 text-base font-semibold text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            Ouvir agora
          </Button>
        </div>
      </div>
    </article>
  );
};
