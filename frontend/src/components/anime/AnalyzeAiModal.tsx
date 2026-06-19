'use client';

import { useReducer, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CharacterBadge } from '@/components/chat/CharacterBadge';
import { useCharacter } from '@/context/CharacterContext';
import { aiService } from '@/services/ai.service';
import { ApiError } from '@/lib/api';
import { AnimeDetailResponse } from '@/types/anime.types';
import { AnalyzeAnimeData } from '@/types/ai.types';

interface AnalyzeAiModalProps {
    isOpen: boolean;
    onClose: () => void;
    anime: AnimeDetailResponse;
}

function buildAnalyzeAnimeData(anime: AnimeDetailResponse): AnalyzeAnimeData {
    return {
        id: anime.id,
        title: { romaji: anime.title.romaji, english: anime.title.english },
        description: anime.description,
        format: anime.format,
        status: anime.status,
        episodes: anime.episodes,
        duration: anime.duration,
        source: anime.source,
        season: anime.season,
        seasonYear: anime.seasonYear,
        startDate: anime.startDate,
        endDate: anime.endDate,
        countryOfOrigin: anime.countryOfOrigin,
        averageScore: anime.averageScore,
        meanScore: anime.meanScore,
        popularity: anime.popularity,
        favourites: anime.favourites,
        genres: anime.genres,
        tags: anime.tags.map((t) => ({ name: t.name, category: t.category })),
        studios: anime.studios.map((s) => ({ name: s.name })),
        characters: anime.characters.map((c) => ({ name: c.name, role: c.role })),
        relations: anime.relations.map((r) => ({ title: r.title.romaji, relationType: r.relationType })),
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

export function AnalyzeAiModal({ isOpen, onClose, anime }: AnalyzeAiModalProps) {
    const { character } = useCharacter();
    const [{ analysis, isLoading, error }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!isOpen) return;
        dispatch({ type: 'START' }); // ← un solo dispatch, un solo render

        aiService
            .analyzeAnime({ character, anime: buildAnalyzeAnimeData(anime) })
            .then((res) => dispatch({ type: 'SUCCESS', analysis: res.analysis }))
            .catch((err) =>
                dispatch({
                    type: 'ERROR',
                    error: err instanceof ApiError ? err.message : 'Error al analizar el anime',
                }),
            );
        // Solo debe relanzarse al abrir el modal o si cambia el anime, no en cada render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, anime.id]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closable={false} title={`Análisis de ${character.characterName}`}>
            <div className="flex flex-col gap-4">
                <CharacterBadge character={character} size="md" showAnimeName />

                {isLoading && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
                        <p>{character.characterName} está pensando su opinión sobre {anime.title.romaji}…</p>
                    </div>
                )}

                {error && <p className="text-sm text-red-400">{error}</p>}

                {analysis && (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{analysis}</p>
                )}

                <Button onClick={onClose} variant="primary" className="mt-2 self-end">
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
}
