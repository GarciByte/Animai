'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCharacter } from '@/context/CharacterContext';
import { CharacterBadge } from '@/components/chat/CharacterBadge';

const NAV_LINKS = [
    { href: '/', label: 'Anime' },
    { href: '/characters', label: 'Personajes' },
] as const;

export function NavBar() {
    const pathname = usePathname();
    const { character } = useCharacter();

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-navbar/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:h-20 sm:gap-4 sm:px-4">
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Animai"
                        width={44}
                        height={44}
                        priority
                        className="h-9 w-9 object-contain sm:h-11 sm:w-11"
                    />
                    <span className="hidden text-lg font-bold tracking-tight sm:inline sm:text-xl">
                        Animai
                    </span>
                </Link>

                {/* Navegación entre vistas */}
                <ul className="flex items-center gap-0.5 sm:gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${isActive
                                            ? 'bg-accent text-white'
                                            : 'text-muted hover:bg-background hover:text-foreground'
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Personaje asignado a la IA — clic lleva al chat */}
                <Link
                    href="/chat"
                    className="flex shrink-0 items-center rounded-full border border-border bg-background px-1.5 py-1.5 pr-3 transition-colors hover:bg-background/70 sm:px-2 sm:py-2 sm:pr-5"
                    title={`Hablando como ${character.characterName}`}
                >
                    <CharacterBadge character={character} size="sm" hideNameOnMobile />
                </Link>
            </nav>
        </header>
    );
}
