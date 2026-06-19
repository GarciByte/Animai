import { AnimeTag } from '@/types/anime.types';

interface TagsRowProps {
    tags: AnimeTag[];
}

export function TagsRow({ tags }: TagsRowProps) {
    if (!tags.length) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag.id}
                    title={tag.description}
                    className="cursor-help rounded-full border border-border bg-card px-3 py-1 text-xs text-muted hover:text-foreground"
                >
                    {tag.name}
                </span>
            ))}
        </div>
    );
}
