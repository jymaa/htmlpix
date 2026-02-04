import type { Page, ScreenshotOptions } from "puppeteer";
import { browserPool } from "./browserPool";
import { injectGoogleFonts } from "./googleFonts";
import { createRequestInterceptor, updateBytesDownloaded, type RequestStats } from "./requestPolicy";
import type { RenderRequest } from "../validation";

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;
const DEFAULT_TIMEOUT_MS = parseInt(process.env.DEFAULT_TIMEOUT_MS || "5000", 10);
const FONT_STABILIZATION_MS = parseInt(process.env.FONT_STABILIZATION_MS || "100", 10);

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

function buildHtml(request: RenderRequest): string {
  let html = request.html;

  // Inject CSS if provided
  if (request.css) {
    const styleTag = `<style>${request.css}</style>`;
    const headCloseIndex = html.toLowerCase().indexOf("</head>");
    if (headCloseIndex !== -1) {
      html = html.slice(0, headCloseIndex) + styleTag + "\n" + html.slice(headCloseIndex);
    } else {
      html = styleTag + "\n" + html;
    }
  }

  // Inject Google Fonts
  if (request.googleFonts && request.googleFonts.length > 0) {
    html = injectGoogleFonts(html, request.googleFonts);
  }

  return html;
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
    const { handler } = createRequestInterceptor(useGoogleFonts);

    await page.setRequestInterception(true);
    page.on("request", (req) => handler(req, requestStats));
    page.on("response", (response) => {
      const headers = response.headers();
      const contentLength = parseInt(headers["content-length"] || "0", 10);
      updateBytesDownloaded(requestStats, contentLength);
    });

    // Build and set content
    const html = buildHtml(request);
    const timeoutMs = request.timeoutMs || DEFAULT_TIMEOUT_MS;

    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
      timeout: timeoutMs,
    });

    // Wait for all images to be fully loaded
    await page.evaluate(`
      Promise.all(
        Array.from(document.querySelectorAll('img')).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.addEventListener('load', () => resolve());
            img.addEventListener('error', () => reject(new Error('Image failed: ' + img.src)));
          });
        })
      )
    `);

    // Wait for fonts to load
    await page.evaluate("document.fonts.ready");

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
