import { browserPool } from "./render/browserPool";
import { render, isRenderError, type RenderResult } from "./render/render";
import { validateRenderRequest, isValidationError } from "./validation";
import { authenticateRequest } from "./middleware/auth";
import { initConvexSync, closeConvexClient, getCacheStats, getConvexClient } from "./sync/convexClient";
import { queueRenderReport, flushPendingRenders } from "./sync/usageSync";
import { queueImageUpload } from "./sync/uploadQueue";
import { imageStore } from "./store/imageStore";
import { diskImageStore } from "./store/diskImageStore";
import { api } from "../convex/_generated/api";
import { logger, type Logger } from "./lib/logger";

const PORT = parseInt(process.env.PORT || "3201", 10);
const IS_DEV = process.env.NODE_ENV !== "production";
const MAX_QUEUE_LENGTH = parseInt(process.env.MAX_QUEUE_LENGTH || "50", 10);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CORS_ORIGIN = process.env.CORS_ORIGIN || (IS_DEV ? "*" : "");

function jsonResponse(data: object, status = 200, headers?: HeadersInit, requestId?: string): Response {
  const responseHeaders = new Headers(headers);
  if (!responseHeaders.has("Content-Type")) {
    responseHeaders.set("Content-Type", "application/json");
  }
  if (requestId) {
    responseHeaders.set("X-Request-Id", requestId);
  }
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders,
  });
}

function generateRequestId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function logRender(log: Logger, result: RenderResult["stats"], success: boolean): void {
  log.info("render.complete", {
    success,
    queueWaitMs: result.queueWaitMs,
    renderMs: result.renderMs,
    screenshotMs: result.screenshotMs,
    bytesDownloaded: result.bytesDownloaded,
    blockedRequests: result.blockedRequests,
  });
}

