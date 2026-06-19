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
        <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur">
            <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4">
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Animai"
                        width={48}
                        height={48}
                        priority
                        className="h-12 w-12 object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight">Animai</span>
                </Link>

                {/* Navegación entre vistas */}
                <ul className="flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
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
                    className="flex shrink-0 items-center rounded-full border border-border bg-background px-2 py-2 pr-5 transition-colors hover:bg-background/70"
                    title={`Hablar con ${character.characterName}`}
                >
                    <CharacterBadge character={character} size="md" hideNameOnMobile />
                </Link>
            </nav>
        </header>
    );
}
