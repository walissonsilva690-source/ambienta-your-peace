/**
 * Mock de anúncios — substituir por backend (Lovable Cloud) depois.
 *
 * Regras de exibição:
 *  - `fixed`    → banner sempre visível no canto superior direito (não clicável).
 *  - `rotating` → aparece a cada 15min por 15s no canto superior esquerdo.
 *
 * Estilo: discretíssimo. Apenas o nome da marca em cinza muito escuro.
 */

export type AdSlot = "fixed" | "rotating";

export interface Ad {
  id: string;
  slot: AdSlot;
  /** Nome curto da marca exibido (em maiúsculas) */
  brand: string;
}

export const ads: Ad[] = [
  // Fixo — uma única marca rotaciona pouco; mantemos só uma por enquanto.
  { id: "fx-nike",    slot: "fixed",    brand: "NIKE" },

  // Rotativo — sequência exibida a cada 15min, uma por ciclo.
  { id: "rt-adidas",  slot: "rotating", brand: "ADIDAS" },
  { id: "rt-spotify", slot: "rotating", brand: "SPOTIFY" },
  { id: "rt-coke",    slot: "rotating", brand: "COCA-COLA" },
  { id: "rt-apple",   slot: "rotating", brand: "APPLE" },
];

export const fixedAds = ads.filter((a) => a.slot === "fixed");
export const rotatingAds = ads.filter((a) => a.slot === "rotating");
