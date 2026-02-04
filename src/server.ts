import { browserPool } from "./render/browserPool";
import { render, isRenderError, type RenderResult } from "./render/render";
import { validateRenderRequest, isValidationError, type RenderRequest } from "./validation";
import { initDb, closeDb } from "./db/index";
import { storeImage, getImage, generateImageId, startImageCleanup, stopImageCleanup } from "./db/images";
import { insertRender } from "./db/renders";
import { authenticateRequest } from "./middleware/auth";

const PORT = parseInt(process.env.PORT || "3000", 10);
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

    // Record failed render
    insertRender({
      id,
      apiKeyId: auth.apiKey.id,
      html: validated.html,
      options: extractOptions(validated),
      status: "error",
      errorMessage: result.message,
      stats: { queueWaitMs: 0, renderMs: 0, screenshotMs: 0, bytesDownloaded: 0, blockedRequests: 0 },
    });

    return jsonResponse(result, 500);
  }

  logRender(result.stats, true);

  // Store image in DB
  const ext = result.contentType.split("/")[1] || "png";
  storeImage(id, result.buffer, result.contentType);

  // Record successful render
  insertRender({
    id,
    apiKeyId: auth.apiKey.id,
    html: validated.html,
    options: extractOptions(validated),
    status: "success",
    stats: result.stats,
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

async function handleGetImage(id: string): Promise<Response> {
  // Strip extension if present
  const cleanId = id.replace(/\.(png|jpeg|jpg|webp)$/, "");

  const image = getImage(cleanId);
  if (!image) {
    return jsonResponse({ code: "NOT_FOUND", message: "Image not found or expired" }, 404);
  }

  return new Response(image.buffer, {
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
  if (canRender) {
    return jsonResponse({ status: "ready", ...browserPool.stats });
  }
  return jsonResponse({ status: "not_ready", ...browserPool.stats }, 503);
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

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
    await browserPool.shutdown();
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
