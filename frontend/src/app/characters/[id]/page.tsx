import type { Metadata } from 'next';
import { CharacterDetailView } from '@/components/views/CharacterDetailView';
import { AsyncPageProps } from '@/types/common.types';

export async function generateMetadata({
    params,
}: AsyncPageProps<{ id: string }>): Promise<Metadata> {
    const { id } = await params;
    return { title: `Personaje #${id}` };
}

export default async function CharacterDetailPage({ params }: AsyncPageProps<{ id: string }>) {
    const { id } = await params;
    return <CharacterDetailView characterId={Number(id)} />;
}
