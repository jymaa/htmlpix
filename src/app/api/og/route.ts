import { type NextRequest, NextResponse } from "next/server";
import { renderOgImage } from "@/lib/og";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const variant = (sp.get("variant") ?? "standard") as "home" | "standard";
  const title = sp.get("title") ?? "HTMLPix";
  const subtitle = sp.get("subtitle") ?? undefined;
  const tag = sp.get("tag") ?? undefined;

  try {
    const png = await renderOgImage({ variant, title, subtitle, tag });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[og] generation failed:", err);
    return new NextResponse("OG image generation failed", { status: 500 });
  }
}
