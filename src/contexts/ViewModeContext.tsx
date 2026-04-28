import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type ViewMode = "black" | "info" | "immersive";

interface ViewModeContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  cycleMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

const STORAGE_KEY = "ambienta:view-mode";
const ORDER: ViewMode[] = ["immersive", "info", "black"];

export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ViewMode>("immersive");

  // Always start in "immersive" mode on load so the app's visuals are visible.
  // Persisted preference is only restored if it's "info" (still shows UI);
  // "black" is intentionally NOT auto-restored to avoid an empty/black preview.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (saved === "info") setModeState("info");
  }, []);

  const setMode = useCallback((m: ViewMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((prev) => {
      const next = ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length];
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Keyboard shortcut: "M" to cycle modes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
        cycleMode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleMode]);

  return (
    <ViewModeContext.Provider value={{ mode, setMode, cycleMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used within ViewModeProvider");
  return ctx;
};
