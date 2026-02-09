import { ImageResponse } from "@takumi-rs/image-response";
import { extractResourceUrls } from "@takumi-rs/core";
import { fetchResources } from "@takumi-rs/helpers";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { evalJsx } from "./jsxEval";
import type { RenderRequest } from "../validation";
import type { Logger } from "../lib/logger";

// React-like VDOM element for Takumi's ImageResponse
interface VNode {
  type: string;
  props: Record<string, unknown>;
}

interface FontDetails {
  name?: string;
  data: Uint8Array | ArrayBuffer;
  weight?: number;
  style?: string;
}

interface GoogleFontFaceCandidate {
  name?: string;
  weight?: number;
  style?: string;
  url: string;
  unicodeRange?: string;
}

const DEFAULT_TAKUMI_RENDER_TIMEOUT_MS = parseInt(process.env.TAKUMI_RENDER_TIMEOUT_MS || "12000", 10);
const DEFAULT_TAKUMI_RESOURCE_FETCH_TIMEOUT_MS = parseInt(process.env.TAKUMI_RESOURCE_FETCH_TIMEOUT_MS || "8000", 10);
const DEFAULT_TAKUMI_EMOJI_FONT_URL = process.env.TAKUMI_EMOJI_FONT_URL || "https://takumi.kane.tw/fonts/TwemojiMozilla-colr.woff2";
const DEFAULT_TAKUMI_EMOJI_FONT_NAME = "Twemoji Mozilla";

const MAX_COMBINED_GOOGLE_FONT_SPECS = 20;
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const RESOURCE_FETCH_ACCEPT_HEADER = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8";
const resourceCache = new Map<string, ArrayBuffer>();
let emojiFontPromise: Promise<FontDetails | null> | null = null;

// ── Google Fonts fetching ──

const fontCache = new Map<string, FontDetails[]>();

function dedupeFontSpecs(specs: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const spec of specs) {
    const normalized = spec.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(normalized);
  }
  return deduped;
}

