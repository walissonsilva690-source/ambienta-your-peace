import { useEffect, useRef, useState } from "react";
import { rotatingAds } from "@/data/ads";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

/**
 * Anúncio ROTATIVO — canto superior esquerdo, ABAIXO da logo.
 *
 * Comportamento PREMIUM:
 *  - Durante EXECUÇÃO (player tocando): aparece a cada 7 minutos
 *  - Durante NAVEGAÇÃO (sem áudio):    aparece a cada 15 minutos
 *  - Dura 20 segundos visível
 *  - Fade in/out de 0.5s
 *  - Sem som, sem piscar, sem interação (não clicável)
 *
 * Estilo idêntico ao AdFixed: ~95×23px, fundo preto 60%,
 * texto cinza #666666, 8px weight 300.
 */
const INTERVAL_PLAYING_MS = 7 * 60 * 1000;   // 7 min em execução
const INTERVAL_IDLE_MS    = 15 * 60 * 1000;  // 15 min em navegação
const VISIBLE_MS          = 20 * 1000;       // 20 segundos
const FADE_MS             = 500;             // fade 0.5s

export const AdRotating = () => {
  const { isPlaying } = useAudioPlayer();
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cycleRef = useRef(0);

  useEffect(() => {
    if (rotatingAds.length === 0) return;

    const intervalMs = isPlaying ? INTERVAL_PLAYING_MS : INTERVAL_IDLE_MS;
    let fadeTimer: number | undefined;
    let unmountTimer: number | undefined;

    const showAd = () => {
      setIndex(cycleRef.current % rotatingAds.length);
      cycleRef.current += 1;
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));

      fadeTimer = window.setTimeout(() => {
        setVisible(false);
        unmountTimer = window.setTimeout(() => setMounted(false), FADE_MS);
      }, VISIBLE_MS);
    };

    // Em dev: primeira aparição em 5s para QA visual.
    const firstDelay = import.meta.env.DEV ? 5_000 : intervalMs;
    const firstTimer = window.setTimeout(showAd, firstDelay);
    const interval   = window.setInterval(showAd, intervalMs);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
      window.clearInterval(interval);
    };
  }, [isPlaying]);

  if (!mounted) return null;

  const ad = rotatingAds[index];

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none fixed left-3 z-[60] flex items-center justify-center"
      style={{
        top: "96px", // abaixo da logo
        width: "95px",
        height: "23px",
        backgroundColor: "rgba(11, 11, 11, 0.6)",
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <span
        style={{
          color: "#666666",
          fontSize: "8px",
          fontWeight: 300,
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {ad.brand}
      </span>
    </div>
  );
};
