import Image from 'next/image';
import Link from 'next/link';
import { AnimeCharacterRef } from '@/types/anime.types';

const ROLE_LABELS: Record<string, string> = { MAIN: 'Principal', SUPPORTING: 'Secundario', BACKGROUND: 'Secundario' };

interface CharactersRowProps {
    characters: AnimeCharacterRef[];
}

export function CharactersRow({ characters }: CharactersRowProps) {
    if (!characters.length) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Personajes</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {characters.map((c) => (
                    <Link key={c.id} href={`/characters/${c.id}`} className="group w-24 shrink-0 text-center">
                        <div className="relative aspect-square w-full overflow-hidden rounded-full bg-card">
                            <Image src={c.image} alt={c.name} fill sizes="96px" className="object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <p className="mt-1.5 line-clamp-1 text-xs font-medium text-foreground group-hover:text-accent">{c.name}</p>
                        <p className="text-[11px] text-muted">{ROLE_LABELS[c.role] ?? c.role}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
