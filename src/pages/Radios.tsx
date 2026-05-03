import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { RadioCard, RadioCardSkeleton, RadioEmpty } from "@/components/ambienta/RadioCard";
import { AdCorners } from "@/components/ambienta/AdCorners";
import { LiveRadio, radioBrowser, toLiveRadio } from "@/lib/radioBrowser";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "@/hooks/use-toast";

type FilterId =
  | "mundo"
  | "brasil"
  | "rock"
  | "eletronica"
  | "relax"
  | "noticias"
  | "favoritos";

type Filter = { id: FilterId; label: string; emoji: string };

const FILTERS: Filter[] = [
  { id: "mundo",      label: "Mundo",       emoji: "🌎" },
  { id: "brasil",     label: "Brasil",      emoji: "🇧🇷" },
  { id: "rock",       label: "Rock",        emoji: "🎸" },
  { id: "eletronica", label: "Eletrônica",  emoji: "🎧" },
  { id: "relax",      label: "Relax",       emoji: "🧘" },
  { id: "noticias",   label: "Notícias",    emoji: "📰" },
  { id: "favoritos",  label: "Favoritos",   emoji: "❤️" },
];

const FILTER_TAG: Partial<Record<FilterId, string>> = {
  rock: "rock",
  eletronica: "electronic",
  noticias: "news",
  relax: "ambient",
};

const FAV_KEY = "ambienta:radios-cache";

type Section = { id: string; title: string; emoji: string; items: LiveRadio[] };

const dedupe = (list: LiveRadio[]) => {
  const seen = new Set<string>();
  return list.filter((r) => (seen.has(r.url) ? false : (seen.add(r.url), true)));
};

const Radios = () => {
  const [filter, setFilter] = useState<FilterId>("mundo");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [searchItems, setSearchItems] = useState<LiveRadio[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const cacheRef = useRef<Map<string, LiveRadio>>(new Map());

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  // Fetch effect — supports search OR category browsing (with multi-row layout when on "mundo")
  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Active search overrides everything
        if (debounced.length >= 2) {
          const stations = await radioBrowser.byName(debounced, 40, ctrl.signal);
          const list = dedupe(stations.map(toLiveRadio).filter((r) => !!r.url));
          list.forEach((r) => cacheRef.current.set(r.id, r));
          setSearchItems(list);
          setSections([]);
          return;
        }
        setSearchItems(null);

        // 2) Favorites tab — local cache only
        if (filter === "favoritos") {
          try {
            const cached = JSON.parse(localStorage.getItem(FAV_KEY) || "[]") as LiveRadio[];
            cached.forEach((r) => cacheRef.current.set(r.id, r));
          } catch { /* ignore */ }
          const favIds = [...favorites].filter((k) => k.startsWith("radio:")).map((k) => k.slice(6));
          const list = favIds
            .map((id) => cacheRef.current.get(id))
            .filter(Boolean) as LiveRadio[];
          setSections([{ id: "favoritos", title: "Favoritos", emoji: "❤️", items: list }]);
          return;
        }

        // 3) "Mundo" tab → mosaic of multiple rows (like the reference)
        if (filter === "mundo") {
          const [destaque, brasil, mundo] = await Promise.all([
            radioBrowser.topVote(10, ctrl.signal).catch(() => []),
            radioBrowser.byCountry("Brazil", 10, ctrl.signal).catch(() => []),
            radioBrowser.topClick(10, ctrl.signal).catch(() => []),
          ]);
          const rows: Section[] = [
            { id: "destaque", title: "Em destaque", emoji: "🔥", items: dedupe(destaque.map(toLiveRadio).filter((r) => !!r.url)) },
            { id: "brasil",   title: "Brasil",      emoji: "🇧🇷", items: dedupe(brasil.map(toLiveRadio).filter((r) => !!r.url)) },
            { id: "mundo",    title: "Mundo",       emoji: "🌎", items: dedupe(mundo.map(toLiveRadio).filter((r) => !!r.url)) },
          ];
          rows.forEach((row) => row.items.forEach((r) => cacheRef.current.set(r.id, r)));
          setSections(rows);
        } else {
          // 4) Single category tab
          let stations;
          if (filter === "brasil") {
            stations = await radioBrowser.byCountry("Brazil", 30, ctrl.signal);
          } else {
            const tag = FILTER_TAG[filter] || filter;
            stations = await radioBrowser.byTag(tag, 30, ctrl.signal);
          }
          const list = dedupe(stations.map(toLiveRadio).filter((r) => !!r.url));
          list.forEach((r) => cacheRef.current.set(r.id, r));
          const f = FILTERS.find((x) => x.id === filter)!;
          setSections([{ id: f.id, title: f.label, emoji: f.emoji, items: list }]);
        }

        // Persist a small cache so favorites tab can render without network
        try {
          const all = [...cacheRef.current.values()].slice(-200);
          localStorage.setItem(FAV_KEY, JSON.stringify(all));
        } catch { /* ignore */ }
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

  const showSearch = !!searchItems;
  const searchHeading = useMemo(
    () => (debounced ? `Resultados para "${debounced}"` : ""),
    [debounced],
  );

  return (
    <>
      <SceneBackground />
      <AdCorners />
      <AppShell>
        <header className="mb-6">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Rádios ao vivo
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Seleção das melhores rádios do mundo
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

        {/* Filters — pill style like reference */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Categorias de rádios">
          {FILTERS.map((f) => {
            const active = filter === f.id && !debounced;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => { setFilter(f.id); setQuery(""); }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
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

        {/* Search results */}
        {showSearch && (
          <>
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground sm:text-2xl">
              {searchHeading}
            </h2>
            <section
              aria-label="Resultados da busca"
              aria-busy={loading}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {loading
                ? Array.from({ length: 10 }).map((_, i) => <RadioCardSkeleton key={i} />)
                : searchItems!.length > 0
                ? searchItems!.map((r) => <RadioCard key={r.id} radio={r} />)
                : <RadioEmpty message={error ?? "Nenhuma rádio encontrada."} />}
            </section>
          </>
        )}

        {/* Category rows (multi-row when "Mundo", single row otherwise) */}
        {!showSearch && sections.map((sec) => (
          <section key={sec.id} aria-label={sec.title} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
              <span aria-hidden>{sec.emoji}</span>
              {sec.title}
            </h2>

            <div className="relative">
              <div
                aria-busy={loading}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <RadioCardSkeleton key={i} />)
                  : sec.items.length > 0
                  ? sec.items.slice(0, 10).map((r) => <RadioCard key={r.id} radio={r} />)
                  : (
                    <RadioEmpty
                      message={
                        error
                          ? error
                          : sec.id === "favoritos"
                          ? "Você ainda não tem rádios favoritas. Toque no ❤️ em qualquer rádio."
                          : "Nenhuma rádio encontrada."
                      }
                    />
                  )}
              </div>

              {!loading && sec.items.length > 5 && (
                <button
                  type="button"
                  aria-label={`Ver mais em ${sec.title}`}
                  className="absolute -right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:scale-110 hover:bg-black/80 lg:flex"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </section>
        ))}
      </AppShell>
    </>
  );
};

export default Radios;
