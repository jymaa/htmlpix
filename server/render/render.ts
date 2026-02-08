import type { Page, ScreenshotOptions, BoundingBox } from "puppeteer";
import { browserPool } from "./browserPool";
import { injectGoogleFonts } from "./googleFonts";
import { createRequestInterceptor, updateBytesDownloaded, type RequestStats } from "./requestPolicy";
import type { RenderRequest } from "../validation";

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;
const DEFAULT_TIMEOUT_MS = parseInt(process.env.DEFAULT_TIMEOUT_MS || "5000", 10);
const FONT_STABILIZATION_MS = parseInt(process.env.FONT_STABILIZATION_MS || "100", 10);
const ASSET_WAIT_MS = parseInt(process.env.ASSET_WAIT_MS || "2000", 10);

export interface RenderResult {
  buffer: Uint8Array;
  contentType: string;
  stats: {
    queueWaitMs: number;
    renderMs: number;
    screenshotMs: number;
    bytesDownloaded: number;
    blockedRequests: number;
  };
}

export interface RenderError {
  code: string;
  message: string;
}

function buildHtml(html: string, request: RenderRequest, useTransparentBackground: boolean): string {
  let result = html;

  // Inject default white background unless transparent is requested
  // This prevents grey/dark backgrounds in headless Chrome
  if (!useTransparentBackground) {
    const defaultBgStyle = `<style>html, body { margin: 0; padding: 0; background-color: white; }</style>`;
    const headCloseIndex = result.toLowerCase().indexOf("</head>");
    if (headCloseIndex !== -1) {
      result = result.slice(0, headCloseIndex) + defaultBgStyle + "\n" + result.slice(headCloseIndex);
    } else {
      result = defaultBgStyle + "\n" + result;
    }
  }

  // Inject CSS if provided (after default bg so user CSS can override)
  if (request.css) {
    const styleTag = `<style>${request.css}</style>`;
    const headCloseIndex = result.toLowerCase().indexOf("</head>");
    if (headCloseIndex !== -1) {
      result = result.slice(0, headCloseIndex) + styleTag + "\n" + result.slice(headCloseIndex);
    } else {
      result = styleTag + "\n" + result;
    }
  }

  // Inject Google Fonts
  if (request.googleFonts && request.googleFonts.length > 0) {
    result = injectGoogleFonts(result, request.googleFonts);
  }

  return result;
}

