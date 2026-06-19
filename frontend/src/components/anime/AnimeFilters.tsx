'use client';

import {
    QUICK_FILTER_OPTIONS, SORT_OPTIONS, SEASON_OPTIONS,
    FORMAT_OPTIONS, STATUS_OPTIONS, YEAR_OPTIONS, GENRE_OPTIONS,
} from '@/lib/constants';
import {
    SearchAnimeParams, QuickFilter, AnimeSort,
    AnimeSeason, AnimeFormat, AnimeStatus,
} from '@/types/anime.types';

interface AnimeFiltersProps {
    filters: SearchAnimeParams;
    onUpdate: <K extends keyof SearchAnimeParams>(key: K, value: SearchAnimeParams[K]) => void;
}

const SELECT_CLASS =
    'h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-accent focus:outline-none';

export function AnimeFilters({ filters, onUpdate }: AnimeFiltersProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Vistas rápidas */}
            <div className="flex flex-wrap gap-2">
                {QUICK_FILTER_OPTIONS.map((option) => {
                    const isActive = filters.quickFilter === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onUpdate('quickFilter', option.value as QuickFilter)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${isActive
                                ? 'bg-accent text-white'
                                : 'bg-card text-muted hover:bg-card-hover hover:text-foreground'
                                }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-wrap gap-3">
                <select
                    value={filters.sort ?? ''}
                    onChange={(e) => onUpdate('sort', (e.target.value || undefined) as AnimeSort | undefined)}
                    className={SELECT_CLASS}
                >
                    <option value="">Ordenar por…</option>
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <select
                    value={filters.season ?? ''}
                    onChange={(e) => onUpdate('season', (e.target.value || undefined) as AnimeSeason | undefined)}
                    className={SELECT_CLASS}
                >
                    <option value="">Temporada</option>
                    {SEASON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <select
                    value={filters.seasonYear ?? ''}
                    onChange={(e) => onUpdate('seasonYear', e.target.value ? Number(e.target.value) : undefined)}
                    className={SELECT_CLASS}
                >
                    <option value="">Año</option>
                    {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select
                    value={filters.formats?.[0] ?? ''}
                    onChange={(e) =>
                        onUpdate('formats', e.target.value ? [e.target.value as AnimeFormat] : undefined)
                    }
                    className={SELECT_CLASS}
                >
                    <option value="">Formato</option>
                    {FORMAT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <select
                    value={filters.statuses?.[0] ?? ''}
                    onChange={(e) =>
                        onUpdate('statuses', e.target.value ? [e.target.value as AnimeStatus] : undefined)
                    }
                    className={SELECT_CLASS}
                >
                    <option value="">Estado</option>
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((genre) => {
                    const isActive = filters.genres?.includes(genre.value) ?? false;
                    return (
                        <button
                            key={genre.value}
                            type="button"
                            onClick={() => {
                                const current = filters.genres ?? [];
                                const next = isActive
                                    ? current.filter((g) => g !== genre.value)
                                    : [...current, genre.value];
                                onUpdate('genres', next.length ? next : undefined);
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${isActive
                                    ? 'bg-accent text-white'
                                    : 'bg-card text-muted hover:bg-card-hover hover:text-foreground'
                                }`}
                        >
                            {genre.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
