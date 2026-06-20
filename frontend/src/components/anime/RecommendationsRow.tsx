import { AnimeRecommendation } from '@/types/anime.types';
import { FORMAT_LABEL_MAP } from '@/lib/constants';
import { MiniAnimeCard } from './MiniAnimeCard';

interface RecommendationsRowProps {
    recommendations: AnimeRecommendation[];
}

export function RecommendationsRow({ recommendations }: RecommendationsRowProps) {
    if (!recommendations.length) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Animes similares</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendations.map((r) => {
                    const isAnime = r.type === 'ANIME';
                    const formatLabel = r.format ? FORMAT_LABEL_MAP[r.format] ?? r.format : null;
                    const subtitle = isAnime
                        ? formatLabel ?? undefined
                        : (formatLabel ? `${formatLabel} · Manga` : 'Manga');

                    return (
                        <MiniAnimeCard
                            key={r.id}
                            title={r.title.romaji}
                            coverImage={r.coverImage}
                            subtitle={subtitle}
                            href={isAnime ? `/anime/${r.id}` : undefined}
                        />
                    );
                })}
            </div>
        </section>
    );
}
