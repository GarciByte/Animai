'use client';

import { AnimeListItem } from '@/types/anime.types';
import { AnimeCard } from './AnimeCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

interface AnimeGridProps {
    items: AnimeListItem[];
    sentinelRef?: (node: HTMLDivElement | null) => void;
    isLoadingMore?: boolean;
}

const GRID_CLASSES = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

export function AnimeGrid({ items, sentinelRef, isLoadingMore }: AnimeGridProps) {
    return (
        <div>
            <div className={GRID_CLASSES}>
                {items.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}
            </div>

            {/* Cuando este div entra en el viewport, useInfiniteScroll dispara loadMore */}
            {sentinelRef && <div ref={sentinelRef} className="h-1" />}

            {isLoadingMore && (
                <div className={`mt-4 ${GRID_CLASSES}`}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
