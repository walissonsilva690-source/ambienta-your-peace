import { LucideIcon, Disc3, Radio, Guitar, Music2, Headphones, Mic2, Drum, Piano, Film, Baby, Cross, Clapperboard, Sparkles, Tv, Waves, Flame, Wine } from "lucide-react";

export type Channel = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Two HSL colors for the gradient background */
  gradient: [string, string];
  /** Continuous 24/7 audio stream URL (Icecast/Shoutcast/HTTP Live) */
  streamUrl: string;
};

export type ChannelSection = {
  id: string;
  title: string;
  channels: Channel[];
};

// Stream sources: SomaFM (CORS-friendly, free, 24/7),
// Radio Paradise, and other reliable public Icecast streams.
export const channelSections: ChannelSection[] = [
  {
    id: "decadas",
    title: "Por década",
    channels: [
      { id: "70s",   name: "Anos 70",     description: "Disco e clássicos", icon: Disc3,    gradient: ["35 90% 45%",  "20 80% 25%"],  streamUrl: "https://ice1.somafm.com/seventies-128-mp3" },
      { id: "80s",   name: "Anos 80",     description: "Synthwave e pop",   icon: Radio,    gradient: ["320 80% 50%", "270 70% 30%"], streamUrl: "https://ice1.somafm.com/u80s-128-mp3" },
      { id: "90s",   name: "Anos 90",     description: "MTV generation",    icon: Tv,       gradient: ["180 70% 40%", "240 70% 25%"], streamUrl: "https://ice1.somafm.com/poptron-128-mp3" },
      { id: "flash", name: "Flashbacks",  description: "Hits eternos",      icon: Sparkles, gradient: ["280 90% 55%", "220 70% 25%"], streamUrl: "https://ice1.somafm.com/thetrip-128-mp3" },
    ],
  },
  {
    id: "genero",
    title: "Por gênero",
    channels: [
      { id: "rock",   name: "Rock Clássico",  description: "Riffs lendários",     icon: Guitar,    gradient: ["0 75% 45%",   "0 0% 12%"],   streamUrl: "https://ice1.somafm.com/thistle-128-mp3" },
      { id: "metal",  name: "Metal",          description: "Peso e energia",      icon: Drum,      gradient: ["260 30% 25%", "0 0% 8%"],    streamUrl: "https://ice1.somafm.com/metal-128-mp3" },
      { id: "indie",  name: "Indie",          description: "Alternativo moderno", icon: Headphones,gradient: ["210 80% 50%", "260 70% 25%"],streamUrl: "https://ice1.somafm.com/indiepop-128-mp3" },
      { id: "jazz",   name: "Jazz & Blues",   description: "Clima de bar",        icon: Mic2,      gradient: ["35 85% 50%",  "20 70% 18%"], streamUrl: "https://ice1.somafm.com/sonicuniverse-128-mp3" },
      { id: "lounge", name: "Lounge / Chill", description: "Para relaxar",        icon: Wine,      gradient: ["280 50% 40%", "240 60% 18%"],streamUrl: "https://ice1.somafm.com/groovesalad-128-mp3" },
      { id: "house",  name: "House",          description: "Batida eletrônica",   icon: Music2,    gradient: ["200 90% 55%", "280 80% 35%"],streamUrl: "https://ice1.somafm.com/beatblender-128-mp3" },
      { id: "lofi",   name: "Lo-fi / Chill",  description: "Beats para foco",     icon: Headphones,gradient: ["260 60% 35%", "210 70% 25%"],streamUrl: "https://ice1.somafm.com/defcon-128-mp3" },
      { id: "classica",name: "Clássica",      description: "Orquestral e câmara", icon: Piano,     gradient: ["220 50% 30%", "260 50% 18%"],streamUrl: "https://stream.radioparadise.com/mellow-128" },
      { id: "piano", name: "Piano Relax",    description: "Solos suaves",        icon: Piano,     gradient: ["240 40% 28%", "280 50% 18%"],streamUrl: "https://stream.radioparadise.com/serenity" },
      { id: "natureza",name: "Natureza",     description: "Sons ambientes",      icon: Waves,     gradient: ["180 60% 30%", "200 70% 18%"],streamUrl: "https://ice1.somafm.com/deepspaceone-128-mp3" },
    ],
  },
  {
    id: "brasil",
    title: "Brasil",
    channels: [
      { id: "mpb",      name: "MPB / Bossa Nova", description: "Brasilidade suave", icon: Piano, gradient: ["35 70% 45%",  "20 60% 22%"], streamUrl: "https://ice1.somafm.com/bossa-128-mp3" },
      { id: "sertanejo",name: "Sertanejo",        description: "Modão e raiz",      icon: Guitar,gradient: ["25 70% 45%",  "15 60% 20%"], streamUrl: "https://stream.zeno.fm/0r0xa792kwzuv" },
      { id: "samba",    name: "Samba / Pagode",   description: "Roda e batucada",   icon: Drum,  gradient: ["140 60% 35%", "30 60% 25%"], streamUrl: "https://stream.zeno.fm/u0a9qz7tk5quv" },
      { id: "forro",    name: "Forró",            description: "Pé-de-serra",       icon: Music2,gradient: ["30 80% 50%",  "15 70% 25%"], streamUrl: "https://stream.zeno.fm/zsmdmxavwl8uv" },
    ],
  },
  {
    id: "especiais",
    title: "Especiais",
    channels: [
      { id: "trilhas", name: "Trilhas Sonoras", description: "Cinema épico",        icon: Film,         gradient: ["220 60% 30%", "260 60% 18%"], streamUrl: "https://ice1.somafm.com/sf1033-128-mp3" },
      { id: "infantil",name: "Infantil",        description: "Para os pequenos",    icon: Baby,         gradient: ["195 80% 60%", "320 70% 60%"], streamUrl: "https://ice1.somafm.com/fluid-128-mp3" },
      { id: "gospel",  name: "Gospel",          description: "Música cristã",       icon: Cross,        gradient: ["35 70% 45%",  "240 60% 25%"], streamUrl: "https://stream.zeno.fm/yn65fsaurfhvv" },
      { id: "filmes",  name: "Temas de Filmes", description: "Clássicos do cinema", icon: Clapperboard, gradient: ["0 70% 45%",   "0 0% 10%"],   streamUrl: "https://ice1.somafm.com/sf1033-128-mp3" },
    ],
  },
];

// Featured hero channel — points to the Jazz & Blues channel above.
export const featuredChannel = {
  id: "jazz",
  name: "Jazz & Blues",
  description: "Clima de bar intimista com o melhor do jazz e blues. 24 horas por dia.",
};

export const _icons = { Waves, Flame };

// Helper — flat lookup
export const allChannels = channelSections.flatMap((s) => s.channels);
export const findChannel = (id: string) => allChannels.find((c) => c.id === id);
