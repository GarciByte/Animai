'use client';

import { createContext, useContext, ReactNode } from 'react';
import { SelectedCharacter } from '@/types/ai.types';
import { useSelectedCharacter } from '@/hooks/useSelectedCharacter';

interface CharacterContextValue {
    character: SelectedCharacter;
    setCharacter: (character: SelectedCharacter) => void;
    resetToDefault: () => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
    const { character, setCharacter, resetToDefault } = useSelectedCharacter();

    return (
        <CharacterContext.Provider value={{ character, setCharacter, resetToDefault }}>
            {children}
        </CharacterContext.Provider>
    );
}

// Hook para consumir el contexto en cualquier Client Component.
// Lanza un error descriptivo si se usa fuera del provider para
// facilitar el debug en lugar de fallar silenciosamente con null.
export function useCharacter(): CharacterContextValue {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error(
            'useCharacter debe usarse dentro de <CharacterProvider>. ' +
            'Asegúrate de que el componente está dentro del árbol de CharacterProvider.',
        );
    }
    return context;
}
