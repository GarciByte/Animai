import { AnimeExternalLink } from '@/types/anime.types';

interface ExternalLinksRowProps {
    links: AnimeExternalLink[];
    malId?: number | null;
}

export function ExternalLinksRow({ links, malId }: ExternalLinksRowProps) {
    if (!links.length && !malId) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {malId && (
                <a
                    href={`https://myanimelist.net/anime/${malId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-[#2e51a2] transition-colors hover:bg-card"
                >
                    MyAnimeList
                </a>
            )}
            {links.map((link) => (
                <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={link.color ? { borderColor: link.color, color: link.color } : undefined}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-card"
                >
                    {link.site}
                </a>
            ))}
        </div>
    );
}
