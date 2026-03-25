"use client";

import { useRef, useState } from "react";
import { useChat } from "@/lib/hooks/use-chat";
import { RoomUpload } from "./room-upload";
import { ProductSuggestions } from "./product-suggestions";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

export function DesignAssistant() {
  const [roomImageUrl, setRoomImageUrl] = useState<string | null>(null);
  const { messages, suggestions, isLoading, sendMessage } = useChat({
    endpoint: "/api/ai/assistant",
    roomImageUrl,
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">AI Interior Design Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Upload your room photo and describe your vision. I'll recommend pieces from our collection.
        </p>
      </div>

      {!roomImageUrl && (
        <RoomUpload onUpload={setRoomImageUrl} className="m-4" />
      )}

      <ChatMessages messages={messages} className="flex-1 overflow-y-auto p-4" />

      {suggestions.length > 0 && (
        <ProductSuggestions products={suggestions} className="border-t p-4" />
      )}

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        placeholder="Describe your style, room size, or ask for recommendations..."
        className="border-t p-4"
      />
    </div>
  );
}
