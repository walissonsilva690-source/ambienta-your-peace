import { Loader2, WifiOff, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSceneStatus } from "@/contexts/SceneStatusContext";

/**
 * Discreet top-center status pill explaining the scene background state.
 *
 * Accessibility & TV-remote:
 * - Visual pill is purely decorative (aria-hidden) so screen readers never read
 *   stale tooltip-like text on every render.
 * - State changes are announced via a separate visually-hidden aria-live region
 *   that updates only when the status actually transitions (loading → ready / failed).
 * - inert + tabIndex=-1 keep arrow-key spatial navigation from ever landing here.
 */
export const SceneStatusBar = () => {
  const { loaded, failed } = useSceneStatus();
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideSuccess, setHideSuccess] = useState(false);

  // Auto-hide the success pill after a short moment.
  useEffect(() => {
    if (loaded && !failed) {
      setShowSuccess(true);
      const t = window.setTimeout(() => setHideSuccess(true), 1800);
      return () => window.clearTimeout(t);
    }
  }, [loaded, failed]);

  const isLoading = !loaded && !failed;
  const visible = isLoading || failed || (showSuccess && !hideSuccess);

  // ── Screen-reader announcement (only fires on real transitions) ──
  const [announcement, setAnnouncement] = useState("");
  const lastPhase = useRef<"loading" | "loaded" | "failed" | null>(null);

  useEffect(() => {
    const phase: "loading" | "loaded" | "failed" =
      failed ? "failed" : loaded ? "loaded" : "loading";

    if (phase === lastPhase.current) return;
    lastPhase.current = phase;

    // Defer to next tick so SRs reliably pick up the change.
    const msg =
      phase === "loading"
        ? "Carregando ambiente"
        : phase === "failed"
        ? "Falha no carregamento do ambiente. Usando fundo estático."
        : "Ambiente pronto";

    // Toggle to empty first so identical consecutive messages are still announced.
    setAnnouncement("");
    const t = window.setTimeout(() => setAnnouncement(msg), 50);
    return () => window.clearTimeout(t);
  }, [loaded, failed]);

  // Visual content (decorative)
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
    <>
      {/* Visually-hidden live region — the SOURCE OF TRUTH for screen readers.
          aria-live="polite" + atomic so transitions are read as a single phrase
          without interrupting the user's current action. */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Decorative visual pill — never focusable, never announced. */}
      <div
        aria-hidden="true"
        // @ts-expect-error -- `inert` is supported in modern browsers / WebKit / WPE (Smart TV)
        inert=""
        tabIndex={-1}
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
    </>
  );
};
