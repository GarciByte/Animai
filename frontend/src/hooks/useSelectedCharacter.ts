"use client";

import { useState, useEffect, useCallback } from "react";
import { SelectedCharacter } from "@/types/ai.types";
import { DEFAULT_CHARACTER, STORAGE_KEYS } from "@/lib/constants";

function persist(character: SelectedCharacter): void {
  window.localStorage.setItem(
    STORAGE_KEYS.SELECTED_CHARACTER,
    JSON.stringify(character),
  );
}

export function useSelectedCharacter() {
  // El primer render (servidor Y cliente) usa SIEMPRE el mismo valor,
  // para que la hidratación nunca pueda chocar.
  const [character, setCharacterState] =
    useState<SelectedCharacter>(DEFAULT_CHARACTER);

  // Tras el montaje (solo en el cliente), se sincroniza con lo que
  // haya guardado en localStorage.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.SELECTED_CHARACTER);

    if (!stored) {
      persist(DEFAULT_CHARACTER);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<SelectedCharacter>;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCharacterState({ ...DEFAULT_CHARACTER, ...parsed });
    } catch {
      persist(DEFAULT_CHARACTER);
    }
  }, []);

  const setCharacter = useCallback((newCharacter: SelectedCharacter) => {
    persist(newCharacter);
    setCharacterState(newCharacter);
  }, []);

  const resetToDefault = useCallback(
    () => setCharacter(DEFAULT_CHARACTER),
    [setCharacter],
  );

  return { character, setCharacter, resetToDefault } as const;
}
