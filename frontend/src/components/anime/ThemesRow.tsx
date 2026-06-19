'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { AnimeThemeItem } from '@/types/anime.types';
import { VideoCard } from './VideoCard';

interface ThemesRowProps {
    themes: AnimeThemeItem[] | null;
}

const TYPE_LABELS: Record<'OP' | 'ED', string> = { OP: 'Opening', ED: 'Ending' };

function ThemeCard({ theme }: { theme: AnimeThemeItem }) {
    const [revealed, setRevealed] = useState(!theme.spoiler);

    if (!theme.videoUrl) return null;

    const youtubeMatch = theme.videoUrl.match(/(?:youtu\.be\/|v=)([\w-]{11})/);

    if (!revealed) {
        return (
            <button
                type="button"
                onClick={() => setRevealed(true)}
                className="flex aspect-video w-64 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card text-center text-xs text-muted hover:text-foreground"
            >
                <Eye className="h-6 w-6" />
                <span>Contiene spoiler — clic para ver</span>
                <span className="font-medium text-foreground">
                    {TYPE_LABELS[theme.type]} — {theme.slug}
                </span>
            </button>
        );
    }

    if (youtubeMatch) {
        return (
            <VideoCard
                youtubeId={youtubeMatch[1]}
                title={`${TYPE_LABELS[theme.type]} — ${theme.slug}`}
                thumbnail={null}
            />
        );
    }

    return (
        <div className="w-64 shrink-0 overflow-hidden rounded-lg bg-card">
            <video controls className="aspect-video w-full" src={theme.videoUrl} preload="none">
                <track kind="captions" />
            </video>
            <p className="px-2 py-1.5 text-xs text-muted">{TYPE_LABELS[theme.type]} — {theme.slug}</p>
        </div>
    );
}

export function ThemesRow({ themes }: ThemesRowProps) {
    if (!themes || themes.length === 0) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Openings y Endings</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {themes.map((theme, i) => (
                    <ThemeCard key={i} theme={theme} />
                ))}
            </div>
        </section>
    );
}
