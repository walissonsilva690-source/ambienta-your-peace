import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { RadioCard, RadioCardSkeleton, RadioEmpty } from "@/components/ambienta/RadioCard";
import { LiveRadio, radioBrowser, toLiveRadio } from "@/lib/radioBrowser";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "@/hooks/use-toast";

type FilterId =
  | "destaque"
  | "brasil"
  | "mundo"
  | "rock"
  | "jazz"
  | "eletronica"
  | "noticias"
  | "relax"
  | "favoritos";

type Filter = { id: FilterId; label: string; emoji: string };

const FILTERS: Filter[] = [
  { id: "destaque",   label: "Em destaque", emoji: "🔥" },
  { id: "brasil",     label: "Brasil",      emoji: "🇧🇷" },
  { id: "mundo",      label: "Mundo",       emoji: "🌎" },
  { id: "rock",       label: "Rock",        emoji: "🎸" },
  { id: "jazz",       label: "Jazz",        emoji: "🎷" },
  { id: "eletronica", label: "Eletrônica",  emoji: "🎧" },
  { id: "noticias",   label: "Notícias",    emoji: "📰" },
  { id: "relax",      label: "Relax",       emoji: "🧠" },
  { id: "favoritos",  label: "Favoritos",   emoji: "❤️" },
];

const FILTER_TAG: Partial<Record<FilterId, string>> = {
  rock: "rock",
  jazz: "jazz",
  eletronica: "electronic",
  noticias: "news",
  relax: "ambient",
};

const FAV_KEY = "ambienta:radios-cache";

const Radios = () => {
  const [filter, setFilter] = useState<FilterId>("destaque");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [items, setItems] = useState<LiveRadio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const cacheRef = useRef<Map<string, LiveRadio>>(new Map());

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  // Fetch effect
  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        let stations;
        if (debounced.length >= 2) {
          stations = await radioBrowser.byName(debounced, 30, ctrl.signal);
        } else if (filter === "destaque") {
          stations = await radioBrowser.topVote(60, ctrl.signal);
        } else if (filter === "brasil") {
          stations = await radioBrowser.byCountry("Brazil", 60, ctrl.signal);
        } else if (filter === "mundo") {
          stations = await radioBrowser.topClick(60, ctrl.signal);
        } else if (filter === "favoritos") {
          // Read from local cache to render favorites without a network roundtrip
          try {
            const cached = JSON.parse(localStorage.getItem(FAV_KEY) || "[]") as LiveRadio[];
            cached.forEach((r) => cacheRef.current.set(r.id, r));
          } catch { /* ignore */ }
          const favIds = [...favorites].filter((k) => k.startsWith("radio:")).map((k) => k.slice(6));
          const list = favIds
            .map((id) => cacheRef.current.get(id))
            .filter(Boolean) as LiveRadio[];
          setItems(list);
          setLoading(false);
          return;
        } else {
          const tag = FILTER_TAG[filter] || filter;
          stations = await radioBrowser.byTag(tag, 60, ctrl.signal);
        }
        const mapped = stations.map(toLiveRadio).filter((r) => !!r.url);
        // de-duplicate by URL
        const seen = new Set<string>();
        const unique = mapped.filter((r) => (seen.has(r.url) ? false : (seen.add(r.url), true)));
        unique.forEach((r) => cacheRef.current.set(r.id, r));
        // Persist a small cache so the favorites tab can render without network
        try {
          const all = [...cacheRef.current.values()].slice(-200);
          localStorage.setItem(FAV_KEY, JSON.stringify(all));
        } catch { /* ignore */ }
        setItems(unique);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        console.error(err);
        setError("Não foi possível carregar as rádios. Tente novamente.");
        toast({ title: "Falha ao carregar rádios", description: "Verifique a conexão." });
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => ctrl.abort();
  }, [filter, debounced, favorites]);

  const heading = useMemo(() => {
    if (debounced) return `Resultados para "${debounced}"`;
    return FILTERS.find((f) => f.id === filter)?.label ?? "Rádios";
  }, [filter, debounced]);

  return (
    <>
      <SceneBackground />
      <AppShell>
        <header className="mb-6">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Rádios ao vivo
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Milhares de rádios licenciadas, ao vivo · powered by Radio Browser
          </p>
        </header>

        {/* Search */}
        <div className="mb-4 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card/60 px-4 py-2 backdrop-blur focus-within:ring-2 focus-within:ring-primary">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome (BBC, NPR, Antena 1...)"
            aria-label="Buscar rádios"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorias de rádios">
          {FILTERS.map((f) => {
            const active = filter === f.id && !debounced;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => { setFilter(f.id); setQuery(""); }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium outline-none transition-all duration-200 ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-soft"
                    : "border border-border bg-card/60 text-muted-foreground backdrop-blur hover:bg-card hover:text-foreground"
                }`}
              >
                <span aria-hidden>{f.emoji}</span>
                {f.label}
              </button>
            );
          })}
        </div>

        <h2 className="mb-4 font-display text-xl font-semibold text-foreground sm:text-2xl">
          {heading}
        </h2>

        <section
          aria-label="Rádios"
          aria-busy={loading}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <RadioCardSkeleton key={i} />)
            : items.length > 0
            ? items.map((r) => <RadioCard key={r.id} radio={r} />)
            : (
              <RadioEmpty
                message={
                  error
                    ? error
                    : filter === "favoritos"
                    ? "Você ainda não tem rádios favoritas. Toque no ❤️ em qualquer rádio."
                    : "Nenhuma rádio encontrada."
                }
              />
            )}
        </section>
      </AppShell>
    </>
  );
};

export default Radios;
