import { useMemo, useState } from "react";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { SceneCard } from "@/components/ambienta/SceneCard";
import { sceneCatalog, sceneCategories, SceneItem } from "@/data/sceneCatalog";
import { toast } from "@/hooks/use-toast";

const Cenas = () => {
  const [filter, setFilter] = useState<string>("all");

  const visible = useMemo(
    () => filter === "all" ? sceneCatalog : sceneCatalog.filter((s) => s.category === filter),
    [filter]
  );

  const handlePlay = (scene: SceneItem) => {
    toast({
      title: `Tocando: ${scene.name}`,
      description: scene.ambient,
    });
  };

  return (
    <>
      <SceneBackground />
      <AppShell>
        <header className="mb-8">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Cenas
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Ambientes visuais para relaxar e dormir melhor.
          </p>
        </header>

        {/* Filters */}
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar cenas por categoria"
        >
          {sceneCategories.map((cat) => {
            const active = filter === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(cat.id)}
                className={`rounded-full px-5 py-2 text-sm font-medium outline-none transition-all duration-200 ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow-soft"
                    : "border border-border bg-card/60 text-muted-foreground backdrop-blur hover:bg-card hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <section
          aria-label="Grade de cenas"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {visible.map((scene) => (
            <SceneCard key={scene.id} scene={scene} onPlay={handlePlay} />
          ))}
        </section>

        {visible.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Nenhuma cena nesta categoria.
          </p>
        )}
      </AppShell>
    </>
  );
};

export default Cenas;
