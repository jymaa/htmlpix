const HTMLPIX_API_URL =
  process.env.HTMLPIX_API_URL || "https://api.htmlpix.com";
const HTMLPIX_API_KEY = process.env.HTMLPIX_API_KEY;

// ─── Types ───────────────────────────────────────────────

export interface OgImageOptions {
  title: string;
  subtitle?: string;
  tag?: string;
  variant?: "home" | "standard";
}

// ─── Public helpers ──────────────────────────────────────

/** Build a relative URL for the OG image API route. */
export function ogImageUrl(params: {
  variant?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.variant) sp.set("variant", params.variant);
  if (params.title) sp.set("title", params.title);
  if (params.subtitle) sp.set("subtitle", params.subtitle);
  if (params.tag) sp.set("tag", params.tag);
  return `/api/og?${sp.toString()}`;
}

/** Render an OG image via the HTMLPix API. Returns a PNG buffer. */
export async function renderOgImage(
  options: OgImageOptions,
): Promise<Buffer> {
  if (!HTMLPIX_API_KEY) {
    throw new Error("HTMLPIX_API_KEY environment variable is not set");
  }

  const html = buildOgHtml(options);

  const res = await fetch(`${HTMLPIX_API_URL}/render`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HTMLPIX_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html,
      width: 1200,
      height: 630,
      format: "png",
      responseFormat: "base64",
      googleFonts: ["Bebas Neue", "Space Mono:wght@400;700"],
      cache: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `HTMLPix API error ${res.status}: ${JSON.stringify(err)}`,
    );
  }

  const data = (await res.json()) as { base64: string };
  let b64 = data.base64;
  // Strip data-URI prefix when present
  if (b64.startsWith("data:")) b64 = b64.split(",")[1];
  return Buffer.from(b64, "base64");
}

// ─── Internals ───────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildOgHtml(opts: OgImageOptions): string {
  return opts.variant === "home" ? homeHtml() : standardHtml(opts);
}

/**
 * Shared outer chrome: blueprint paper, grid, corner marks, margin line,
 * dimension annotation on the right edge.
 */
function wrap(inner: string): string {
  return `<!DOCTYPE html>
<html><head><style>*{margin:0;padding:0;box-sizing:border-box;}</style></head>
<body style="width:1200px;height:630px;overflow:hidden;">
<div style="width:1200px;height:630px;background:#f5f0e8;position:relative;font-family:'Space Mono',monospace;color:#1a1a1a;overflow:hidden;">

  <!-- Blueprint grid -->
  <div style="position:absolute;inset:0;background-image:
    linear-gradient(rgba(26,26,26,0.05) 1px,transparent 1px),
    linear-gradient(90deg,rgba(26,26,26,0.05) 1px,transparent 1px);
    background-size:60px 60px;"></div>

  <!-- Corner registration marks -->
  <div style="position:absolute;top:20px;left:20px;width:24px;height:24px;border-top:2px solid rgba(26,26,26,0.12);border-left:2px solid rgba(26,26,26,0.12);"></div>
  <div style="position:absolute;top:20px;right:20px;width:24px;height:24px;border-top:2px solid rgba(26,26,26,0.12);border-right:2px solid rgba(26,26,26,0.12);"></div>
  <div style="position:absolute;bottom:20px;left:20px;width:24px;height:24px;border-bottom:2px solid rgba(26,26,26,0.12);border-left:2px solid rgba(26,26,26,0.12);"></div>
  <div style="position:absolute;bottom:20px;right:20px;width:24px;height:24px;border-bottom:2px solid rgba(26,26,26,0.12);border-right:2px solid rgba(26,26,26,0.12);"></div>

  <!-- Left margin line (red/orange, like engineering paper) -->
  <div style="position:absolute;left:52px;top:0;bottom:0;width:1px;background:rgba(255,77,0,0.12);"></div>

  <!-- Right-edge dimension line + ticks -->
  <div style="position:absolute;right:36px;top:20px;bottom:20px;width:1px;background:rgba(26,26,26,0.05);"></div>
  <div style="position:absolute;right:32px;top:20px;width:9px;height:1px;background:rgba(26,26,26,0.08);"></div>
  <div style="position:absolute;right:32px;bottom:20px;width:9px;height:1px;background:rgba(26,26,26,0.08);"></div>

  ${inner}
</div>
</body></html>`;
}

