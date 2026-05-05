import { useRadioPlayer } from "@/contexts/RadioPlayerContext";

/**
 * Discreet preview countdown bar (Free users).
 * No-op when idle / Premium / in full player.
 */
export const PreviewBar = () => {
  const { stage, radio, previewLeft } = useRadioPlayer();
  if (stage !== "preview" || !radio) return null;

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2">
      <div className="glass pointer-events-auto rounded-full border border-border px-4 py-2 text-xs text-foreground shadow-card">
        <span className="text-muted-foreground">Preview · </span>
        <span className="font-semibold">{radio.name}</span>
        <span className="ml-2 text-primary">{previewLeft}s restantes</span>
      </div>
    </div>
  );
};
