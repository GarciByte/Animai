"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessage } from "@/types/ai.types";
import { STORAGE_KEYS, MAX_CHAT_HISTORY } from "@/lib/constants";

function persist(messages: ChatMessage[]): void {
  window.localStorage.setItem(
    STORAGE_KEYS.CHAT_HISTORY,
    JSON.stringify(messages),
  );
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(parsed);
      }
    } catch {
      // JSON corrupto: se queda vacío sin más
    }
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      const updated = [...prev, message].slice(-MAX_CHAT_HISTORY);
      persist(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    persist([]);
    setMessages([]);
  }, []);

  return { messages, addMessage, clearHistory } as const;
}
