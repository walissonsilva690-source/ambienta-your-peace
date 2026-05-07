import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const TOTAL = 45 * 60;

export const TimerCard = () => {
  const [remaining, setRemaining] = useState(TOTAL);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r <= 0 ? TOTAL : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  const progress = remaining / TOTAL;
  const C = 2 * Math.PI * 32; // r=32

  return (
    <div className="glass pointer-events-auto w-full rounded-2xl p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Clock className="h-4 w-4" />
        <span className="text-xs font-semibold tracking-wide">Timer</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Desligamento em</p>
          <p className="font-display text-3xl font-bold tabular-nums text-foreground">
            {m}:{s}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 h-8 rounded-full border-border bg-white/5 text-xs font-medium hover:bg-white/10"
          >
            Alterar
          </Button>
        </div>
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
            <circle
              cx="40" cy="40" r="32"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
