import { useMemo, useState } from "react";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { RadioCard } from "@/components/ambienta/RadioCard";
import { HorizontalRow } from "@/components/ambienta/HorizontalRow";
import { radios, radioFilters, radioSections, Radio } from "@/data/radios";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "@/hooks/use-toast";

const Radios = () => {
  const [filter, setFilter] = useState<string>("mundo");
  const { favorites } = useFavorites();

  const handlePlay = (r: Radio) => {
    toast({ title: `Tocando: ${r.name}`, description: r.location });
  };

  // Filter view: when user picks a chip, show flat grid; default "mundo" → sections
  const filtered = useMemo(() => {
    if (filter === "mundo") return null; // sections mode
    if (filter === "favoritos") {
      return radios.filter((r) => favorites.has(`radio:${r.id}`));
    }
    return radios.filter((r) => r.categories.includes(filter as Radio["categories"][number]));
  }, [filter, favorites]);

  return (
    <>
      <SceneBackground />
      <AppShell>
        <header className="mb-6">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Rádios ao vivo
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Seleção das melhores rádios do mundo.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist">
          {radioFilters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
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

        {/* Sections (default) */}
        {filtered === null ? (
          <div className="space-y-10">
            {radioSections.map((sec) => {
              const list = radios.filter(sec.filter);
              if (!list.length) return null;
              return (
                <HorizontalRow key={sec.id} title={sec.title} emoji={sec.emoji}>
                  {list.map((r) => (
                    <RadioCard key={r.id} radio={r} onPlay={handlePlay} />
                  ))}
                </HorizontalRow>
              );
            })}
          </div>
        ) : (
          // Filtered grid
          <section
            aria-label="Rádios filtradas"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {filtered.map((r) => (
              <div key={r.id} className="w-full">
                <RadioCard radio={r} onPlay={handlePlay} />
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full mt-6 text-center text-muted-foreground">
                {filter === "favoritos"
                  ? "Você ainda não tem rádios favoritas. Toque no ❤️ em qualquer rádio."
                  : "Nenhuma rádio nesta categoria."}
              </p>
            )}
          </section>
        )}
      </AppShell>
    </>
  );
};

export default Radios;
