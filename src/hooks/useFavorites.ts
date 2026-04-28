import { useEffect, useState } from "react";

const KEY = "ambienta:favorites";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || "[]"));
  } catch {
    return new Set();
  }
}

const listeners = new Set<() => void>();
let state = read();

function emit() {
  state = new Set(state);
  localStorage.setItem(KEY, JSON.stringify([...state]));
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  return {
    favorites: state,
    isFavorite: (id: string) => state.has(id),
    toggle: (id: string) => {
      if (state.has(id)) state.delete(id); else state.add(id);
      emit();
    },
  };
}
