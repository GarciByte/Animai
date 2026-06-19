'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimePicture } from '@/types/anime.types';

interface PicturesGalleryProps {
    pictures: AnimePicture[] | null;
}

export function PicturesGallery({ pictures }: PicturesGalleryProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!pictures || pictures.length === 0) return null;

    const close = () => setActiveIndex(null);
    const prev = () =>
        setActiveIndex((i) => (i === null ? null : (i - 1 + pictures.length) % pictures.length));
    const next = () => setActiveIndex((i) => (i === null ? null : (i + 1) % pictures.length));

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Galería</h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {pictures.map((pic, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className="relative aspect-square overflow-hidden rounded-md bg-card"
                    >
                        <Image src={pic.jpg} alt={`Imagen ${i + 1}`} fill sizes="120px" className="object-cover transition-transform hover:scale-105" />
                    </button>
                ))}
            </div>

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
                        <Image src={pictures[activeIndex].jpg} alt={`Imagen ${activeIndex + 1}`} fill sizes="100vw" className="object-contain" />
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
