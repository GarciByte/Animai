'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimePicture } from '@/types/anime.types';

interface GalleryProps {
    pictures: AnimePicture[] | null;
    posters: string[] | null;
    backdrops: string[] | null;
}

export function Gallery({ pictures, posters, backdrops }: GalleryProps) {
    const [revealed, setRevealed] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Une las tres fuentes en el orden pedido: 1º Jikan, 2º Posters, 3º Backdrops
    const images: string[] = [
        ...(pictures?.map((p) => p.jpg) ?? []),
        ...(posters ?? []),
        ...(backdrops ?? []),
    ];

    if (images.length === 0) return null;

    const close = () => setActiveIndex(null);
    const prev = () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    const next = () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Galería</h2>

            {!revealed ? (
                <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="flex w-full flex-col items-center gap-2 rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-6 text-sm text-amber-400 hover:bg-amber-950/30"
                >
                    <AlertTriangle className="h-6 w-6" />
                    <span>Esta galería puede contener spoilers. Pulsa para mostrarla.</span>
                </button>
            ) : (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-md bg-card sm:w-32"
                        >
                            <Image src={src} alt={`Imagen ${i + 1}`} fill sizes="128px" className="object-cover transition-transform hover:scale-105" />
                        </button>
                    ))}
                </div>
            )}

            {activeIndex !== null && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4" onClick={close}>
                    <button onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10">
                        <X className="h-6 w-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/10 sm:left-4"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <div className="relative h-[80vh] w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[activeIndex]}
                            alt={`Imagen ${activeIndex + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-contain"
                        />
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/10 sm:right-4"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                </div>
            )}
        </section>
    );
}
