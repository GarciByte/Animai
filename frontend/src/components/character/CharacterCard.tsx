import Image from 'next/image';
import Link from 'next/link';
import { CharacterListItem } from '@/types/character.types';

interface CharacterCardProps {
    character: CharacterListItem;
    priority?: boolean;
}

export function CharacterCard({ character, priority = false }: CharacterCardProps) {
    return (
        <Link
            href={`/characters/${character.id}`}
            className="group flex flex-col gap-2 rounded-lg transition-transform hover:-translate-y-1"
        >
            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-card">
                <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div>
                <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-accent">
                    {character.name}
                </h3>
                {character.mediaTitle && (
                    <p className="line-clamp-1 text-xs text-muted">{character.mediaTitle}</p>
                )}
            </div>
        </Link>
    );
}
