import { ImageResponse } from "@takumi-rs/image-response";
import { parse, ELEMENT_NODE, TEXT_NODE, DOCUMENT_NODE, transformSync } from "ultrahtml";
import inline from "ultrahtml/transformers/inline";
import type { RenderRequest } from "../validation";
import type { Logger } from "../lib/logger";

// Ultrahtml node types
interface UNode {
  type: number;
  name?: string;
  value?: string;
  attributes?: Record<string, unknown>;
  children?: UNode[];
}

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

const SKIP_TAGS = new Set(["style", "script", "head", "meta", "link", "title", "!doctype"]);
const UNWRAP_TAGS = new Set(["html", "body"]);
const LINEBREAK_TAGS = new Set(["br", "hr"]);

// Sentinel object so we can detect <br> in the children array before merging
const BR_TOKEN = { __br: true } as const;
type ConvertResult = VNode | string | typeof BR_TOKEN | null;

function isBr(v: unknown): v is typeof BR_TOKEN {
  return v != null && typeof v === "object" && "__br" in v;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00A0",
  copy: "\u00A9",
  reg: "\u00AE",
  trade: "\u2122",
  mdash: "\u2014",
  ndash: "\u2013",
  laquo: "\u00AB",
  raquo: "\u00BB",
  bull: "\u2022",
  hellip: "\u2026",
  prime: "\u2032",
  Prime: "\u2033",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201C",
  rdquo: "\u201D",
  rarr: "\u2192",
  larr: "\u2190",
  uarr: "\u2191",
  darr: "\u2193",
  harr: "\u2194",
  rArr: "\u21D2",
  lArr: "\u21D0",
  uArr: "\u21D1",
  dArr: "\u21D3",
  hArr: "\u21D4",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x([0-9a-fA-F]+)|#(\d+)|(\w+));/g, (match, _, hex, dec, named) => {
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    if (dec) return String.fromCodePoint(parseInt(dec, 10));
    if (named && named in NAMED_ENTITIES) return NAMED_ENTITIES[named]!;
    return match;
  });
}

// Takumi style surface from https://takumi.kane.tw/docs/reference#style-properties.
const TAKUMI_STYLE_PROPERTIES = new Set([
  "display",
  "position",
  "width",
  "height",
  "maxWidth",
  "maxHeight",
  "minWidth",
  "minHeight",
  "aspectRatio",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "paddingInline",
  "paddingBlock",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginInline",
  "marginBlock",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "insetInline",
  "insetBlock",
  "border",
  "borderWidth",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderInlineWidth",
  "borderBlockWidth",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",
  "flex",
  "flexBasis",
  "flexGrow",
  "flexShrink",
  "flexDirection",
  "justifyContent",
  "justifySelf",
  "alignContent",
  "justifyItems",
  "alignItems",
  "alignSelf",
  "flexWrap",
  "gap",
  "columnGap",
  "rowGap",
  "objectFit",
  "objectPosition",
  "overflow",
  "overflowX",
  "overflowY",
  "background",
  "backgroundImage",
  "backgroundPosition",
  "backgroundSize",
  "backgroundRepeat",
  "backgroundColor",
  "backgroundClip",
  "backgroundBlendMode",
  "boxShadow",
  "clipPath",
  "clipRule",
  "mask",
  "maskImage",
  "maskSize",
  "maskPosition",
  "maskRepeat",
  "transform",
  "translate",
  "translateX",
  "translateY",
  "rotate",
  "scale",
  "scaleX",
  "scaleY",
  "transformOrigin",
  "gridAutoColumns",
  "gridAutoRows",
  "gridAutoFlow",
  "gridColumn",
  "gridRow",
  "gridTemplateColumns",
  "gridTemplateRows",
  "gridTemplateAreas",
  "textOverflow",
  "textTransform",
  "fontStyle",
  "color",
  "textShadow",
  "fontSize",
  "fontFamily",
  "lineHeight",
  "fontWeight",
  "fontVariationSettings",
  "fontFeatureSettings",
  "lineClamp",
  "textAlign",
  "letterSpacing",
  "wordSpacing",
  "overflowWrap",
  "wordBreak",
  "whiteSpace",
  "whiteSpaceCollapse",
  "textWrap",
  "textWrapMode",
  "textWrapStyle",
  "boxSizing",
  "opacity",
  "imageRendering",
  "filter",
  "backdropFilter",
  "WebkitTextStroke",
  "WebkitTextStrokeWidth",
  "WebkitTextStrokeColor",
  "WebkitTextFillColor",
  "strokeLinejoin",
  "textDecoration",
  "textDecorationLine",
  "textDecorationColor",
  "isolation",
  "mixBlendMode",
  "visibility",
]);

