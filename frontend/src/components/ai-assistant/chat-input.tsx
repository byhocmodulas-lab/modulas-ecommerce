"use client";

import React, { useState } from "react";

export function ChatInput({ onSend, isLoading, placeholder, className }: { onSend?: (text: string) => void; isLoading?: boolean; placeholder?: string; className?: string }) {
  const [text, setText] = useState("");
  return (
    <div className={className ?? "flex gap-2"}>
      <input placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} className="border p-2 flex-1" />
      <button disabled={isLoading} onClick={() => { onSend?.(text); setText(""); }} className="px-3 bg-blue-600 text-white">Send</button>
    </div>
  );
}

export default ChatInput;
