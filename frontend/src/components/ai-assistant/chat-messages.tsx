"use client";

import React from "react";

export function ChatMessages({ messages = [], className = "" }: { messages?: any[]; className?: string }) {
  return (
    <div className={className}>
      {messages.map((m, i) => (
        <div key={i} className="text-sm text-gray-700">{m.text ?? JSON.stringify(m)}</div>
      ))}
    </div>
  );
}

export default ChatMessages;
