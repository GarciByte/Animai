"use client";

import { useState, useCallback } from "react";
import { ChatMessage } from "@/types/ai.types";
import { STORAGE_KEYS, MAX_CHAT_HISTORY } from "@/lib/constants";

function getInitialHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEYS.CHAT_HISTORY,
    JSON.stringify(messages),
  );
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>(getInitialHistory);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      // Recorta los mensajes más antiguos si se supera el límite,
      // el mismo que valida ChatDto en el backend (máx. 30)
      const updated = [...prev, message].slice(-MAX_CHAT_HISTORY);
      persist(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    persist([]);
    setMessages([]);
  }, []);

  return { messages, addMessage, clearHistory };
}
