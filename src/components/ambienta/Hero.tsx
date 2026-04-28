import { Button } from "@/components/ui/button";
import { Play, Radio, AlertCircle } from "lucide-react";
import { useSceneStatus } from "@/contexts/SceneStatusContext";
import { HeroSkeleton } from "@/components/ambienta/HeroSkeleton";

export const Hero = () => {
  const { loaded, failed } = useSceneStatus();

  // Show skeleton while initial scene image is still loading.
  if (!loaded && !failed) {
    return <HeroSkeleton />;
  }

  return (
    <div className="pointer-events-auto max-w-2xl animate-fade-in">
      {failed && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 text-primary" />
          Modo offline · usando fundo estático
        </div>
      )}
      <h1 className="text-balance font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
        Paz. Música.<br />Ambiente.
      </h1>
      <p className="mt-5 max-w-md text-balance text-base text-muted-foreground sm:text-lg">
        O botão de paz instantânea que sua TV sempre mereceu.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          size="lg"
          data-focus-anchor="immersive-primary"
          className="h-14 rounded-2xl bg-gradient-primary px-7 text-base font-semibold text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Play className="mr-2 h-5 w-5 fill-current" />
          Explorar cenas
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 rounded-2xl border-white/20 bg-black/30 px-7 text-base font-medium text-foreground backdrop-blur transition-transform duration-200 hover:scale-105 hover:bg-black/40 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Radio className="mr-2 h-5 w-5" />
          Rádios ao vivo
        </Button>
      </div>
    </div>
  );
};
