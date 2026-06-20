'use client';

import { useReducer, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CharacterBadge } from '@/components/chat/CharacterBadge';
import { useCharacter } from '@/context/CharacterContext';
import { aiService } from '@/services/ai.service';
import { ApiError } from '@/lib/api';
import { CharacterDetailResponse } from '@/types/character.types';
import { AnalyzeCharacterData } from '@/types/ai.types';

interface AnalyzeCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    target: CharacterDetailResponse;
}

function buildAnalyzeCharacterData(target: CharacterDetailResponse): AnalyzeCharacterData {
    return {
        id: target.id,
        name: target.name,
        nativeName: target.nativeName,
        description: target.description,
        age: target.age,
        gender: target.gender,
        bloodType: target.bloodType,
        height: target.height,
        birthday: target.birthday ?? undefined,
        favourites: target.favourites,
        mediaMain: target.mediaMain.map((m) => ({ title: m.title.romaji, year: m.year, role: m.role })),
        mediaSupporting: target.mediaSupporting.map((m) => ({ title: m.title.romaji, year: m.year, role: m.role })),
    };
}

type State = {
    analysis: string | null;
    isLoading: boolean;
    error: string | null;
};

type Action =
    | { type: 'START' }
    | { type: 'SUCCESS'; analysis: string }
    | { type: 'ERROR'; error: string };

const initialState: State = { analysis: null, isLoading: false, error: null };

function reducer(_state: State, action: Action): State {
    switch (action.type) {
        case 'START': return { analysis: null, isLoading: true, error: null };
        case 'SUCCESS': return { analysis: action.analysis, isLoading: false, error: null };
        case 'ERROR': return { analysis: null, isLoading: false, error: action.error };
        default: return _state;
    }
}

export function AnalyzeCharacterModal({ isOpen, onClose, target }: AnalyzeCharacterModalProps) {
    const { character } = useCharacter();
    const [{ analysis, isLoading, error }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!isOpen) return;
        dispatch({ type: 'START' });

        aiService
            .analyzeCharacter({ character, targetCharacter: buildAnalyzeCharacterData(target) })
            .then((res) => dispatch({ type: 'SUCCESS', analysis: res.analysis }))
            .catch((err) =>
                dispatch({
                    type: 'ERROR',
                    error: err instanceof ApiError ? err.message : 'Error al analizar el personaje',
                }),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, target.id]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closable={false} title={`Análisis de ${character.characterName}`}>
            <div className="flex flex-col gap-4">
                <CharacterBadge character={character} size="md" showAnimeName />

                {isLoading && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
                        <p>{character.characterName} está pensando su opinión sobre {target.name}…</p>
                    </div>
                )}

                {error && <p className="text-sm text-red-400">{error}</p>}

                {analysis && <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{analysis}</p>}

                <Button onClick={onClose} variant="primary" className="mt-2 self-end">
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
}