/** Logo block reused by both templates. */
function logo(): string {
  return `<div style="display:flex;align-items:center;gap:10px;">
  <div style="width:30px;height:30px;background:#1a1a1a;display:flex;align-items:center;justify-content:center;">
    <span style="color:#f5f0e8;font-size:10px;font-weight:bold;">&lt;/&gt;</span>
  </div>
  <span style="font-weight:bold;letter-spacing:3px;font-size:12px;">HTMLPIX</span>
</div>`;
}

// ─── Home template ───────────────────────────────────────

function homeHtml(): string {
  return wrap(`
  <div style="position:relative;display:flex;height:100%;padding:44px 52px;">

    <!-- LEFT COLUMN -->
    <div style="flex:1;display:flex;flex-direction:column;padding-right:28px;">
      ${logo()}

      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
        <div style="font-size:10px;letter-spacing:4px;color:#ff4d00;margin-bottom:14px;">HTML TO IMAGE API</div>
        <div style="font-family:'Bebas Neue',cursive;font-size:96px;line-height:0.88;letter-spacing:-1px;">
          <span style="color:#ff4d00;">HTML IN.</span><br/>IMAGE OUT.
        </div>
        <div style="width:56px;height:4px;background:#ff4d00;margin:20px 0;"></div>
        <div style="font-size:12px;color:rgba(26,26,26,0.4);max-width:360px;line-height:1.7;">
          Send HTML, get pixel-perfect screenshots. One POST request. One API key. No more headaches.
        </div>
      </div>

      <!-- Specs bar -->
      <div style="display:flex;gap:20px;border-top:2px solid rgba(26,26,26,0.07);padding-top:14px;">
        <div>
          <div style="font-size:8px;letter-spacing:2px;color:rgba(26,26,26,0.28);text-transform:uppercase;">AVG LATENCY</div>
          <div style="font-size:14px;font-weight:bold;color:#ff4d00;margin-top:2px;">&lt;200ms</div>
        </div>
        <div style="width:1px;background:rgba(26,26,26,0.07);"></div>
        <div>
          <div style="font-size:8px;letter-spacing:2px;color:rgba(26,26,26,0.28);text-transform:uppercase;">UPTIME SLA</div>
          <div style="font-size:14px;font-weight:bold;color:#ff4d00;margin-top:2px;">99.9%</div>
        </div>
        <div style="width:1px;background:rgba(26,26,26,0.07);"></div>
        <div>
          <div style="font-size:8px;letter-spacing:2px;color:rgba(26,26,26,0.28);text-transform:uppercase;">FORMATS</div>
          <div style="font-size:14px;font-weight:bold;color:#ff4d00;margin-top:2px;">PNG / JPG / WEBP</div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN: Terminal mock -->
    <div style="width:400px;display:flex;align-items:center;">
      <div style="width:100%;background:#1a1a1a;border:2px solid rgba(26,26,26,0.15);box-shadow:4px 4px 0 0 rgba(26,26,26,0.06);">
        <!-- Title bar -->
        <div style="display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid rgba(245,240,232,0.08);">
          <div style="width:8px;height:8px;border-radius:50%;background:#ff5f57;"></div>
          <div style="width:8px;height:8px;border-radius:50%;background:#febc2e;"></div>
          <div style="width:8px;height:8px;border-radius:50%;background:#28c840;"></div>
          <span style="margin-left:8px;font-size:9px;color:rgba(245,240,232,0.2);">terminal</span>
        </div>
        <!-- Code -->
        <div style="padding:14px;font-size:11px;line-height:1.9;">
          <div>
            <span style="color:#28c840;">$</span>
            <span style="color:#f5f0e8;"> curl </span>
            <span style="color:#ff4d00;">-X POST</span>
            <span style="color:rgba(245,240,232,0.6);"> api.htmlpix.com/render</span>
            <span style="color:rgba(245,240,232,0.15);"> \\</span>
          </div>
          <div style="padding-left:16px;">
            <span style="color:#ff4d00;">-H</span>
            <span style="color:#a5d6a7;"> "Authorization: Bearer $KEY"</span>
            <span style="color:rgba(245,240,232,0.15);"> \\</span>
          </div>
          <div style="padding-left:16px;">
            <span style="color:#ff4d00;">-d</span>
            <span style="color:#a5d6a7;"> '{"html":"&lt;h1&gt;Hello&lt;/h1&gt;"}'</span>
          </div>

          <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(245,240,232,0.06);">
            <div style="color:rgba(245,240,232,0.2);margin-bottom:4px;"># 200 OK (143ms)</div>
            <div style="color:rgba(245,240,232,0.2);">{</div>
            <div style="padding-left:16px;">
              <span style="color:#81c784;">"id"</span><span style="color:rgba(245,240,232,0.2);">: </span><span style="color:#a5d6a7;">"abc123"</span><span style="color:rgba(245,240,232,0.2);">,</span>
            </div>
            <div style="padding-left:16px;">
              <span style="color:#81c784;">"url"</span><span style="color:rgba(245,240,232,0.2);">: </span><span style="color:#a5d6a7;">"...abc123.png"</span><span style="color:rgba(245,240,232,0.2);">,</span>
            </div>
            <div style="padding-left:16px;">
              <span style="color:#81c784;">"imageKey"</span><span style="color:rgba(245,240,232,0.2);">: </span><span style="color:#a5d6a7;">"abc123.png"</span>
            </div>
            <div style="color:rgba(245,240,232,0.2);">}</div>
          </div>
        </div>
      </div>

      <!-- "that's it" annotation -->
      <div style="position:absolute;bottom:44px;right:52px;font-size:9px;color:rgba(26,26,26,0.2);display:flex;align-items:center;gap:6px;">
        <span style="width:6px;height:6px;border-radius:50%;background:#28c840;"></span>
        LIVE
      </div>
    </div>

  </div>`);
}

