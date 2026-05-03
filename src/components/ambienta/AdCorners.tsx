import { ads } from "@/data/ads";

/**
 * AdCorners — anúncios discretíssimos nos 4 cantos da tela.
 * Usado nas TELAS DE ESCOLHA (Cenas, Rádios, Canais 24h).
 *
 * Estilo idêntico ao AdFixed: 95×23px, fundo #0B0B0B 60%,
 * texto #666666 8px weight 300. Sem clique, sem som, sem animação.
 */
const corners = [
  { pos: "top-left",     style: { top: "12px",    left: "12px"  } },
  { pos: "top-right",    style: { top: "12px",    right: "12px" } },
  { pos: "bottom-left",  style: { bottom: "12px", left: "12px"  } },
  { pos: "bottom-right", style: { bottom: "12px", right: "12px" } },
] as const;

export const AdCorners = () => {
  // Pega 4 marcas distintas (round-robin sobre o pool completo).
  const pool = ads.length > 0 ? ads : [];
  if (pool.length === 0) return null;

  return (
    <>
      {corners.map((c, i) => {
        const ad = pool[i % pool.length];
        return (
          <div
            key={c.pos}
            aria-hidden="true"
            role="presentation"
            className="pointer-events-none fixed z-[60] flex items-center justify-center"
            style={{
              ...c.style,
              width: "95px",
              height: "23px",
              backgroundColor: "rgba(11, 11, 11, 0.6)",
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
      })}
    </>
  );
};
