'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, UserCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCharacter } from '@/context/CharacterContext';
import { CharacterDetailResponse } from '@/types/character.types';
import { SelectedCharacter } from '@/types/ai.types';
import { AnalyzeCharacterModal } from './AnalyzeCharacterModal';
import { cleanDescription, truncateDescription } from '@/lib/character-text';
import { MAX_PERSONA_DESCRIPTION_LENGTH } from '@/lib/constants';

function buildSelectedCharacter(target: CharacterDetailResponse): SelectedCharacter {
    const animeName = target.mediaMain[0]?.title.romaji ?? target.mediaSupporting[0]?.title.romaji ?? 'su anime';
    const description = target.description ? cleanDescription(target.description) : null;

    return {
        id: target.id,
        characterName: target.name,
        animeName,
        characterDescription: description
            ? truncateDescription(description, MAX_PERSONA_DESCRIPTION_LENGTH)
            : `Personaje de ${animeName}. Interpreta su personalidad de la forma más fiel posible.`,
        image: target.image,
    };
}

interface CharacterHeroProps {
    target: CharacterDetailResponse;
}

export function CharacterHero({ target }: CharacterHeroProps) {
    const { setCharacter } = useCharacter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [justSelected, setJustSelected] = useState(false);

    const handleSelectCharacter = () => {
        setCharacter(buildSelectedCharacter(target));
        setJustSelected(true);
        setTimeout(() => setJustSelected(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative aspect-2/3 w-36 shrink-0 self-start overflow-hidden rounded-lg bg-card shadow-xl sm:w-57.5">
                <Image src={target.image} alt={target.name} fill sizes="230px" className="object-cover" priority />
            </div>

            <div className="flex flex-1 flex-col gap-4">
                <div>
                    <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl">{target.name}</h1>
                    {target.nativeName && <p className="mt-1 text-sm text-muted">{target.nativeName}</p>}
                </div>

                {target.favourites !== null && (
                    <span className="flex w-fit items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold text-foreground">
                        <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                        {target.favourites.toLocaleString('es-ES')}
                    </span>
                )}

                <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setIsModalOpen(true)} size="sm">
                        <Sparkles className="h-4 w-4" />
                        Analizar
                    </Button>
                    <Button onClick={handleSelectCharacter} variant="confirm" size="sm">
                        <UserCheck className="h-4 w-4" />
                        {justSelected ? '¡Personaje seleccionado!' : 'Seleccionar personaje'}
                    </Button>
                </div>
            </div>

            <AnalyzeCharacterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} target={target} />
        </div>
    );
}
