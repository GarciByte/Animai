import Image from 'next/image';
import { AnimeNewsItem } from '@/types/anime.types';

interface NewsRowProps {
    news: AnimeNewsItem[] | null;
}

export function NewsRow({ news }: NewsRowProps) {
    if (!news || news.length === 0) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Noticias</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {news.map((item) => (
                    <a
                        key={item.malId}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-64 shrink-0 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-card-hover"
                    >
                        {item.imageUrl && (
                            <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-md">
                                <Image src={item.imageUrl} alt={item.title} fill sizes="256px" className="object-cover" />
                            </div>
                        )}
                        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{item.title}</h3>
                        <p className="mt-1 text-xs text-muted">
                            {item.authorUsername} · {new Date(item.date).toLocaleDateString('es-ES')}
                        </p>
                    </a>
                ))}
            </div>
        </section>
    );
}
