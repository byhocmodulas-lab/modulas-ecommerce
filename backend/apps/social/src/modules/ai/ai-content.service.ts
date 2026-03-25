import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export type ContentTool =
  | 'caption'
  | 'hashtags'
  | 'platform_variants'
  | 'content_ideas'
  | 'product_copy'
  | 'product_description'
  | 'seo_tags'
  | 'blog'
  | 'product_names'
  | 'email';

export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'pinterest';
export type Tone     = 'luxury' | 'informative' | 'promotional' | 'conversational';

export interface GenerateTextDto {
  tool:      ContentTool;
  prompt:    string;
  platform?: Platform;
  tone?:     Tone;
  audience?: 'architect' | 'homeowner' | 'designer' | 'general';
  maxTokens?: number;
}

export interface GenerateImagePromptDto {
  category:  string; // e.g. "wardrobe", "kitchen", "sofa"
  theme:     string; // e.g. "luxury", "modern", "minimal"
  audience?: string;
  style?:    string; // e.g. "lifestyle", "product render", "social media"
}

// ── System prompts per tool ─────────────────────────────────────

const BRAND_CONTEXT = `You are a content strategist for Modulas, a luxury modular furniture brand based in India.
Modulas specialises in custom wardrobes, modular kitchens, premium storage solutions, and bespoke interior furniture.
Key brand pillars: precision craftsmanship, luxury finish, personalisation, architect partnerships, fast 30-day delivery.
Target markets: Mumbai, Bengaluru, Delhi, Hyderabad, Pune, Chennai.
Brand tone: sophisticated, warm, confident. Never use exclamation marks excessively. Avoid corporate buzzwords.`;

const TOOL_PROMPTS: Record<ContentTool, (dto: GenerateTextDto) => string> = {
  caption: (dto) => `${BRAND_CONTEXT}

Generate a compelling social media caption for ${dto.platform ?? 'Instagram'} about: "${dto.prompt}".
Tone: ${dto.tone ?? 'luxury'}.
Audience: ${dto.audience ?? 'homeowners and design enthusiasts'}.

Requirements:
- 2–4 sentences maximum
- Platform-appropriate length (Instagram: 150 chars for first line, Facebook: can be longer, LinkedIn: professional)
- No generic phrases like "Elevate your space" or "Transform your home"
- Specific, tactile, evocative language
- End with a soft call to action if appropriate
- Do NOT include hashtags (those are generated separately)

Return ONLY the caption text, no labels or preamble.`,

  hashtags: (dto) => `${BRAND_CONTEXT}

Generate 25 highly relevant hashtags for a post about: "${dto.prompt}".
Platform: ${dto.platform ?? 'Instagram'}.

Mix:
- 5 broad reach hashtags (100K–1M posts) for discovery
- 8 mid-tier hashtags (10K–100K posts) relevant to the topic
- 7 niche/specific hashtags (1K–10K posts) for targeted reach
- 5 brand/local hashtags (e.g. #ModulasIndia, #MumbaiInteriors, #BengaluruHomes, #ModularWardrobe, #LuxuryKitchen)

Return ONLY the hashtags as a single line, space-separated, each prefixed with #. No explanations.`,

  platform_variants: (dto) => `${BRAND_CONTEXT}

Create platform-specific caption variants for: "${dto.prompt}".
Tone: ${dto.tone ?? 'luxury'}.

Generate one caption for each platform:

**INSTAGRAM**: Visual-first, sensory language, 2–3 sentences, emoji optional but minimal
**FACEBOOK**: Slightly longer, story-driven, can include a question to drive comments
**LINKEDIN**: Professional, industry insight angle, suitable for architects/designers/professionals
**PINTEREST**: Description-style, keyword-rich, practical inspiration focus

Format exactly as:
INSTAGRAM: [caption]
FACEBOOK: [caption]
LINKEDIN: [caption]
PINTEREST: [caption]`,

  content_ideas: (dto) => `${BRAND_CONTEXT}

Generate 8 content ideas for the topic/theme: "${dto.prompt}".
Each idea should be specific, actionable, and suited for a luxury furniture brand's social media.

For each idea provide:
- Post type (carousel/reel/single image/story)
- Hook (first line that stops the scroll)
- Core content (2 sentences on what the post shows/says)
- Platform (best suited to)

Format as a numbered list. Be specific — no generic "showcase your products" ideas.`,

  product_copy: (dto) => `${BRAND_CONTEXT}

Write a compelling short product description (150–200 words) for: "${dto.prompt}".
Use evocative, material-specific language. Mention key features naturally. End with lead time or ordering info if relevant.`,

  product_description: (dto) => `${BRAND_CONTEXT}

Write a detailed editorial product description (400–600 words) for: "${dto.prompt}".
Cover: materials, craftsmanship, dimensions (estimated if not given), customisation options, room fit, care.
Use headings for each section. Tone: design-magazine quality.`,

  seo_tags: (dto) => `${BRAND_CONTEXT}

Generate complete SEO metadata for: "${dto.prompt}".
Return:
- Meta title (max 60 chars, include brand)
- Meta description (max 155 chars, include key benefit + CTA)
- 5 primary keywords
- 3 image alt text suggestions
Format clearly with labels.`,

  blog: (dto) => `${BRAND_CONTEXT}

Write a journal/blog post (600–800 words) for Modulas about: "${dto.prompt}".
Style: design publication (think Kinfolk, Dezeen India, AD India).
Structure: evocative opening, 2–3 substantive sections, soft close.
No listicles. Narrative prose. Include 1–2 natural mentions of Modulas.`,

  product_names: (dto) => `${BRAND_CONTEXT}

Suggest 6 elegant product names for: "${dto.prompt}".
Names should be: short (1–2 words), evocative, easy to pronounce in India, on-brand (luxury, nature, craft).
For each name provide a one-line rationale.`,

  email: (dto) => `${BRAND_CONTEXT}

Write a marketing email for: "${dto.prompt}".
Audience: ${dto.audience ?? 'Modulas customers and prospects'}.
Include:
- 3 subject line options (A/B test variants)
- Pre-header text
- Email body (150–250 words): personal opening, core message, clear CTA button text
- P.S. line
Tone: ${dto.tone ?? 'luxury'} — warm, not salesy.`,
};

