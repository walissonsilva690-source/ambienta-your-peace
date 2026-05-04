import { useState } from "react";
import {
  Heart,
  Loader2,
  Pause,
  Play,
  Radio as RadioIcon,
  Share2,
  Square,
  X,
  ShieldCheck,
  Sparkles,
  Headphones,
  Star,
} from "lucide-react";
import { useRadioPlayer } from "@/contexts/RadioPlayerContext";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "@/hooks/use-toast";

const fmt = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

const splitTags = (tags: string[]) =>
  tags
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4);

/* ---------------------------------------------------------------
   Mini-player de PREVIEW (15s) — Free
--------------------------------------------------------------- */
const PreviewMini = () => {
  const { radio, previewLeft, open } = useRadioPlayer();
  const { status } = useAudioPlayer();
  if (!radio) return null;

  const tags = splitTags(radio.tags);

  return (
    <div className="pointer-events-auto fixed bottom-24 left-1/2 z-[80] w-[min(92vw,420px)] -translate-x-1/2">
      <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-black/85 p-3 shadow-2xl backdrop-blur-xl">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
          {radio.favicon ? (
            <img
              src={radio.favicon}
              alt={radio.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          ) : (
            <RadioIcon className="h-6 w-6 text-black/70" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/90">
            Now Playing
            {status === "loading" && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
          </p>
          <h3 className="truncate text-sm font-semibold text-white">{radio.name}</h3>
          {tags.length > 0 && (
            <p className="truncate text-[11px] text-white/60">{tags.join(" • ")}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {previewLeft}s restantes
          </span>
          <button
            onClick={() => open(radio)}
            className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   Player COMPLETO (modal) — Etapa 2
--------------------------------------------------------------- */
const FullPlayer = () => {
  const { radio, closeFull, sleepLeft, setSleep, isPremium } = useRadioPlayer();
  const { status, toggle, stop, meta } = useAudioPlayer();
  const { isFavorite, toggle: toggleFav } = useFavorites();
  const [imgErr, setImgErr] = useState(false);

  if (!radio) return null;

  const tags = splitTags(radio.tags);
  const fav = isFavorite(`radio:${radio.id}`);
  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const sleepOptions = isPremium
    ? [15, 30, 60, 120, 240]
    : [15, 30, 60, 120];

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: radio.name, text: radio.name, url });
      } else {
        await navigator.clipboard?.writeText(`${radio.name} — ${url}`);
        toast({ title: "Link copiado", description: radio.name });
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-stretch justify-center overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative my-6 w-full max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl sm:p-8">
        {/* Close */}
        <button
          onClick={closeFull}
          aria-label="Fechar player"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/80 hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand topo */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="font-display text-2xl font-bold tracking-[0.3em] text-white">
            AMBIENTA
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-widest text-white/70">
            {radio.name.split("•")[0].trim()} · Listener Supported · Commercial Free
          </span>
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-primary/80">
            Rádio ao vivo
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* COLUNA ESQUERDA */}
          <div>
            <div className="flex items-start gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">
                {radio.favicon && !imgErr ? (
                  <img
                    src={radio.favicon}
                    alt={radio.name}
                    onError={() => setImgErr(true)}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <RadioIcon className="h-8 w-8 text-black/70" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {radio.name.toUpperCase()}
                </h1>
                <p className="mt-2 text-sm text-white/70">
                  {radio.location} — Uma seleção fina de chillout, downtempo, trip hop e ambient beats.
                </p>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleFav(`radio:${radio.id}`)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                      fav
                        ? "bg-primary text-primary-foreground"
                        : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
                    {fav ? "Favorito" : "Favoritar"}
                  </button>
                  <button
                    onClick={share}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>

            {/* Now playing card */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 align-middle" />
                Transmitindo ao vivo
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                {radio.name}
              </h2>
              {meta?.track && (
                <p className="mt-1 text-sm text-white/70">
                  {meta.artist ? `${meta.artist} — ${meta.track}` : meta.track}
                </p>
              )}
              {tags.length > 0 && (
                <p className="mt-2 text-xs text-white/50">{tags.join(" • ")}</p>
              )}

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 animate-pulse bg-primary/70" />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={toggle}
                  className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current" />
                  )}
                </button>
                <button
                  onClick={() => stop()}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                  aria-label="Parar"
                >
                  <Square className="h-4 w-4 fill-current" />
                </button>
              </div>
            </div>

            {/* Premium benefits */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, t: "Sem anúncios", d: "Experiência 100% limpa" },
                { icon: Sparkles, t: "Qualidade Premium", d: "Áudio em alta fidelidade" },
                { icon: Headphones, t: "Canais exclusivos", d: "Mais rádios e conteúdos" },
                { icon: Star, t: "Suporte prioritário", d: "Atendimento premium" },
              ].map(({ icon: Icon, t, d }) => (
                <div
                  key={t}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t}</p>
                    <p className="text-xs text-white/60">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA — info + timer */}
          <aside className="space-y-3">
            {[
              { label: "Qualidade", value: "320 kbps" },
              { label: "Gênero", value: tags[0] || "Chillout" },
              { label: "Canais", value: "24h por dia" },
              {
                label: "Tempo restante",
                value: sleepLeft > 0 ? fmt(sleepLeft) : "00:00",
                accent: sleepLeft > 0,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                  {row.label}
                </p>
                <p
                  className={`mt-1 font-display text-xl font-bold tabular-nums ${
                    row.accent ? "text-primary" : "text-white"
                  }`}
                >
                  {row.value}
                </p>
              </div>
            ))}

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                Timer de desligamento
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sleepOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSleep(m)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-primary/60 hover:bg-primary/10 hover:text-white"
                  >
                    {m >= 60 ? `${m / 60}h` : `${m}min`}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   Root: escolhe o que renderizar
--------------------------------------------------------------- */
export const RadioPlayer = () => {
  const { stage } = useRadioPlayer();
  if (stage === "preview") return <PreviewMini />;
  if (stage === "full") return <FullPlayer />;
  return null;
};
