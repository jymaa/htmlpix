import "server-only";
import { cache } from "react";

const DEFAULT_HTMLPIX_API_URL = "https://api.htmlpix.com";

const HTMLPIX_API_URL =
  process.env.HTMLPIX_API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_HTMLPIX_API_URL;
const HTMLPIX_API_KEY = process.env.HTMLPIX_API_KEY;
const HTMLPIX_OG_TEMPLATE_ID = process.env.HTMLPIX_OG_TEMPLATE_ID;
const HTMLPIX_OG_STANDARD_TEMPLATE_ID = process.env.HTMLPIX_OG_STANDARD_TEMPLATE_ID;
const HTMLPIX_OG_HOME_TEMPLATE_ID = process.env.HTMLPIX_OG_HOME_TEMPLATE_ID;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

type OgVariant = "home" | "standard";

export interface MintSignedOgUrlOptions {
  title?: string;
  subtitle?: string;
  tag?: string;
  variant?: OgVariant;
}

export interface OgMetadataImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

function resolveTemplateId(variant: OgVariant): string {
  if (variant === "home") {
    return HTMLPIX_OG_HOME_TEMPLATE_ID || HTMLPIX_OG_TEMPLATE_ID || "";
  }
  return HTMLPIX_OG_STANDARD_TEMPLATE_ID || HTMLPIX_OG_TEMPLATE_ID || "";
}

const mintSignedOgImageUrlCached = cache(
  async (variant: OgVariant, title: string, subtitle: string, tag: string): Promise<string> => {
    if (!HTMLPIX_API_KEY) {
      throw new Error("Missing HTMLPIX_API_KEY environment variable");
    }

    const templateId = resolveTemplateId(variant);
    if (!templateId) {
      throw new Error(
        "Missing OG template ID. Set HTMLPIX_OG_TEMPLATE_ID (or HTMLPIX_OG_STANDARD_TEMPLATE_ID / HTMLPIX_OG_HOME_TEMPLATE_ID)."
      );
    }

    const endpoint = new URL("/v1/image-url", HTMLPIX_API_URL).toString();
    const mintRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HTMLPIX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        format: "webp",
        variables: {
          title,
          subtitle,
          tag,
          variant,
        },
      }),
    });

    if (!mintRes.ok) {
      const raw = await mintRes.text();
      throw new Error(`Mint request failed (${mintRes.status}): ${raw}`);
    }

    const payload = (await mintRes.json()) as { url?: string };
    if (!payload.url) {
      throw new Error("Mint request succeeded but did not return a signed URL");
    }

    return payload.url;
  }
);

export async function mintSignedOgImageUrl(options: MintSignedOgUrlOptions): Promise<string> {
  const variant = options.variant ?? "standard";
  const title =
    options.title ?? (variant === "home" ? "HTMLPix - HTML In. Image Out." : "HTMLPix - HTML to Image API");
  const subtitle =
    options.subtitle ??
    (variant === "home"
      ? "Mint once. Reuse everywhere."
      : "Generate images from HTML/CSS with a single API call.");
  const tag = options.tag ?? "HTML TO IMAGE API";

  return mintSignedOgImageUrlCached(variant, title, subtitle, tag);
}

export async function getOgMetadataImage(
  options: MintSignedOgUrlOptions & { alt: string }
): Promise<OgMetadataImage | null> {
  try {
    const url = await mintSignedOgImageUrl(options);
    return {
      url,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: options.alt,
    };
  } catch (error) {
    console.error("[og] failed to mint signed OG URL", error);
    return null;
  }
}
