import type { Metadata } from 'next';
import { AnimeDetailView } from '@/components/views/AnimeDetailView';
import { AsyncPageProps } from '@/types/common.types';

export async function generateMetadata({
    params,
}: AsyncPageProps<{ id: string }>): Promise<Metadata> {
    const { id } = await params;
    return { title: `Anime #${id}` };
}

export default async function AnimeDetailPage({ params }: AsyncPageProps<{ id: string }>) {
    const { id } = await params;
    return <AnimeDetailView animeId={Number(id)} />;
}
