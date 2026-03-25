import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

/**
 * AI-powered SEO meta content generator.
 *
 * Generates:
 * - Optimized title tags (50-60 chars)
 * - Meta descriptions (140-160 chars)
 * - FAQ blocks for AEO (answer engine optimization)
 * - GEO variants (locale-specific content)
 */
export class MetaGenerator {
  async generateProductMeta(product: ProductMetaInput): Promise<ProductMeta> {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are an SEO specialist for luxury furniture.
      Generate compelling, keyword-rich but natural SEO content.
      Always respond with valid JSON matching the requested schema.
      Focus on luxury, craftsmanship, and design language.`,
      messages: [
        {
          role: "user",
          content: `Generate SEO metadata for this luxury furniture product:

Name: ${product.name}
Category: ${product.category}
Materials: ${product.materials.join(", ")}
Description: ${product.description}
Price: £${product.price}

Return JSON with:
{
  "title": "50-60 char title with primary keyword",
  "metaDescription": "140-160 char compelling description with CTA",
  "h1": "Page heading variant",
  "faqs": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ],
  "keywords": ["primary", "secondary", "long-tail"],
  "altText": "Image alt text for main product image"
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    return JSON.parse(content.text) as ProductMeta;
  }

  async generateGeoVariants(
    baseMeta: ProductMeta,
    locales: string[],
  ): Promise<Record<string, ProductMeta>> {
    const variants: Record<string, ProductMeta> = {};

    for (const locale of locales) {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: `Adapt this SEO metadata for the ${locale} market (language, currency, cultural tone):
${JSON.stringify(baseMeta)}

Return JSON in the same structure, translated and culturally adapted.`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === "text") {
        variants[locale] = JSON.parse(content.text);
      }
    }

    return variants;
  }

  async generateFAQBlock(
    topic: string,
    context: string,
    count = 5,
  ): Promise<Array<{ question: string; answer: string }>> {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Generate ${count} FAQs optimized for Google's "People Also Ask" feature about: ${topic}

Context: ${context}

Rules:
- Questions should match natural language search queries
- Answers should be 40-60 words, factual, and direct
- Cover: care, delivery, customization, materials, returns

Return JSON array: [{"question": "...", "answer": "..."}]`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");
    return JSON.parse(content.text);
  }
}

interface ProductMetaInput {
  name: string;
  category: string;
  materials: string[];
  description: string;
  price: number;
}

interface ProductMeta {
  title: string;
  metaDescription: string;
  h1: string;
  faqs: Array<{ question: string; answer: string }>;
  keywords: string[];
  altText: string;
}
