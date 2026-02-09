import { renderWithTakumi } from "./render/takumiRender";
import { authenticateRequest } from "./middleware/auth";
import {
  initConvexSync,
  closeConvexClient,
  getCacheStats,
  getConvexClient,
  validateUserQuota,
} from "./sync/convexClient";
import { imageStore } from "./store/imageStore";
import { diskImageStore } from "./store/diskImageStore";
import {
  validateImageUrlMintRequest,
  validateTemplatePreviewRenderRequest,
  parseSignedImageQuery,
  isValidationError,
  type RenderRequest,
} from "./validation";
import { canonicalizeQuery, signCanonicalQuery, verifyCanonicalQuery } from "./lib/signing";
import { api } from "../convex/_generated/api";
import { logger, type Logger } from "./lib/logger";
import { interpolateTemplate, resolveTemplateVariables } from "./render/templateInterpolation";

const PORT = parseInt(process.env.PORT || "3201", 10);
const IS_DEV = process.env.NODE_ENV !== "production";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CORS_ORIGIN = process.env.CORS_ORIGIN || (IS_DEV ? "*" : "");
const SERVER_SECRET = process.env.SERVER_SECRET || "";
const TEMPLATE_PREVIEW_SECRET = process.env.TEMPLATE_PREVIEW_SECRET || "";
const DEFAULT_IMAGE_TTL_MS = 5 * 365 * 24 * 60 * 60 * 1000; // 5 years

if (!SERVER_SECRET) {
  throw new Error("SERVER_SECRET environment variable is required");
}

interface ServerTemplate {
  _id: string;
  userId: string;
  html: string;
  css?: string;
  variables: { name: string; defaultValue?: string }[];
  width?: number;
  height?: number;
  format?: "png" | "jpeg" | "webp";
  isPublic: boolean;
  updatedAt: number;
}

interface RenderEventPayload {
  userId: string;
  templateId: string;
  tv?: string;
  canonicalPath: string;
  contentHash: string;
  status: "success" | "error";
  cached: boolean;
  format: "png" | "jpeg" | "webp";
  renderMs: number;
  errorCode?: string;
  createdAt: number;
}

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

function toStringRecord(input: Record<string, string | number> | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input || {})) {
    out[key] = String(value);
  }
  return out;
}

async function fetchTemplate(templateId: string): Promise<ServerTemplate | null> {
  return (await getConvexClient().query((api as any).templates.getTemplateForServer, {
    serverSecret: SERVER_SECRET,
    templateId,
  })) as ServerTemplate | null;
}

function hashContent(input: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(input);
  return hasher.digest("hex");
}

function buildCanonicalPath(canonicalQuery: string, sig: string): string {
  return `/v1/image?${canonicalQuery}&sig=${encodeURIComponent(sig)}`;
}

function makeImageHeaders(
  contentType: string,
  etag: string,
  cached: boolean,
  requestId: string,
  renderId: string
): HeadersInit {
  return {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: etag,
    "X-Render-Cached": cached ? "1" : "0",
    "X-Request-Id": requestId,
    "X-Render-Id": renderId,
  };
}

function isNotModified(req: Request, etag: string): boolean {
  const ifNoneMatch = req.headers.get("If-None-Match");
  if (!ifNoneMatch) return false;
  return ifNoneMatch === etag;
}

async function writeRenderEvent(event: RenderEventPayload, log: Logger): Promise<void> {
  try {
    await getConvexClient().mutation((api as any).sync.ingestRenderEvents, {
      serverSecret: SERVER_SECRET,
      events: [event],
    });
  } catch (error) {
    log.error("event.ingest_failed", { error, templateId: event.templateId });
  }
}

