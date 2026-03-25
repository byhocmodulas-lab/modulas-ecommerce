/**
 * Minimal type shim for @anthropic-ai/sdk.
 * Replace with the real package by running:
 *   npm install @anthropic-ai/sdk
 * inside apps/gateway/
 */
declare module '@anthropic-ai/sdk' {
  interface MessageCreateParams {
    model: string;
    max_tokens: number;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    system?: string;
  }

  interface ContentBlock {
    type: string;
    text?: string;
  }

  interface Message {
    content: ContentBlock[];
    id: string;
    model: string;
    role: string;
    stop_reason: string | null;
    usage: { input_tokens: number; output_tokens: number };
  }

  interface Messages {
    create(params: MessageCreateParams): Promise<Message>;
  }

  interface ClientOptions {
    apiKey?: string;
  }

  class Anthropic {
    messages: Messages;
    constructor(options?: ClientOptions);
  }

  export default Anthropic;
}
