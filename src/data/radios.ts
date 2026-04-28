export type RadioCategory =
  | "destaque" | "brasil" | "mundo" | "rock" | "eletronica" | "relax" | "noticias";

export type Radio = {
  id: string;
  name: string;
  location: string;
  /** Short tag rendered as fake logo (1-4 chars) */
  short: string;
  /** Two HSL colors for the logo gradient */
  gradient: [string, string];
  /** Optional emoji accent */
  accent?: string;
  categories: RadioCategory[];
};

export type RadioFilter = {
  id: "mundo" | "brasil" | "rock" | "eletronica" | "relax" | "noticias" | "favoritos";
  label: string;
  emoji: string;
};

export const radioFilters: RadioFilter[] = [
  { id: "mundo",      label: "Mundo",      emoji: "🌎" },
  { id: "brasil",     label: "Brasil",     emoji: "🇧🇷" },
  { id: "rock",       label: "Rock",       emoji: "🎸" },
  { id: "eletronica", label: "Eletrônica", emoji: "🎧" },
  { id: "relax",      label: "Relax",      emoji: "🧠" },
  { id: "noticias",   label: "Notícias",   emoji: "📰" },
  { id: "favoritos",  label: "Favoritos",  emoji: "❤️" },
];

export const radios: Radio[] = [
  // === Em destaque / Mundo ===
  { id: "bbc1",     name: "BBC Radio 1",       location: "Reino Unido", short: "BBC",    gradient: ["0 75% 45%",   "0 0% 10%"],   categories: ["destaque", "mundo", "noticias"] },
  { id: "npr",      name: "NPR Live",          location: "Estados Unidos", short: "NPR", gradient: ["210 80% 50%", "240 70% 25%"],categories: ["destaque", "mundo", "noticias"] },
  { id: "jazz-fr",  name: "Jazz Radio",        location: "França", short: "JR",         gradient: ["35 85% 50%",  "20 70% 18%"], categories: ["destaque", "mundo", "relax"] },
  { id: "chill",    name: "Chill Lover Radio", location: "Alemanha", short: "CL",       gradient: ["180 60% 40%", "240 60% 22%"],categories: ["destaque", "mundo", "relax"] },
  { id: "kexp",     name: "KEXP 90.3 FM",      location: "Estados Unidos", short: "KX", gradient: ["280 80% 50%", "220 70% 25%"],categories: ["destaque", "mundo", "rock"] },

  // === Brasil ===
  { id: "jovempan", name: "Jovem Pan News",    location: "São Paulo - SP", short: "JP", gradient: ["0 80% 50%",   "0 0% 10%"],   categories: ["brasil", "noticias"] },
  { id: "89fm",     name: "Rádio 89 FM",       location: "São Paulo - SP", short: "89", gradient: ["0 75% 50%",   "20 70% 25%"], categories: ["brasil", "rock"] },
  { id: "antena1",  name: "Antena 1 FM",       location: "São Paulo - SP", short: "A1", gradient: ["220 80% 50%", "260 70% 30%"],categories: ["brasil", "relax"] },
  { id: "bandnews", name: "BandNews FM",       location: "São Paulo - SP", short: "BN", gradient: ["210 80% 45%", "0 70% 40%"],  categories: ["brasil", "noticias"] },
  { id: "cbn",      name: "CBN FM",            location: "São Paulo - SP", short: "CBN",gradient: ["0 75% 45%",   "240 60% 25%"],categories: ["brasil", "noticias"] },
  { id: "kiss",     name: "Kiss FM",           location: "São Paulo - SP", short: "KS", gradient: ["340 80% 50%", "0 0% 12%"],   categories: ["brasil", "rock"] },

  // === Mundo ===
  { id: "rp",       name: "Radio Paradise",    location: "Estados Unidos", short: "RP", gradient: ["20 80% 45%",  "30 70% 25%"], categories: ["mundo", "rock"] },
  { id: "skyfm",    name: "Sky.FM Chillout",   location: "Estados Unidos", short: "SK", gradient: ["195 90% 60%", "240 70% 30%"],categories: ["mundo", "relax", "eletronica"] },
  { id: "classic",  name: "Classic FM",        location: "Reino Unido", short: "CFM",   gradient: ["35 70% 45%",  "20 60% 22%"], categories: ["mundo", "relax"] },
  { id: "inter",    name: "France Inter",      location: "França", short: "INT",        gradient: ["0 80% 50%",   "0 0% 12%"],   categories: ["mundo", "noticias"] },
  { id: "deutsch",  name: "Deutschlandfunk",   location: "Alemanha", short: "DE",       gradient: ["210 90% 55%", "220 70% 30%"],categories: ["mundo", "noticias"] },

  // === Rock ===
  { id: "planet",   name: "Planet Rock",       location: "Reino Unido", short: "PR",    gradient: ["0 75% 45%",   "0 0% 10%"],   categories: ["rock"] },
  { id: "metalfm",  name: "Metal FM",          location: "Finlândia", short: "MFM",     gradient: ["260 30% 25%", "0 0% 5%"],    categories: ["rock"] },
  { id: "indiepop", name: "Indie Pop Radio",   location: "Suécia", short: "IP",         gradient: ["320 70% 50%", "260 60% 25%"],categories: ["rock"] },

  // === Eletrônica ===
  { id: "ibiza",    name: "Ibiza Sonica",      location: "Espanha", short: "IBZ",       gradient: ["280 85% 55%", "200 80% 35%"],categories: ["eletronica", "mundo"] },
  { id: "deephous", name: "Deep House Radio",  location: "Holanda", short: "DH",        gradient: ["200 90% 50%", "280 80% 30%"],categories: ["eletronica"] },

  // === Relax ===
  { id: "calmrad",  name: "Calm Radio",        location: "Canadá", short: "CR",         gradient: ["180 60% 40%", "260 60% 25%"],categories: ["relax"] },
  { id: "smooth",   name: "Smooth Jazz 24/7",  location: "Estados Unidos", short: "SJ", gradient: ["35 85% 45%",  "20 70% 20%"], categories: ["relax"] },
];

export const radioSections: { id: string; title: string; emoji: string; filter: (r: Radio) => boolean }[] = [
  { id: "destaque", title: "Em destaque", emoji: "🔥", filter: (r) => r.categories.includes("destaque") },
  { id: "brasil",   title: "Brasil",      emoji: "🇧🇷", filter: (r) => r.categories.includes("brasil") },
  { id: "mundo",    title: "Mundo",       emoji: "🌎", filter: (r) => r.categories.includes("mundo") },
  { id: "rock",     title: "Rock",        emoji: "🎸", filter: (r) => r.categories.includes("rock") },
  { id: "relax",    title: "Relax",       emoji: "🧠", filter: (r) => r.categories.includes("relax") },
];
