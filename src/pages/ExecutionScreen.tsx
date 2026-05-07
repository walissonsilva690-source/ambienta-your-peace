import { Link, useParams } from "react-router-dom";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { AudioVisualizer } from "@/components/ambienta/AudioVisualizer";
import { SceneMixer } from "@/components/ambienta/SceneMixer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

const ExecutionScreen = () => {
  const { id } = useParams<{ id: string }>();
  const { isPlaying } = useAudioPlayer();

  return (
    <>
      <SceneBackground />
      <AppShell>
        <header className="mb-8 flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="rounded-full border-border bg-white/5">
            <Link to="/modos-prontos" aria-label="Voltar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Executando</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <span className="text-primary capitalize">{id}</span>
            </h1>
          </div>
        </header>

        {/* Visualizer — pulsates while a stream is active, freezes when paused */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <AudioVisualizer active={isPlaying} className="w-full max-w-xl" />
          <p className="text-xs text-muted-foreground">
            {isPlaying ? "Ambiente ao vivo" : "Pausado"}
          </p>
        </div>

        {/* Scene mixer */}
        <SceneMixer />
      </AppShell>
    </>
  );
};

export default ExecutionScreen;
