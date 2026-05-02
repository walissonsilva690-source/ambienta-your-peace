import { fixedAds } from "@/data/ads";

/**
 * Anúncio FIXO — canto superior direito.
 *
 * Especificação (intencionalmente discretíssimo):
 *  - ~2.5cm × 0.6cm  → 95px × 23px
 *  - Fundo: #0B0B0B com 60% de opacidade
 *  - Texto: nome da marca em #666666, 8px, weight 300
 *  - 12px do topo / 12px da direita
 *  - Sem borda, sem ícone, sem botão fechar
 *  - Sem som, sem animação, sem piscar
 *  - Não clicável (`pointer-events-none`)
 *
 * Posicionado em `position: fixed` — funciona globalmente.
 */
export const AdFixed = () => {
  const ad = fixedAds[0];
  if (!ad) return null;

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none fixed top-3 right-3 z-[60] flex items-center justify-center"
      style={{
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
};
