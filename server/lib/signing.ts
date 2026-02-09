import { timingSafeEqual } from "node:crypto";

export interface SignableQuery {
  templateId: string;
  uid: string;
  exp: number;
  width?: number;
  height?: number;
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  tv?: string;
  variables?: Record<string, string>;
}

const SIGNING_SECRET = process.env.IMAGE_SIGNING_SECRET;
if (!SIGNING_SECRET) {
  throw new Error("IMAGE_SIGNING_SECRET environment variable is required");
}

function base64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function hmacSha256(payload: string): string {
  const hmac = new Bun.CryptoHasher("sha256", SIGNING_SECRET);
  hmac.update(payload);
  return base64Url(hmac.digest());
}

export function canonicalizeQuery(input: SignableQuery): string {
  const params: Array<[string, string]> = [
    ["templateId", input.templateId],
    ["uid", input.uid],
    ["exp", String(input.exp)],
  ];

  if (input.width !== undefined) params.push(["width", String(input.width)]);
  if (input.height !== undefined) params.push(["height", String(input.height)]);
  if (input.format) params.push(["format", input.format]);
  if (input.quality !== undefined) params.push(["quality", String(input.quality)]);
  if (input.tv) params.push(["tv", input.tv]);

  const vars = input.variables ?? {};
  const sortedVarKeys = Object.keys(vars).sort();
  for (const key of sortedVarKeys) {
    params.push([`v_${key}`, vars[key] ?? ""]);
  }

  params.sort(([a], [b]) => a.localeCompare(b));

  return params
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

export function signCanonicalQuery(canonicalQuery: string): string {
  return hmacSha256(canonicalQuery);
}

export function verifyCanonicalQuery(canonicalQuery: string, providedSig: string): boolean {
  const expectedSig = signCanonicalQuery(canonicalQuery);
  if (expectedSig.length !== providedSig.length) return false;
  return timingSafeEqual(Buffer.from(expectedSig), Buffer.from(providedSig));
}
