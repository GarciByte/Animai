import Image from 'next/image';
import Link from 'next/link';

interface MiniAnimeCardProps {
    id: number;
    title: string;
    coverImage: string;
    subtitle?: string;
}

export function MiniAnimeCard({ id, title, coverImage, subtitle }: MiniAnimeCardProps) {
    return (
        <Link href={`/anime/${id}`} className="group w-32 shrink-0">
            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-card">
                <Image src={coverImage} alt={title} fill sizes="128px" className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent">{title}</p>
            {subtitle && <p className="text-[11px] text-muted">{subtitle}</p>}
        </Link>
    );
}
