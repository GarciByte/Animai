import type { Metadata } from 'next';
import { CharactersView } from '@/components/views/CharactersView';

export const metadata: Metadata = {
    title: 'Personajes',
    description: 'Busca y descubre personajes de anime ordenados por popularidad.',
};

export default function CharactersPage() {
    return <CharactersView />;
}
