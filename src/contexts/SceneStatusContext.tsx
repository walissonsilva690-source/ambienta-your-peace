import { createContext, ReactNode, useContext, useState } from "react";

interface SceneStatus {
  /** True when at least one scene image has loaded successfully. */
  loaded: boolean;
  /** True when all scene loads have failed → show static fallback. */
  failed: boolean;
  markLoaded: () => void;
  markFailed: () => void;
}

const SceneStatusContext = createContext<SceneStatus | undefined>(undefined);

export const SceneStatusProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState(false);
  const [failedCount, setFailedCount] = useState(0);

  const value: SceneStatus = {
    loaded,
    // Treat as failed only after several errors and no successful load yet.
    failed: !loaded && failedCount >= 2,
    markLoaded: () => setLoaded(true),
    markFailed: () => setFailedCount((n) => n + 1),
  };

  return (
    <SceneStatusContext.Provider value={value}>{children}</SceneStatusContext.Provider>
  );
};

export const useSceneStatus = () => {
  const ctx = useContext(SceneStatusContext);
  if (!ctx) throw new Error("useSceneStatus must be used within SceneStatusProvider");
  return ctx;
};
