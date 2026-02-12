import { NextResponse } from "next/server";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import {
  isValidationError,
  validateTemplatePreviewRenderRequest,
  type TemplatePreviewRenderRequest,
} from "../../../../../shared/validation";

export const runtime = "nodejs";

const TEMPLATE_PREVIEW_API_BASE = (
  process.env.TEMPLATE_PREVIEW_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3201"
).replace(/\/+$/, "");

function jsonError(code: string, message: string, status: number): NextResponse {
  return NextResponse.json({ code, message }, { status });
}

interface PreviewRouteRequest extends TemplatePreviewRenderRequest {
  templateId: string;
}

interface RouteValidationError {
  code: string;
  message: string;
}

function validatePreviewRouteRequest(body: unknown): PreviewRouteRequest | RouteValidationError {
  if (!body || typeof body !== "object") {
    return { code: "INVALID_BODY", message: "Request body must be a JSON object" };
  }

  const raw = body as Record<string, unknown>;
  if (typeof raw.templateId !== "string" || raw.templateId.trim().length === 0) {
    return { code: "MISSING_TEMPLATE_ID", message: "templateId is required" };
  }

  const validated = validateTemplatePreviewRenderRequest(raw);
  if (isValidationError(validated)) return validated;

  return {
    templateId: raw.templateId,
    ...validated,
  };
}

function normalizedUpstreamError(status: number, body: unknown): NextResponse {
  if (body && typeof body === "object" && "code" in body && "message" in body) {
    const record = body as Record<string, unknown>;
    const code = typeof record.code === "string" ? record.code : "PREVIEW_ERROR";
    const message = typeof record.message === "string" ? record.message : "Preview render failed";
    return jsonError(code, message, status);
  }
  return jsonError("PREVIEW_ERROR", "Preview render failed", status);
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    console.warn("[template-preview] unauthorized");
    return jsonError("UNAUTHENTICATED", "Authentication required", 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsed = validatePreviewRouteRequest(body);
  if ("code" in parsed) {
    return jsonError(parsed.code, parsed.message, 400);
  }

  const templateId = parsed.templateId as Id<"templates">;
  const template = await fetchAuthQuery(api.templates.getTemplate, { templateId });
  if (!template) {
    console.warn("[template-preview] template not found or unauthorized", { templateId: parsed.templateId });
    return jsonError("TEMPLATE_NOT_FOUND", "Template not found", 404);
  }

  const previewSecret = process.env.TEMPLATE_PREVIEW_SECRET;
  if (!previewSecret) {
    console.error("[template-preview] missing TEMPLATE_PREVIEW_SECRET");
    return jsonError("PREVIEW_NOT_CONFIGURED", "Template preview is not configured", 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 11000);
  try {
    const upstream = await fetch(`${TEMPLATE_PREVIEW_API_BASE}/internal/template-preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Template-Preview-Secret": previewSecret,
      },
      body: JSON.stringify({
        jsx: parsed.jsx,
        variables: parsed.variables,
        variableValues: parsed.variableValues,
        googleFonts: parsed.googleFonts,
        width: parsed.width,
        height: parsed.height,
        format: "webp",
        quality: parsed.quality,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!upstream.ok) {
      let payload: unknown = null;
      try {
        payload = await upstream.json();
      } catch {
        payload = null;
      }
      console.warn("[template-preview] upstream render failed", {
        status: upstream.status,
        templateId: parsed.templateId,
      });
      return normalizedUpstreamError(upstream.status, payload);
    }

    const imageBuffer = await upstream.arrayBuffer();
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", upstream.headers.get("Content-Type") || "image/png");
    const renderMs = upstream.headers.get("X-Render-Ms");
    if (renderMs) responseHeaders.set("X-Render-Ms", renderMs);
    responseHeaders.set("Cache-Control", "no-store");

    console.info("[template-preview] upstream render success", {
      templateId: parsed.templateId,
      renderMs: renderMs || "n/a",
    });

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    console.error("[template-preview] upstream request failed", {
      templateId: parsed.templateId,
      error: error instanceof Error ? error.message : String(error),
      aborted: isAbort,
    });
    return jsonError(
      "PREVIEW_UPSTREAM_ERROR",
      isAbort ? "Preview request timed out" : "Preview request failed",
      502
    );
  } finally {
    clearTimeout(timeout);
  }
}
