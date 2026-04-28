import fireplace from "@/assets/scene-fireplace.jpg";
import rain from "@/assets/scene-rain.jpg";
import ocean from "@/assets/scene-ocean.jpg";
import forest from "@/assets/scene-forest.jpg";
import cabin from "@/assets/scene-cabin.jpg";

export type Scene = {
  id: string;
  name: string;
  src: string;
};

export const scenes: Scene[] = [
  { id: "fireplace", name: "Lareira", src: fireplace },
  { id: "rain",      name: "Chuva",   src: rain },
  { id: "ocean",     name: "Mar",     src: ocean },
  { id: "forest",    name: "Floresta",src: forest },
  { id: "cabin",     name: "Cabana",  src: cabin },
];
