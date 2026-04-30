import { Link, useLocation } from "react-router-dom";
import { Home, Radio, Tv, Heart, Clock, Settings, Music2, Crown } from "lucide-react";

type Item = { to: string; label: string; icon: typeof Home };

const items: Item[] = [
  { to: "/",          label: "Início",         icon: Home },
  { to: "/cenas",     label: "Cenas",          icon: Music2 },
  { to: "/radios",    label: "Rádios\nao vivo", icon: Radio },
  { to: "/canais",    label: "Canais 24h",     icon: Tv },
  { to: "/favoritos", label: "Favoritos",      icon: Heart },
  { to: "/timer",     label: "Timer",          icon: Clock },
  { to: "/config",    label: "Configurações",  icon: Settings },
];

export const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside
      aria-label="Menu principal"
      className="glass pointer-events-auto flex h-[calc(100vh-9rem)] w-[180px] flex-col items-stretch gap-1 rounded-2xl px-3 py-4 shadow-card"
    >
      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label.replace(/\n/g, " ")}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-glow-soft"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground focus:bg-white/5"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
              <span className="whitespace-pre-line text-sm font-medium leading-tight">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Link
        to="/premium"
        className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Premium"
      >
        <Crown className="h-5 w-5 text-gold" />
        <span className="text-xs font-bold tracking-widest text-gold">PREMIUM</span>
      </Link>
    </aside>
  );
};
