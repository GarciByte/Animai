'use client';

import { CharacterListItem } from '@/types/character.types';
import { CharacterCard } from './CharacterCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

interface CharacterGridProps {
    items: CharacterListItem[];
    sentinelRef?: (node: HTMLDivElement | null) => void;
    isLoadingMore?: boolean;
}

const GRID_CLASSES = 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

export function CharacterGrid({ items, sentinelRef, isLoadingMore }: CharacterGridProps) {
    return (
        <div>
            <div className={GRID_CLASSES}>
                {items.map((character, index) => (
                    <CharacterCard key={character.id} character={character} priority={index < 6} />
                ))}
            </div>

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
