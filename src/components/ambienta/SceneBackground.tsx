import { useEffect, useState } from "react";
import { scenes } from "@/data/scenes";

const ROTATE_MS = 150_000; // 2.5 min

export const SceneBackground = () => {
  const [index, setIndex] = useState(0);

  // Preload next image
  useEffect(() => {
    const next = (index + 1) % scenes.length;
    const img = new Image();
    img.src = scenes[next].src;
  }, [index]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % scenes.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {scenes.map((scene, i) => (
        <img
          key={scene.id}
          src={scene.src}
          alt={`Cena ambiente: ${scene.name}`}
          width={1920}
          height={1088}
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
