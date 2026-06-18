"use client";

import { useState, useCallback } from "react";
import { SelectedCharacter } from "@/types/ai.types";
import { DEFAULT_CHARACTER, STORAGE_KEYS } from "@/lib/constants";

function persist(character: SelectedCharacter): void {
  window.localStorage.setItem(
    STORAGE_KEYS.SELECTED_CHARACTER,
    JSON.stringify(character),
  );
}

function getInitialCharacter(): SelectedCharacter {
  // Solo se ejecuta en el cliente: con useState lazy init nunca corre
  // en el servidor durante el renderizado inicial de Next.js
  if (typeof window === "undefined") return DEFAULT_CHARACTER;

  const stored = window.localStorage.getItem(STORAGE_KEYS.SELECTED_CHARACTER);

  if (!stored) {
    persist(DEFAULT_CHARACTER);
    return DEFAULT_CHARACTER;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<SelectedCharacter>;
    // Fusiona con el default: si en el futuro se añade un campo nuevo a
    // SelectedCharacter, los usuarios con datos antiguos guardados no
    // se quedan con `undefined` en ese campo.
    return { ...DEFAULT_CHARACTER, ...parsed };
  } catch {
    persist(DEFAULT_CHARACTER);
    return DEFAULT_CHARACTER;
  }
}

export function useSelectedCharacter() {
  const [character, setCharacterState] =
    useState<SelectedCharacter>(getInitialCharacter);

  const setCharacter = useCallback((newCharacter: SelectedCharacter) => {
    persist(newCharacter);
    setCharacterState(newCharacter);
  }, []);

  const resetToDefault = useCallback(
    () => setCharacter(DEFAULT_CHARACTER),
    [setCharacter],
  );

  return { character, setCharacter, resetToDefault };
}
