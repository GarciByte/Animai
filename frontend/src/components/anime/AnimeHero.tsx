'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimeDetailResponse } from '@/types/anime.types';
import { AnalyzeAiModal } from './AnalyzeAiModal';
import { FORMAT_LABEL_MAP } from '@/lib/constants';

const STATUS_LABELS: Record<string, string> = {
    FINISHED: 'Finalizado', RELEASING: 'En emisión', NOT_YET_RELEASED: 'Próximamente', CANCELLED: 'Cancelado', HIATUS: 'En pausa',
};

interface AnimeHeroProps {
    anime: AnimeDetailResponse;
}

export function AnimeHero({ anime }: AnimeHeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const subtitleParts = [anime.title.english, anime.title.native].filter(
        (t): t is string => Boolean(t) && t !== anime.title.romaji,
    );

    return (
        <div className="relative">
            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-card sm:h-56 md:h-64">
                {anime.bannerImage && (
                    <Image src={anime.bannerImage} alt="" fill sizes="100vw" priority className="object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            </div>

            <div className="relative z-10 -mt-16 flex flex-col gap-4 px-1 sm:-mt-20 sm:flex-row sm:items-end sm:px-2">
                <div className="relative aspect-2/3 w-28 shrink-0 overflow-hidden rounded-lg border-2 border-background shadow-xl sm:w-40">
                    <Image src={anime.coverImage.large} alt={anime.title.romaji} fill sizes="160px" className="object-cover" priority />
                </div>

                <div className="flex flex-1 flex-col gap-2 pb-1">
                    <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl">{anime.title.romaji}</h1>
                    {subtitleParts.length > 0 && (
                        <p className="text-sm text-muted">{subtitleParts.join(' · ')}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        {anime.format && (
                            <span className="rounded-full bg-card px-2.5 py-1 font-medium">{FORMAT_LABEL_MAP[anime.format]}</span>
                        )}
                        {anime.status && (
                            <span className="rounded-full bg-card px-2.5 py-1 font-medium">{STATUS_LABELS[anime.status] ?? anime.status}</span>
                        )}
                    </div>

                    <Button onClick={() => setIsModalOpen(true)} size="sm" className="mt-1 w-fit">
                        <Sparkles className="h-4 w-4" />
                        Analizar
                    </Button>
                </div>
            </div>

            <AnalyzeAiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} anime={anime} />
        </div>
    );
}
