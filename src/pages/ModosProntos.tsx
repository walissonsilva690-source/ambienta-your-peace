import { Link } from "react-router-dom";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";

const MODOS = [
  { id: "relax",   name: "Relax",        desc: "Sons calmos para descansar" },
  { id: "foco",    name: "Foco",         desc: "Concentração profunda" },
  { id: "sono",    name: "Sono",         desc: "Para dormir melhor" },
  { id: "leitura", name: "Leitura",      desc: "Ambiente silencioso" },
  { id: "festa",   name: "Festa",        desc: "Energia e ritmo" },
  { id: "jantar",  name: "Jantar",       desc: "Clima intimista" },
];

const ModosProntos = () => (
  <>
    <SceneBackground />
    <AppShell>
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Modos prontos
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Atalhos rápidos para criar o ambiente perfeito.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODOS.map((m) => (
          <Link
            key={m.id}
            to={`/execution/${m.id}`}
            className="group rounded-2xl border border-border bg-card/60 p-5 backdrop-blur transition-all duration-200 hover:scale-[1.02] hover:border-primary/60 hover:shadow-glow-soft focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary"
          >
            <h2 className="font-display text-xl font-semibold text-foreground">{m.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
          </Link>
        ))}
      </section>
    </AppShell>
  </>
);

export default ModosProntos;
