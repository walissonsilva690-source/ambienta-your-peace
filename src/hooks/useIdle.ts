import { useEffect, useState } from "react";

export function useIdle(timeoutMs = 8000) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let t: number | undefined;
    const reset = () => {
      setIdle(false);
      window.clearTimeout(t);
      t = window.setTimeout(() => setIdle(true), timeoutMs);
    };
    const events: (keyof WindowEventMap)[] = [
      "mousemove", "mousedown", "keydown", "touchstart", "wheel", "focusin",
    ];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      window.clearTimeout(t);
    };
  }, [timeoutMs]);

  return idle;
}
