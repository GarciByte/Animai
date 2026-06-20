'use client';

import { useEffect } from 'react';
import { useCharacterSearch } from '@/hooks/useCharacterSearch';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { SearchBar } from '@/components/ui/SearchBar';
import { CharacterGrid } from '@/components/character/CharacterGrid';
import { CharacterSkeleton } from '@/components/character/CharacterSkeleton';

export function CharactersView() {
    const {
        items, query, isLoading, isInitialLoading,
        hasNextPage, error, search, loadMore, setQuery,
    } = useCharacterSearch();

    // Carga inicial automática
    useEffect(() => {
        void search();
    }, [search]);

    const { sentinelRef } = useInfiniteScroll({ hasNextPage, isLoading, onLoadMore: loadMore });

    const isLoadingMore = isLoading && items.length > 0;
    const showEmptyState = !isLoading && !error && items.length === 0;

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="mb-6">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onSearch={search}
                    isLoading={isLoading}
                    placeholder="Buscar personaje por nombre…"
                />
            </div>

            {error && (
                <p className="mb-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                    {error}
                </p>
            )}

            {isInitialLoading ? (
                <CharacterSkeleton />
            ) : showEmptyState ? (
                <p className="py-12 text-center text-sm text-muted">
                    No se encontraron personajes con ese nombre.
                </p>
            ) : (
                <CharacterGrid items={items} sentinelRef={sentinelRef} isLoadingMore={isLoadingMore} />
            )}
        </div>
    );
}
