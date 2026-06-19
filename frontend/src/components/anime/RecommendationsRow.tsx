import { AnimeRecommendation } from '@/types/anime.types';
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
                {recommendations.map((r) => (
                    <MiniAnimeCard
                        key={r.id}
                        id={r.id}
                        title={r.title.romaji}
                        coverImage={r.coverImage}
                        subtitle={r.averageScore ? `${r.averageScore}/100` : undefined}
                    />
                ))}
            </div>
        </section>
    );
}
