'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimeReview } from '@/types/anime.types';

interface ReviewsListProps {
    reviews: AnimeReview[] | null;
}

const PREVIEW_LENGTH = 320;

function ReviewItem({ review }: { review: AnimeReview }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.review.length > PREVIEW_LENGTH;
    const text = expanded || !isLong ? review.review : `${review.review.slice(0, PREVIEW_LENGTH)}…`;

    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
                {review.user.imageUrl && (
                    <Image src={review.user.imageUrl} alt={review.user.username} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                )}
                <span className="text-sm font-medium">{review.user.username}</span>
                <span className="ml-auto rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                    {review.score}/10
                </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{text}</p>
            <div className="mt-2 flex items-center gap-3 text-xs">
                {isLong && (
                    <button onClick={() => setExpanded((p) => !p)} className="font-medium text-accent hover:underline">
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </button>
                )}
                <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground">
                    Ver original en MyAnimeList ↗
                </a>
            </div>
        </div>
    );
}

export function ReviewsList({ reviews }: ReviewsListProps) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Reseñas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {reviews.map((review) => (
                    <ReviewItem key={review.malId} review={review} />
                ))}
            </div>
        </section>
    );
}
