import waterfall from "@/assets/scene-waterfall.jpg";
import rainWindow from "@/assets/scene-rain.jpg";
import rainCabin from "@/assets/scene-cabin.jpg";
import sea from "@/assets/scene-ocean.jpg";
import beach from "@/assets/scene-beach.jpg";
import lake from "@/assets/scene-lake.jpg";
import forest from "@/assets/scene-forest.jpg";
import camping from "@/assets/scene-camping.jpg";
import river from "@/assets/scene-river.jpg";
import porch from "@/assets/scene-porch.jpg";
import fireplace from "@/assets/scene-fireplace.jpg";

export type SceneCategory =
  | "agua" | "chuva" | "floresta" | "cabanas" | "lareiras" | "natureza";

export type SceneItem = {
  id: string;
  name: string;
  ambient: string;
  category: SceneCategory;
  src: string;
};

export const sceneCatalog: SceneItem[] = [
  { id: "waterfall",  name: "Cachoeira à noite", ambient: "Água corrente",   category: "agua",     src: waterfall },
  { id: "rain-window",name: "Chuva na janela",   ambient: "Chuva suave",     category: "chuva",    src: rainWindow },
  { id: "rain-cabin", name: "Chuva na cabana",   ambient: "Chuva e madeira", category: "cabanas",  src: rainCabin },
  { id: "sea",        name: "Mar tranquilo",     ambient: "Ondas calmas",    category: "agua",     src: sea },
  { id: "beach",      name: "Praia à noite",     ambient: "Brisa e ondas",   category: "agua",     src: beach },
  { id: "lake",       name: "Lago sereno",       ambient: "Fogueira e vento",category: "natureza", src: lake },
  { id: "forest",     name: "Floresta noturna",  ambient: "Grilos e folhas", category: "floresta", src: forest },
  { id: "camping",    name: "Acampamento",       ambient: "Floresta calma",  category: "floresta", src: camping },
  { id: "river",      name: "Rio na floresta",   ambient: "Água e mata",     category: "agua",     src: river },
  { id: "porch",      name: "Noite na varanda",  ambient: "Lanterna e vento",category: "cabanas",  src: porch },
  { id: "fireplace",  name: "Lareira aconchego", ambient: "Lenha crepitando",category: "lareiras", src: fireplace },
];

export const sceneCategories: { id: "all" | SceneCategory; label: string }[] = [
  { id: "all",      label: "Todas" },
  { id: "agua",     label: "Água" },
  { id: "chuva",    label: "Chuva" },
  { id: "floresta", label: "Floresta" },
  { id: "cabanas",  label: "Cabanas" },
  { id: "lareiras", label: "Lareiras" },
  { id: "natureza", label: "Natureza" },
];