export function buildGoogleFontsUrl(specs: string[], subsetText?: string): string {
  const families = specs.map((s) => {
    const colonIdx = s.indexOf(":");
    if (colonIdx === -1) {
      return `family=${encodeURIComponent(s).replace(/%20/g, "+")}`;
    }
    const name = s.slice(0, colonIdx);
    const variant = s.slice(colonIdx);
    return `family=${encodeURIComponent(name).replace(/%20/g, "+")}${variant}`;
  });
  let url = `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
  if (subsetText && subsetText.trim().length > 0) {
    url += `&text=${encodeURIComponent(subsetText)}`;
  }
  return url;
}

export async function fetchGoogleFonts(specs: string[], subsetText?: string): Promise<FontDetails[]> {
  const normalizedSpecs = dedupeFontSpecs(specs);
  if (normalizedSpecs.length === 0) return [];

  const cacheKey = [...normalizedSpecs].sort().join("|") + `|text:${subsetText || ""}`;
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  const downloadFontsForSpecs = async (requestedSpecs: string[]): Promise<FontDetails[]> => {
    const cssUrl = buildGoogleFontsUrl(requestedSpecs, subsetText);
    const cssRes = await fetch(cssUrl, {
      headers: { "User-Agent": GOOGLE_FONTS_USER_AGENT },
    });
    if (!cssRes.ok) throw new Error(`Google Fonts CSS fetch failed: ${cssRes.status}`);
    const cssText = await cssRes.text();
    return extractFontsFromGoogleCss(cssText);
  };

  try {
    const validFonts = await downloadFontsForSpecs(normalizedSpecs);
    fontCache.set(cacheKey, validFonts);
    return validFonts;
  } catch (error) {
    const settled = await Promise.allSettled(normalizedSpecs.map((spec) => downloadFontsForSpecs([spec])));
    const fallbackFonts = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
    if (fallbackFonts.length > 0) {
      fontCache.set(cacheKey, fallbackFonts);
      return fallbackFonts;
    }
    throw error;
  }
}

export async function extractFontsFromGoogleCss(cssText: string): Promise<FontDetails[]> {
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  const chosenFaces = new Map<string, GoogleFontFaceCandidate & { score: number }>();

  function faceKey(name?: string, weight?: number, style?: string): string {
    return `${name || ""}|${weight || ""}|${style || ""}`;
  }

  function scoreUnicodeRange(unicodeRange?: string): number {
    if (!unicodeRange) return 0;
    const value = unicodeRange.toLowerCase();
    if (/u\+\s*0{0,4}0{0,2}(?:00)?\s*-\s*0{0,2}ff\b/.test(value)) return 3;
    if (/u\+\s*0{0,5}0\s*-\s*0{0,4}7f\b/.test(value)) return 3;
    if (/u\+\s*0{0,3}2[0-9a-f]{2}\s*-\s*0{0,3}7[0-9a-f]{2}\b/.test(value)) return 2;
    if (value.includes("latin")) return 2;
    return 0;
  }

  const downloadPromises: Promise<void>[] = [];

  let match: RegExpExecArray | null;
  while ((match = fontFaceRegex.exec(cssText)) !== null) {
    const block = match[1]!;
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?\s*;?/i);
    const name = familyMatch?.[1]?.trim();
    const weightDecl = block.match(/font-weight:\s*([^;]+);?/i)?.[1]?.trim();
    let weight: number | undefined;
    if (weightDecl) {
      if (/^\d+$/.test(weightDecl)) {
        weight = parseInt(weightDecl, 10);
      } else if (weightDecl.toLowerCase() === "normal") {
        weight = 400;
      } else if (weightDecl.toLowerCase() === "bold") {
        weight = 700;
      }
    }
    const styleDecl = block.match(/font-style:\s*([^;]+);?/i)?.[1]?.trim().toLowerCase();
    const style = styleDecl === "italic" || styleDecl === "oblique" || styleDecl === "normal" ? styleDecl : undefined;
    const unicodeRange = block.match(/unicode-range:\s*([^;]+);?/i)?.[1]?.trim();
    const urlMatch = block.match(/url\((['"]?)([^'")]+\.woff2(?:\?[^'")]+)?)\1\)/i);
    if (!urlMatch) continue;

    const candidate: GoogleFontFaceCandidate = { name, weight, style, url: urlMatch[2]!, unicodeRange };
    const key = faceKey(name, weight, style);
    const score = scoreUnicodeRange(unicodeRange);
    const existing = chosenFaces.get(key);
    if (!existing || score > existing.score) {
      chosenFaces.set(key, { ...candidate, score });
    }
  }

  const faces = [...chosenFaces.values()];
  const fonts: FontDetails[] = faces.map((face) => ({
    name: face.name,
    weight: face.weight,
    style: face.style,
    data: new Uint8Array(0),
  }));

  for (let idx = 0; idx < faces.length; idx += 1) {
    const face = faces[idx]!;
    downloadPromises.push(
      fetch(face.url).then(async (res) => {
        if (!res.ok) throw new Error(`Font download failed: ${res.status} ${face.url}`);
        const buf = await res.arrayBuffer();
        fonts[idx]!.data = new Uint8Array(buf);
      })
    );
  }

  await Promise.allSettled(downloadPromises);
  return fonts.filter((f) => f.data.byteLength > 0);
}

function getPositiveTimeout(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function fetchWithBrowserHeaders(input: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", GOOGLE_FONTS_USER_AGENT);
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", RESOURCE_FETCH_ACCEPT_HEADER);
  }
  return fetch(input, { ...init, headers });
}

async function fetchTemplateResources(element: VNode, log: Logger): Promise<Array<{ src: string; data: ArrayBuffer }> | undefined> {
  try {
    const node = await fromJsx(element as unknown as React.ReactNode);
    const resourceUrls = extractResourceUrls(node as any);
    if (resourceUrls.length === 0) return undefined;

    const timeoutMs = getPositiveTimeout(DEFAULT_TAKUMI_RESOURCE_FETCH_TIMEOUT_MS, 8000);
    const fetchedResources = await fetchResources(resourceUrls, {
      timeout: timeoutMs,
      throwOnError: false,
      cache: resourceCache,
      fetch: fetchWithBrowserHeaders,
    });

    if (fetchedResources.length < resourceUrls.length) {
      log.warn("takumi.resources_partial", {
        requested: resourceUrls.length,
        fetched: fetchedResources.length,
      });
    }

    return fetchedResources;
  } catch (error) {
    log.warn("takumi.resources_discovery_failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
}

export async function loadEmojiFont(log: Logger): Promise<FontDetails | null> {
  if (!DEFAULT_TAKUMI_EMOJI_FONT_URL) return null;

  if (!emojiFontPromise) {
    emojiFontPromise = (async () => {
      const response = await fetch(DEFAULT_TAKUMI_EMOJI_FONT_URL, {
        headers: { "User-Agent": GOOGLE_FONTS_USER_AGENT },
      });
      if (!response.ok) throw new Error(`Emoji font fetch failed: ${response.status}`);
      const data = new Uint8Array(await response.arrayBuffer());
      if (data.byteLength === 0) throw new Error("Emoji font is empty");
      return { name: DEFAULT_TAKUMI_EMOJI_FONT_NAME, data };
    })().catch((error) => {
      log.warn("takumi.emoji_font_failed", {
        error: error instanceof Error ? error.message : String(error),
        url: DEFAULT_TAKUMI_EMOJI_FONT_URL,
      });
      return null;
    });
  }

  return emojiFontPromise;
}

export function appendFont(base: FontDetails[] | undefined, next: FontDetails | null): FontDetails[] | undefined {
  if (!next) return base;
  if (!base || base.length === 0) return [next];
  const duplicate = base.some(
    (font) =>
      font.name === next.name && font.weight === next.weight && font.style === next.style && font.data.byteLength === next.data.byteLength
  );
  return duplicate ? base : [...base, next];
}

function buildImageResponseOptions(
  width: number,
  height: number,
  format: "png" | "jpeg" | "webp",
  request: RenderRequest,
  fonts?: FontDetails[],
  fetchedResources?: Array<{ src: string; data: ArrayBuffer }>
): Record<string, unknown> {
  const options: Record<string, unknown> = { width, height, format };
  if (fonts && fonts.length > 0) {
    options.fonts = fonts;
    options.loadDefaultFonts = true;
  }
  if (request.deviceScaleFactor && request.deviceScaleFactor !== 1) {
    options.devicePixelRatio = request.deviceScaleFactor;
  }
  if (request.quality !== undefined) options.quality = request.quality;
  if (fetchedResources !== undefined) options.fetchedResources = fetchedResources;
  return options;
}

async function renderVdomWithTimeout(
  element: VNode,
  options: Record<string, unknown>,
  timeoutMs: number
): Promise<Uint8Array> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = new ImageResponse(element as React.ReactNode, {
      ...options,
      signal: controller.signal,
    });
    return new Uint8Array(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

// ── Main render function ──

export interface TakumiRenderResult {
  buffer: Uint8Array;
  contentType: string;
  renderMs: number;
}

export interface RenderJsxOptions {
  jsx: string;
  props: Record<string, string>;
  googleFonts?: string[];
  width?: number;
  height?: number;
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  deviceScaleFactor?: number;
}

export async function renderJsxTemplate(opts: RenderJsxOptions, log: Logger): Promise<TakumiRenderResult> {
  const start = performance.now();

  const width = opts.width || 1200;
  const height = opts.height || 800;
  const format = opts.format || "png";
  const renderTimeoutMs = Number.isFinite(DEFAULT_TAKUMI_RENDER_TIMEOUT_MS) && DEFAULT_TAKUMI_RENDER_TIMEOUT_MS > 0
    ? DEFAULT_TAKUMI_RENDER_TIMEOUT_MS
    : 12000;

  const element = evalJsx(opts.jsx, opts.props);

  const googleFontSpecs = dedupeFontSpecs(opts.googleFonts || []).slice(0, MAX_COMBINED_GOOGLE_FONT_SPECS);

  const fetchedResourcesPromise = fetchTemplateResources(element, log);
  const emojiFontPromiseForRender = loadEmojiFont(log);

  log.debug("takumi.render_start", {
    width,
    height,
    format,
    googleFonts: googleFontSpecs.length,
  });

  let fonts: FontDetails[] | undefined;
  if (googleFontSpecs.length > 0) {
    try {
      fonts = await fetchGoogleFonts(googleFontSpecs);
      log.debug("takumi.fonts_loaded", { count: fonts.length });
    } catch (err) {
      log.warn("takumi.fonts_failed", { error: err instanceof Error ? err.message : String(err) });
    }
  }

  const emojiFont = await emojiFontPromiseForRender;
  fonts = appendFont(fonts, emojiFont);
  const fetchedResources = await fetchedResourcesPromise;

  const renderRequest: RenderRequest = {
    jsx: opts.jsx,
    width,
    height,
    format,
    quality: opts.quality,
    deviceScaleFactor: opts.deviceScaleFactor,
  };

  const optionsWithFonts = buildImageResponseOptions(width, height, format, renderRequest, fonts, fetchedResources);
  const optionsWithoutFonts = buildImageResponseOptions(width, height, format, renderRequest, undefined, fetchedResources);

  let buffer: Uint8Array | null = null;
  let fontRecoveryUsed = false;
  let lastError: unknown;

  try {
    buffer = await renderVdomWithTimeout(element, optionsWithFonts, renderTimeoutMs);
  } catch (error) {
    lastError = error;
    const message = error instanceof Error ? error.message : String(error);

    log.warn("takumi.render_primary_failed", {
      error: message,
      hasFonts: Boolean(fonts && fonts.length > 0),
    });

    if (fonts && fonts.length > 0) {
      try {
        buffer = await renderVdomWithTimeout(element, optionsWithoutFonts, renderTimeoutMs);
        fontRecoveryUsed = true;
      } catch (noFontError) {
        lastError = noFontError;
        log.warn("takumi.render_no_fonts_retry_failed", {
          error: noFontError instanceof Error ? noFontError.message : String(noFontError),
        });
      }
    }
  }

  if (!buffer) {
    throw lastError instanceof Error ? lastError : new Error(String(lastError || "Takumi render failed"));
  }

  const renderMs = Math.round(performance.now() - start);
  const contentType = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";

  log.info("takumi.render_complete", {
    renderMs,
    bytes: buffer.length,
    fontRecoveryUsed,
  });

  return { buffer, contentType, renderMs };
}
