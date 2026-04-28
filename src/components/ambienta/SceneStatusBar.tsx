import { Loader2, WifiOff, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSceneStatus } from "@/contexts/SceneStatusContext";

/**
 * Discreet top-center status pill explaining the scene background state.
 * - Loading: "Carregando ambiente..."
 * - Failed:  "Falha no carregamento · usando fundo estático"
 * - Loaded:  briefly "Ambiente pronto", then auto-hides
 */
export const SceneStatusBar = () => {
  const { loaded, failed } = useSceneStatus();
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideSuccess, setHideSuccess] = useState(false);

  // When images finish loading, show a brief confirmation then fade away.
  useEffect(() => {
    if (loaded && !failed) {
      setShowSuccess(true);
      const t = window.setTimeout(() => setHideSuccess(true), 1800);
      return () => window.clearTimeout(t);
    }
  }, [loaded, failed]);

  const isLoading = !loaded && !failed;
  const visible = isLoading || failed || (showSuccess && !hideSuccess);

  let icon = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
  let label = "Carregando ambiente...";
  let tone = "text-muted-foreground";

  if (failed) {
    icon = <WifiOff className="h-3.5 w-3.5" />;
    label = "Falha no carregamento · usando fundo estático";
    tone = "text-destructive-foreground";
  } else if (loaded) {
    icon = <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
    label = "Ambiente pronto";
    tone = "text-foreground/80";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 top-6 z-40 -translate-x-1/2 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div
        className={`glass flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-medium shadow-card ${tone}`}
      >
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
};
