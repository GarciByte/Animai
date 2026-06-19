import { AnimeDetailResponse } from '@/types/anime.types';
import { AnimeDescription } from './AnimeDescription';
import { TagsRow } from './TagsRow';

const SEASON_LABELS: Record<string, string> = { WINTER: 'Invierno', SPRING: 'Primavera', SUMMER: 'Verano', FALL: 'Otoño' };

function formatDate(date: { year: number | null; month: number | null; day: number | null }): string {
    if (!date.year) return 'Desconocida';
    return [date.day, date.month, date.year].filter(Boolean).join('/');
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div className="flex justify-between gap-3 border-b border-border py-2 text-sm last:border-0">
            <span className="text-muted">{label}</span>
            <span className="text-right font-medium text-foreground">{value}</span>
        </div>
    );
}

interface AnimeInfoGridProps {
    anime: AnimeDetailResponse;
}

export function AnimeInfoGrid({ anime }: AnimeInfoGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-4 md:col-span-2">
                <div>
                    <h2 className="mb-2 text-lg font-semibold">Sinopsis</h2>
                    <AnimeDescription anime={anime} />
                </div>
                <TagsRow tags={anime.tags} />
            </div>

            <div className="rounded-lg border border-border bg-card px-4 py-1">
                <InfoRow label="Duración" value={anime.duration ? `${anime.duration} min/ep` : null} />
                <InfoRow label="Fuente" value={anime.source} />
                <InfoRow
                    label="Temporada"
                    value={anime.season ? `${SEASON_LABELS[anime.season] ?? anime.season} ${anime.seasonYear ?? ''}` : null}
                />
                <InfoRow label="Emisión" value={anime.startDate.year ? formatDate(anime.startDate) : null} />
                <InfoRow label="Finalización" value={anime.endDate.year ? formatDate(anime.endDate) : null} />
                <InfoRow label="País de origen" value={anime.countryOfOrigin} />
                <InfoRow label="Puntuación media (usuarios)" value={anime.meanScore ? `${anime.meanScore}/100` : null} />
                <InfoRow label="Popularidad" value={anime.popularity ? `#${anime.popularity}` : null} />
                <InfoRow label="Favoritos" value={anime.favourites ? anime.favourites.toLocaleString('es-ES') : null} />
                <InfoRow label="Estudios" value={anime.studios.length ? anime.studios.map((s) => s.name).join(', ') : null} />
                <InfoRow label="Géneros" value={anime.genres.length ? anime.genres.join(', ') : null} />
            </div>
        </div>
    );
}
