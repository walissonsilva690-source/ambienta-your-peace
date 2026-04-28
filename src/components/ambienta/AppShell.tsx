import { ReactNode } from "react";
import { Sidebar } from "@/components/ambienta/Sidebar";
import { NowPlaying } from "@/components/ambienta/NowPlaying";
import { TimerCard } from "@/components/ambienta/TimerCard";
import { StatusBar } from "@/components/ambienta/StatusBar";
import { Logo } from "@/components/ambienta/Logo";
import { useIdle } from "@/hooks/useIdle";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

interface Props {
  children: ReactNode;
  /** Right column visibility (Now Playing + Timer) */
  showRightColumn?: boolean;
}

export const AppShell = ({ children, showRightColumn = true }: Props) => {
  useSpatialNavigation();
  const idle = useIdle(10_000);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <div className={idle ? "ui-fade-out" : "ui-fade-in"}>
        {/* Logo */}
        <header className="fixed left-6 top-6 z-30 sm:left-8 sm:top-8">
          <Logo />
        </header>

        {/* Sidebar */}
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

        {/* Page content */}
        <div className="relative z-10 min-h-screen pl-6 pr-6 pt-32 pb-32 sm:pl-8 sm:pr-8 md:pl-32 lg:pl-40 lg:pr-[360px]">
          {children}
        </div>

        {/* Status bar */}
        <footer className="fixed inset-x-6 bottom-6 z-30 sm:inset-x-8 sm:bottom-8 md:left-32 lg:left-40">
          <StatusBar />
        </footer>
      </div>

      {idle && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 text-xs text-white/40">
          Modo Relax · mova para reativar
        </div>
      )}
    </main>
  );
};
