import { ReactNode, useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/ambienta/Sidebar";
import { NowPlaying } from "@/components/ambienta/NowPlaying";
import { TimerCard } from "@/components/ambienta/TimerCard";
import { StatusBar } from "@/components/ambienta/StatusBar";
import { Logo } from "@/components/ambienta/Logo";
import { ViewModeToggle } from "@/components/ambienta/ViewModeToggle";
import { MinimalInfo } from "@/components/ambienta/MinimalInfo";
import { PlayerControls } from "@/components/ambienta/PlayerControls";
import { SceneStatusBar } from "@/components/ambienta/SceneStatusBar";
import { AdFixed } from "@/components/ambienta/AdFixed";
import { AdRotating } from "@/components/ambienta/AdRotating";
import { AdCorners } from "@/components/ambienta/AdCorners";
import { useIdle } from "@/hooks/useIdle";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";
import { useViewMode } from "@/contexts/ViewModeContext";

interface Props {
  children: ReactNode;
  /** Right column visibility (Now Playing + Timer) */
  showRightColumn?: boolean;
}

export const AppShell = ({ children, showRightColumn = true }: Props) => {
  useSpatialNavigation();
  const idle = useIdle(10_000);
  const { mode } = useViewMode();

  // In black mode: any interaction reveals UI for 5s, then hides again.
  const [blackReveal, setBlackReveal] = useState(false);
  useEffect(() => {
    if (mode !== "black") return;
    let t: number | undefined;
    const reveal = () => {
      setBlackReveal(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => setBlackReveal(false), 5000);
    };
    const events: (keyof WindowEventMap)[] = [
      "mousemove", "mousedown", "keydown", "touchstart", "wheel",
    ];
    events.forEach((e) => window.addEventListener(e, reveal, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, reveal));
      window.clearTimeout(t);
    };
  }, [mode]);

  // ── Deterministic focus after mode change (post-crossfade) ──
  // Priority per mode:
  //   black     → ViewMode toggle (only thing reachable on reveal)
  //   info      → ViewMode toggle (chrome is the only interactive surface)
  //   immersive → primary CTA in content, fallback to first sidebar item
  const FADE_MS = 520; // matches duration-500 + small buffer
  const firstRender = useRef(true);
  useEffect(() => {
    // Skip the initial mount — useSpatialNavigation handles first focus.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const t = window.setTimeout(() => {
      const pick = (sel: string) =>
        document.querySelector<HTMLElement>(sel);

      let target: HTMLElement | null = null;
      if (mode === "immersive") {
        target =
          pick('[data-focus-anchor="immersive-primary"]') ??
          pick('aside[aria-label="Menu principal"] a');
      } else if (mode === "info") {
        target =
          pick('[data-focus-anchor="mode-toggle"]') ??
          pick('aside[aria-label="Menu principal"] a');
      } else {
        // black mode — focus only when chrome is revealed
        if (!blackReveal) return;
        target = pick('[data-focus-anchor="mode-toggle"]');
      }

      if (target && document.activeElement !== target) {
        target.focus({ preventScroll: true });
      }
    }, FADE_MS);

    return () => window.clearTimeout(t);
  }, [mode, blackReveal]);

  // UI visibility logic per mode
  const isBlack = mode === "black";
  const isInfo = mode === "info";
  const isImmersive = mode === "immersive";

  const chromeVisible = isBlack ? blackReveal : !idle;
  const showInfoOverlay = isInfo || (isBlack && blackReveal);

  // Crossfade timings
  const FADE = "transition-opacity duration-500 ease-in-out";

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {/* Discreet scene-load status pill (top-center) */}
      <SceneStatusBar />
      {/* Always-mounted overlays — crossfade via opacity (no flash) */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[5] bg-black ${FADE} ${
          isBlack ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-[5] bg-background ${FADE} ${
          isInfo ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Chrome (logo, sidebar, right column, status bar) — fades with idle/reveal */}
      <div
        className={`${FADE} ${chromeVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <header className="fixed left-6 top-6 z-40 sm:left-8 sm:top-8">
          <Logo />
        </header>

        <div className="fixed left-6 top-32 z-30 hidden md:block">
          <Sidebar />
        </div>

        {showRightColumn && (
          <div className="fixed right-6 top-6 z-30 hidden flex-col gap-4 sm:right-8 sm:top-8 lg:flex">
            <NowPlaying />
            <TimerCard />
          </div>
        )}

        <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
          <ViewModeToggle />
        </div>

        <footer className="pointer-events-none fixed inset-x-6 bottom-6 z-30 hidden sm:inset-x-8 sm:bottom-8 md:left-[220px] md:block lg:right-24">
          <StatusBar />
        </footer>
      </div>

      {/* Page content — crossfaded; only interactive in immersive */}
      <div
        className={`relative z-10 min-h-screen pl-6 pr-6 pt-32 pb-32 sm:pl-8 sm:pr-8 md:pl-[220px] lg:pr-[360px] ${FADE} ${
          isImmersive ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>

      {/* Floating transport controls — visible whenever a stream is active */}
      <PlayerControls />

      {/* Anúncios discretos (mock — substituir por backend depois).
          Plano Premium futuramente irá ocultá-los via useIsPremium(). */}
      <AdFixed />
      <AdRotating />
      <AdCorners />

      {/* Info overlay (always mounted, fades) */}
      <MinimalInfo visible={showInfoOverlay} />

      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 text-xs text-white/40 ${FADE} ${
          idle && isImmersive ? "opacity-100" : "opacity-0"
        }`}
      >
        Modo Relax · mova para reativar
      </div>

      <div
        className={`pointer-events-none fixed bottom-4 left-1/2 z-[6] -translate-x-1/2 text-[10px] tracking-widest text-white/20 ${FADE} ${
          isBlack && !blackReveal ? "opacity-100" : "opacity-0"
        }`}
      >
        TELA PRETA · toque para mostrar
      </div>
    </main>
  );
};
