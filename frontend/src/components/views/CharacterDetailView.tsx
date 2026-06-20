'use client';

import { useEffect } from 'react';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';
import { CharacterHero } from '@/components/character/CharacterHero';
import { CharacterAppearancesSection } from '@/components/character/CharacterAppearancesSection';

interface CharacterDetailViewProps {
    characterId: number;
}

export function CharacterDetailView({ characterId }: CharacterDetailViewProps) {
    const { character: target, isLoading, error } = useCharacterDetail(characterId);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [characterId]);

    if (isLoading) {
        return (
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
                <div className="flex gap-4">
                    <div className="skeleton aspect-2/3 w-28 rounded-lg sm:w-40" />
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="skeleton h-7 w-2/3 rounded" />
                        <div className="skeleton h-4 w-1/3 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !target) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-center">
                <p className="text-sm text-red-400">{error ?? 'No se pudo cargar este personaje.'}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-6 pb-24">
            <CharacterHero target={target} />
            <CharacterAppearancesSection mediaMain={target.mediaMain} mediaSupporting={target.mediaSupporting} />
        </div>
    );
}
