import { AnimeDetailResponse } from '@/types/anime.types';
import { VideoCard } from './VideoCard';

interface PromoVideosRowProps {
    anime: AnimeDetailResponse;
}

export function PromoVideosRow({ anime }: PromoVideosRowProps) {
    const hasPromoVideos = Boolean(anime.promoVideos?.length);
    // El trailer de AniList solo se muestra si Jikan no trajo ninguno
    const showAnilistTrailer = !hasPromoVideos && anime.trailer?.site === 'youtube';

    if (!hasPromoVideos && !showAnilistTrailer) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Vídeos promocionales</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {hasPromoVideos &&
                    anime.promoVideos!.map((video, i) => (
                        <VideoCard key={i} youtubeId={video.youtubeId} title={video.title} thumbnail={video.thumbnail} />
                    ))}
                {showAnilistTrailer && (
                    <VideoCard
                        youtubeId={anime.trailer!.id}
                        title={`Trailer — ${anime.title.romaji}`}
                        thumbnail={anime.trailer!.thumbnail}
                    />
                )}
            </div>
        </section>
    );
}