export async function render(request: RenderRequest): Promise<RenderResult | RenderError> {
  const startTime = performance.now();
  let queueWaitMs = 0;
  let renderMs = 0;
  let screenshotMs = 0;

  const { context, release } = await browserPool.acquireContext();
  queueWaitMs = performance.now() - startTime;

  let page: Page | null = null;
  const requestStats: RequestStats = { bytesDownloaded: 0, blockedCount: 0 };

  try {
    const renderStart = performance.now();

    page = await context.newPage();

    // Set viewport
    const width = request.width || DEFAULT_WIDTH;
    const height = request.height || DEFAULT_HEIGHT;
    const deviceScaleFactor = request.deviceScaleFactor || 1;

    await page.setViewport({ width, height, deviceScaleFactor });

    // Set up request interception
    const useGoogleFonts = (request.googleFonts && request.googleFonts.length > 0) || false;
    const allowAllDomains = !!request.url; // Allow all domains in URL mode
    const { handler } = createRequestInterceptor(useGoogleFonts, allowAllDomains);

    await page.setRequestInterception(true);
    page.on("request", (req) => handler(req, requestStats));
    page.on("response", (response) => {
      const headers = response.headers();
      const contentLength = parseInt(headers["content-length"] || "0", 10);
      updateBytesDownloaded(requestStats, contentLength);
    });

    const useTransparentBackground = request.background === "transparent";
    const timeoutMs = request.timeoutMs || DEFAULT_TIMEOUT_MS;

    // Either navigate to URL or set HTML content
    if (request.url) {
      // URL mode: navigate to the URL
      await page.goto(request.url, {
        waitUntil: "load",
        timeout: timeoutMs,
      });
    } else if (request.html) {
      // HTML mode: set content directly
      const html = buildHtml(request.html, request, useTransparentBackground);
      await page.setContent(html, {
        waitUntil: "load",
        timeout: timeoutMs,
      });
    }

    // Wait for all images to be fully loaded (both <img> and CSS background-image)
    const waitForAssets = page.evaluate(`
      (async () => {
        // Wait for <img> elements
        const imgPromises = Array.from(document.querySelectorAll('img')).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.addEventListener('load', () => resolve());
            img.addEventListener('error', () => reject(new Error('Image failed: ' + img.src)));
          });
        });

        // Wait for CSS background images
        const bgPromises = [];
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          const style = getComputedStyle(el);
          const bg = style.backgroundImage;
          if (bg && bg !== 'none') {
            const urls = bg.match(/url\\(["']?([^"')]+)["']?\\)/g);
            if (urls) {
              for (const urlMatch of urls) {
                const url = urlMatch.replace(/url\\(["']?|["']?\\)/g, '');
                if (url && !url.startsWith('data:')) {
                  bgPromises.push(new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Don't fail on blocked/missing images
                    img.src = url;
                  }));
                }
              }
            }
          }
        }

        await Promise.all([...imgPromises, ...bgPromises]);
      })()
    `);

    const waitForFonts = page.evaluate("document.fonts.ready");
    const waitForAllAssets = Promise.all([waitForAssets, waitForFonts]);

    if (ASSET_WAIT_MS > 0) {
      await Promise.race([
        waitForAllAssets,
        new Promise((resolve) => setTimeout(resolve, ASSET_WAIT_MS)),
      ]);
      void waitForAllAssets.catch(() => undefined);
    } else {
      await waitForAllAssets;
    }

    // Small stabilization delay for fonts
    if (useGoogleFonts) {
      await new Promise((resolve) => setTimeout(resolve, FONT_STABILIZATION_MS));
    }

    renderMs = performance.now() - renderStart;

    // Take screenshot
    const screenshotStart = performance.now();

    const format = request.format || "png";
    const screenshotOptions: ScreenshotOptions = {
      type: format,
      fullPage: request.fullPage || false,
      omitBackground: request.background === "transparent",
    };

    if ((format === "jpeg" || format === "webp") && request.quality !== undefined) {
      screenshotOptions.quality = request.quality;
    }

    // Handle DOM selector targeting
    if (request.selector) {
      const element = await page.$(request.selector);
      if (!element) {
        return {
          code: "SELECTOR_NOT_FOUND",
          message: `Element not found for selector: ${request.selector}`,
        };
      }
      const boundingBox = await element.boundingBox();
      if (boundingBox) {
        screenshotOptions.clip = {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        };
        // When using clip, fullPage should be false
        screenshotOptions.fullPage = false;
      }
    }

    const buffer = await page.screenshot(screenshotOptions);

    screenshotMs = performance.now() - screenshotStart;

    const contentType =
      format === "png"
        ? "image/png"
        : format === "jpeg"
          ? "image/jpeg"
          : "image/webp";

    return {
      buffer: buffer as Uint8Array,
      contentType,
      stats: {
        queueWaitMs: Math.round(queueWaitMs),
        renderMs: Math.round(renderMs),
        screenshotMs: Math.round(screenshotMs),
        bytesDownloaded: requestStats.bytesDownloaded,
        blockedRequests: requestStats.blockedCount,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("timeout") || message.includes("Timeout")) {
      return { code: "RENDER_TIMEOUT", message: `Render timed out: ${message}` };
    }

    return { code: "RENDER_ERROR", message };
  } finally {
    if (page) {
      try {
        await page.close();
      } catch {
        // Ignore
      }
    }
    await release();
  }
}

export function isRenderError(result: RenderResult | RenderError): result is RenderError {
  return "code" in result && "message" in result && !("buffer" in result);
}
