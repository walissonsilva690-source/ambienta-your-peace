import { LucideIcon, Disc3, Radio, Guitar, Music2, Headphones, Mic2, Drum, Piano, Film, Baby, Cross, Clapperboard, Sparkles, Tv, Waves, Flame, Wine } from "lucide-react";

export type Channel = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Two HSL colors for the gradient background */
  gradient: [string, string];
};

export type ChannelSection = {
  id: string;
  title: string;
  channels: Channel[];
};

export const channelSections: ChannelSection[] = [
  {
    id: "decadas",
    title: "Por década",
    channels: [
      { id: "70s", name: "Anos 70", description: "Disco e clássicos", icon: Disc3,    gradient: ["35 90% 45%", "20 80% 25%"] },
      { id: "80s", name: "Anos 80", description: "Synthwave e pop",    icon: Radio,    gradient: ["320 80% 50%", "270 70% 30%"] },
      { id: "90s", name: "Anos 90", description: "MTV generation",     icon: Tv,       gradient: ["180 70% 40%", "240 70% 25%"] },
      { id: "flash", name: "Flashbacks", description: "Hits eternos",  icon: Sparkles, gradient: ["280 90% 55%", "220 70% 25%"] },
    ],
  },
  {
    id: "genero",
    title: "Por gênero",
    channels: [
      { id: "rock",   name: "Rock Clássico",  description: "Riffs lendários",     icon: Guitar,    gradient: ["0 75% 45%",   "0 0% 12%"] },
      { id: "metal",  name: "Metal",          description: "Peso e energia",      icon: Drum,      gradient: ["260 30% 25%", "0 0% 8%"] },
      { id: "indie",  name: "Indie",          description: "Alternativo moderno", icon: Headphones,gradient: ["210 80% 50%", "260 70% 25%"] },
      { id: "jazz",   name: "Jazz & Blues",   description: "Clima de bar",        icon: Mic2,      gradient: ["35 85% 50%",  "20 70% 18%"] },
      { id: "lounge", name: "Lounge / Chill", description: "Para relaxar",        icon: Wine,      gradient: ["280 50% 40%", "240 60% 18%"] },
      { id: "house",  name: "House",          description: "Batida eletrônica",   icon: Music2,    gradient: ["200 90% 55%", "280 80% 35%"] },
    ],
  },
  {
    id: "brasil",
    title: "Brasil",
    channels: [
      { id: "mpb",      name: "MPB / Bossa Nova", description: "Brasilidade suave", icon: Piano, gradient: ["35 70% 45%",  "20 60% 22%"] },
      { id: "sertanejo",name: "Sertanejo",        description: "Modão e raiz",      icon: Guitar,gradient: ["25 70% 45%",  "15 60% 20%"] },
      { id: "samba",    name: "Samba / Pagode",   description: "Roda e batucada",   icon: Drum,  gradient: ["140 60% 35%", "30 60% 25%"] },
      { id: "forro",    name: "Forró",            description: "Pé-de-serra",       icon: Music2,gradient: ["30 80% 50%",  "15 70% 25%"] },
    ],
  },
  {
    id: "especiais",
    title: "Especiais",
    channels: [
      { id: "trilhas", name: "Trilhas Sonoras", description: "Cinema épico",   icon: Film,        gradient: ["220 60% 30%", "260 60% 18%"] },
      { id: "infantil",name: "Infantil",        description: "Para os pequenos",icon: Baby,       gradient: ["195 80% 60%", "320 70% 60%"] },
      { id: "gospel",  name: "Gospel",          description: "Música cristã",  icon: Cross,       gradient: ["35 70% 45%",  "240 60% 25%"] },
      { id: "filmes",  name: "Temas de Filmes", description: "Clássicos do cinema", icon: Clapperboard, gradient: ["0 70% 45%",   "0 0% 10%"] },
    ],
  },
];

// Featured hero channel
export const featuredChannel = {
  id: "jazz",
  name: "Jazz & Blues",
  description: "Clima de bar intimista com o melhor do jazz e blues. 24 horas por dia.",
};

// Bonus icons re-exported for convenience
export const _icons = { Waves, Flame };
