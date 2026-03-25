"use client";

import { useState } from "react";

export function useChat(_opts?: { endpoint?: string; roomImageUrl?: string | null }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestions] = useState<any[]>([]);
  const [isLoading] = useState(false);
  function sendMessage(text: string) {
    // stub: append to messages
    setMessages((m) => [...m, { text }]);
  }
  return { messages, suggestions, isLoading, sendMessage };
}

export default useChat;
