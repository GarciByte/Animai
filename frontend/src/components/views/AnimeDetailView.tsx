'use client';

import { useAnimeDetail } from '@/hooks/useAnimeDetail';
import { AnimeHero } from '@/components/anime/AnimeHero';
import { AnimeInfoGrid } from '@/components/anime/AnimeInfoGrid';
import { PromoVideosRow } from '@/components/anime/PromoVideosRow';
import { ThemesRow } from '@/components/anime/ThemesRow';
import { PicturesGallery } from '@/components/anime/PicturesGallery';
import { RelationsRow } from '@/components/anime/RelationsRow';
import { RecommendationsRow } from '@/components/anime/RecommendationsRow';
import { CharactersRow } from '@/components/anime/CharactersRow';
import { TmdbImagesRow } from '@/components/anime/TmdbImagesRow';
import { ReviewsList } from '@/components/anime/ReviewsList';
import { NewsRow } from '@/components/anime/NewsRow';
import { ExternalLinksRow } from '@/components/anime/ExternalLinksRow';

interface AnimeDetailViewProps {
    animeId: number;
}

export function AnimeDetailView({ animeId }: AnimeDetailViewProps) {
    const { anime, isLoading, error } = useAnimeDetail(animeId);

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
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6">
            <AnimeHero anime={anime} />
            <AnimeInfoGrid anime={anime} />
            <ExternalLinksRow links={anime.externalLinks} malId={anime.idMal} />
            <PromoVideosRow anime={anime} />
            <ThemesRow themes={anime.themes} />
            <PicturesGallery pictures={anime.pictures} />
            <RelationsRow relations={anime.relations} />
            <RecommendationsRow recommendations={anime.recommendations} />
            <CharactersRow characters={anime.characters} />
            <TmdbImagesRow title="Posters" images={anime.postersEs} aspect="poster" />
            <TmdbImagesRow title="Backdrops" images={anime.backdrops} aspect="backdrop" />
            <ReviewsList reviews={anime.reviews} />
            <NewsRow news={anime.news} />
        </div>
    );
}
