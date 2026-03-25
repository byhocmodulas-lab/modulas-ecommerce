import Anthropic from "@anthropic-ai/sdk";
import { Pinecone } from "@pinecone-database/pinecone";
import { createProductSearchTool } from "../tools/product-search-tool";
import { createRoomAnalysisTool } from "../tools/room-analysis-tool";
import { createStyleMatchTool } from "../tools/style-match-tool";
import { DESIGN_SYSTEM_PROMPT } from "../prompts/design-system-prompt";

const client = new Anthropic();
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const productIndex = pinecone.index("modulas-products");

/**
 * Agentic interior design assistant.
 *
 * Given a room image and user description, it:
 * 1. Analyzes the room (dimensions, style, existing colors)
 * 2. Searches the product catalog via vector similarity
 * 3. Returns curated recommendations with reasoning
 */
export async function runDesignAgent({
  userMessage,
  roomImageUrl,
  conversationHistory,
  budget,
}: {
  userMessage: string;
  roomImageUrl?: string;
  conversationHistory: Anthropic.MessageParam[];
  budget?: { min: number; max: number };
}) {
  const tools = [
    createProductSearchTool(productIndex, budget),
    createRoomAnalysisTool(),
    createStyleMatchTool(productIndex),
  ];

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory,
    {
      role: "user",
      content: [
        ...(roomImageUrl
          ? [
              {
                type: "image" as const,
                source: {
                  type: "url" as const,
                  url: roomImageUrl,
                },
              },
            ]
          : []),
        { type: "text" as const, text: userMessage },
      ],
    },
  ];

  // Agentic loop
  const productSuggestions: ProductSuggestion[] = [];
  let finalText = "";
  let continueLoop = true;

  while (continueLoop) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: DESIGN_SYSTEM_PROMPT,
      tools,
      messages,
    });

    // Collect assistant turn
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = await executeTool(block.name, block.input, productSuggestions);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }

      messages.push({ role: "user", content: toolResults });
    } else {
      // end_turn
      continueLoop = false;
      const textBlock = response.content.find((b) => b.type === "text");
      if (textBlock && textBlock.type === "text") {
        finalText = textBlock.text;
      }
    }
  }

  return {
    message: finalText,
    suggestions: productSuggestions,
    updatedHistory: messages,
  };
}

async function executeTool(
  name: string,
  input: unknown,
  suggestions: ProductSuggestion[],
): Promise<unknown> {
  switch (name) {
    case "search_products": {
      const results = await searchProductsCatalog(input as ProductSearchInput);
      suggestions.push(...results);
      return results;
    }
    case "analyze_room":
      return analyzeRoomImage(input as RoomAnalysisInput);
    case "match_style":
      return matchStyleToProducts(input as StyleMatchInput);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

async function searchProductsCatalog(input: ProductSearchInput) {
  // Generate embedding for query, search Pinecone, return top matches
  const embeddingResponse = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: `Embedding query: ${input.query}` }],
  });
  // ... vector search implementation
  return [];
}

async function analyzeRoomImage(input: RoomAnalysisInput) {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "url", url: input.imageUrl } },
        {
          type: "text",
          text: "Analyze this room: identify dominant colors, style (modern/classical/etc), approximate dimensions, existing furniture style, and lighting conditions. Respond as JSON.",
        },
      ],
    }],
  });
  return response.content[0];
}

async function matchStyleToProducts(input: StyleMatchInput) {
  // Vector search by style embedding
  return [];
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  matchScore: number;
  reason: string;
}

interface ProductSearchInput {
  query: string;
  category?: string;
  maxPrice?: number;
  style?: string;
}

interface RoomAnalysisInput {
  imageUrl: string;
}

interface StyleMatchInput {
  style: string;
  colors: string[];
  budget?: { min: number; max: number };
}
