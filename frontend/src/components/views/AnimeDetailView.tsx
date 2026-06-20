'use client';

import { useEffect } from 'react';
import { useAnimeDetail } from '@/hooks/useAnimeDetail';
import { AnimeHero } from '@/components/anime/AnimeHero';
import { AnimeInfoGrid } from '@/components/anime/AnimeInfoGrid';
import { RelationsRow } from '@/components/anime/RelationsRow';
import { CharactersRow } from '@/components/anime/CharactersRow';
import { PromoVideosRow } from '@/components/anime/PromoVideosRow';
import { ThemesRow } from '@/components/anime/ThemesRow';
import { Gallery } from '@/components/anime/Gallery';
import { ReviewsList } from '@/components/anime/ReviewsList';
import { NewsRow } from '@/components/anime/NewsRow';
import { RecommendationsRow } from '@/components/anime/RecommendationsRow';
import { ExternalLinksRow } from '@/components/anime/ExternalLinksRow';

interface AnimeDetailViewProps {
    animeId: number;
}

export function AnimeDetailView({ animeId }: AnimeDetailViewProps) {
    const { anime, isLoading, error } = useAnimeDetail(animeId);

    // Sube al principio de la página al navegar a otro anime
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [animeId]);

    if (isLoading) {
        return (
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
                <div className="skeleton h-40 w-full rounded-xl sm:h-56" />
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

    if (error || !anime) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-center">
                <p className="text-sm text-red-400">{error ?? 'No se pudo cargar este anime.'}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pt-6 pb-24">
            <AnimeHero anime={anime} />
            <AnimeInfoGrid anime={anime} />
            <RelationsRow relations={anime.relations} />
            <CharactersRow characters={anime.characters} />
            <PromoVideosRow anime={anime} />
            <ThemesRow themes={anime.themes} />
            <Gallery pictures={anime.pictures} posters={anime.posters} backdrops={anime.backdrops} />
            <ReviewsList reviews={anime.reviews} />
            <NewsRow news={anime.news} />
            <RecommendationsRow recommendations={anime.recommendations} />
            <ExternalLinksRow links={anime.externalLinks} malId={anime.idMal} />
        </div>
    );
}
