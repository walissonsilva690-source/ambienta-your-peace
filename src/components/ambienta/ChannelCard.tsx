import { Play, Pause, Loader2 } from "lucide-react";
import { Channel } from "@/data/channels";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

interface Props {
  channel: Channel;
  /** Optional override; defaults to global player. */
  onPlay?: (c: Channel) => void;
}

export const ChannelCard = ({ channel, onPlay }: Props) => {
  const Icon = channel.icon;
  const [from, to] = channel.gradient;
  const { meta, status, play } = useAudioPlayer();

  const isCurrent = meta?.channelId === channel.id;
  const isLoading = isCurrent && status === "loading";
  const isPlaying = isCurrent && status === "playing";

  const handle = () => {
    if (onPlay) return onPlay(channel);
    play({
      streamUrl: channel.streamUrl,
      fallback: channel.fallback,
      rescueTag: channel.rescueTag,
      channelId: channel.id,
      channelName: channel.name,
      description: channel.description,
    });
  };

  return (
    <button
      onClick={handle}
      aria-label={`Ouvir ${channel.name}`}
      aria-pressed={isPlaying}
      className={`group relative isolate flex aspect-[4/3] w-full flex-col justify-end overflow-hidden rounded-2xl border text-left shadow-card transition-all duration-300 hover:scale-[1.05] focus-visible:scale-[1.05] hover:shadow-glow focus-visible:shadow-glow ${
        isCurrent ? "border-primary shadow-glow ring-2 ring-primary/60" : "border-border"
      }`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${from}) 0%, hsl(${to}) 100%)`,
      }}
    >
      {/* Themed cover image */}
      <img
        src={channel.image}
        alt=""
        loading="lazy"
        width={768}
        height={576}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Subtle icon watermark fallback */}
      <Icon
        className="absolute -right-4 -top-4 h-24 w-24 text-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        strokeWidth={1.2}
        aria-hidden
      />

      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Status badge */}
      <span
        className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-glow-soft transition-all duration-300 ${
          isCurrent
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Play className="h-5 w-5 fill-current" />
        )}
      </span>

      <div className="relative z-10 p-3 sm:p-4">
        <h3 className="text-sm font-semibold leading-tight text-white drop-shadow sm:text-base">{channel.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{channel.description}</p>
      </div>
    </button>
  );
};
