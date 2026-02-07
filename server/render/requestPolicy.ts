import type { HTTPRequest } from "puppeteer";

// Resource types to allow
const ALLOWED_RESOURCE_TYPES = new Set([
  "document",
  "stylesheet",
  "font",
  "image",
]);

// Always allowed hosts for Google Fonts
const GOOGLE_FONTS_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com",
]);

// Parse additional allowed hosts from env
const ADDITIONAL_ALLOWED_HOSTS = new Set(
  (process.env.ALLOWED_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
);

// Max bytes per render
const MAX_ASSET_BYTES = parseInt(process.env.MAX_ASSET_BYTES || "10485760", 10); // 10MB default

export interface RequestStats {
  bytesDownloaded: number;
  blockedCount: number;
}

export function createRequestInterceptor(
  useGoogleFonts: boolean,
  allowAllDomains = false
): {
  handler: (request: HTTPRequest, stats: RequestStats) => Promise<void>;
  stats: RequestStats;
} {
  const stats: RequestStats = {
    bytesDownloaded: 0,
    blockedCount: 0,
  };

  const handler = async (request: HTTPRequest, stats: RequestStats): Promise<void> => {
    const resourceType = request.resourceType();
    const url = new URL(request.url());
    const host = url.hostname.toLowerCase();

    // Check resource type
    if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
      stats.blockedCount++;
      await request.abort("blockedbyclient");
      return;
    }

    // For remote requests, check domain allowlist
    if (url.protocol === "http:" || url.protocol === "https:") {
      const isGoogleFonts = GOOGLE_FONTS_HOSTS.has(host);
      const isAdditionalAllowed = ADDITIONAL_ALLOWED_HOSTS.has(host);

      // Block Google Fonts if not requested
      if (isGoogleFonts && !useGoogleFonts) {
        stats.blockedCount++;
        await request.abort("blockedbyclient");
        return;
      }

      // In URL mode (allowAllDomains), allow all document/stylesheet/font/image requests
      if (allowAllDomains) {
        // All allowed resource types pass through
      } else {
        // For non-document requests, check allowlist (images allowed from any host)
        if (resourceType !== "document" && resourceType !== "image") {
          if (!isGoogleFonts && !isAdditionalAllowed) {
            stats.blockedCount++;
            await request.abort("blockedbyclient");
            return;
          }
        }
      }
    }

    // Check if we've exceeded max bytes (rough estimate)
    if (stats.bytesDownloaded > MAX_ASSET_BYTES) {
      stats.blockedCount++;
      await request.abort("blockedbyclient");
      return;
    }

    await request.continue();
  };

  return { handler, stats };
}

export function updateBytesDownloaded(stats: RequestStats, bytes: number): void {
  stats.bytesDownloaded += bytes;
}

export { MAX_ASSET_BYTES };
