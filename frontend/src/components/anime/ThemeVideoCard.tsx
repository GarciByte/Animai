'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface ThemeVideoCardProps {
    videoUrl: string;
    label: string;
}

export function ThemeVideoCard({ videoUrl, label }: ThemeVideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
            <div className="aspect-video w-64 shrink-0 overflow-hidden rounded-lg bg-black">
                <video src={videoUrl} controls autoPlay playsInline className="h-full w-full">
                    <track kind="captions" />
                </video>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group relative flex aspect-video w-64 shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-linear-to-br from-accent/30 via-card to-card text-center"
        >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20">
                <Play className="h-6 w-6 fill-white text-white" />
            </span>
            <span className="px-3 text-sm font-medium text-foreground">{label}</span>
        </button>
    );
}
