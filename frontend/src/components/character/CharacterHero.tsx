'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCharacter } from '@/context/CharacterContext';
import { CharacterDetailResponse } from '@/types/character.types';
import { SelectedCharacter } from '@/types/ai.types';
import { CharacterDescription } from './CharacterDescription';
import { AnalyzeCharacterModal } from './AnalyzeCharacterModal';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatBirthday(date: { year: number | null; month: number | null; day: number | null } | null): string | null {
    if (!date || (!date.day && !date.month)) return null;
    const month = date.month ? MONTHS[date.month - 1] : '';
    return [date.day, month].filter(Boolean).join(' ');
}

function buildSelectedCharacter(target: CharacterDetailResponse): SelectedCharacter {
    const animeName = target.mediaMain[0]?.title.romaji ?? target.mediaSupporting[0]?.title.romaji ?? 'su anime';
    return {
        id: target.id,
        characterName: target.name,
        animeName,
        characterDescription:
            target.description ?? `Personaje de ${animeName}. Interpreta su personalidad de la forma más fiel posible.`,
        image: target.image,
    };
}

function InfoChip({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <span className="rounded-full bg-card px-2.5 py-1 text-xs">
            <span className="text-muted">{label}: </span>
            <span className="font-medium text-foreground">{value}</span>
        </span>
    );
}

interface CharacterHeroProps {
    target: CharacterDetailResponse;
}

export function CharacterHero({ target }: CharacterHeroProps) {
    const router = useRouter();
    const { setCharacter } = useCharacter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUseCharacter = () => {
        setCharacter(buildSelectedCharacter(target));
        router.push('/chat');
    };

    const birthday = formatBirthday(target.birthday);

    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative aspect-2/3 w-28 shrink-0 overflow-hidden rounded-lg bg-card shadow-xl sm:w-40">
                <Image src={target.image} alt={target.name} fill sizes="160px" className="object-cover" priority />
            </div>

            <div className="flex flex-1 flex-col gap-2">
                <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl">{target.name}</h1>
                {target.nativeName && <p className="text-sm text-muted">{target.nativeName}</p>}

                <div className="flex flex-wrap items-center gap-2">
                    {target.favourites !== null && (
                        <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent">
                            <Heart className="h-3 w-3 fill-current" /> {target.favourites.toLocaleString('es-ES')}
                        </span>
                    )}
                    <InfoChip label="Edad" value={target.age} />
                    <InfoChip label="Género" value={target.gender} />
                    <InfoChip label="Grupo sanguíneo" value={target.bloodType} />
                    <InfoChip label="Altura" value={target.height} />
                    <InfoChip label="Cumpleaños" value={birthday} />
                </div>

                <CharacterDescription target={target} />

                <div className="mt-1 flex flex-wrap gap-2">
                    <Button onClick={() => setIsModalOpen(true)} size="sm">
                        <Sparkles className="h-4 w-4" />
                        Analizar
                    </Button>
                    <Button onClick={handleUseCharacter} variant="secondary" size="sm">
                        Usar en el chat
                    </Button>
                </div>
            </div>

            <AnalyzeCharacterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} target={target} />
        </div>
    );
}
