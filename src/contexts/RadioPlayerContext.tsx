import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LiveRadio } from "@/lib/radioBrowser";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

type Stage = "idle" | "preview" | "full";

interface RadioPlayerValue {
  stage: Stage;
  radio: LiveRadio | null;
  /** Segundos restantes no preview (somente em stage === "preview") */
  previewLeft: number;
  /** Timer de desligamento em segundos (0 = sem timer) */
  sleepLeft: number;
  /** É usuário Premium? Premium pula o preview. */
  isPremium: boolean;
  open: (radio: LiveRadio) => void;
  closeFull: () => void;
  setSleep: (minutes: number) => void;
  clearSleep: () => void;
}

const RadioPlayerContext = createContext<RadioPlayerValue | undefined>(undefined);

const PREVIEW_SECONDS = 15;

export const RadioPlayerProvider = ({
  children,
  isPremium = true, // Premium completo nesta versão
}: {
  children: ReactNode;
  isPremium?: boolean;
}) => {
  const audio = useAudioPlayer();
  const [stage, setStage] = useState<Stage>("idle");
  const [radio, setRadio] = useState<LiveRadio | null>(null);
  const [previewLeft, setPreviewLeft] = useState(0);
  const [sleepLeft, setSleepLeft] = useState(0);
  const previewTimerRef = useRef<number | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  const clearPreviewTimer = () => {
    if (previewTimerRef.current != null) {
      window.clearInterval(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  };
  const clearSleepTimer = () => {
    if (sleepTimerRef.current != null) {
      window.clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
  };

  const startStream = useCallback(
    (r: LiveRadio) => {
      audio.play({
        streamUrl: r.url,
        rescueTag: r.tags[0],
        channelId: r.id,
        channelName: r.name,
        description: r.location,
      });
    },
    [audio],
  );

  const startPreview = useCallback(
    (r: LiveRadio) => {
      clearPreviewTimer();
      setStage("preview");
      setRadio(r);
      setPreviewLeft(PREVIEW_SECONDS);
      startStream(r);
      previewTimerRef.current = window.setInterval(() => {
        setPreviewLeft((s) => {
          if (s <= 1) {
            clearPreviewTimer();
            audio.stop();
            setStage("idle");
            setRadio(null);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    },
    [audio, startStream],
  );

  const openFull = useCallback(
    (r: LiveRadio) => {
      clearPreviewTimer();
      setStage("full");
      setRadio(r);
      setPreviewLeft(0);
      startStream(r);
    },
    [startStream],
  );

  const open: RadioPlayerValue["open"] = useCallback(
    (r) => {
      // Versão PREMIUM COMPLETA: clique único abre direto o player completo.
      // (O fluxo de preview de 15s será reativado quando o modo Free for criado.)
      openFull(r);
    },
    [openFull],
  );

  const closeFull = useCallback(() => {
    clearPreviewTimer();
    clearSleepTimer();
    audio.stop();
    setStage("idle");
    setRadio(null);
    setSleepLeft(0);
  }, [audio]);

  const setSleep = useCallback(
    (minutes: number) => {
      clearSleepTimer();
      const total = Math.max(0, Math.round(minutes * 60));
      setSleepLeft(total);
      if (total === 0) return;
      sleepTimerRef.current = window.setInterval(() => {
        setSleepLeft((s) => {
          if (s <= 1) {
            clearSleepTimer();
            audio.stop();
            setStage("idle");
            setRadio(null);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    },
    [audio],
  );

  const clearSleep = useCallback(() => {
    clearSleepTimer();
    setSleepLeft(0);
  }, []);

  useEffect(
    () => () => {
      clearPreviewTimer();
      clearSleepTimer();
    },
    [],
  );

  const value: RadioPlayerValue = {
    stage,
    radio,
    previewLeft,
    sleepLeft,
    isPremium,
    open,
    closeFull,
    setSleep,
    clearSleep,
  };

  return (
    <RadioPlayerContext.Provider value={value}>{children}</RadioPlayerContext.Provider>
  );
};

export const useRadioPlayer = () => {
  const ctx = useContext(RadioPlayerContext);
  if (!ctx) throw new Error("useRadioPlayer must be used within RadioPlayerProvider");
  return ctx;
};
