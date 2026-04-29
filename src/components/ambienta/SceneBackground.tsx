import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { scenes } from "@/data/scenes";
import { useSceneStatus } from "@/contexts/SceneStatusContext";

const ROTATE_MS = 150_000; // 2.5 min

export const SceneBackground = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // Home: fixed cabin scene. Other routes: rotate.
  const homeIndex = Math.max(0, scenes.findIndex((s) => s.id === "cabin"));
  const [index, setIndex] = useState(isHome ? homeIndex : 0);
  const { failed, loaded, markLoaded, markFailed } = useSceneStatus();

  // Preload next image (only when rotating)
  useEffect(() => {
    if (isHome) return;
    const next = (index + 1) % scenes.length;
    const img = new Image();
    img.src = scenes[next].src;
  }, [index, isHome]);

  useEffect(() => {
    if (isHome) {
      setIndex(homeIndex);
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [isHome, homeIndex]);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
      aria-busy={!loaded && !failed}
    >
      {/* Static gradient fallback — always rendered behind images. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsl(258 60% 18%) 0%, hsl(0 0% 6%) 55%, hsl(0 0% 3%) 100%)",
        }}
      />
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-700 ${
          failed ? "opacity-100" : "opacity-60"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 80%, hsl(258 100% 65% / 0.18), transparent 60%)",
        }}
      />

      {!failed &&
        scenes.map((scene, i) => (
          <img
            key={scene.id}
            src={scene.src}
            alt={`Cena ambiente: ${scene.name}`}
            width={1920}
            height={1088}
            onLoad={markLoaded}
            onError={markFailed}
            className={`scene-img absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}

      <div className="scene-overlay absolute inset-0" />
    </div>
  );
};