@Injectable()
export class AIContentService {
  private client: Anthropic;

  constructor(private readonly config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY') ?? '',
    });
  }

  async generateText(dto: GenerateTextDto): Promise<{ text: string; tool: string }> {
    const systemPrompt = TOOL_PROMPTS[dto.tool]?.(dto);
    if (!systemPrompt) {
      throw new InternalServerErrorException(`Unknown tool: ${dto.tool}`);
    }

    const message = await this.client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: dto.maxTokens ?? 1024,
      messages: [
        { role: 'user', content: dto.prompt },
      ],
      system: systemPrompt,
    });

    const text = message.content
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { type: string; text?: string }) => (b as { type: 'text'; text: string }).text)
      .join('');

    return { text, tool: dto.tool };
  }

  /**
   * Generate an optimised image prompt for text-to-image tools
   * (DALL-E, Stable Diffusion, Midjourney).
   * Returns a ready-to-use prompt string.
   */
  async generateImagePrompt(dto: GenerateImagePromptDto): Promise<{ prompt: string; negativePrompt: string }> {
    const message = await this.client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: `You are a professional prompt engineer for interior design image generation.
Create detailed, specific prompts for generating luxury furniture / interior images.
Always output two things:
PROMPT: [the positive prompt]
NEGATIVE: [negative prompt — things to exclude]`,
      messages: [
        {
          role: 'user',
          content: `Generate an image prompt for a ${dto.style ?? 'lifestyle'} photo of ${dto.category} furniture.
Theme: ${dto.theme}. Target audience: ${dto.audience ?? 'luxury homeowners'}.
The image should be suitable for Instagram and luxury brand marketing.`,
        },
      ],
    });

    const full = message.content
      .filter((b: { type: string }) => b.type === 'text')
      .map((b: { type: string; text?: string }) => (b as { type: 'text'; text: string }).text)
      .join('');

    const promptMatch   = full.match(/PROMPT:\s*(.+?)(?:\nNEGATIVE:|$)/s);
    const negativeMatch = full.match(/NEGATIVE:\s*(.+?)$/s);

    return {
      prompt:         promptMatch?.[1]?.trim()   ?? full,
      negativePrompt: negativeMatch?.[1]?.trim() ?? 'blurry, low quality, cluttered, amateur',
    };
  }

  /** Generate full multi-part content brief for a campaign */
  async generateCampaignBrief(topic: string, platforms: Platform[]): Promise<{
    caption: string;
    hashtags: string;
    variants: string;
    ideas: string;
  }> {
    const [caption, hashtags, variants, ideas] = await Promise.all([
      this.generateText({ tool: 'caption',           prompt: topic, platform: 'instagram', tone: 'luxury' }),
      this.generateText({ tool: 'hashtags',          prompt: topic, platform: 'instagram' }),
      this.generateText({ tool: 'platform_variants', prompt: topic, tone: 'luxury' }),
      this.generateText({ tool: 'content_ideas',     prompt: topic }),
    ]);

    return {
      caption:  caption.text,
      hashtags: hashtags.text,
      variants: variants.text,
      ideas:    ideas.text,
    };
  }
}
