import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { Sidebar } from "@/components/ambienta/Sidebar";
import { NowPlaying } from "@/components/ambienta/NowPlaying";
import { TimerCard } from "@/components/ambienta/TimerCard";
import { StatusBar } from "@/components/ambienta/StatusBar";
import { Hero } from "@/components/ambienta/Hero";
import { Logo } from "@/components/ambienta/Logo";
import { useIdle } from "@/hooks/useIdle";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

const Index = () => {
  useSpatialNavigation();
  const idle = useIdle(10_000);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <SceneBackground />

      {/* UI layer — fades out when idle (Modo Relax) */}
      <div className={`absolute inset-0 ${idle ? "ui-fade-out" : "ui-fade-in"}`}>
        {/* Top bar with logo */}
        <header className="absolute left-6 top-6 z-20 sm:left-8 sm:top-8">
          <Logo />
        </header>

        {/* Right column: Now playing + Timer */}
        <div className="absolute right-6 top-6 z-20 hidden flex-col gap-4 sm:right-8 sm:top-8 lg:flex">
          <NowPlaying />
          <TimerCard />
        </div>

        {/* Sidebar */}
        <div className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 md:block">
          <Sidebar />
        </div>

        {/* Hero */}
        <section className="absolute left-1/2 top-1/2 z-10 w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 px-6 sm:px-12 md:pl-32 lg:pl-40">
          <Hero />
        </section>

        {/* Status bar */}
        <footer className="absolute inset-x-6 bottom-6 z-20 sm:inset-x-8 sm:bottom-8 md:left-32 lg:left-40">
          <StatusBar />
        </footer>

        {/* Mobile right cards */}
        <div className="absolute inset-x-6 bottom-28 z-20 flex flex-col gap-3 lg:hidden">
          <div className="hidden sm:block lg:hidden">
            <NowPlaying />
          </div>
        </div>
      </div>

      {/* Subtle hint when idle */}
      {idle && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40">
          Modo Relax · mova para reativar
        </div>
      )}
    </main>
  );
};

export default Index;
