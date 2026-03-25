import { chromium, Browser, Page } from "playwright";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface SocialPost {
  platform: string;
  externalPostId: string;
  content: string;
  mediaUrls: string[];
  likes: number;
  comments: number;
  shares: number;
  postedAt: Date;
  authorHandle: string;
}

interface MentionResult {
  platform: string;
  postUrl: string;
  author: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  mentionsBrand: boolean;
}

/**
 * Social media scraper for monitoring brand mentions,
 * competitor activity, and trend detection.
 *
 * Supports: Instagram, Pinterest, TikTok (public pages only).
 * Uses Playwright for scraping + Claude for sentiment analysis.
 */
export class SocialScraper {
  private browser: Browser | null = null;

  async init() {
    this.browser = await chromium.launch({ headless: true });
  }

  async close() {
    await this.browser?.close();
  }

  /**
   * Scrape public posts from a social profile page.
   */
  async scrapeProfile(
    platform: string,
    handle: string,
    maxPosts: number = 20,
  ): Promise<SocialPost[]> {
    if (!this.browser) throw new Error("Browser not initialized");

    const page = await this.browser.newPage();
    try {
      const url = this.buildProfileUrl(platform, handle);
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000); // Allow dynamic content to load

      const posts = await this.extractPosts(page, platform, maxPosts);
      return posts.map((p) => ({ ...p, authorHandle: handle }));
    } finally {
      await page.close();
    }
  }

  /**
   * Search for brand mentions across platforms.
   */
  async searchMentions(
    brandKeywords: string[],
    platforms: string[],
  ): Promise<MentionResult[]> {
    const mentions: MentionResult[] = [];

    for (const platform of platforms) {
      for (const keyword of brandKeywords) {
        const results = await this.searchPlatform(platform, keyword);
        mentions.push(...results);
      }
    }

    // Batch sentiment analysis
    if (mentions.length > 0) {
      const analyzed = await this.analyzeSentimentBatch(mentions);
      return analyzed;
    }

    return mentions;
  }

  /**
   * Use Claude to analyze sentiment of scraped posts/mentions.
   */
  async analyzeSentimentBatch(
    mentions: MentionResult[],
  ): Promise<MentionResult[]> {
    const texts = mentions.map((m, i) => `[${i}] ${m.content}`).join("\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Analyze the sentiment of each numbered post about a luxury furniture brand called "Modulas". For each, classify as positive, neutral, negative, or mixed. Also note if it directly mentions the brand. Return JSON array of objects with fields: index, sentiment, mentionsBrand.

Posts:
${texts}`,
        },
      ],
    });

    try {
      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") return mentions;

      const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return mentions;

      const analysis = JSON.parse(jsonMatch[0]) as Array<{
        index: number;
        sentiment: "positive" | "neutral" | "negative" | "mixed";
        mentionsBrand: boolean;
      }>;

      for (const item of analysis) {
        if (mentions[item.index]) {
          mentions[item.index].sentiment = item.sentiment;
          mentions[item.index].mentionsBrand = item.mentionsBrand;
        }
      }
    } catch {
      // If parsing fails, leave default sentiment
    }

    return mentions;
  }

  private buildProfileUrl(platform: string, handle: string): string {
    switch (platform) {
      case "instagram":
        return `https://www.instagram.com/${handle}/`;
      case "pinterest":
        return `https://www.pinterest.com/${handle}/`;
      case "tiktok":
        return `https://www.tiktok.com/@${handle}`;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private async extractPosts(
    page: Page,
    platform: string,
    maxPosts: number,
  ): Promise<Omit<SocialPost, "authorHandle">[]> {
    // Platform-specific extraction logic
    // This is a simplified skeleton — real implementation would
    // handle each platform's DOM structure
    switch (platform) {
      case "instagram":
        return this.extractInstagramPosts(page, maxPosts);
      case "pinterest":
        return this.extractPinterestPins(page, maxPosts);
      default:
        return [];
    }
  }

  private async extractInstagramPosts(
    page: Page,
    maxPosts: number,
  ): Promise<Omit<SocialPost, "authorHandle">[]> {
    const posts = await page.evaluate((max: number) => {
      const articles = document.querySelectorAll("article");
      const results: Array<{
        platform: string;
        externalPostId: string;
        content: string;
        mediaUrls: string[];
        likes: number;
        comments: number;
        shares: number;
        postedAt: string;
      }> = [];

      articles.forEach((article, i) => {
        if (i >= max) return;
        const img = article.querySelector("img");
        const link = article.querySelector("a[href*='/p/']");
        results.push({
          platform: "instagram",
          externalPostId: link?.getAttribute("href")?.split("/p/")[1]?.replace("/", "") ?? "",
          content: img?.getAttribute("alt") ?? "",
          mediaUrls: img ? [img.src] : [],
          likes: 0,
          comments: 0,
          shares: 0,
          postedAt: new Date().toISOString(),
        });
      });

      return results;
    }, maxPosts);

    return posts.map((p) => ({ ...p, postedAt: new Date(p.postedAt) }));
  }

  private async extractPinterestPins(
    page: Page,
    maxPosts: number,
  ): Promise<Omit<SocialPost, "authorHandle">[]> {
    const pins = await page.evaluate((max: number) => {
      const pinElements = document.querySelectorAll("[data-test-id='pin']");
      const results: Array<{
        platform: string;
        externalPostId: string;
        content: string;
        mediaUrls: string[];
        likes: number;
        comments: number;
        shares: number;
        postedAt: string;
      }> = [];

      pinElements.forEach((pin, i) => {
        if (i >= max) return;
        const img = pin.querySelector("img");
        const link = pin.querySelector("a");
        results.push({
          platform: "pinterest",
          externalPostId: link?.getAttribute("href")?.split("/pin/")[1]?.replace("/", "") ?? "",
          content: img?.getAttribute("alt") ?? "",
          mediaUrls: img ? [img.src] : [],
          likes: 0,
          comments: 0,
          shares: 0,
          postedAt: new Date().toISOString(),
        });
      });

      return results;
    }, maxPosts);

    return pins.map((p) => ({ ...p, postedAt: new Date(p.postedAt) }));
  }

  private async searchPlatform(
    platform: string,
    keyword: string,
  ): Promise<MentionResult[]> {
    if (!this.browser) throw new Error("Browser not initialized");

    const page = await this.browser.newPage();
    try {
      // Platform-specific search — each has different URL patterns
      const searchUrl = this.buildSearchUrl(platform, keyword);
      if (!searchUrl) return [];

      await page.goto(searchUrl, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(2000);

      // Extract search results
      const results = await page.evaluate(
        (args: { plat: string; kw: string }) => {
          const items = document.querySelectorAll("article, [data-testid='tweet'], [data-test-id='pin']");
          const mentions: Array<{
            platform: string;
            postUrl: string;
            author: string;
            content: string;
            sentiment: "neutral";
            mentionsBrand: boolean;
          }> = [];

          items.forEach((item) => {
            const text = item.textContent ?? "";
            const link = item.querySelector("a");
            mentions.push({
              platform: args.plat,
              postUrl: link?.href ?? "",
              author: "",
              content: text.slice(0, 500),
              sentiment: "neutral",
              mentionsBrand: text.toLowerCase().includes(args.kw.toLowerCase()),
            });
          });

          return mentions;
        },
        { plat: platform, kw: keyword },
      );

      return results;
    } finally {
      await page.close();
    }
  }

  private buildSearchUrl(platform: string, keyword: string): string | null {
    const encoded = encodeURIComponent(keyword);
    switch (platform) {
      case "pinterest":
        return `https://www.pinterest.com/search/pins/?q=${encoded}`;
      case "tiktok":
        return `https://www.tiktok.com/search?q=${encoded}`;
      default:
        return null;
    }
  }
}
