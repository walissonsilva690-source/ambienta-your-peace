import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { AppShell } from "@/components/ambienta/AppShell";
import { Hero } from "@/components/ambienta/Hero";

const Index = () => {
  return (
    <>
      <SceneBackground />
      <AppShell>
        <div className="flex min-h-[calc(100vh-16rem)] items-center">
          <Hero />
        </div>
      </AppShell>
    </>
  );
};

export default Index;
