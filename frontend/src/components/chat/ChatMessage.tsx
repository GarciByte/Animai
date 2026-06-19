import Image from 'next/image';
import { ChatMessage as ChatMessageType } from '@/types/ai.types';

interface ChatMessageProps {
    message: ChatMessageType;
    characterImage: string;
    characterName: string;
}

export function ChatMessage({ message, characterImage, characterName }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
            {!isUser && (
                <Image
                    src={characterImage}
                    alt={characterName}
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
            )}
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isUser ? 'bg-accent text-white' : 'bg-card text-foreground'
                    }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}
