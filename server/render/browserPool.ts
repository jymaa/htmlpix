import puppeteer, { Browser, BrowserContext } from "puppeteer";
import { logger } from "../lib/logger";

const BROWSER_INSTANCES = parseInt(process.env.BROWSER_INSTANCES || "1", 10);
const RENDER_CONCURRENCY = parseInt(process.env.RENDER_CONCURRENCY || "3", 10);

class Semaphore {
  private permits: number;
  private waiting: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }
    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      const next = this.waiting.shift();
      if (next) next();
    } else {
      this.permits++;
    }
  }

  get available(): number {
    return this.permits;
  }

  get queueLength(): number {
    return this.waiting.length;
  }
}

export class BrowserPool {
  private browsers: Browser[] = [];
  private semaphore: Semaphore;
  private currentIndex = 0;
  private restartCount = 0;
  private isInitialized = false;

  constructor() {
    this.semaphore = new Semaphore(RENDER_CONCURRENCY);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const launchOptions = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-sync",
        "--disable-translate",
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--safebrowsing-disable-auto-update",
      ],
    };

    for (let i = 0; i < BROWSER_INSTANCES; i++) {
      const browser = await puppeteer.launch(launchOptions);
      this.browsers.push(browser);
    }

    this.isInitialized = true;
    logger.info(`BrowserPool: initialized ${BROWSER_INSTANCES} browser(s), concurrency=${RENDER_CONCURRENCY}`);
  }

  async acquireContext(): Promise<{ context: BrowserContext; release: () => Promise<void> }> {
    await this.semaphore.acquire();

    // Round-robin browser selection
    const browser = this.browsers[this.currentIndex % this.browsers.length];
    this.currentIndex++;

    if (!browser) {
      this.semaphore.release();
      throw new Error("No browser available");
    }

    const context = await browser.createBrowserContext();

    const release = async () => {
      try {
        await context.close();
      } catch {
        // Context may already be closed
      }
      this.semaphore.release();
    };

    return { context, release };
  }

  async testRender(): Promise<boolean> {
    try {
      const { context, release } = await this.acquireContext();
      try {
        const page = await context.newPage();
        await page.setContent("<html><body>test</body></html>");
        await page.close();
        return true;
      } finally {
        await release();
      }
    } catch {
      return false;
    }
  }

  async restartBrowser(index: number): Promise<void> {
    const oldBrowser = this.browsers[index];
    if (oldBrowser) {
      try {
        await oldBrowser.close();
      } catch {
        // May already be closed
      }
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    this.browsers[index] = browser;
    this.restartCount++;
    logger.info(`BrowserPool: restarted browser ${index}`, { totalRestarts: this.restartCount });
  }

  async shutdown(): Promise<void> {
    for (const browser of this.browsers) {
      try {
        await browser.close();
      } catch {
        // Ignore
      }
    }
    this.browsers = [];
    this.isInitialized = false;
  }

  get stats() {
    return {
      browsers: this.browsers.length,
      concurrency: RENDER_CONCURRENCY,
      available: this.semaphore.available,
      queueLength: this.semaphore.queueLength,
      restarts: this.restartCount,
    };
  }
}

// Global singleton
export const browserPool = new BrowserPool();
