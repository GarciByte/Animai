import Image from 'next/image';
import Link from 'next/link';
import { CharacterAnimeAppearance } from '@/types/character.types';
import { FORMAT_LABEL_MAP } from '@/lib/constants';

const ROLE_LABELS: Record<string, string> = { MAIN: 'Principal', SUPPORTING: 'Secundario', BACKGROUND: 'Secundario' };

function AppearanceCard({ appearance }: { appearance: CharacterAnimeAppearance }) {
    return (
        <Link href={`/anime/${appearance.id}`} className="group w-32 shrink-0">
            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-card">
                <Image
                    src={appearance.coverImage}
                    alt={appearance.title.romaji}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent">
                {appearance.title.romaji}
            </p>
            <p className="text-[11px] text-muted">
                {[appearance.year, appearance.format ? FORMAT_LABEL_MAP[appearance.format] ?? appearance.format : null]
                    .filter(Boolean)
                    .join(' · ')}
            </p>
            <p className="text-[11px] text-muted">{ROLE_LABELS[appearance.role] ?? appearance.role}</p>
        </Link>
    );
}

interface CharacterAppearancesSectionProps {
    mediaMain: CharacterAnimeAppearance[];
    mediaSupporting: CharacterAnimeAppearance[];
}

export function CharacterAppearancesSection({ mediaMain, mediaSupporting }: CharacterAppearancesSectionProps) {
    if (mediaMain.length === 0 && mediaSupporting.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            {mediaMain.length > 0 && (
                <section>
                    <h2 className="mb-3 text-lg font-semibold">Apariciones principales</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {mediaMain.map((a) => <AppearanceCard key={a.id} appearance={a} />)}
                    </div>
                </section>
            )}
            {mediaSupporting.length > 0 && (
                <section>
                    <h2 className="mb-3 text-lg font-semibold">Apariciones secundarias</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {mediaSupporting.map((a) => <AppearanceCard key={a.id} appearance={a} />)}
                    </div>
                </section>
            )}
        </div>
    );
}
