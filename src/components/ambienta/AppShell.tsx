import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "@/components/ambienta/Sidebar";
import { NowPlaying } from "@/components/ambienta/NowPlaying";
import { TimerCard } from "@/components/ambienta/TimerCard";
import { StatusBar } from "@/components/ambienta/StatusBar";
import { Logo } from "@/components/ambienta/Logo";
import { ViewModeToggle } from "@/components/ambienta/ViewModeToggle";
import { MinimalInfo } from "@/components/ambienta/MinimalInfo";
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

  // UI visibility logic per mode
  const isBlack = mode === "black";
  const isInfo = mode === "info";
  const isImmersive = mode === "immersive";

  const chromeVisible = isBlack ? blackReveal : !idle;
  const showContent = isImmersive; // hero/grids only in immersive
  const showInfoOverlay = isInfo || (isBlack && blackReveal);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      {/* Black-mode opaque overlay over the scene background */}
      {isBlack && (
        <div className="fixed inset-0 z-[5] bg-black transition-opacity duration-300" />
      )}
      {/* Info-mode flat dark surface (hides video) */}
      {isInfo && (
        <div className="fixed inset-0 z-[5] bg-background transition-opacity duration-300" />
      )}

      <div className={`transition-opacity duration-300 ${chromeVisible ? "ui-fade-in" : "ui-fade-out"}`}>
        {/* Logo */}
        <header className="fixed left-6 top-6 z-30 sm:left-8 sm:top-8">
          <Logo />
        </header>

        {/* Sidebar - hide in black mode entirely (only on reveal) */}
        <div className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 md:block">
          <Sidebar />
        </div>

        {/* Right column */}
        {showRightColumn && (
          <div className="fixed right-6 top-6 z-30 hidden flex-col gap-4 sm:right-8 sm:top-8 lg:flex">
            <NowPlaying />
            <TimerCard />
          </div>
        )}

        {/* View mode toggle — bottom-right, always reachable when chrome visible */}
        <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
          <ViewModeToggle />
        </div>

        {/* Page content — only in immersive mode */}
        {showContent && (
          <div className="relative z-10 min-h-screen pl-6 pr-6 pt-32 pb-32 sm:pl-8 sm:pr-8 md:pl-32 lg:pl-40 lg:pr-[360px]">
            {children}
          </div>
        )}

        {/* Status bar */}
        <footer className="fixed inset-x-6 bottom-6 z-30 sm:inset-x-8 sm:bottom-8 md:left-32 lg:left-40 lg:right-24">
          <StatusBar />
        </footer>
      </div>

      {/* Info overlay (visible in info mode and during black-mode reveal) */}
      {showInfoOverlay && (
        <div className="relative z-20">
          <MinimalInfo />
        </div>
      )}

      {idle && isImmersive && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 text-xs text-white/40">
          Modo Relax · mova para reativar
        </div>
      )}

      {isBlack && !blackReveal && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-[6] -translate-x-1/2 text-[10px] tracking-widest text-white/20">
          TELA PRETA · toque para mostrar
        </div>
      )}
    </main>
  );
};
