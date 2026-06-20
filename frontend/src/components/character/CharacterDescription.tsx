'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/services/ai.service';
import { ApiError } from '@/lib/api';
import { CharacterDetailResponse } from '@/types/character.types';
import { cleanDescription, stripLinksToPlainText, parseLinks, resolveCharacterLink } from '@/lib/character-text';

interface CharacterDescriptionProps {
    target: CharacterDetailResponse;
}

function RenderedDescription({ text }: { text: string }) {
    const parts = parseLinks(text);
    return (
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {parts.map((part, i) => {
                if (part.type === 'text') return <span key={i}>{part.content}</span>;
                const { href, internal } = resolveCharacterLink(part.href!);
                return internal ? (
                    <Link key={i} href={href} className="font-medium text-accent hover:underline">
                        {part.content}
                    </Link>
                ) : (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                        {part.content}
                    </a>
                );
            })}
        </p>
    );
}

export function CharacterDescription({ target }: CharacterDescriptionProps) {
    const original = target.description ? cleanDescription(target.description) : null;

    const [translated, setTranslated] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!original) return null;

    const animeName = target.mediaMain[0]?.title.romaji ?? target.mediaSupporting[0]?.title.romaji ?? null;
    const showingOriginal = showOriginal || !translated;

    const handleTranslate = async () => {
        setIsTranslating(true);
        setError(null);
        try {
            // Se manda sin la sintaxis de los enlaces, para que la IA
            // traduzca solo prosa limpia y no intente "traducir" el marcado.
            const res = await aiService.translate({
                text: stripLinksToPlainText(original),
                context: 'CHARACTER_DESCRIPTION',
                characterContext: { name: target.name, animeName, gender: target.gender, age: target.age },
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
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Descripción</h2>
                {!translated ? (
                    <Button variant="primary" size="sm" onClick={handleTranslate} isLoading={isTranslating}>
                        Traducir
                    </Button>
                ) : (
                    <Button variant="ghost" size="sm" onClick={() => setShowOriginal((p) => !p)}>
                        {showOriginal ? 'Mostrar traducción' : 'Mostrar original'}
                    </Button>
                )}
            </div>

            {showingOriginal ? (
                <RenderedDescription text={original} />
            ) : (
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{translated}</p>
            )}

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