async function handleRender(req: Request, log: Logger, requestId: string): Promise<Response> {
  // Auth check
  const auth = authenticateRequest(req, log);
  if (!auth.authenticated) {
    return jsonResponse(auth.response, auth.status, undefined, requestId);
  }

  // Enrich logger with user context
  const rlog = log.child({ userId: auth.apiKey.userId, apiKeyId: auth.apiKey.id });

  // Check queue length
  const stats = browserPool.stats;
  if (stats.queueLength >= MAX_QUEUE_LENGTH) {
    rlog.warn("queue.full", { queueLength: stats.queueLength, available: stats.available });
    return jsonResponse({ code: "QUEUE_FULL", message: "Server is overloaded, try again later" }, 429, undefined, requestId);
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    rlog.warn("request.invalid_json");
    return jsonResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON" }, 400, undefined, requestId);
  }

  // Validate
  const validated = validateRenderRequest(body);
  if (isValidationError(validated)) {
    rlog.warn("request.validation_error", { code: validated.code });
    return jsonResponse(validated, 400, undefined, requestId);
  }

  // Template resolution: fetch template from Convex and interpolate variables
  if (validated.templateId) {
    try {
      const template: {
        userId: string;
        html: string;
        css?: string;
        variables: { name: string; defaultValue?: string }[];
        width?: number;
        height?: number;
        format?: "png" | "jpeg" | "webp";
        isPublic: boolean;
      } | null = await getConvexClient().query((api as any).templates.getTemplate, {
        templateId: validated.templateId,
      });
      if (!template) {
        return jsonResponse({ code: "TEMPLATE_NOT_FOUND", message: "Template not found" }, 404, undefined, requestId);
      }
      // Check access: template must be public or owned by the user
      if (!template.isPublic && template.userId !== auth.apiKey.userId) {
        return jsonResponse({ code: "TEMPLATE_NOT_FOUND", message: "Template not found" }, 404, undefined, requestId);
      }

      rlog.debug("template.resolved", {
        templateId: validated.templateId,
        variableCount: template.variables.length,
      });

      // Interpolate variables into HTML and CSS
      let html = template.html;
      let css = template.css || "";
      const vars = validated.variables || {};

      // Apply defaults for missing variables then interpolate
      for (const tmplVar of template.variables) {
        const value = vars[tmplVar.name] ?? tmplVar.defaultValue ?? "";
        const placeholder = `{{${tmplVar.name}}}`;
        html = html.split(placeholder).join(String(value));
        css = css.split(placeholder).join(String(value));
      }

      validated.html = html;
      validated.css = css || undefined;
      // Apply template defaults for width/height/format if not overridden
      if (!validated.width && template.width) validated.width = template.width;
      if (!validated.height && template.height) validated.height = template.height;
      if (!validated.format && template.format) validated.format = template.format;
    } catch (error) {
      rlog.error("template.fetch_failed", { templateId: validated.templateId, error });
      return jsonResponse({ code: "TEMPLATE_ERROR", message: "Failed to fetch template" }, 500, undefined, requestId);
    }
  }

  // Compute content hash for duplicate detection
  const contentHash = computeContentHash(validated);
  const enableCache = validated.cache !== false; // Default to true

  // Check for cached render if caching enabled
  if (enableCache) {
    try {
      const cached = await getConvexClient().action(api.images.checkCachedRender, { contentHash });
      if (cached.cached && cached.externalId && cached.imageKey) {
        const ext = validated.format || "png";
        rlog.info("cache.hit", { contentHash: contentHash.slice(0, 12), renderId: cached.externalId });

        // Return cached result
        if (validated.responseFormat === "base64") {
          // Fetch the image and return as base64
          const imageData = await diskImageStore.get(cached.externalId, ext);
          if (imageData) {
            const fileBuffer = await Bun.file(imageData.path).arrayBuffer();
            const base64 = Buffer.from(fileBuffer).toString("base64");
            return jsonResponse({
              id: cached.externalId,
              base64,
              mimeType: imageData.contentType,
              cached: true,
            }, 200, undefined, requestId);
          }
          // If not in disk cache, redirect to URL
        }

        return jsonResponse({
          id: cached.externalId,
          url: `${BASE_URL}/images/${cached.externalId}.${ext}`,
          imageKey: cached.imageKey,
          cached: true,
        }, 200, undefined, requestId);
      }
    } catch (error) {
      // If cache check fails, proceed with render
      rlog.error("cache.check_failed", { error });
    }
  }

  // Render
  const result = await render(validated, rlog);
  const id = generateImageId();

  // Compute htmlHash for backwards compat (use html or url)
  const htmlHash = validated.html ? hashHtml(validated.html) : hashHtml(validated.url || "");

  if (isRenderError(result)) {
    logRender(
      rlog,
      { queueWaitMs: 0, renderMs: 0, screenshotMs: 0, bytesDownloaded: 0, blockedRequests: 0 },
      false
    );

    // Queue render report to Convex
    queueRenderReport({
      externalId: id,
      apiKeyId: auth.apiKey.id,
      userId: auth.apiKey.userId,
      status: "error",
      htmlHash,
      contentHash,
      format: validated.format || "png",
      renderMs: 0,
      createdAt: Date.now(),
    });

    return jsonResponse(result, 500, undefined, requestId);
  }

  logRender(rlog, result.stats, true);

  const ext = result.contentType.split("/")[1] || "png";
  const imageKey = `${id}.${ext}`;

  imageStore.store(id, result.buffer, result.contentType);
  void diskImageStore.save(id, ext, result.buffer).catch((error) => {
    rlog.error("disk_cache.save_failed", { error });
  });

  const enqueueStart = performance.now();
  queueImageUpload({
    renderId: id,
    contentType: result.contentType,
    buffer: result.buffer,
    imageKey,
  });
  const uploadQueueMs = Math.round(performance.now() - enqueueStart);

  // Queue render report to Convex
  queueRenderReport({
    externalId: id,
    apiKeyId: auth.apiKey.id,
    userId: auth.apiKey.userId,
    status: "success",
    htmlHash,
    contentHash,
    format: validated.format || "png",
    renderMs: result.stats.renderMs,
    createdAt: Date.now(),
  });

  const serverTiming = `queueWait;dur=${result.stats.queueWaitMs}, render;dur=${result.stats.renderMs}, screenshot;dur=${result.stats.screenshotMs}, uploadQueue;dur=${uploadQueueMs}`;

  // Return base64 response if requested
  if (validated.responseFormat === "base64") {
    const base64 = Buffer.from(result.buffer).toString("base64");
    return jsonResponse(
      {
        id,
        base64,
        mimeType: result.contentType,
      },
      200,
      { "Server-Timing": serverTiming },
      requestId
    );
  }

  return jsonResponse(
    {
      id,
      url: `${BASE_URL}/images/${id}.${ext}`,
      imageKey,
    },
    200,
    { "Server-Timing": serverTiming },
    requestId
  );
}

function hashHtml(html: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(html);
  return hasher.digest("hex");
}

function computeContentHash(request: {
  html?: string;
  url?: string;
  css?: string;
  googleFonts?: string[];
  selector?: string;
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  format?: string;
  quality?: number;
  fullPage?: boolean;
  background?: string;
}): string {
  const hasher = new Bun.CryptoHasher("sha256");
  // Include all rendering parameters that affect output
  hasher.update(
    JSON.stringify({
      html: request.html,
      url: request.url,
      css: request.css,
      googleFonts: request.googleFonts?.sort(),
      selector: request.selector,
      width: request.width || 1200,
      height: request.height || 800,
      deviceScaleFactor: request.deviceScaleFactor || 1,
      format: request.format || "png",
      quality: request.quality,
      fullPage: request.fullPage || false,
      background: request.background || "white",
    })
  );
  return hasher.digest("hex");
}

