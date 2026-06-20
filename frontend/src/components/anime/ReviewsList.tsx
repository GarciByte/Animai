'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimeReview } from '@/types/anime.types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ReviewsListProps {
    reviews: AnimeReview[] | null;
}

const INITIAL_COUNT = 4;
const PREVIEW_LENGTH = 280;

function scoreColor(score: number): string {
    if (score >= 7) return 'bg-emerald-500/20 text-emerald-400';
    if (score >= 4) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
}

function ReviewCard({ review, onExpand }: { review: AnimeReview; onExpand: () => void }) {
    const isLong = review.review.length > PREVIEW_LENGTH;
    const preview = isLong ? `${review.review.slice(0, PREVIEW_LENGTH)}…` : review.review;

    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
                {review.user.imageUrl && (
                    <Image src={review.user.imageUrl} alt={review.user.username} width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                )}
                <span className="text-sm font-medium">{review.user.username}</span>
                <span className={`ml-auto rounded-full px-2.5 py-1 text-xs font-bold ${scoreColor(review.score)}`}>
                    {review.score}/10
                </span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{preview}</p>
            <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
                {isLong && (
                    <button onClick={onExpand} className="text-accent hover:underline">
                        Ver más
                    </button>
                )}
                <a href={review.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Ver original en MyAnimeList ↗
                </a>
            </div>
        </div>
    );
}

export function ReviewsList({ reviews }: ReviewsListProps) {
    const [showAll, setShowAll] = useState(false);
    const [activeReview, setActiveReview] = useState<AnimeReview | null>(null);

    if (!reviews || reviews.length === 0) return null;

    const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);

    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold">Reseñas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {visibleReviews.map((review) => (
                    <ReviewCard key={review.malId} review={review} onExpand={() => setActiveReview(review)} />
                ))}
            </div>

            {!showAll && reviews.length > INITIAL_COUNT && (
                <div className="mt-4 flex justify-center">
                    <Button variant="secondary" size="sm" onClick={() => setShowAll(true)}>
                        Mostrar más reseñas ({reviews.length - INITIAL_COUNT})
                    </Button>
                </div>
            )}

            <Modal
                isOpen={activeReview !== null}
                onClose={() => setActiveReview(null)}
                title={activeReview ? `Reseña de ${activeReview.user.username}` : undefined}
            >
                {activeReview && (
                    <div className="flex flex-col gap-3">
                        <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${scoreColor(activeReview.score)}`}>
                            {activeReview.score}/10
                        </span>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{activeReview.review}</p>
                        <a
                            href={activeReview.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-accent hover:underline"
                        >
                            Ver original en MyAnimeList ↗
                        </a>
                    </div>
                )}
            </Modal>
        </section>
    );
}
