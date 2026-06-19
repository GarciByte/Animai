'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/ai.service';
import { ApiError } from '@/lib/api';
import { AnimeDetailResponse } from '@/types/anime.types';

interface AnimeDescriptionProps {
    anime: AnimeDetailResponse;
}

// AniList devuelve algo de HTML básico (<br>, <i>) en la descripción
function stripHtml(text: string): string {
    return text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
}

export function AnimeDescription({ anime }: AnimeDescriptionProps) {
    // Prioridad: descripción de TMDB en español; si no llega, la de AniList
    const original = anime.descriptionEs ?? (anime.description ? stripHtml(anime.description) : null);
    const isAlreadySpanish = Boolean(anime.descriptionEs);

    const [translated, setTranslated] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!original) {
        return <p className="text-sm text-muted">Sin sinopsis disponible.</p>;
    }

    const displayText = showOriginal ? original : translated ?? original;

    const handleTranslate = async () => {
        setIsTranslating(true);
        setError(null);
        try {
            const res = await aiService.translate({
                text: original,
                context: 'ANIME_DESCRIPTION',
                animeContext: {
                    title: anime.title.romaji,
                    genres: anime.genres,
                    format: anime.format,
                    tags: anime.tags.map((t) => t.name),
                },
            });
            setTranslated(res.translatedText);
            setShowOriginal(false);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Error al traducir');
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{displayText}</p>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2">
                {!isAlreadySpanish && !translated && (
                    <Button variant="outline" size="sm" onClick={handleTranslate} isLoading={isTranslating}>
                        Traducir
                    </Button>
                )}
                {translated && (
                    <Button variant="ghost" size="sm" onClick={() => setShowOriginal((prev) => !prev)}>
                        {showOriginal ? 'Mostrar traducción' : 'Mostrar original'}
                    </Button>
                )}
            </div>
        </div>
    );
}
