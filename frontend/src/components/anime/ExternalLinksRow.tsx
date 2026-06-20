import { AnimeExternalLink } from '@/types/anime.types';

interface ExternalLinksRowProps {
    links: AnimeExternalLink[];
    malId?: number | null;
}

export function ExternalLinksRow({ links, malId }: ExternalLinksRowProps) {
    if (!links.length && !malId) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Enlaces externos</h2>
            <div className="flex flex-wrap gap-2">
                {malId && (
                    <a
                        href={`https://myanimelist.net/anime/${malId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card-hover"
                    >
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#2e51a2]" />
                        MyAnimeList
                    </a>
                )}
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-card-hover"
                    >
                        {link.color && (
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: link.color }} />
                        )}
                        {link.site}
                    </a>
                ))}
            </div>
        </section>
    );
}
