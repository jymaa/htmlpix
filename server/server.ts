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

const PORT = parseInt(process.env.PORT || "3201", 10);
const IS_DEV = process.env.NODE_ENV !== "production";
const MAX_QUEUE_LENGTH = parseInt(process.env.MAX_QUEUE_LENGTH || "50", 10);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

function jsonResponse(data: object, status = 200, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers);
  if (!responseHeaders.has("Content-Type")) {
    responseHeaders.set("Content-Type", "application/json");
  }
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders,
  });
}

function logRender(result: RenderResult["stats"], success: boolean): void {
  console.log(
    JSON.stringify({
      type: "render",
      success,
      queueWaitMs: result.queueWaitMs,
      renderMs: result.renderMs,
      screenshotMs: result.screenshotMs,
      bytesDownloaded: result.bytesDownloaded,
      blockedRequests: result.blockedRequests,
      timestamp: new Date().toISOString(),
    })
  );
}

async function handleRender(req: Request): Promise<Response> {
  // Auth check
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return jsonResponse(auth.response, auth.status);
  }

  // Check queue length
  const stats = browserPool.stats;
  if (stats.queueLength >= MAX_QUEUE_LENGTH) {
    return jsonResponse({ code: "QUEUE_FULL", message: "Server is overloaded, try again later" }, 429);
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON" }, 400);
  }

  // Validate
  const validated = validateRenderRequest(body);
  if (isValidationError(validated)) {
    return jsonResponse(validated, 400);
  }

  // Render
  const result = await render(validated);
  const id = generateImageId();

  if (isRenderError(result)) {
    logRender({ queueWaitMs: 0, renderMs: 0, screenshotMs: 0, bytesDownloaded: 0, blockedRequests: 0 }, false);

    // Queue render report to Convex
    queueRenderReport({
      externalId: id,
      apiKeyId: auth.apiKey.id,
      userId: auth.apiKey.userId,
      status: "error",
      htmlHash: hashHtml(validated.html),
      format: validated.format || "png",
      renderMs: 0,
      createdAt: Date.now(),
    });

    return jsonResponse(result, 500);
  }

  logRender(result.stats, true);

  const ext = result.contentType.split("/")[1] || "png";
  const imageKey = `${id}.${ext}`;

  imageStore.store(id, result.buffer, result.contentType);
  void diskImageStore.save(id, ext, result.buffer).catch((error) => {
    console.error("Failed to save image to disk cache:", error);
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
    htmlHash: hashHtml(validated.html),
    format: validated.format || "png",
    renderMs: result.stats.renderMs,
    createdAt: Date.now(),
  });

  return jsonResponse({
    id,
    url: `${BASE_URL}/images/${id}.${ext}`,
    imageKey,
  },
  200,
  {
    "Server-Timing": `queueWait;dur=${result.stats.queueWaitMs}, render;dur=${result.stats.renderMs}, screenshot;dur=${result.stats.screenshotMs}, uploadQueue;dur=${uploadQueueMs}`,
  });
}

function hashHtml(html: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(html);
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

async function handleGetImage(id: string): Promise<Response> {
  const { cleanId, ext } = parseImageId(id);

  const cached = imageStore.get(cleanId);
  if (cached) {
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
      return jsonResponse({ code: "NOT_FOUND", message: "Image not found" }, 404);
    }
    return new Response(null, {
      status: 302,
      headers: { Location: url },
    });
  } catch (error) {
    console.error("Failed to fetch image URL:", error);
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

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // Dev testing interface (dev mode only)
  if (IS_DEV && path === "/dev" && method === "GET") {
    const devPage = Bun.file(import.meta.dir + "/dev/index.html");
    return new Response(devPage, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (path === "/render" && method === "POST") {
    return handleRender(req);
  }

  // GET /images/:id
  const imageMatch = path.match(/^\/images\/([^/]+)$/);
  if (imageMatch && method === "GET") {
    return handleGetImage(imageMatch[1] || "");
  }

  if (path === "/healthz" && method === "GET") {
    return handleHealthz();
  }

  if (path === "/readyz" && method === "GET") {
    return handleReadyz();
  }

  return jsonResponse({ code: "NOT_FOUND", message: "Endpoint not found" }, 404);
}

// Initialize browser pool and start server
async function main() {
  console.log("Initializing Convex sync...");
  initConvexSync();

  console.log("Initializing browser pool...");
  await browserPool.initialize();

  const server = Bun.serve({
    port: PORT,
    fetch: handleRequest,
  });

  console.log(`Server running on http://localhost:${server.port}`);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down...");
    console.log("Flushing pending renders...");
    await flushPendingRenders();

    imageStore.shutdown();
    diskImageStore.shutdown();
    await browserPool.shutdown();
    await closeConvexClient();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

function generateImageId(): string {
  return crypto.randomUUID();
}
