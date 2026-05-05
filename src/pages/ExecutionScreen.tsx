import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ExecutionScreen = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <SceneBackground />
      <AppShell>
        <header className="mb-6 flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-full border-border bg-white/5">
            <Link to="/modos-prontos" aria-label="Voltar"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Executando: <span className="text-primary capitalize">{id}</span>
          </h1>
        </header>
        <p className="text-base text-muted-foreground">
          Ambiente em execução. Use o controle de player flutuante para pausar ou ajustar.
        </p>
      </AppShell>
    </>
  );
};

export default ExecutionScreen;
