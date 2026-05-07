import { useMemo } from "react";

interface Props {
  /** When false, bars freeze flat (paused state). */
  active?: boolean;
  /** Number of bars in the visualizer. */
  bars?: number;
  /** Tailwind height class for container. */
  className?: string;
}

/**
 * Decorative audio-style visualizer.
 * Pure CSS — uses staggered keyframe animations so each bar pulses
 * at a different rate, giving a reactive feel without WebAudio.
 */
export const AudioVisualizer = ({ active = true, bars = 32, className = "" }: Props) => {
  // Pre-compute deterministic per-bar animation params so SSR/CSR match.
  const items = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        // Pseudo-random but stable per index
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        const duration = 0.6 + r * 0.9; // 0.6s – 1.5s
        const delay = -(r * 1.2); // negative offset → out of sync from frame 1
        const minH = 12 + Math.round(r * 18); // 12–30%
        return { duration, delay, minH };
      }),
    [bars],
  );

  return (
    <div
      aria-hidden="true"
      className={`flex h-32 items-end justify-center gap-1.5 ${className}`}
    >
      {items.map((it, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-primary/40 via-primary to-primary-glow shadow-glow-soft"
          style={{
            height: active ? "100%" : `${it.minH}%`,
            animation: active
              ? `viz-pulse ${it.duration}s ease-in-out ${it.delay}s infinite alternate`
              : "none",
            transformOrigin: "bottom",
          }}
        />
      ))}
      <style>{`
        @keyframes viz-pulse {
          0%   { transform: scaleY(0.15); opacity: 0.55; }
          100% { transform: scaleY(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};
