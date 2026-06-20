import type { Metadata } from 'next';
import { ChatWindow } from '@/components/chat/ChatWindow';

export const metadata: Metadata = {
    title: 'Chat con la IA',
    description: 'Habla con la IA interpretando a tu personaje de anime favorito.',
};

export default function ChatPage() {
    return <ChatWindow />;
}