async function handleTemplatePreview(req: Request, log: Logger, requestId: string): Promise<Response> {
  if (!TEMPLATE_PREVIEW_SECRET) {
    log.error("template_preview.misconfigured", { reason: "missing_secret" });
    return jsonResponse(
      { code: "PREVIEW_NOT_CONFIGURED", message: "Template preview is not configured on the render server" },
      503,
      undefined,
      requestId
    );
  }

  const providedSecret = req.headers.get("X-Template-Preview-Secret");
  if (!providedSecret || providedSecret !== TEMPLATE_PREVIEW_SECRET) {
    log.warn("template_preview.unauthorized");
    return jsonResponse({ code: "UNAUTHORIZED", message: "Invalid template preview secret" }, 401, undefined, requestId);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON" }, 400, undefined, requestId);
  }

  const validated = validateTemplatePreviewRenderRequest(body);
  if (isValidationError(validated)) {
    return jsonResponse(validated, 400, undefined, requestId);
  }

  const resolved = resolveTemplateVariables(
    {
      html: validated.html,
      css: validated.css,
      variables: validated.variables,
    },
    toStringRecord(validated.variableValues)
  );

  if (resolved.missing.length > 0) {
    return jsonResponse(
      {
        code: "MISSING_TEMPLATE_VARIABLES",
        message: `Missing required template variables: ${resolved.missing.join(", ")}`,
      },
      400,
      undefined,
      requestId
    );
  }

  const html = interpolateTemplate(
    {
      html: validated.html,
      css: validated.css,
      variables: validated.variables,
    },
    resolved.values
  );
  const renderRequest: RenderRequest = {
    html,
    width: validated.width,
    height: validated.height,
    format: validated.format,
    quality: validated.quality,
  };

  log.info("template_preview.render_start", {
    width: validated.width,
    height: validated.height,
    format: validated.format,
  });

  try {
    const rendered = await renderWithTakumi(renderRequest, log);
    log.info("template_preview.render_success", {
      renderMs: rendered.renderMs,
      bytes: rendered.buffer.length,
    });

    return new Response(Buffer.from(rendered.buffer), {
      status: 200,
      headers: {
        "Content-Type": rendered.contentType,
        "X-Render-Ms": String(rendered.renderMs),
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown render error";
    log.warn("template_preview.render_error", { error: message });
    return jsonResponse({ code: "RENDER_ERROR", message }, 500, undefined, requestId);
  }
}

async function handleMintImageUrl(req: Request, log: Logger, requestId: string): Promise<Response> {
  const auth = authenticateRequest(req, log);
  if (!auth.authenticated) {
    return jsonResponse(auth.response, auth.status, undefined, requestId);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ code: "INVALID_JSON", message: "Request body must be valid JSON" }, 400, undefined, requestId);
  }

  const validated = validateImageUrlMintRequest(body);
  if (isValidationError(validated)) {
    return jsonResponse(validated, 400, undefined, requestId);
  }

  const template = await fetchTemplate(validated.templateId);
  if (!template) {
    return jsonResponse({ code: "TEMPLATE_NOT_FOUND", message: "Template not found" }, 404, undefined, requestId);
  }

  if (!template.isPublic && template.userId !== auth.apiKey.userId) {
    return jsonResponse({ code: "TEMPLATE_NOT_FOUND", message: "Template not found" }, 404, undefined, requestId);
  }

  const requestedVariables = toStringRecord(validated.variables);
  const resolved = resolveTemplateVariables(template, requestedVariables);
  if (resolved.missing.length > 0) {
    return jsonResponse(
      {
        code: "MISSING_TEMPLATE_VARIABLES",
        message: `Missing required template variables: ${resolved.missing.join(", ")}`,
      },
      400,
      undefined,
      requestId
    );
  }

  const width = validated.width ?? template.width ?? 1200;
  const height = validated.height ?? template.height ?? 630;
  const format = validated.format ?? template.format ?? "png";
  const tv = validated.tv || String(template.updatedAt);
  const exp = Date.now() + DEFAULT_IMAGE_TTL_MS;

  const canonicalQuery = canonicalizeQuery({
    templateId: validated.templateId,
    uid: auth.apiKey.userId,
    exp,
    width,
    height,
    format,
    quality: validated.quality,
    tv,
    variables: resolved.values,
  });
  const sig = signCanonicalQuery(canonicalQuery);

  return jsonResponse(
    {
      url: `${BASE_URL}/v1/image?${canonicalQuery}&sig=${encodeURIComponent(sig)}`,
      expiresAt: exp,
    },
    200,
    undefined,
    requestId
  );
}

async function handleSignedImage(req: Request, log: Logger, requestId: string): Promise<Response> {
  const url = new URL(req.url);
  const parsed = parseSignedImageQuery(url.searchParams);
  if (isValidationError(parsed)) {
    return jsonResponse(parsed, 400, undefined, requestId);
  }

  if (parsed.exp < Date.now()) {
    return jsonResponse({ code: "URL_EXPIRED", message: "Signed image URL has expired" }, 403, undefined, requestId);
  }

  const canonicalQuery = canonicalizeQuery({
    templateId: parsed.templateId,
    uid: parsed.uid,
    exp: parsed.exp,
    width: parsed.width,
    height: parsed.height,
    format: parsed.format,
    quality: parsed.quality,
    tv: parsed.tv,
    variables: parsed.variables,
  });

  if (!verifyCanonicalQuery(canonicalQuery, parsed.sig)) {
    return jsonResponse({ code: "INVALID_SIGNATURE", message: "Invalid signed image URL" }, 403, undefined, requestId);
  }

  const template = await fetchTemplate(parsed.templateId);
  if (!template) {
    return jsonResponse({ code: "TEMPLATE_NOT_FOUND", message: "Template not found" }, 404, undefined, requestId);
  }
  if (!template.isPublic && template.userId !== parsed.uid) {
    return jsonResponse({ code: "TEMPLATE_NOT_FOUND", message: "Template not found" }, 404, undefined, requestId);
  }

  const resolved = resolveTemplateVariables(template, parsed.variables);
  if (resolved.missing.length > 0) {
    return jsonResponse(
      {
        code: "MISSING_TEMPLATE_VARIABLES",
        message: `Missing required template variables: ${resolved.missing.join(", ")}`,
      },
      400,
      undefined,
      requestId
    );
  }

  const canonicalPath = buildCanonicalPath(canonicalQuery, parsed.sig);
  const contentHash = hashContent(canonicalQuery);
  const format = parsed.format;
  const contentType = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
  const etag = `"${contentHash}"`;
  const renderId = crypto.randomUUID().slice(0, 12);

  const inMemory = imageStore.get(contentHash);
  if (inMemory) {
    await writeRenderEvent(
      {
        userId: parsed.uid,
        templateId: parsed.templateId,
        tv: parsed.tv,
        canonicalPath,
        contentHash,
        status: "success",
        cached: true,
        format,
        renderMs: 0,
        createdAt: Date.now(),
      },
      log
    );

    if (isNotModified(req, etag)) {
      return new Response(null, {
        status: 304,
        headers: makeImageHeaders(inMemory.contentType, etag, true, requestId, renderId),
      });
    }

    return new Response(Buffer.from(inMemory.buffer), {
      status: 200,
      headers: makeImageHeaders(inMemory.contentType, etag, true, requestId, renderId),
    });
  }

  const diskCached = await diskImageStore.get(contentHash, format);
  if (diskCached) {
    try {
      const fileBuffer = await Bun.file(diskCached.path).arrayBuffer();
      imageStore.store(contentHash, new Uint8Array(fileBuffer), diskCached.contentType);
    } catch {
      // ignore warmup failures
    }

    await writeRenderEvent(
      {
        userId: parsed.uid,
        templateId: parsed.templateId,
        tv: parsed.tv,
        canonicalPath,
        contentHash,
        status: "success",
        cached: true,
        format,
        renderMs: 0,
        createdAt: Date.now(),
      },
      log
    );

    if (isNotModified(req, etag)) {
      return new Response(null, {
        status: 304,
        headers: makeImageHeaders(diskCached.contentType, etag, true, requestId, renderId),
      });
    }

    return new Response(Bun.file(diskCached.path), {
      status: 200,
      headers: makeImageHeaders(diskCached.contentType, etag, true, requestId, renderId),
    });
  }

  const quotaCheck = validateUserQuota(parsed.uid);
  if (!quotaCheck.allowed) {
    await writeRenderEvent(
      {
        userId: parsed.uid,
        templateId: parsed.templateId,
        tv: parsed.tv,
        canonicalPath,
        contentHash,
        status: "error",
        cached: false,
        format,
        renderMs: 0,
        errorCode: quotaCheck.code,
        createdAt: Date.now(),
      },
      log
    );

    return jsonResponse(
      {
        code: quotaCheck.code,
        message: quotaCheck.message,
      },
      quotaCheck.status,
      undefined,
      requestId
    );
  }

  const html = interpolateTemplate(template, resolved.values);
  const renderRequest: RenderRequest = {
    html,
    width: parsed.width,
    height: parsed.height,
    format,
    quality: parsed.quality,
  };

  try {
    const rendered = await renderWithTakumi(renderRequest, log);

    imageStore.store(contentHash, rendered.buffer, rendered.contentType);
    await diskImageStore.save(contentHash, format, rendered.buffer);

    await writeRenderEvent(
      {
        userId: parsed.uid,
        templateId: parsed.templateId,
        tv: parsed.tv,
        canonicalPath,
        contentHash,
        status: "success",
        cached: false,
        format,
        renderMs: rendered.renderMs,
        createdAt: Date.now(),
      },
      log
    );

    return new Response(Buffer.from(rendered.buffer), {
      status: 200,
      headers: {
        ...makeImageHeaders(rendered.contentType, etag, false, requestId, renderId),
        "Server-Timing": `render;dur=${rendered.renderMs}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown render error";

    await writeRenderEvent(
      {
        userId: parsed.uid,
        templateId: parsed.templateId,
        tv: parsed.tv,
        canonicalPath,
        contentHash,
        status: "error",
        cached: false,
        format,
        renderMs: 0,
        errorCode: "RENDER_ERROR",
        createdAt: Date.now(),
      },
      log
    );

    return jsonResponse({ code: "RENDER_ERROR", message }, 500, undefined, requestId);
  }
}

async function handleHealthz(): Promise<Response> {
  return jsonResponse({ status: "ok", timestamp: new Date().toISOString() });
}

async function handleReadyz(): Promise<Response> {
  const cacheStats = getCacheStats();
  const isAuthReady = cacheStats.lastUpdate > 0;

  if (isAuthReady) {
    return jsonResponse({
      status: "ready",
      authCache: cacheStats,
    });
  }

  return jsonResponse(
    {
      status: "not_ready",
      authCache: cacheStats,
      reason: "auth_cache",
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

  if (method === "OPTIONS" && CORS_ORIGIN) {
    return withCors(new Response(null, { status: 204 }), origin);
  }

  const requestId = generateRequestId();
  const log = logger.child({ requestId, method, path });

  if (IS_DEV && path === "/dev" && method === "GET") {
    const devPage = Bun.file(import.meta.dir + "/dev/index.html");
    return new Response(devPage, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (path === "/v1/image-url" && method === "POST") {
    const res = await handleMintImageUrl(req, log, requestId);
    return withCors(res, origin);
  }

  if (path === "/internal/template-preview" && method === "POST") {
    const res = await handleTemplatePreview(req, log, requestId);
    return withCors(res, origin);
  }

  if (path === "/v1/image" && method === "GET") {
    const res = await handleSignedImage(req, log, requestId);
    return withCors(res, origin);
  }

  if ((path === "/render" && method === "POST") || (path.startsWith("/images/") && method === "GET")) {
    return withCors(
      jsonResponse(
        {
          code: "ENDPOINT_DEPRECATED",
          message: "This endpoint is deprecated. Use POST /v1/image-url and GET /v1/image.",
        },
        410,
        undefined,
        requestId
      ),
      origin
    );
  }

  if (path === "/healthz" && method === "GET") {
    return withCors(await handleHealthz(), origin);
  }

  if (path === "/readyz" && method === "GET") {
    return withCors(await handleReadyz(), origin);
  }

  return withCors(jsonResponse({ code: "NOT_FOUND", message: "Endpoint not found" }, 404, undefined, requestId), origin);
}

async function main() {
  logger.info("Initializing Convex sync...");
  initConvexSync();

  const server = Bun.serve({
    port: PORT,
    fetch: handleRequest,
  });

  logger.info(`Server running on http://localhost:${server.port}`);

  const shutdown = async () => {
    logger.info("Shutting down...");

    imageStore.shutdown();
    diskImageStore.shutdown();
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