// ─── Standard template ───────────────────────────────────

function standardHtml(opts: OgImageOptions): string {
  const title = esc(opts.title);
  const subtitle = opts.subtitle ? esc(opts.subtitle) : undefined;
  const tag = opts.tag ? esc(opts.tag) : undefined;

  // Dynamic font size based on title length
  const len = opts.title.length;
  const fontSize =
    len <= 20 ? 92 : len <= 30 ? 80 : len <= 42 ? 66 : len <= 55 ? 56 : 48;

  return wrap(`
  <!-- Decorative: large faded logo bottom-right -->
  <div style="position:absolute;right:60px;bottom:48px;width:160px;height:160px;border:3px solid rgba(255,77,0,0.06);display:flex;align-items:center;justify-content:center;">
    <span style="font-size:56px;font-weight:bold;color:rgba(255,77,0,0.05);">&lt;/&gt;</span>
  </div>

  <!-- Decorative: offset inner rectangle -->
  <div style="position:absolute;right:80px;bottom:68px;width:120px;height:120px;border:2px dashed rgba(26,26,26,0.04);"></div>

  <div style="position:relative;display:flex;flex-direction:column;height:100%;padding:44px 64px;">

    <!-- Top bar -->
    <div style="display:flex;align-items:center;justify-content:space-between;">
      ${logo()}
      <span style="font-size:9px;letter-spacing:3px;color:rgba(26,26,26,0.18);text-transform:uppercase;">htmlpix.com</span>
    </div>

    <!-- Orange gradient line -->
    <div style="height:2px;background:linear-gradient(90deg,#ff4d00 0%,rgba(255,77,0,0.25) 60%,transparent 100%);margin:16px 0 0;"></div>

    <!-- Main content -->
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;max-width:880px;">
      ${tag ? `<div style="display:inline-flex;margin-bottom:14px;"><span style="font-size:10px;letter-spacing:4px;color:#ff4d00;text-transform:uppercase;background:rgba(255,77,0,0.06);padding:4px 12px;">${tag}</span></div>` : ""}

      <div style="font-family:'Bebas Neue',cursive;font-size:${fontSize}px;line-height:0.95;color:#1a1a1a;letter-spacing:0px;">
        ${title}
      </div>

      <div style="width:52px;height:4px;background:#ff4d00;margin:18px 0;"></div>

      ${subtitle ? `<div style="font-size:13px;color:rgba(26,26,26,0.38);max-width:640px;line-height:1.7;">${subtitle}</div>` : ""}
    </div>

    <!-- Bottom annotation -->
    <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(26,26,26,0.06);padding-top:12px;">
      <span style="font-size:9px;color:rgba(26,26,26,0.18);">htmlpix.com</span>
      <span style="font-size:8px;letter-spacing:2px;color:rgba(26,26,26,0.12);text-transform:uppercase;">HTML to Image API</span>
    </div>

  </div>`);
}
