import { Crown, Radio, Tv, Clock, AudioLines } from "lucide-react";

const items = [
  { icon: Crown, label: "Premium ativo", gold: true },
  { icon: Radio, label: "300 rádios" },
  { icon: Tv, label: "Canais 24h" },
  { icon: Clock, label: "Timer até 4h" },
  { icon: AudioLines, label: "Qualidade 320 kbps" },
];

export const StatusBar = () => {
  return (
    <div className="glass pointer-events-auto flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-2xl px-6 py-3 shadow-card">
      {items.map(({ icon: Icon, label, gold }) => (
        <div key={label} className="flex items-center gap-2 text-xs sm:text-sm">
          <Icon className={`h-4 w-4 ${gold ? "text-gold" : "text-muted-foreground"}`} />
          <span className={gold ? "text-gold font-medium" : "text-foreground/80"}>{label}</span>
        </div>
      ))}
    </div>
  );
};
