import { useState } from "react";
import { SelectedCharacter } from "@/types/ai.types";
import { DEFAULT_CHARACTER, SELECTED_CHARACTER_KEY } from "@/lib/constants";

function getInitialCharacter(): SelectedCharacter {
  // Esta función solo se ejecuta en el cliente (useState lazy init)
  if (typeof window === "undefined") return DEFAULT_CHARACTER;

  const stored = localStorage.getItem(SELECTED_CHARACTER_KEY);

  if (!stored) {
    localStorage.setItem(
      SELECTED_CHARACTER_KEY,
      JSON.stringify(DEFAULT_CHARACTER),
    );
    return DEFAULT_CHARACTER;
  }

  try {
    return JSON.parse(stored) as SelectedCharacter;
  } catch {
    // JSON corrupto: restaurar el personaje por defecto
    localStorage.setItem(
      SELECTED_CHARACTER_KEY,
      JSON.stringify(DEFAULT_CHARACTER),
    );
    return DEFAULT_CHARACTER;
  }
}

export function useSelectedCharacter() {
  // La función se pasa como callback para que useState la llame
  // solo una vez durante la inicialización, no en cada render
  const [character, setCharacter] =
    useState<SelectedCharacter>(getInitialCharacter);

  const updateCharacter = (newCharacter: SelectedCharacter) => {
    localStorage.setItem(SELECTED_CHARACTER_KEY, JSON.stringify(newCharacter));
    setCharacter(newCharacter);
  };

  return { character, updateCharacter };
}
