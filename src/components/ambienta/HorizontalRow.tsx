import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  title: string;
  emoji?: string;
  children: React.ReactNode;
}

export const HorizontalRow = ({ title, emoji, children }: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (dir === "right" ? 1 : -1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-foreground sm:text-xl">
        {emoji && <span aria-hidden>{emoji}</span>}
        {title}
      </h2>

      <div className="group relative">
        <button
          aria-label="Rolar para a esquerda"
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-card backdrop-blur transition-opacity duration-200 hover:bg-card md:grid"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        >
          {children}
        </div>

        <button
          aria-label="Rolar para a direita"
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground shadow-card backdrop-blur transition-opacity duration-200 hover:bg-card md:grid"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};
