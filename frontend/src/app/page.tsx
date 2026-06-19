import type { Metadata } from 'next';
import { HomeView } from '@/components/views/HomeView';

export const metadata: Metadata = {
    title: 'Animai',
    description: 'Descubre, busca y filtra animes por temporada, año, formato y género.',
};

export default function HomePage() {
    return <HomeView />;
}
