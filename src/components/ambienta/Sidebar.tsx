import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Radio, Tv, Heart, Clock, Settings, Music2, Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Item = { to: string; label: string; icon: typeof Home };

const items: Item[] = [
  { to: "/",          label: "Início",         icon: Home },
  { to: "/cenas",     label: "Cenas",          icon: Music2 },
  { to: "/radios",    label: "Rádios ao vivo", icon: Radio },
  { to: "/canais",    label: "Canais 24h",     icon: Tv },
  { to: "/favoritos", label: "Favoritos",      icon: Heart },
  { to: "/timer",     label: "Timer",          icon: Clock },
  { to: "/config",    label: "Configurações",  icon: Settings },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  // Treat unknown routes as "home" highlight only when actually on /
  const [hovered, setHovered] = useState<string | null>(null);
  void hovered;

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        aria-label="Menu principal"
        className="glass pointer-events-auto flex h-[calc(100vh-3rem)] w-[88px] flex-col items-center gap-2 rounded-2xl py-6 shadow-card"
      >
        <nav className="flex flex-1 flex-col items-center gap-2">
          {items.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <Tooltip key={to}>
                <TooltipTrigger asChild>
                  <Link
                    to={to}
                    aria-label={label}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex h-14 w-14 items-center justify-center rounded-xl outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-soft pulse-glow"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground focus:bg-white/5"
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover/95 backdrop-blur border-border">
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <Link
          to="/premium"
          className="flex flex-col items-center gap-1 pt-4 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2"
          aria-label="Premium"
        >
          <Crown className="h-5 w-5 text-gold" />
          <span className="text-[10px] font-bold tracking-widest text-gold">PREMIUM</span>
        </Link>
      </aside>
    </TooltipProvider>
  );
};
