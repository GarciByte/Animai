'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useCharacter } from '@/context/CharacterContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { aiService } from '@/services/ai.service';
import { ApiError } from '@/lib/api';
import { ChatMessage } from './ChatMessage';
import { CharacterBadge } from './CharacterBadge';
import { Button } from '@/components/ui/Button';

export function ChatWindow() {
    const { character } = useCharacter();
    const { messages, addMessage, clearHistory } = useChatHistory();
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll al último mensaje cada vez que se añade uno
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isSending) return;

        setError(null);
        addMessage({ role: 'user', content: trimmed });
        setInput('');
        setIsSending(true);

        try {
            const response = await aiService.chat({
                character,
                messages: [...messages, { role: 'user', content: trimmed }],
            });
            addMessage({ role: 'assistant', content: response.reply });
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Error al hablar con la IA';
            setError(message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex h-[calc(100dvh-5rem)] flex-col">
            {/* Cabecera con el personaje activo */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <CharacterBadge character={character} size="md" showAnimeName />
                <button
                    type="button"
                    onClick={clearHistory}
                    className="text-xs text-muted hover:text-foreground"
                >
                    Limpiar chat
                </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.length === 0 && (
                    <p className="text-center text-sm text-muted">
                        Empieza a hablar con {character.characterName}
                    </p>
                )}
                {messages.map((message, i) => (
                    <ChatMessage
                        key={i}
                        message={message}
                        characterImage={character.image}
                        characterName={character.characterName}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            {error && <p className="px-4 text-sm text-red-400">{error}</p>}

            {/* Input */}
            <div className="flex gap-2 border-t border-border px-4 py-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe un mensaje…"
                    className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-sm focus:border-accent focus:outline-none"
                />
                <Button onClick={handleSend} isLoading={isSending} size="md" aria-label="Enviar mensaje">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
