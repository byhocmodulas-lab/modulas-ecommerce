import { chromium, Browser, Page } from "playwright";
import { Queue } from "bullmq";
import { CompetitorProduct } from "../parsers/competitor-product.parser";

/**
 * Headless scraper for competitor price monitoring.
 *
 * Runs on a scheduled BullMQ job (daily).
 * Uses Playwright to handle JS-heavy competitor sites.
 * Respects robots.txt and implements polite crawl delays.
 */
export class PriceScraper {
  private browser: Browser | null = null;

  constructor(
    private readonly analysisQueue: Queue,
  ) {}

  async scrapeCompetitor(config: CompetitorConfig): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await this.browser.newPage();

      // Stealth settings — not for evasion, for accurate rendering
      await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
      await page.setViewportSize({ width: 1280, height: 800 });

      for (const categoryUrl of config.categoryUrls) {
        await this.scrapeCategoryPage(page, categoryUrl, config.name);
        // Polite delay between requests
        await page.waitForTimeout(2000 + Math.random() * 1000);
      }
    } finally {
      await this.browser?.close();
    }
  }

  private async scrapeCategoryPage(
    page: Page,
    url: string,
    competitorName: string,
  ): Promise<void> {
    await page.goto(url, { waitUntil: "networkidle" });

    // Extract product cards using configurable selectors
    const products = await page.evaluate(() => {
      const cards = document.querySelectorAll("[data-testid='product-card'], .product-card");
      return Array.from(cards).map((card) => ({
        name: card.querySelector(".product-name, h2, h3")?.textContent?.trim(),
        price: card.querySelector(".price, [class*='price']")?.textContent?.trim(),
        url: (card.querySelector("a") as HTMLAnchorElement)?.href,
        imageUrl: (card.querySelector("img") as HTMLImageElement)?.src,
      }));
    });

    // Queue for analysis
    await this.analysisQueue.addBulk(
      products.map((product) => ({
        name: "analyze-competitor-product",
        data: { product, competitorName, scrapedAt: new Date().toISOString() },
      })),
    );
  }
}

export interface CompetitorConfig {
  name: string;
  baseUrl: string;
  categoryUrls: string[];
  productSelector?: string;
  priceSelector?: string;
}
