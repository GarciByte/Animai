import { AnimeRelation } from '@/types/anime.types';
import { MiniAnimeCard } from './MiniAnimeCard';

const RELATION_LABELS: Record<string, string> = {
    PREQUEL: 'Precuela', SEQUEL: 'Secuela', SIDE_STORY: 'Historia paralela',
    SPIN_OFF: 'Spin-off', ADAPTATION: 'Adaptación', ALTERNATIVE: 'Versión alternativa',
    SUMMARY: 'Resumen', PARENT: 'Obra original', CHARACTER: 'Comparte personajes', OTHER: 'Relacionado',
};

interface RelationsRowProps {
    relations: AnimeRelation[];
}

export function RelationsRow({ relations }: RelationsRowProps) {
    if (!relations.length) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Relacionados</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {relations.map((r) => {
                    const baseLabel = RELATION_LABELS[r.relationType] ?? r.relationType;
                    const isAnime = r.type === 'ANIME';
                    return (
                        <MiniAnimeCard
                            key={r.id}
                            title={r.title.romaji}
                            coverImage={r.coverImage}
                            subtitle={isAnime ? baseLabel : `${baseLabel} · Manga`}
                            href={isAnime ? `/anime/${r.id}` : undefined}
                        />
                    );
                })}
            </div>
        </section>
    );
}
