export function SkeletonCard() {
    return (
        <div className="flex flex-col gap-2">
            <div className="skeleton aspect-2/3 w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
        </div>
    );
}
