import Image from 'next/image';
import Link from 'next/link';
import { AnimeListItem } from '@/types/anime.types';
import { FORMAT_LABEL_MAP } from '@/lib/constants';

interface AnimeCardProps {
    anime: AnimeListItem;
    priority?: boolean;
}

export function AnimeCard({ anime, priority = false }: AnimeCardProps) {
    const title = anime.title.romaji;
    const formatLabel = anime.format ? FORMAT_LABEL_MAP[anime.format] ?? anime.format : null;

    return (
        <Link
            href={`/anime/${anime.id}`}
            className="group flex flex-col gap-2 rounded-lg transition-transform hover:-translate-y-1"
        >
            {/* fill en vez de width/height numéricos: el ancho de la card es
            responsive (depende del grid), así que no hay un tamaño fijo
            que darle. fill también es inmune al warning de aspect ratio. */}
            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-card">
                <Image
                    src={anime.coverImage.large}
                    alt={title}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {formatLabel && (
                    <span className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium backdrop-blur">
                        {formatLabel}
                    </span>
                )}
            </div>
            <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-accent">
                {title}
            </h3>
        </Link>
    );
}
