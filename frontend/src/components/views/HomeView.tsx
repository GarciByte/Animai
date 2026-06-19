'use client';

import { useEffect } from 'react';
import { useAnimeSearch } from '@/hooks/useAnimeSearch';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchBar } from '@/components/ui/SearchBar';
import { AnimeFilters } from '@/components/anime/AnimeFilters';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { AnimeSkeleton } from '@/components/anime/AnimeSkeleton';

export function HomeView() {
    const {
        items, filters, isLoading, isInitialLoading,
        hasNextPage, error, search, loadMore, applyFilter, updateQuery,
    } = useAnimeSearch();

    useEffect(() => {
        void search();
    }, [search]);

    const { sentinelRef } = useInfiniteScroll({
        hasNextPage,
        isLoading,
        onLoadMore: loadMore,
    });

    // isLoading es true tanto en la carga inicial como al cargar más
    // páginas; se diferencian por si ya hay items o no.
    const isLoadingMore = isLoading && items.length > 0;
    const showEmptyState = !isLoading && !error && items.length === 0;

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="mb-6 flex flex-col gap-4">
                <SearchBar
                    value={filters.query ?? ''}
                    onChange={(value) => updateQuery(value || undefined)}
                    onSearch={search}
                    isLoading={isLoading}
                    placeholder="Buscar anime por nombre…"
                />
                <AnimeFilters filters={filters} onApplyFilter={applyFilter} />
            </div>

            {error && (
                <p className="mb-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                    {error}
                </p>
            )}

            {isInitialLoading ? (
                <AnimeSkeleton />
            ) : showEmptyState ? (
                <p className="py-12 text-center text-sm text-muted">
                    No se encontraron animes con estos filtros. Prueba a cambiarlos.
                </p>
            ) : (
                <AnimeGrid items={items} sentinelRef={sentinelRef} isLoadingMore={isLoadingMore} />
            )}
        </div>
    );
}
