'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/ai.service';
import { ApiError } from '@/lib/api';
import { CharacterDetailResponse } from '@/types/character.types';

interface CharacterDescriptionProps {
    target: CharacterDetailResponse;
}

function stripHtml(text: string): string {
    return text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
}

export function CharacterDescription({ target }: CharacterDescriptionProps) {
    const original = target.description ? stripHtml(target.description) : null;

    const [translated, setTranslated] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!original) return null;

    const displayText = showOriginal ? original : translated ?? original;
    const animeName = target.mediaMain[0]?.title.romaji ?? target.mediaSupporting[0]?.title.romaji ?? null;

    const handleTranslate = async () => {
        setIsTranslating(true);
        setError(null);
        try {
            const res = await aiService.translate({
                text: original,
                context: 'CHARACTER_DESCRIPTION',
                characterContext: {
                    name: target.name,
                    animeName,
                    gender: target.gender,
                    age: target.age,
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
        <div className="flex flex-col gap-2">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{displayText}</p>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-2">
                {!translated && (
                    <Button variant="primary" size="sm" onClick={handleTranslate} isLoading={isTranslating}>
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
