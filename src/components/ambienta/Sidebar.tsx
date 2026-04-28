import { Home, Radio, Tv, Heart, Clock, Settings, Music2, Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const items = [
  { id: "home",     label: "Início",        icon: Home },
  { id: "scenes",   label: "Cenas",         icon: Music2 },
  { id: "radios",   label: "Rádios ao vivo",icon: Radio },
  { id: "channels", label: "Canais 24h",    icon: Tv },
  { id: "favs",     label: "Favoritos",     icon: Heart },
  { id: "timer",    label: "Timer",         icon: Clock },
  { id: "settings", label: "Configurações", icon: Settings },
];

export const Sidebar = () => {
  const [active, setActive] = useState("home");

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        aria-label="Menu principal"
        className="glass pointer-events-auto flex h-[calc(100vh-3rem)] w-[88px] flex-col items-center gap-2 rounded-2xl py-6 shadow-card"
      >
        <nav className="flex flex-1 flex-col items-center gap-2">
          {items.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActive(id)}
                    aria-label={label}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex h-14 w-14 items-center justify-center rounded-xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-soft pulse-glow"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground focus:bg-white/5"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover/95 backdrop-blur border-border">
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-1 pt-4">
          <Crown className="h-5 w-5 text-gold" />
          <span className="text-[10px] font-bold tracking-widest text-gold">PREMIUM</span>
        </div>
      </aside>
    </TooltipProvider>
  );
};
