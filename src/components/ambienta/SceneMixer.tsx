import { useEffect, useRef, useState } from "react";
import { CloudRain, Flame, Trees, Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type Layer = {
  id: string;
  name: string;
  icon: typeof CloudRain;
  /** Loopable ambient sound URL. Replace with your own assets when available. */
  src: string;
};

const LAYERS: Layer[] = [
  {
    id: "rain",
    name: "Chuva",
    icon: CloudRain,
    src: "https://cdn.pixabay.com/audio/2022/10/30/audio_347111d654.mp3",
  },
  {
    id: "fire",
    name: "Lareira",
    icon: Flame,
    src: "https://cdn.pixabay.com/audio/2022/03/15/audio_4842b80133.mp3",
  },
  {
    id: "forest",
    name: "Floresta",
    icon: Trees,
    src: "https://cdn.pixabay.com/audio/2022/02/15/audio_db49a2db5b.mp3",
  },
];

type LayerState = { playing: boolean; volume: number };

/**
 * Scene Mixer — mix up to 3 ambient layers with independent volumes.
 * Each layer has its own looping HTMLAudioElement.
 */
export const SceneMixer = () => {
  const audiosRef = useRef<Record<string, HTMLAudioElement>>({});
  const [state, setState] = useState<Record<string, LayerState>>(() =>
    Object.fromEntries(LAYERS.map((l) => [l.id, { playing: false, volume: 0.6 }])),
  );

  // Initialise audio elements once
  useEffect(() => {
    LAYERS.forEach((l) => {
      if (audiosRef.current[l.id]) return;
      const a = new Audio(l.src);
      a.loop = true;
      a.preload = "none";
      a.crossOrigin = "anonymous";
      a.volume = state[l.id].volume;
      audiosRef.current[l.id] = a;
    });
    return () => {
      Object.values(audiosRef.current).forEach((a) => {
        a.pause();
        a.src = "";
      });
      audiosRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    const a = audiosRef.current[id];
    if (!a) return;
    setState((prev) => {
      const next = { ...prev, [id]: { ...prev[id], playing: !prev[id].playing } };
      if (next[id].playing) {
        a.volume = next[id].volume;
        a.play().catch(() => {
          // Autoplay blocked — revert
          setState((p) => ({ ...p, [id]: { ...p[id], playing: false } }));
        });
      } else {
        a.pause();
      }
      return next;
    });
  };

  const setVolume = (id: string, v: number) => {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], volume: v } }));
    const a = audiosRef.current[id];
    if (a) a.volume = v;
  };

  return (
    <section
      aria-label="Mixer de cenas"
      className="glass mx-auto w-full max-w-3xl rounded-2xl border border-border p-5 shadow-card"
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Mixer de ambiente</h2>
        <span className="text-xs text-muted-foreground">Combine até 3 sons</span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {LAYERS.map((l) => {
          const s = state[l.id];
          const Icon = l.icon;
          return (
            <div
              key={l.id}
              className={`rounded-xl border p-4 transition-colors ${
                s.playing
                  ? "border-primary/60 bg-primary/5"
                  : "border-border bg-card/40"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${s.playing ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{l.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(l.id)}
                  aria-label={s.playing ? `Pausar ${l.name}` : `Tocar ${l.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {s.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>

              <Slider
                value={[Math.round(s.volume * 100)]}
                onValueChange={([v]) => setVolume(l.id, v / 100)}
                max={100}
                step={1}
                aria-label={`Volume ${l.name}`}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>{Math.round(s.volume * 100)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
