'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { SelectedCharacter } from '@/types/ai.types';
import { useSelectedCharacter } from '@/hooks/useSelectedCharacter';
import { STORAGE_KEYS } from '@/lib/constants';

interface CharacterContextValue {
    character: SelectedCharacter;
    setCharacter: (character: SelectedCharacter) => void;
    resetToDefault: () => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
    const { character, setCharacter: setCharacterBase, resetToDefault } = useSelectedCharacter();

    // Cualquier cambio de personaje borra el historial del chat anterior
    const setCharacter = useCallback(
        (newCharacter: SelectedCharacter) => {
            window.localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
            setCharacterBase(newCharacter);
        },
        [setCharacterBase],
    );

    return (
        <CharacterContext.Provider value={{ character, setCharacter, resetToDefault }}>
            {children}
        </CharacterContext.Provider>
    );
}

export function useCharacter(): CharacterContextValue {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error('useCharacter debe usarse dentro de <CharacterProvider>.');
    }
    return context;
}
