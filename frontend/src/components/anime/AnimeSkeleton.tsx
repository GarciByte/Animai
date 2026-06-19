import { SkeletonCard } from '@/components/ui/SkeletonCard';

interface AnimeSkeletonProps {
    count?: number;
}

export function AnimeSkeleton({ count = 12 }: AnimeSkeletonProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
