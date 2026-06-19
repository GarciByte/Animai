'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle } from 'lucide-react';

interface TmdbImagesRowProps {
    title: string;
    images: string[] | null;
    aspect?: 'poster' | 'backdrop';
}

export function TmdbImagesRow({ title, images, aspect = 'backdrop' }: TmdbImagesRowProps) {
    const [revealed, setRevealed] = useState(false);

    if (!images || images.length === 0) return null;

    const aspectClass = aspect === 'poster' ? 'aspect-[2/3] w-36' : 'aspect-video w-64';

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>

            {!revealed ? (
                <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-6 text-sm text-amber-400 hover:bg-amber-950/30"
                >
                    <AlertTriangle className="h-6 w-6" />
                    <span>Estas imágenes pueden contener spoilers. Pulsa para mostrarlas.</span>
                </button>
            ) : (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((src, i) => (
                        <div key={i} className={`relative shrink-0 overflow-hidden rounded-lg bg-card ${aspectClass}`}>
                            <Image src={src} alt={`${title} ${i + 1}`} fill sizes="256px" className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