function parseImageId(id: string): { cleanId: string; ext?: string } {
  const match = id.match(/^(.+)\.(png|jpe?g|webp)$/i);
  if (match) {
    const ext = match[2]?.toLowerCase() || undefined;
    return { cleanId: match[1] || id, ext };
  }
  return { cleanId: id };
}

async function handleGetImage(id: string, log: Logger): Promise<Response> {
  const { cleanId, ext } = parseImageId(id);

  const cached = imageStore.get(cleanId);
  if (cached) {
    log.debug("image.hit", { renderId: cleanId, tier: "memory" });
    const body = Uint8Array.from(cached.buffer);
    const blob = new Blob([body], { type: cached.contentType });
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const diskCached = await diskImageStore.get(cleanId, ext);
  if (diskCached) {
    log.debug("image.hit", { renderId: cleanId, tier: "disk" });
    return new Response(Bun.file(diskCached.path), {
      status: 200,
      headers: {
        "Content-Type": diskCached.contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  try {
    const client = getConvexClient();
    const url = await client.action(api.images.getImageUrlByRender, { renderId: cleanId });
    if (!url) {
      log.debug("image.miss", { renderId: cleanId });
      return jsonResponse({ code: "NOT_FOUND", message: "Image not found" }, 404);
    }
    log.debug("image.hit", { renderId: cleanId, tier: "remote" });
    return new Response(null, {
      status: 302,
      headers: { Location: url },
    });
  } catch (error) {
    log.error("image.fetch_failed", { renderId: cleanId, error });
    return jsonResponse({ code: "NOT_FOUND", message: "Image not found" }, 404);
  }
}

async function handleHealthz(): Promise<Response> {
  return jsonResponse({ status: "ok", timestamp: new Date().toISOString() });
}

async function handleReadyz(): Promise<Response> {
  const canRender = await browserPool.testRender();
  const cacheStats = getCacheStats();
  const isAuthReady = cacheStats.lastUpdate > 0;

  if (canRender && isAuthReady) {
    return jsonResponse({
      status: "ready",
      ...browserPool.stats,
      authCache: cacheStats,
    });
  }

  return jsonResponse(
    {
      status: "not_ready",
      ...browserPool.stats,
      authCache: cacheStats,
      reason: !canRender ? "browser_pool" : "auth_cache",
    },
    503
  );
}

function withCors(res: Response, origin?: string | null): Response {
  if (!CORS_ORIGIN) return res;
  const allowed = CORS_ORIGIN === "*" ? "*" : CORS_ORIGIN;
  if (allowed !== "*" && origin && !allowed.split(",").includes(origin)) return res;
  res.headers.set("Access-Control-Allow-Origin", allowed === "*" ? "*" : origin || allowed.split(",")[0]!);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Max-Age", "86400");
  return res;
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  const origin = req.headers.get("Origin");

  // CORS preflight
  if (method === "OPTIONS" && CORS_ORIGIN) {
    return withCors(new Response(null, { status: 204 }), origin);
  }

  const requestId = generateRequestId();
  const log = logger.child({ requestId, method, path });

  // Dev testing interface (dev mode only)
  if (IS_DEV && path === "/dev" && method === "GET") {
    const devPage = Bun.file(import.meta.dir + "/dev/index.html");
    return new Response(devPage, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (path === "/render" && method === "POST") {
    const res = await handleRender(req, log, requestId);
    res.headers.set("X-Request-Id", requestId);
    return withCors(res, origin);
  }

  // GET /images/:id
  const imageMatch = path.match(/^\/images\/([^/]+)$/);
  if (imageMatch && method === "GET") {
    const res = await handleGetImage(imageMatch[1] || "", log);
    res.headers.set("X-Request-Id", requestId);
    return withCors(res, origin);
  }

  if (path === "/healthz" && method === "GET") {
    return withCors(await handleHealthz(), origin);
  }

  if (path === "/readyz" && method === "GET") {
    return withCors(await handleReadyz(), origin);
  }

  return withCors(jsonResponse({ code: "NOT_FOUND", message: "Endpoint not found" }, 404), origin);
}

// Initialize browser pool and start server
async function main() {
  logger.info("Initializing Convex sync...");
  initConvexSync();

  logger.info("Initializing browser pool...");
  await browserPool.initialize();

  const server = Bun.serve({
    port: PORT,
    fetch: handleRequest,
  });

  logger.info(`Server running on http://localhost:${server.port}`);

  // Handle graceful shutdown
  const shutdown = async () => {
    logger.info("Shutting down...");
    logger.info("Flushing pending renders...");
    await flushPendingRenders();

    imageStore.shutdown();
    diskImageStore.shutdown();
    await browserPool.shutdown();
    await closeConvexClient();
    await logger.flush();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  logger.error("Failed to start server", { error: String(err) });
  process.exit(1);
});

function generateImageId(): string {
  return crypto.randomUUID();
}
