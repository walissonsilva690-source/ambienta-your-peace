import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/ambienta/AppShell";
import { SceneBackground } from "@/components/ambienta/SceneBackground";
import { ChannelHero } from "@/components/ambienta/ChannelHero";
import { ChannelCard } from "@/components/ambienta/ChannelCard";
import { channelSections, featuredChannel, Channel } from "@/data/channels";
import { toast } from "@/hooks/use-toast";

const Canais = () => {
  const handlePlay = (c: Channel | { name: string; description: string }) => {
    toast({ title: `Tocando: ${c.name}`, description: c.description });
  };

  return (
    <>
      <SceneBackground />
      <AppShell>
        <header className="mb-6">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Canais 24h
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Música contínua, sem comerciais, sem interrupções.
          </p>
        </header>

        <ChannelHero onPlay={() => handlePlay(featuredChannel)} />

        <div className="space-y-10">
          {channelSections.map((section) => (
            <section key={section.id} aria-labelledby={`sec-${section.id}`}>
              <button
                className="group mb-4 flex items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Ver tudo de ${section.title}`}
              >
                <h2
                  id={`sec-${section.id}`}
                  className="font-display text-xl font-semibold text-foreground sm:text-2xl"
                >
                  {section.title}
                </h2>
                <ChevronRight className="h-5 w-5 text-primary transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {section.channels.map((ch) => (
                  <ChannelCard key={ch.id} channel={ch} onPlay={handlePlay} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </AppShell>
    </>
  );
};

export default Canais;
