'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface VideoCardProps {
    youtubeId: string;
    title: string;
    thumbnail: string | null;
}

export function VideoCard({ youtubeId, title, thumbnail }: VideoCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const thumbSrc = thumbnail ?? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    return (
        <div className="relative aspect-video w-64 shrink-0 overflow-hidden rounded-lg bg-card">
            {isPlaying ? (
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                />
            ) : (
                <button type="button" onClick={() => setIsPlaying(true)} className="group relative h-full w-full">
                    <Image src={thumbSrc} alt={title} fill sizes="256px" className="object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
                        <Play className="h-10 w-10 fill-white text-white" />
                    </span>
                    <span className="absolute bottom-0 left-0 right-0 truncate bg-linear-to-t from-black/80 to-transparent px-2 py-1.5 text-xs text-white">
                        {title}
                    </span>
                </button>
            )}
        </div>
    );
}
