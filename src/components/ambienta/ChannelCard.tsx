import { Play } from "lucide-react";
import { Channel } from "@/data/channels";

interface Props {
  channel: Channel;
  onPlay: (c: Channel) => void;
}

export const ChannelCard = ({ channel, onPlay }: Props) => {
  const Icon = channel.icon;
  const [from, to] = channel.gradient;

  return (
    <button
      onClick={() => onPlay(channel)}
      aria-label={`Ouvir ${channel.name}`}
      className="group relative isolate flex aspect-[4/3] w-full flex-col justify-end overflow-hidden rounded-2xl border border-border text-left shadow-card transition-all duration-300 hover:scale-[1.05] focus-visible:scale-[1.05] hover:shadow-glow focus-visible:shadow-glow"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${from}) 0%, hsl(${to}) 100%)`,
      }}
    >
      {/* Decorative big icon */}
      <Icon
        className="absolute -right-4 -top-4 h-32 w-32 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/20"
        strokeWidth={1.2}
        aria-hidden
      />
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Play badge — appears on hover/focus */}
      <span className="absolute right-3 top-3 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-primary/90 text-primary-foreground opacity-0 shadow-glow-soft transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <Play className="h-5 w-5 fill-current" />
      </span>

      <div className="relative z-10 p-4">
        <h3 className="text-sm font-semibold leading-tight text-white sm:text-base">{channel.name}</h3>
        <p className="mt-0.5 text-xs text-white/70 line-clamp-1">{channel.description}</p>
      </div>
    </button>
  );
};
