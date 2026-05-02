import { useEffect, useRef, useState } from "react";
import { rotatingAds } from "@/data/ads";

/**
 * Anúncio ROTATIVO — canto superior esquerdo, ABAIXO da logo.
 *
 * Comportamento:
 *  - Aparece a cada 15 MINUTOS
 *  - Dura 15 segundos visível
 *  - Some com fade-out de 0.5s
 *  - Sem interação (não clicável, sem hover, sem fechar)
 *  - A cada ciclo mostra o próximo anúncio da lista (round-robin)
 *
 * Estilo idêntico ao AdFixed: ~95px × 23px, fundo preto 60%,
 * texto cinza #666666, 8px weight 300.
 *
 * Posicionamento: `top: 96px` deixa folga abaixo do bloco da logo
 * (logo está em top-6 / top-8 com altura ~64px).
 */
const SHOW_INTERVAL_MS = 15 * 60 * 1000; // 15 minutos
const VISIBLE_MS       = 15 * 1000;       // 15 segundos
const FADE_MS          = 500;             // fade-out 0.5s

export const AdRotating = () => {
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cycleRef = useRef(0);

  useEffect(() => {
    if (rotatingAds.length === 0) return;

    let fadeTimer: number | undefined;
    let unmountTimer: number | undefined;

    const showAd = () => {
      setIndex(cycleRef.current % rotatingAds.length);
      cycleRef.current += 1;
      setMounted(true);
      // próximo frame → opacity 1 (fade-in suave também)
      requestAnimationFrame(() => setVisible(true));

      // após VISIBLE_MS começa o fade-out
      fadeTimer = window.setTimeout(() => {
        setVisible(false);
        // depois do fade desmontamos
        unmountTimer = window.setTimeout(() => setMounted(false), FADE_MS);
      }, VISIBLE_MS);
    };

    // Em produção: primeira aparição após 15min.
    // Em dev: mostra logo após 5s para QA visual.
    const firstDelay = import.meta.env.DEV ? 5_000 : SHOW_INTERVAL_MS;
    const firstTimer = window.setTimeout(showAd, firstDelay);
    const interval   = window.setInterval(showAd, SHOW_INTERVAL_MS);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
      window.clearInterval(interval);
    };
  }, []);

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
