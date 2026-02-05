import { browserPool } from "./render/browserPool";
import { render, isRenderError, type RenderResult } from "./render/render";
import { validateRenderRequest, isValidationError, type RenderRequest } from "./validation";
import { initDb, closeDb } from "./db/index";
import { storeImage, getImage, generateImageId, startImageCleanup, stopImageCleanup } from "./db/images";
import { insertRender } from "./db/renders";
import { authenticateRequest } from "./middleware/auth";
import { initConvexSync, closeConvexClient, getCacheStats } from "./sync/convexClient";
import { queueRenderReport, flushPendingRenders } from "./sync/usageSync";

const PORT = parseInt(process.env.PORT || "3201", 10);
const IS_DEV = process.env.NODE_ENV !== "production";
const MAX_QUEUE_LENGTH = parseInt(process.env.MAX_QUEUE_LENGTH || "50", 10);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
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

    // Record failed render locally
    insertRender({
      id,
      apiKeyId: auth.apiKey.id,
      html: validated.html,
      options: extractOptions(validated),
      status: "error",
      errorMessage: result.message,
      stats: { queueWaitMs: 0, renderMs: 0, screenshotMs: 0, bytesDownloaded: 0, blockedRequests: 0 },
    });

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

  // Store image in DB
  const ext = result.contentType.split("/")[1] || "png";
  storeImage(id, result.buffer, result.contentType);

  // Record successful render locally
  insertRender({
    id,
    apiKeyId: auth.apiKey.id,
    html: validated.html,
    options: extractOptions(validated),
    status: "success",
    stats: result.stats,
  });

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
  });
}

function extractOptions(req: RenderRequest): Omit<RenderRequest, "html"> {
  const { html, ...options } = req;
  return options;
}

function hashHtml(html: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(html);
  return hasher.digest("hex");
}

async function handleGetImage(id: string): Promise<Response> {
  // Strip extension if present
  const cleanId = id.replace(/\.(png|jpeg|jpg|webp)$/, "");

  const image = getImage(cleanId);
  if (!image) {
    return jsonResponse({ code: "NOT_FOUND", message: "Image not found or expired" }, 404);
  }

  return new Response(Buffer.from(image.buffer), {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
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
  console.log("Initializing database...");
  initDb();

  console.log("Starting image cleanup...");
  startImageCleanup();

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
    stopImageCleanup();

    console.log("Flushing pending renders...");
    await flushPendingRenders();

    await browserPool.shutdown();
    await closeConvexClient();
    closeDb();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
