import { Layers, Music, MoonStar } from "lucide-react";
import { useViewMode, ViewMode } from "@/contexts/ViewModeContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const config: Record<ViewMode, { icon: typeof Layers; label: string }> = {
  immersive: { icon: Layers, label: "Imersivo · Música + Tema" },
  info: { icon: Music, label: "Info · Apenas música" },
  black: { icon: MoonStar, label: "Tela preta · Só áudio" },
};

export const ViewModeToggle = () => {
  const { mode, cycleMode } = useViewMode();
  const { icon: Icon, label } = config[mode];

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={cycleMode}
            data-focus-anchor="mode-toggle"
            aria-label={`Modo de tela: ${label}. Clique para alternar.`}
            className="glass pointer-events-auto flex h-12 w-12 items-center justify-center rounded-xl text-foreground outline-none transition-all duration-200 hover:bg-white/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-popover/95 backdrop-blur border-border">
          {label} <span className="ml-2 text-muted-foreground">(M)</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