const OVERFLOW_STYLE_PROPERTIES = new Set(["overflow", "overflowX", "overflowY"]);
const TAKUMI_DISPLAY_VALUES = new Set(["none", "flex", "grid", "inline", "block", "initial", "inherit"]);
const DISPLAY_VALUE_ALIASES: Record<string, string> = {
  "inline-block": "inline",
  "inline-flex": "flex",
  "inline-grid": "grid",
  contents: "block",
  "flow-root": "block",
  "list-item": "block",
  table: "block",
  "table-row": "block",
  "table-cell": "block",
};
const LENGTH_LIKE_STYLE_PROPERTIES = new Set(["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "flexBasis"]);
const UNSUPPORTED_INTRINSIC_SIZE_VALUE_RE = /^(?:fit-content|max-content|min-content)$/i;
const CLASS_ATTRIBUTE_KEYS = new Set(["class", "classname", "tw"]);
const UNSUPPORTED_BORDER_STYLE_RE = /\b(?:dashed|dotted|double|groove|ridge|inset|outset)\b/i;
const CSS_VAR_REFERENCE_RE = /\bvar\(/i;
const CSS_DATA_URL_RE = /\burl\(\s*(['"]?)\s*data:/i;
const DEFAULT_TAKUMI_RENDER_TIMEOUT_MS = parseInt(process.env.TAKUMI_RENDER_TIMEOUT_MS || "12000", 10);

interface ParsedStyleDeclaration {
  property: string;
  value: string;
}

interface StyleSanitizeStats {
  parsedDeclarations: number;
  keptDeclarations: number;
  droppedUnsupportedProperty: number;
  droppedInvalidValue: number;
  droppedCustomProperty: number;
}

interface ConvertContext {
  styleMode: "standard" | "strict";
  styleStats: StyleSanitizeStats;
}

function createStyleSanitizeStats(): StyleSanitizeStats {
  return {
    parsedDeclarations: 0,
    keptDeclarations: 0,
    droppedUnsupportedProperty: 0,
    droppedInvalidValue: 0,
    droppedCustomProperty: 0,
  };
}

function hasAnyDroppedStyles(stats: StyleSanitizeStats): boolean {
  return stats.droppedUnsupportedProperty + stats.droppedInvalidValue + stats.droppedCustomProperty > 0;
}

function findTopLevelDelimiter(input: string, delimiter: ":" | ";"): number {
  let quote: '"' | "'" | null = null;
  let parenDepth = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]!;
    if (quote) {
      if (ch === "\\") {
        i += 1;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }

    if (ch === "(") {
      parenDepth += 1;
      continue;
    }

    if (ch === ")") {
      if (parenDepth > 0) parenDepth -= 1;
      continue;
    }

    if (parenDepth === 0 && ch === delimiter) return i;
  }

  return -1;
}

function splitTopLevelSemicolons(input: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let parenDepth = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]!;
    if (quote) {
      current += ch;
      if (ch === "\\") {
        if (i + 1 < input.length) {
          current += input[i + 1]!;
          i += 1;
        }
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === "(") {
      parenDepth += 1;
      current += ch;
      continue;
    }

    if (ch === ")") {
      if (parenDepth > 0) parenDepth -= 1;
      current += ch;
      continue;
    }

    if (parenDepth === 0 && ch === ";") {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function normalizeStylePropertyName(rawProperty: string): string | null {
  let prop = decodeEntities(rawProperty).trim();
  if (!prop) return null;
  if (prop.startsWith("--")) return null;

  if (prop.includes("-")) {
    prop = prop.toLowerCase().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  }
  if (/^webkit[A-Z]/.test(prop)) {
    prop = `W${prop.slice(1)}`;
  }
  return prop;
}

function parseStyleDeclarations(style: string): ParsedStyleDeclaration[] {
  const declarations: ParsedStyleDeclaration[] = [];
  const decoded = decodeEntities(style);
  for (const chunk of splitTopLevelSemicolons(decoded)) {
    const colonIdx = findTopLevelDelimiter(chunk, ":");
    if (colonIdx <= 0) continue;
    const property = chunk.slice(0, colonIdx).trim();
    const value = chunk.slice(colonIdx + 1).trim();
    if (!property || !value) continue;
    declarations.push({ property, value });
  }
  return declarations;
}

function parseInlineStyle(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const decl of parseStyleDeclarations(style)) {
    const property = normalizeStylePropertyName(decl.property);
    if (!property) continue;
    const value = decl.value.replace(/\s*!important\s*$/i, "").trim();
    if (!value) continue;
    result[property] = value;
  }
  return result;
}

function sanitizeStyleValue(property: string, rawValue: string, mode: ConvertContext["styleMode"]): string | null {
  const value = decodeEntities(rawValue).replace(/\s*!important\s*$/i, "").trim();
  if (!value) return null;
  if (CSS_VAR_REFERENCE_RE.test(value)) return null;
  if (CSS_DATA_URL_RE.test(value)) return null;

  if (property === "display") {
    const normalized = value.toLowerCase();
    if (TAKUMI_DISPLAY_VALUES.has(normalized)) return normalized;
    const alias = DISPLAY_VALUE_ALIASES[normalized];
    return alias && TAKUMI_DISPLAY_VALUES.has(alias) ? alias : null;
  }

  if (LENGTH_LIKE_STYLE_PROPERTIES.has(property) && UNSUPPORTED_INTRINSIC_SIZE_VALUE_RE.test(value)) {
    return null;
  }

  if (OVERFLOW_STYLE_PROPERTIES.has(property)) {
    const normalized = value.toLowerCase();
    if (normalized !== "visible" && normalized !== "hidden") return null;
    return normalized;
  }

  // Takumi currently supports only solid border style.
  if (property === "border" && UNSUPPORTED_BORDER_STYLE_RE.test(value)) return null;

  // Strict mode is used only for recovery retries on style parsing errors.
  if (mode === "strict" && /\b(?:env|var)\(/i.test(value)) return null;

  return value;
}

function sanitizeInlineStyle(
  rawStyle: string,
  styleMode: ConvertContext["styleMode"],
  stats: StyleSanitizeStats
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const declaration of parseStyleDeclarations(rawStyle)) {
    stats.parsedDeclarations += 1;
    const normalizedProperty = normalizeStylePropertyName(declaration.property);
    if (!normalizedProperty) {
      stats.droppedCustomProperty += 1;
      continue;
    }
    if (!TAKUMI_STYLE_PROPERTIES.has(normalizedProperty)) {
      stats.droppedUnsupportedProperty += 1;
      continue;
    }
    const sanitizedValue = sanitizeStyleValue(normalizedProperty, declaration.value, styleMode);
    if (!sanitizedValue) {
      stats.droppedInvalidValue += 1;
      continue;
    }
    result[normalizedProperty] = sanitizedValue;
    stats.keptDeclarations += 1;
  }
  return result;
}

function sanitizeInlineStyleObject(
  rawStyleObject: Record<string, unknown>,
  styleMode: ConvertContext["styleMode"],
  stats: StyleSanitizeStats
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [rawProperty, rawValue] of Object.entries(rawStyleObject)) {
    if (rawValue === null || rawValue === undefined) continue;
    stats.parsedDeclarations += 1;
    const normalizedProperty = normalizeStylePropertyName(rawProperty);
    if (!normalizedProperty) {
      stats.droppedCustomProperty += 1;
      continue;
    }
    if (!TAKUMI_STYLE_PROPERTIES.has(normalizedProperty)) {
      stats.droppedUnsupportedProperty += 1;
      continue;
    }
    const stringValue = typeof rawValue === "number" ? String(rawValue) : String(rawValue).trim();
    if (!stringValue) {
      stats.droppedInvalidValue += 1;
      continue;
    }
    const sanitizedValue = sanitizeStyleValue(normalizedProperty, stringValue, styleMode);
    if (!sanitizedValue) {
      stats.droppedInvalidValue += 1;
      continue;
    }
    result[normalizedProperty] = sanitizedValue;
    stats.keptDeclarations += 1;
  }
  return result;
}

function inlineStyles(html: string, width: number, height: number, log: Logger): string {
  try {
    return transformSync(html, [inline({ env: { width, height } })]);
  } catch (error) {
    log.warn("takumi.css_inline_failed", { error: error instanceof Error ? error.message : String(error) });
    return html;
  }
}

function parseGoogleFontSpecsFromCss2Url(input: string): string[] {
  let parsed: URL;
  try {
    const normalized = decodeEntities(input).replace(/&amp;/gi, "&").trim();
    const absolute = normalized.startsWith("//") ? `https:${normalized}` : normalized;
    parsed = new URL(absolute);
  } catch {
    return [];
  }

  if (!/fonts\.googleapis\.com$/i.test(parsed.hostname)) return [];
  if (!parsed.pathname.startsWith("/css2")) return [];

  return parsed.searchParams
    .getAll("family")
    .map((family) => family.trim())
    .filter((family) => family.length > 0);
}

const GENERIC_FONT_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer",
]);

const LOCAL_OR_SYSTEM_FONT_FAMILIES = new Set([
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
  "arial",
  "helvetica",
  "times new roman",
  "georgia",
  "courier new",
  "menlo",
  "monaco",
  "verdana",
  "tahoma",
  "trebuchet ms",
  "palatino",
  "garamond",
  "bookman",
  "comic sans ms",
  "candara",
  "optima",
  "didot",
  "geneva",
  "calibri",
  "cambria",
  "consolas",
  "impact",
  "lucida console",
]);

const MAX_COMBINED_GOOGLE_FONT_SPECS = 20;
const MAX_FONT_SUBSET_TEXT_CHARS = 256;
const GOOGLE_FONTS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

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

function getFontFamilyNameFromGoogleSpec(spec: string): string {
  const colonIdx = spec.indexOf(":");
  return (colonIdx === -1 ? spec : spec.slice(0, colonIdx)).trim().toLowerCase();
}

function mergeGoogleFontSpecs(explicitSpecs: string[], discoveredSpecs: string[]): string[] {
  const explicit = dedupeFontSpecs(explicitSpecs);
  const discovered = dedupeFontSpecs(discoveredSpecs);

  const byFamily = new Map<string, string>();
  for (const spec of explicit) {
    byFamily.set(getFontFamilyNameFromGoogleSpec(spec), spec);
  }

  for (const spec of discovered) {
    const familyKey = getFontFamilyNameFromGoogleSpec(spec);
    const existing = byFamily.get(familyKey);
    if (!existing) {
      byFamily.set(familyKey, spec);
      continue;
    }

    const existingHasVariant = existing.includes(":");
    const currentHasVariant = spec.includes(":");
    // Prefer the more specific variant form (e.g. Inter:wght@400;700 over Inter).
    if (!existingHasVariant && currentHasVariant) {
      byFamily.set(familyKey, spec);
    }
  }

  return [...byFamily.values()];
}

function splitTopLevelCsv(input: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let parenDepth = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]!;

    if (quote) {
      current += ch;
      if (ch === "\\") {
        if (i + 1 < input.length) {
          current += input[i + 1]!;
          i += 1;
        }
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
      continue;
    }

    if (ch === "(") {
      parenDepth += 1;
      current += ch;
      continue;
    }

    if (ch === ")") {
      if (parenDepth > 0) parenDepth -= 1;
      current += ch;
      continue;
    }

    if (ch === "," && parenDepth === 0) {
      const token = current.trim();
      if (token) parts.push(token);
      current = "";
      continue;
    }

    current += ch;
  }

  const token = current.trim();
  if (token) parts.push(token);
  return parts;
}

function normalizeDetectedFontFamilyToken(token: string): string | null {
  let family = decodeEntities(token).replace(/\s*!important\s*$/i, "").trim();
  if (!family) return null;
  if (family.startsWith("var(")) return null;

  if ((family.startsWith("'") && family.endsWith("'")) || (family.startsWith('"') && family.endsWith('"'))) {
    family = family.slice(1, -1).trim();
  }
  if (!family) return null;

  family = family.replace(/\s+/g, " ");
  const lower = family.toLowerCase();
  if (GENERIC_FONT_FAMILIES.has(lower) || LOCAL_OR_SYSTEM_FONT_FAMILIES.has(lower)) {
    return null;
  }
  return family;
}

function collectGoogleFontSpecsFromFamilyList(familyList: string): string[] {
  const specs: string[] = [];
  const tokens = splitTopLevelCsv(familyList);
  for (const token of tokens) {
    const family = normalizeDetectedFontFamilyToken(token);
    if (family) specs.push(family);
  }
  return specs;
}

function extractFamilyListFromFontShorthand(fontShorthand: string): string | null {
  const cleaned = decodeEntities(fontShorthand).replace(/\s*!important\s*$/i, "").trim();
  if (!cleaned) return null;

  // `font` shorthand always places the family list after the size[/line-height] section.
  const match = cleaned.match(
    /(?:^|\s)(?:xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large|smaller|larger|[\d.]+(?:px|pt|pc|em|rem|ex|ch|vh|vw|vmin|vmax|%))(?:\s*\/\s*[^\s,]+)?\s+(.+)$/i
  );
  return match?.[1]?.trim() || null;
}

function extractGoogleFontsFromHtml(html: string): string[] {
  const specs: string[] = [];

  const linkRegex = /<link\b[^>]*href=(['"])([^'"]*fonts\.googleapis\.com\/css2[^'"]*)\1[^>]*>/gi;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    specs.push(...parseGoogleFontSpecsFromCss2Url(linkMatch[2] || ""));
  }

  const importRegex = /@import\s+(?:url\(\s*)?(['"]?)(https?:\/\/fonts\.googleapis\.com\/css2[^'")\s]+)\1\s*\)?/gi;
  let importMatch: RegExpExecArray | null;
  while ((importMatch = importRegex.exec(html)) !== null) {
    specs.push(...parseGoogleFontSpecsFromCss2Url(importMatch[2] || ""));
  }

  return dedupeFontSpecs(specs);
}

function extractGoogleFontsFromFontUsage(html: string): string[] {
  const specs: string[] = [];

  const styleAttrRegex = /\bstyle\s*=\s*(['"])([\s\S]*?)\1/gi;
  let styleAttrMatch: RegExpExecArray | null;
  while ((styleAttrMatch = styleAttrRegex.exec(html)) !== null) {
    const styleValue = decodeEntities(styleAttrMatch[2] || "");
    const styleObj = parseInlineStyle(styleValue);
    if (styleObj.fontFamily) {
      specs.push(...collectGoogleFontSpecsFromFamilyList(styleObj.fontFamily));
    }
    if (styleObj.font) {
      const familyList = extractFamilyListFromFontShorthand(styleObj.font);
      if (familyList) specs.push(...collectGoogleFontSpecsFromFamilyList(familyList));
    }
  }

  const styleTagRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let styleTagMatch: RegExpExecArray | null;
  while ((styleTagMatch = styleTagRegex.exec(html)) !== null) {
    const cssText = decodeEntities(styleTagMatch[1] || "");
    const familyDeclRegex = /font-family\s*:\s*([^;}{]+)\s*;?/gi;
    let familyDeclMatch: RegExpExecArray | null;
    while ((familyDeclMatch = familyDeclRegex.exec(cssText)) !== null) {
      specs.push(...collectGoogleFontSpecsFromFamilyList(familyDeclMatch[1] || ""));
    }

    const fontDeclRegex = /(?:^|[;{])\s*font\s*:\s*([^;}{]+)\s*;?/gi;
    let fontDeclMatch: RegExpExecArray | null;
    while ((fontDeclMatch = fontDeclRegex.exec(cssText)) !== null) {
      const familyList = extractFamilyListFromFontShorthand(fontDeclMatch[1] || "");
      if (familyList) specs.push(...collectGoogleFontSpecsFromFamilyList(familyList));
    }
  }

  // SVG text nodes commonly use attribute form (font-family="...").
  const fontFamilyAttrRegex = /\bfont-family\s*=\s*(['"])([\s\S]*?)\1/gi;
  let fontFamilyAttrMatch: RegExpExecArray | null;
  while ((fontFamilyAttrMatch = fontFamilyAttrRegex.exec(html)) !== null) {
    specs.push(...collectGoogleFontSpecsFromFamilyList(fontFamilyAttrMatch[2] || ""));
  }

  return dedupeFontSpecs(specs);
}

function collectDecodedTextNodes(node: UNode, out: string[]): void {
  if (node.type === TEXT_NODE) {
    const decoded = decodeEntities(node.value || "");
    if (decoded) out.push(decoded);
    return;
  }
  const children = node.children || [];
  for (const child of children) {
    collectDecodedTextNodes(child, out);
  }
}

function extractFontSubsetText(html: string): string {
  const chunks: string[] = [];
  try {
    const doc = parse(html) as UNode;
    collectDecodedTextNodes(doc, chunks);
  } catch {
    return "";
  }

  const seen = new Set<string>();
  let result = "";
  for (const chunk of chunks) {
    for (const ch of chunk) {
      const code = ch.codePointAt(0) || 0;
      if (code < 32 && ch !== "\n" && ch !== "\t") continue;
      if (seen.has(ch)) continue;
      seen.add(ch);
      result += ch;
      if (result.length >= MAX_FONT_SUBSET_TEXT_CHARS) {
        return result;
      }
    }
  }
  return result;
}

/**
 * Merge adjacent text/BR_TOKEN runs into single strings with "\n",
 * returning the final children array and whether any BR was present.
 */
function mergeBreaks(raw: ConvertResult[]): { children: (VNode | string)[]; hasBr: boolean } {
  let hasBr = false;
  const out: (VNode | string)[] = [];
  let textBuf = "";

  for (const child of raw) {
    if (child == null) continue;
    if (isBr(child)) {
      hasBr = true;
      textBuf += "\n";
    } else if (typeof child === "string") {
      textBuf += child;
    } else {
      // VNode — flush any accumulated text first
      if (textBuf) {
        out.push(textBuf);
        textBuf = "";
      }
      out.push(child);
    }
  }
  if (textBuf) out.push(textBuf);
  return { children: out, hasBr };
}

function getAttributeCaseInsensitive(attrs: Record<string, unknown>, name: string): unknown {
  const needle = name.toLowerCase();
  for (const [key, value] of Object.entries(attrs)) {
    if (key.toLowerCase() === needle) return value;
  }
  return undefined;
}

function mergeClassValues(values: string[]): string | undefined {
  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const raw of values) {
    for (const token of raw.split(/\s+/)) {
      const value = token.trim();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      tokens.push(value);
    }
  }
  return tokens.length > 0 ? tokens.join(" ") : undefined;
}

function collectClassValues(attrs: Record<string, unknown>): string[] {
  const classes: string[] = [];
  for (const [key, value] of Object.entries(attrs)) {
    if (!CLASS_ATTRIBUTE_KEYS.has(key.toLowerCase())) continue;
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    classes.push(trimmed);
  }
  return classes;
}

function convertNode(node: UNode, context: ConvertContext): ConvertResult {
  if (node.type === DOCUMENT_NODE) {
    const { children } = mergeBreaks((node.children || []).map((child) => convertNode(child, context)));
    if (children.length === 0) return null;
    if (children.length === 1) return children[0]!;
    return {
      type: "div",
      props: {
        style: { display: "flex", flexDirection: "column", width: "100%", height: "100%" },
        children,
      },
    };
  }

  if (node.type === ELEMENT_NODE) {
    const tag = (node.name || "div").toLowerCase();

    if (SKIP_TAGS.has(tag)) return null;

    // <br> / <hr> → BR sentinel (merged into "\n" by parent)
    if (LINEBREAK_TAGS.has(tag)) return BR_TOKEN;

    const { children, hasBr } = mergeBreaks((node.children || []).map((child) => convertNode(child, context)));

    // Unwrap html/body — just return their children
    if (UNWRAP_TAGS.has(tag)) {
      if (children.length === 0) return null;
      if (children.length === 1) return children[0]!;
      return {
        type: "div",
        props: {
          style: { display: "flex", flexDirection: "column" },
          children,
        },
      };
    }

    const props: Record<string, unknown> = {};
    const attrs = node.attributes || {};

    // Inline style → sanitized style object based on Takumi-supported properties.
    const style: Record<string, string> = {};
    const rawStyle = getAttributeCaseInsensitive(attrs, "style");
    if (typeof rawStyle === "string" && rawStyle.trim().length > 0) {
      Object.assign(style, sanitizeInlineStyle(rawStyle, context.styleMode, context.styleStats));
    } else if (rawStyle && typeof rawStyle === "object") {
      Object.assign(
        style,
        sanitizeInlineStyleObject(rawStyle as Record<string, unknown>, context.styleMode, context.styleStats)
      );
    }

    // If this element contains <br>, ensure white-space: pre-wrap so \n renders.
    if (hasBr) {
      style.whiteSpace = "pre-wrap";
    }

    if (Object.keys(style).length > 0) props.style = style;

    // class/className/tw → tw (Tailwind support in Takumi).
    const twClasses = mergeClassValues(collectClassValues(attrs));
    if (twClasses) props.tw = twClasses;

    // img attributes
    if (tag === "img") {
      const srcAttr = getAttributeCaseInsensitive(attrs, "src");
      if (typeof srcAttr === "string" && srcAttr) props.src = srcAttr;
      const widthRaw = getAttributeCaseInsensitive(attrs, "width");
      const heightRaw = getAttributeCaseInsensitive(attrs, "height");
      const widthAttr = typeof widthRaw === "number" ? widthRaw : Number(widthRaw);
      const heightAttr = typeof heightRaw === "number" ? heightRaw : Number(heightRaw);
      if (Number.isFinite(widthAttr)) props.width = widthAttr;
      if (Number.isFinite(heightAttr)) props.height = heightAttr;
      const altAttr = getAttributeCaseInsensitive(attrs, "alt");
      if (typeof altAttr === "string" && altAttr) props.alt = altAttr;
    }

    props.children = children.length === 1 ? children[0] : children.length > 0 ? children : undefined;

    return { type: tag, props };
  }

  if (node.type === TEXT_NODE) {
    const raw = node.value || "";
    const text = decodeEntities(raw);
    return text || null;
  }

  return null;
}

/**
 * Parse an HTML string into a React-like VDOM tree that Takumi's ImageResponse accepts.
 * Skips <style>, <script>, <head> etc. that Takumi can't render.
 * Converts inline styles to object form and maps class → tw for Tailwind.
 */
interface HtmlToVdomOptions {
  styleMode?: ConvertContext["styleMode"];
  styleStats?: StyleSanitizeStats;
}

function htmlToVdom(htmlStr: string, options: HtmlToVdomOptions = {}): VNode {
  const context: ConvertContext = {
    styleMode: options.styleMode || "standard",
    styleStats: options.styleStats || createStyleSanitizeStats(),
  };
  const doc = parse(htmlStr);
  const result = convertNode(doc as UNode, context);

  if (result && typeof result !== "string" && !isBr(result)) return result;

  // Wrap bare text / BR in a div
  const text = isBr(result) ? "\n" : (result ?? "");
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        ...(isBr(result) ? { whiteSpace: "pre-wrap" } : {}),
      },
      children: text,
    },
  };
}

// ── Google Fonts fetching ──

// In-memory font cache keyed by sorted font specs
const fontCache = new Map<string, FontDetails[]>();

function buildGoogleFontsUrl(specs: string[], subsetText?: string): string {
  const families = specs.map((s) => {
    // Split on first ":" to separate font name from variant spec (e.g. ":wght@400;700")
    // Only the font name needs URL encoding; variant syntax (:, @, ;) must stay literal
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

async function fetchGoogleFonts(specs: string[], subsetText?: string): Promise<FontDetails[]> {
  const normalizedSpecs = dedupeFontSpecs(specs);
  if (normalizedSpecs.length === 0) return [];

  const cacheKey = [...normalizedSpecs].sort().join("|") + `|text:${subsetText || ""}`;
  const cached = fontCache.get(cacheKey);
  if (cached) return cached;

  const downloadFontsForSpecs = async (requestedSpecs: string[]): Promise<FontDetails[]> => {
    const cssUrl = buildGoogleFontsUrl(requestedSpecs, subsetText);

    // Fetch CSS with a browser-like UA to get woff2 URLs
    const cssRes = await fetch(cssUrl, {
      headers: {
        "User-Agent": GOOGLE_FONTS_USER_AGENT,
      },
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

async function extractFontsFromGoogleCss(cssText: string): Promise<FontDetails[]> {
  // Parse @font-face blocks
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  const chosenFaces = new Map<string, GoogleFontFaceCandidate & { score: number }>();

  function faceKey(name?: string, weight?: number, style?: string): string {
    return `${name || ""}|${weight || ""}|${style || ""}`;
  }

  function scoreUnicodeRange(unicodeRange?: string): number {
    if (!unicodeRange) return 0;
    const value = unicodeRange.toLowerCase();
    // Prefer subsets that include Basic Latin glyphs so ASCII text doesn't render as tofu.
    if (/u\+\s*0{0,4}0{0,2}(?:00)?\s*-\s*0{0,2}ff\b/.test(value)) return 3; // U+0000-00FF
    if (/u\+\s*0{0,5}0\s*-\s*0{0,4}7f\b/.test(value)) return 3; // U+0000-007F
    if (/u\+\s*0{0,3}2[0-9a-f]{2}\s*-\s*0{0,3}7[0-9a-f]{2}\b/.test(value)) return 2; // includes printable ASCII
    if (value.includes("latin")) return 2;
    return 0;
  }

  const downloadPromises: Promise<void>[] = [];

  let match: RegExpExecArray | null;
  while ((match = fontFaceRegex.exec(cssText)) !== null) {
    const block = match[1]!;

    // Extract font-family
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?\s*;?/i);
    const name = familyMatch?.[1]?.trim();

    // Extract font-weight; keep undefined for ranges like "100 900"
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

    // Extract font-style
    const styleDecl = block.match(/font-style:\s*([^;]+);?/i)?.[1]?.trim().toLowerCase();
    const style = styleDecl === "italic" || styleDecl === "oblique" || styleDecl === "normal" ? styleDecl : undefined;
    const unicodeRange = block.match(/unicode-range:\s*([^;]+);?/i)?.[1]?.trim();

    // Extract URL (prefer woff2)
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

  // Filter out any fonts that failed to download (empty data)
  const validFonts = fonts.filter((f) => f.data.byteLength > 0);
  return validFonts;
}

function buildImageResponseOptions(
  width: number,
  height: number,
  format: "png" | "jpeg" | "webp",
  request: RenderRequest,
  fonts?: FontDetails[]
): Record<string, unknown> {
  const options: Record<string, unknown> = {
    width,
    height,
    format,
  };
  if (fonts && fonts.length > 0) options.fonts = fonts;
  if (request.deviceScaleFactor && request.deviceScaleFactor !== 1) {
    options.devicePixelRatio = request.deviceScaleFactor;
  }
  if (request.quality !== undefined) options.quality = request.quality;
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

function isLikelyStyleRenderError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("invalidarg") ||
    lower.includes("invalid value") ||
    lower.includes("expected a value") ||
    lower.includes("style")
  );
}

function isLikelyResourceRenderError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("failed to fetch") || lower.includes("timeout") || lower.includes("aborted");
}

// ── Main render function ──

export interface TakumiRenderResult {
  buffer: Uint8Array;
  contentType: string;
  renderMs: number;
}

export async function renderWithTakumi(request: RenderRequest, log: Logger): Promise<TakumiRenderResult> {
  const start = performance.now();

  const width = request.width || 1200;
  const height = request.height || 800;
  const format = request.format || "png";
  const renderTimeoutMs = Number.isFinite(DEFAULT_TAKUMI_RENDER_TIMEOUT_MS) && DEFAULT_TAKUMI_RENDER_TIMEOUT_MS > 0
    ? DEFAULT_TAKUMI_RENDER_TIMEOUT_MS
    : 12000;

  const sourceHtml = request.html || "<div>No content</div>";
  const normalizedHtml = inlineStyles(sourceHtml, width, height, log);
  const subsetText = extractFontSubsetText(normalizedHtml) || extractFontSubsetText(sourceHtml);
  const discoveredGoogleFonts = dedupeFontSpecs([
    ...extractGoogleFontsFromHtml(sourceHtml),
    ...extractGoogleFontsFromFontUsage(sourceHtml),
    ...extractGoogleFontsFromFontUsage(normalizedHtml),
  ]);
  const combinedGoogleFonts = mergeGoogleFontSpecs(request.googleFonts || [], discoveredGoogleFonts).slice(
    0,
    MAX_COMBINED_GOOGLE_FONT_SPECS
  );

  const primaryStyleStats = createStyleSanitizeStats();
  const element = htmlToVdom(normalizedHtml, {
    styleMode: "standard",
    styleStats: primaryStyleStats,
  });

  log.debug("takumi.render_start", {
    width,
    height,
    format,
    requestedGoogleFonts: request.googleFonts?.length || 0,
    discoveredGoogleFonts: discoveredGoogleFonts.length,
    combinedGoogleFonts: combinedGoogleFonts.length,
    subsetTextChars: subsetText.length,
    styleParsed: primaryStyleStats.parsedDeclarations,
    styleDropped:
      primaryStyleStats.droppedUnsupportedProperty +
      primaryStyleStats.droppedInvalidValue +
      primaryStyleStats.droppedCustomProperty,
  });

  if (hasAnyDroppedStyles(primaryStyleStats)) {
    log.debug("takumi.style_sanitized", {
      mode: "standard",
      ...primaryStyleStats,
    });
  }

  // Fetch Google Fonts from explicit request + font links/imports in HTML/CSS.
  let fonts: FontDetails[] | undefined;
  if (combinedGoogleFonts.length > 0) {
    try {
      fonts = await fetchGoogleFonts(combinedGoogleFonts, subsetText);
      log.debug("takumi.fonts_loaded", { count: fonts.length });
    } catch (err) {
      log.warn("takumi.fonts_failed", { error: err instanceof Error ? err.message : String(err) });
    }
  }

  const optionsWithFonts = buildImageResponseOptions(width, height, format, request, fonts);
  const optionsWithoutFonts = buildImageResponseOptions(width, height, format, request);

  let buffer: Uint8Array | null = null;
  let activeElement = element;
  let styleRecoveryUsed = false;
  let fontRecoveryUsed = false;
  let lastError: unknown;

  try {
    buffer = await renderVdomWithTimeout(activeElement, optionsWithFonts, renderTimeoutMs);
  } catch (error) {
    lastError = error;
    const message = error instanceof Error ? error.message : String(error);
    const styleLikeError = isLikelyStyleRenderError(message);

    log.warn("takumi.render_primary_failed", {
      error: message,
      styleLikeError,
      hasFonts: Boolean(fonts && fonts.length > 0),
    });

    if (styleLikeError) {
      const strictStyleStats = createStyleSanitizeStats();
      const strictElement = htmlToVdom(normalizedHtml, {
        styleMode: "strict",
        styleStats: strictStyleStats,
      });
      activeElement = strictElement;

      if (hasAnyDroppedStyles(strictStyleStats)) {
        log.debug("takumi.style_sanitized", {
          mode: "strict",
          ...strictStyleStats,
        });
      }

      try {
        buffer = await renderVdomWithTimeout(activeElement, optionsWithFonts, renderTimeoutMs);
        styleRecoveryUsed = true;
      } catch (strictError) {
        lastError = strictError;
        log.warn("takumi.render_strict_retry_failed", {
          error: strictError instanceof Error ? strictError.message : String(strictError),
        });
      }
    }

    if (!buffer && fonts && fonts.length > 0) {
      const messageForFallback = lastError instanceof Error ? lastError.message : message;
      const resourceLikeError = isLikelyResourceRenderError(messageForFallback);
      try {
        buffer = await renderVdomWithTimeout(activeElement, optionsWithoutFonts, renderTimeoutMs);
        fontRecoveryUsed = true;
      } catch (noFontError) {
        lastError = noFontError;
        log.warn("takumi.render_no_fonts_retry_failed", {
          error: noFontError instanceof Error ? noFontError.message : String(noFontError),
          resourceLikeError,
        });
      }
    }
  }

  if (!buffer) {
    throw (lastError instanceof Error ? lastError : new Error(String(lastError || "Takumi render failed")));
  }

  const renderMs = Math.round(performance.now() - start);

  const contentType = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";

  log.info("takumi.render_complete", {
    renderMs,
    bytes: buffer.length,
    styleRecoveryUsed,
    fontRecoveryUsed,
  });

  return { buffer, contentType, renderMs };
}
