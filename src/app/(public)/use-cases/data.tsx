import type { ReactNode } from "react";

export interface UseCase {
  slug: string;
  tag: string;
  title: string;
  headline: string;
  subtitle: string;
  meta: { title: string; description: string };
  problem: { heading: string; body: string[] };
  solution: { heading: string; body: string[] };
  code: { filename: string; snippet: string };
  benefits: { title: string; description: string }[];
  cta: { heading: string; body: string };
  preview: ReactNode;
  heroPreview: ReactNode;
  bg: string;
  desc: string;
  integrations?: {
    tabs: {
      label: string;
      language: string;
      filename: string;
      snippet: string;
    }[];
  };
  roi?: { manual: string; withApi: string; savings: string };
  faq?: { question: string; answer: string }[];
}

export const useCases: UseCase[] = [
  {
    slug: "og-images",
    tag: "SEO",
    title: "OG Images",
    headline: "Generate Open Graph Images From HTML",
    subtitle:
      "A unique social preview for every page on your site. More clicks from Google, Twitter, and LinkedIn — generated with a single API call.",
    meta: {
      title: "Generate OG Images From HTML",
      description:
        "Generate unique Open Graph images for every page with a single API call. HTML template in, OG image out. No Puppeteer, no headless Chrome.",
    },
    problem: {
      heading: "Manual OG Images Don't Scale",
      body: [
        "Every blog post, product page, and landing page needs a unique social preview. Without one, your links look generic in feeds and search results — fewer clicks, less traffic.",
        "Self-hosting Puppeteer or Playwright means maintaining headless Chrome infrastructure: memory leaks, zombie processes, version mismatches, cold starts. It's a full-time ops job for what should be a simple image.",
      ],
    },
    solution: {
      heading: "One Template, Infinite Images",
      body: [
        "Design your OG image as an HTML template. Inject dynamic data — title, author, date, category — per request. POST it to HTMLPix and get back a pixel-perfect 1200×630 PNG.",
        "Tailwind CSS, Google Fonts, gradients, images — everything renders exactly like a browser. Because it is a browser. We handle the infrastructure so you don't have to.",
      ],
    },
    code: {
      filename: "og-image.sh",
      snippet: `curl -X POST https://api.htmlpix.com/render \\
  -H "Authorization: Bearer $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<div style=\\"width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a1a,#333)\\"><h1 style=\\"color:white;font-size:64px\\">{{title}}</h1></div>",
    "width": 1200,
    "height": 630
  }' --output og.png`,
    },
    benefits: [
      {
        title: "Higher Click-Through Rate",
        description:
          "Rich social previews get 2-3x more clicks than plain links. Every page gets its own branded image.",
      },
      {
        title: "Zero Infrastructure",
        description:
          "No headless Chrome to maintain. No memory leaks to debug. No cold starts to optimize. Just an API call.",
      },
      {
        title: "Dynamic Per Page",
        description:
          "Inject title, author, date, and category into your template. Every page gets a unique preview automatically.",
      },
      {
        title: "Tailwind & Google Fonts",
        description:
          "Use the same CSS tools you already know. Tailwind classes, custom fonts, gradients — all render perfectly.",
      },
    ],
    cta: {
      heading: "Start Generating OG Images",
      body: "50 free renders every month. Your first OG image is one API call away.",
    },
    bg: "from-[#1a1a1a] to-[#333]",
    desc: "Generate a unique social preview for every page on your site. More clicks from Google, Twitter, and LinkedIn.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "app/api/og/route.ts",
          snippet: `import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Default Title";

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:#111"><h1 style="color:white;font-size:64px">\${title}</h1></div>\`,
      width: 1200,
      height: 630,
    }),
  });

  return new NextResponse(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "generate_og.py",
          snippet: `import requests, os

def generate_og(title: str) -> bytes:
    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={
            "html": f'<div style="width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:#111"><h1 style="color:white;font-size:64px">{title}</h1></div>',
            "width": 1200,
            "height": 630,
        },
    )
    res.raise_for_status()
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "generateOg.mjs",
          snippet: `const res = await fetch("https://api.htmlpix.com/render", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    html: \`<div style="width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:#111"><h1 style="color:white;font-size:64px">\${title}</h1></div>\`,
    width: 1200,
    height: 630,
  }),
});

await fs.writeFile("og.png", Buffer.from(await res.arrayBuffer()));`,
        },
      ],
    },
    roi: {
      manual: "Self-hosting Puppeteer: 4-8 hours initial setup, ongoing maintenance for Chrome updates, memory leak debugging, and cold start optimization. $50-200/mo infrastructure.",
      withApi: "Single API call per image. No infrastructure to maintain. Auto-scaling, zero cold starts. Pay only for what you render.",
      savings: "~20 engineering hours/month",
    },
    faq: [
      { question: "What dimensions should OG images be?", answer: "The standard Open Graph image size is 1200x630 pixels. This works across Facebook, Twitter/X, LinkedIn, and most other platforms. HTMLPix lets you specify exact width and height in every request." },
      { question: "Can I use custom fonts in my OG images?", answer: "Yes. Include Google Fonts via a <link> tag in your HTML, or use any web font. HTMLPix waits for fonts to load before capturing the screenshot." },
      { question: "How fast are OG images generated?", answer: "Typical render times are 200-500ms depending on complexity. Results are cacheable — set Cache-Control headers and serve the same image on repeat requests." },
      { question: "Do I need to host Puppeteer myself?", answer: "No. HTMLPix runs managed browser instances. You send HTML, we return an image. No Chrome binaries, no Docker containers, no infrastructure." },
    ],
    preview: (
      <div className="flex h-full flex-col justify-between p-4">
        <div className="text-[8px] font-bold tracking-wider text-[#ff4d00] uppercase">
          Blog Post
        </div>
        <div>
          <div className="mb-1 font-[family-name:var(--font-bebas-neue)] text-base leading-tight text-white">
            How We Scaled to 10M Requests
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3.5 w-3.5 rounded-full bg-[#ff4d00]" />
            <span className="text-[7px] text-white/40">htmlpix.com</span>
            <span className="text-[7px] text-white/20">|</span>
            <span className="text-[7px] text-white/40">5 min</span>
          </div>
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        {/* Twitter/X embed context */}
        <div className="rounded-xl border border-[#1a1a1a]/10 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1a1a1a]" />
            <div>
              <div className="text-xs font-bold text-[#1a1a1a]">Your SaaS Blog</div>
              <div className="text-[10px] text-[#1a1a1a]/40">@yoursaas</div>
            </div>
          </div>
          <p className="mb-3 text-xs text-[#1a1a1a]/70">
            New post: How we scaled our rendering pipeline to handle 10 million API requests per day.
          </p>
          {/* The actual OG card */}
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10">
            <div
              className="relative flex aspect-[1200/630] w-full flex-col justify-between overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 100%)",
              }}
            >
              {/* Decorative grid overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Top bar */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-5 md:px-10 md:pt-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#ff4d00] md:h-8 md:w-8">
                    <span className="text-[8px] font-bold text-white md:text-[10px]">
                      {"</>"}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold tracking-wider text-white/40 uppercase md:text-xs">
                    acme.dev/blog
                  </span>
                </div>
                <span className="rounded-full bg-[#ff4d00]/20 px-2 py-0.5 text-[8px] font-bold text-[#ff4d00] md:px-3 md:py-1 md:text-[10px]">
                  Engineering
                </span>
              </div>
              {/* Main content */}
              <div className="relative z-10 px-6 pb-5 md:px-10 md:pb-8">
                <h3 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-xl leading-[1.1] text-white sm:text-2xl md:mb-3 md:text-4xl lg:text-5xl">
                  How We Scaled to
                  <br />
                  <span className="text-[#ff4d00]">10M Requests/Day</span>
                </h3>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#ff4d00] to-[#ff6a33] md:h-7 md:w-7" />
                  <div>
                    <span className="text-[8px] font-medium text-white/70 md:text-xs">
                      Sarah Chen
                    </span>
                    <span className="mx-1 text-white/20 md:mx-2">|</span>
                    <span className="text-[8px] text-white/40 md:text-xs">
                      5 min read
                    </span>
                  </div>
                </div>
              </div>
              {/* Accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#ff4d00] via-[#ff6a33] to-transparent" />
            </div>
            <div className="bg-[#fafafa] px-3 py-2">
              <div className="text-[10px] font-medium text-[#1a1a1a]">
                How We Scaled to 10M Requests/Day - Acme Engineering Blog
              </div>
              <div className="text-[9px] text-[#1a1a1a]/40">acme.dev</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "social-cards",
    tag: "SOCIAL",
    title: "Social Cards",
    headline: "Branded Social Cards via API",
    subtitle:
      "One HTML template, any platform. Generate brand-consistent cards for Twitter/X, LinkedIn, and Discord on demand.",
    meta: {
      title: "Branded Social Cards via API",
      description:
        "Generate branded social cards for Twitter, LinkedIn, and Discord from HTML templates. One API call, any size, always on-brand.",
    },
    problem: {
      heading: "Every Platform Wants a Different Size",
      body: [
        "Twitter wants 1200×628. LinkedIn wants 1200×627. Discord wants 1280×720. Each platform renders previews differently, and your design team can't manually create every variation for every post.",
        "When your product ships daily updates, launches, or user-generated content, manual card creation becomes the bottleneck. Design requests pile up, cards go stale, and brand consistency suffers.",
      ],
    },
    solution: {
      heading: "One Template, Any Dimension",
      body: [
        "Build your card as an HTML template with your brand colors, logo, and layout. Pass in the title, description, and image URL per request. Change width and height to match any platform.",
        "Generate cards on-demand in your CI pipeline, CMS webhook, or API endpoint. Every card is pixel-perfect and brand-consistent, whether you're generating 10 or 10,000.",
      ],
    },
    code: {
      filename: "social-card.ts",
      snippet: `const card = await fetch("https://api.htmlpix.com/render", {
  method: "POST",
  headers: { "Authorization": \`Bearer \${key}\` },
  body: JSON.stringify({
    html: \`<div style="width:1200px;height:628px;display:flex;
      align-items:center;justify-content:center;
      background:linear-gradient(135deg,#ff4d00,#ff6a33)">
      <h1 style="color:white;font-size:48px">\${title}</h1>
    </div>\`,
    width: 1200,
    height: 628
  })
});`,
    },
    benefits: [
      {
        title: "Multi-Platform Sizing",
        description:
          "Same template, different dimensions. Twitter, LinkedIn, Discord, Slack — one API call each.",
      },
      {
        title: "On-Demand Generation",
        description:
          "Generate cards in real-time from webhooks, CMS events, or user actions. No design queue.",
      },
      {
        title: "Brand Consistency",
        description:
          "Your template enforces brand guidelines. Colors, fonts, logo placement — always correct, always consistent.",
      },
      {
        title: "A/B Testable",
        description:
          "Swap headlines, images, or layouts per variant. Measure which card design drives more engagement.",
      },
    ],
    cta: {
      heading: "Start Generating Social Cards",
      body: "50 free renders every month. Ship branded cards for every platform today.",
    },
    bg: "from-[#ff4d00] to-[#ff6a33]",
    desc: "Branded cards for Twitter/X, LinkedIn, and Discord. Generated from your app data on every request.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "lib/socialCard.ts",
          snippet: `export async function generateCard(title: string, platform: "twitter" | "linkedin") {
  const sizes = { twitter: { w: 1200, h: 628 }, linkedin: { w: 1200, h: 627 } };
  const { w, h } = sizes[platform];

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:\${w}px;height:\${h}px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33)"><h1 style="color:white;font-size:48px">\${title}</h1></div>\`,
      width: w, height: h,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "social_card.py",
          snippet: `import requests, os

SIZES = {"twitter": (1200, 628), "linkedin": (1200, 627), "discord": (1280, 720)}

def generate_card(title: str, platform: str) -> bytes:
    w, h = SIZES[platform]
    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={
            "html": f'<div style="width:{w}px;height:{h}px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33)"><h1 style="color:white;font-size:48px">{title}</h1></div>',
            "width": w, "height": h,
        },
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "socialCard.mjs",
          snippet: `const sizes = { twitter: [1200, 628], linkedin: [1200, 627], discord: [1280, 720] };

async function generateCard(title, platform) {
  const [width, height] = sizes[platform];
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:\${width}px;height:\${height}px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33)"><h1 style="color:white;font-size:48px">\${title}</h1></div>\`,
      width, height,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Design team creates cards manually per campaign. 30-60 minutes per card variation. Backlogs of 2-5 days for urgent requests.",
      withApi: "Cards generated programmatically in milliseconds. Any size, any platform. Zero design queue. Ship cards the moment content is ready.",
      savings: "~15 design hours/month",
    },
    faq: [
      { question: "What sizes work for different social platforms?", answer: "Twitter/X uses 1200x628, LinkedIn uses 1200x627, Discord uses 1280x720, and Facebook uses 1200x630. Pass the width and height per request to match any platform." },
      { question: "Can I generate cards in bulk?", answer: "Yes. Loop through your content and POST one request per card. The API handles concurrency — generate hundreds of cards in parallel." },
      { question: "Do social cards support transparent backgrounds?", answer: "Yes, when using PNG format. Set your HTML background to transparent and the output PNG will preserve alpha transparency." },
      { question: "Can I include images from external URLs?", answer: "Yes. Use standard <img> tags with external URLs. HTMLPix fetches and renders remote images as part of the screenshot." },
    ],
    preview: (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-1 font-[family-name:var(--font-bebas-neue)] text-xl text-white">
            Launch Day
          </div>
          <div className="text-[8px] tracking-wider text-white/60">@yourapp</div>
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        {/* LinkedIn embed context */}
        <div className="rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#ff4d00] to-[#ff6a33]" />
              <div>
                <div className="text-xs font-bold text-[#1a1a1a]">Acme Inc.</div>
                <div className="text-[10px] text-[#1a1a1a]/40">
                  12,400 followers
                </div>
              </div>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-[#1a1a1a]/60">
              We just shipped something big. After 6 months of building in
              stealth, Acme v2.0 is live. New dashboard, 3x faster API, and
              a free tier for indie devs.
            </p>
          </div>
          {/* The actual social card */}
          <div className="overflow-hidden border-t border-[#1a1a1a]/10">
            <div
              className="relative flex aspect-[1200/628] w-full items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #ff4d00 0%, #ff6a33 50%, #ff8a5c 100%)",
              }}
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border-[30px] border-white/[0.06]" />
              <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full border-[40px] border-white/[0.04]" />
              <div className="relative z-10 text-center px-6">
                <div className="mb-2 text-[8px] font-bold tracking-[0.2em] text-white/50 uppercase md:mb-3 md:text-xs">
                  Introducing
                </div>
                <div className="mb-2 font-[family-name:var(--font-bebas-neue)] text-3xl leading-[0.95] text-white sm:text-4xl md:mb-4 md:text-6xl lg:text-7xl">
                  ACME V2.0
                </div>
                <div className="mx-auto mb-3 h-0.5 w-12 bg-white/30 md:mb-4 md:w-16" />
                <div className="text-[9px] font-medium leading-relaxed text-white/70 md:text-sm">
                  3x Faster API &middot; New Dashboard &middot; Free Tier
                </div>
              </div>
            </div>
            <div className="bg-[#f3f2ef] px-4 py-2.5">
              <div className="text-[10px] font-medium text-[#1a1a1a]">
                Acme v2.0 is Here - Everything You Need to Know
              </div>
              <div className="text-[9px] text-[#1a1a1a]/40">acme.dev</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "invoices",
    tag: "COMMERCE",
    title: "Invoices",
    headline: "Pixel-Perfect Invoice Images From HTML",
    subtitle:
      "Invoices that look identical everywhere — inbox, print, archive. Rendered from HTML templates via API.",
    meta: {
      title: "Pixel-Perfect Invoice Images From HTML",
      description:
        "Generate pixel-perfect invoice and receipt images from HTML. Renders identically in every email client, print-ready, and archive-ready.",
    },
    problem: {
      heading: "Email Clients Destroy Your Layout",
      body: [
        "You designed a beautiful HTML invoice. Then Outlook strips your CSS grid. Gmail ignores your media queries. Yahoo wraps your columns. Every email client renders your invoice differently.",
        "PDF libraries add bloat to your stack and still require careful layout tuning. You need invoices that look exactly the same whether the customer views them on mobile, desktop, or prints them out.",
      ],
    },
    solution: {
      heading: "Render Once, Display Everywhere",
      body: [
        "Design your invoice as HTML with full CSS support — flexbox, grid, custom fonts, your brand colors. POST it to HTMLPix and get back a pixel-perfect PNG or JPEG.",
        "Embed the image in emails, attach it to receipts, or store it for compliance. The image looks identical in every email client, every browser, and every printer. Batch-generate thousands of invoices via API.",
      ],
    },
    code: {
      filename: "invoice.sh",
      snippet: `curl -X POST https://api.htmlpix.com/render \\
  -H "Authorization: Bearer $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<div style=\\"width:800px;padding:40px;font-family:monospace;background:white\\"><h2>Invoice #1042</h2><table style=\\"width:100%;border-collapse:collapse\\"><tr><td style=\\"padding:8px;border-bottom:1px solid #eee\\">API Pro Plan</td><td style=\\"text-align:right;padding:8px;border-bottom:1px solid #eee\\">$15.00</td></tr><tr><td style=\\"padding:8px\\"><strong>Total</strong></td><td style=\\"text-align:right;padding:8px\\"><strong>$15.00</strong></td></tr></table></div>",
    "width": 800
  }' --output invoice.png`,
    },
    benefits: [
      {
        title: "Universal Rendering",
        description:
          "Images render identically in Outlook, Gmail, Apple Mail, and every other client. No CSS hacks needed.",
      },
      {
        title: "Email-Safe Format",
        description:
          "Embed as an <img> tag or attach as a file. No broken layouts, no missing fonts, no rendering surprises.",
      },
      {
        title: "Print-Ready Resolution",
        description:
          "High-resolution output suitable for printing. Customers can print invoices that look exactly like the digital version.",
      },
      {
        title: "Batch Generation",
        description:
          "Generate thousands of invoices via API. Loop through your orders, POST per invoice, done in minutes.",
      },
    ],
    cta: {
      heading: "Start Generating Invoices",
      body: "50 free renders every month. Pixel-perfect invoices from HTML, starting now.",
    },
    bg: "from-[#f5f0e8] to-[#e8e0d5]",
    desc: "Pixel-perfect receipts from HTML templates. Email-ready, print-ready, archive-ready.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "app/api/invoice/route.ts",
          snippet: `import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { invoiceId, items, total } = await req.json();

  const html = \`<div style="width:800px;padding:40px;font-family:monospace;background:white">
    <h2>Invoice #\${invoiceId}</h2>
    \${items.map((i: any) => \`<div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee"><span>\${i.name}</span><span>\${i.price}</span></div>\`).join("")}
    <div style="text-align:right;padding:16px 8px;font-weight:bold">Total: \${total}</div>
  </div>\`;

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: { Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ html, width: 800 }),
  });

  return new NextResponse(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png" },
  });
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "invoice.py",
          snippet: `import requests, os

def render_invoice(invoice_id: str, items: list, total: str) -> bytes:
    rows = "".join(
        f'<div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee"><span>{i["name"]}</span><span>{i["price"]}</span></div>'
        for i in items
    )
    html = f'<div style="width:800px;padding:40px;font-family:monospace;background:white"><h2>Invoice #{invoice_id}</h2>{rows}<div style="text-align:right;padding:16px 8px;font-weight:bold">Total: {total}</div></div>'

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 800},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "invoice.mjs",
          snippet: `async function renderInvoice(invoiceId, items, total) {
  const rows = items.map(i =>
    \`<div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee"><span>\${i.name}</span><span>\${i.price}</span></div>\`
  ).join("");

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:800px;padding:40px;font-family:monospace;background:white"><h2>Invoice #\${invoiceId}</h2>\${rows}<div style="text-align:right;padding:16px 8px;font-weight:bold">Total: \${total}</div></div>\`,
      width: 800,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "HTML emails with CSS hacks for Outlook/Gmail. Hours of cross-client testing. PDF libraries add complexity and still break on edge cases.",
      withApi: "Design once in HTML, render as image. Identical in every email client. No cross-client testing, no CSS hacks, no PDF dependencies.",
      savings: "~10 engineering hours/month",
    },
    faq: [
      { question: "Will invoice images look the same in every email client?", answer: "Yes. Since the invoice is rendered as an image, it displays identically in Outlook, Gmail, Apple Mail, and every other client. No CSS rendering differences." },
      { question: "Can I generate invoices in batch?", answer: "Yes. Loop through your orders and POST one request per invoice. Generate thousands of invoices in minutes." },
      { question: "What resolution are invoice images?", answer: "Images render at 1x by default. For high-DPI/retina output, set deviceScaleFactor to 2 in your request for crisp print-quality results." },
      { question: "Can I include my company logo?", answer: "Yes. Use an <img> tag with your logo URL in the HTML template. HTMLPix fetches and renders external images." },
    ],
    preview: (
      <div className="flex h-full flex-col justify-between p-4">
        <div className="text-[8px] font-bold tracking-wider text-[#1a1a1a]/50 uppercase">
          Receipt
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[7px] text-[#1a1a1a]/50">
            <span>API Pro Plan</span>
            <span>$15.00</span>
          </div>
          <div className="flex justify-between text-[7px] text-[#1a1a1a]/50">
            <span>Extra Renders</span>
            <span>$8.00</span>
          </div>
          <div className="border-t border-dashed border-[#1a1a1a]/15 pt-1.5">
            <div className="flex justify-between text-[8px] font-bold text-[#1a1a1a]">
              <span>Total</span>
              <span>$23.00</span>
            </div>
          </div>
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-lg">
        {/* Email client context */}
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="border-b border-[#1a1a1a]/10 bg-[#fafafa] px-4 py-2.5">
            <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40">
              <span className="font-bold text-[#1a1a1a]/60">From:</span> billing@acme.dev
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40">
              <span className="font-bold text-[#1a1a1a]/60">Subject:</span> Invoice #1042 — January 2026
            </div>
          </div>
          {/* The actual invoice image */}
          <div className="p-4 md:p-6">
            <div className="border border-[#e5e5e5] bg-white">
              <div className="px-5 pt-5 pb-4 md:px-8 md:pt-8 md:pb-6">
                {/* Header */}
                <div className="mb-5 flex items-start justify-between md:mb-8">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center bg-[#1a1a1a] md:h-6 md:w-6">
                        <span className="text-[6px] font-bold text-white md:text-[8px]">A</span>
                      </div>
                      <span className="text-xs font-bold tracking-wider text-[#1a1a1a] md:text-sm">
                        ACME
                      </span>
                    </div>
                    <div className="mt-1 text-[8px] text-[#1a1a1a]/30 md:text-[10px]">
                      123 Market St, San Francisco, CA
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-[family-name:var(--font-bebas-neue)] text-lg text-[#1a1a1a] md:text-2xl">
                      INVOICE
                    </div>
                    <div className="text-[8px] text-[#1a1a1a]/40 md:text-[10px]">#1042</div>
                    <div className="text-[8px] text-[#1a1a1a]/40 md:text-[10px]">
                      Jan 15, 2026
                    </div>
                  </div>
                </div>
                {/* Bill to */}
                <div className="mb-4 md:mb-6">
                  <div className="mb-1 text-[7px] font-bold tracking-wider text-[#1a1a1a]/30 uppercase md:text-[9px]">
                    Bill To
                  </div>
                  <div className="text-[9px] font-medium text-[#1a1a1a] md:text-xs">
                    Jane Cooper
                  </div>
                  <div className="text-[8px] text-[#1a1a1a]/40 md:text-[10px]">
                    Cooper Studios LLC
                  </div>
                </div>
                {/* Line items */}
                <div className="mb-4 md:mb-6">
                  <div className="mb-1 grid grid-cols-12 border-b border-[#1a1a1a]/10 pb-1 text-[7px] font-bold tracking-wider text-[#1a1a1a]/30 uppercase md:text-[9px]">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  {[
                    { item: "Pro Plan", qty: "1", rate: "$15.00", amount: "$15.00" },
                    { item: "Extra Renders (500)", qty: "1", rate: "$8.00", amount: "$8.00" },
                    { item: "Priority Support", qty: "1", rate: "$5.00", amount: "$5.00" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 border-b border-dashed border-[#1a1a1a]/5 py-1.5 text-[8px] text-[#1a1a1a]/60 md:text-[10px]"
                    >
                      <div className="col-span-6">{row.item}</div>
                      <div className="col-span-2 text-right">{row.qty}</div>
                      <div className="col-span-2 text-right">{row.rate}</div>
                      <div className="col-span-2 text-right font-medium text-[#1a1a1a]">
                        {row.amount}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-36 space-y-1 md:w-48">
                    <div className="flex justify-between text-[8px] text-[#1a1a1a]/40 md:text-[10px]">
                      <span>Subtotal</span>
                      <span>$28.00</span>
                    </div>
                    <div className="flex justify-between text-[8px] text-[#1a1a1a]/40 md:text-[10px]">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-[#1a1a1a]/10 pt-1 text-[9px] font-bold text-[#1a1a1a] md:text-xs">
                      <span>Total</span>
                      <span>$28.00</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer bar */}
              <div className="bg-[#1a1a1a] px-5 py-2 md:px-8 md:py-3">
                <div className="flex items-center justify-between text-[7px] text-white/40 md:text-[9px]">
                  <span>Paid via Stripe &middot; Jan 15, 2026</span>
                  <span className="font-bold text-[#28c840]">PAID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "certificates",
    tag: "EDUCATION",
    title: "Certificates",
    headline: "Generate Certificates and Diplomas at Scale",
    subtitle:
      "Thousands of personalized certificates in minutes. HTML template + API call per recipient. No manual editing.",
    meta: {
      title: "Generate Certificates and Diplomas at Scale",
      description:
        "Generate personalized certificates, diplomas, and awards at scale. HTML template + API call per recipient. Thousands in minutes.",
    },
    problem: {
      heading: "Manual Certificate Creation Doesn't Scale",
      body: [
        "500 graduates means 500 manual edits in Canva or Photoshop. Each certificate needs the right name, date, course title, and instructor signature. One typo means starting over.",
        "There's no automation path in design tools. Export-to-PDF workflows are fragile. And when you need to regenerate a certificate because someone's name was misspelled, it's another manual round trip.",
      ],
    },
    solution: {
      heading: "Template Once, Generate Thousands",
      body: [
        "Design your certificate as an HTML template with placeholder variables for name, date, course, and any other dynamic field. Use CSS to match your exact brand — custom fonts, borders, seals, signatures.",
        "Loop through your recipient list and POST one request per person. HTMLPix renders each certificate as a high-resolution image. Thousands of personalized certificates generated in minutes, ready for email delivery or download.",
      ],
    },
    code: {
      filename: "certificates.ts",
      snippet: `const recipients = ["Alice Johnson", "Bob Smith", "Carol Lee"];

for (const name of recipients) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: { "Authorization": \`Bearer \${key}\` },
    body: JSON.stringify({
      html: \`<div style="width:1100px;height:800px;display:flex;
        flex-direction:column;align-items:center;justify-content:center;
        border:8px double #1a1a1a;padding:60px;background:white">
        <p style="letter-spacing:4px;color:#666">CERTIFICATE OF COMPLETION</p>
        <h1 style="font-size:48px;margin:20px 0">\${name}</h1>
        <p style="color:#666">Full-Stack Development — 2026</p>
      </div>\`,
      width: 1100, height: 800
    })
  });
  await Bun.write(\`cert-\${name.toLowerCase().replace(/ /g,"-")}.png\`,
    await res.arrayBuffer());
}`,
    },
    benefits: [
      {
        title: "Batch Thousands",
        description:
          "Generate certificates for entire graduating classes, conference attendees, or training cohorts in a single script run.",
      },
      {
        title: "Consistent Branding",
        description:
          "Every certificate uses the same template. Fonts, colors, layout, and logo placement are always correct.",
      },
      {
        title: "Instant Delivery",
        description:
          "Generate and email certificates immediately after course completion. No waiting for a designer.",
      },
      {
        title: "Dynamic Data",
        description:
          "Name, date, course title, instructor, score — any field can be injected per recipient.",
      },
    ],
    cta: {
      heading: "Start Generating Certificates",
      body: "50 free renders every month. Automate your certificate pipeline today.",
    },
    bg: "from-[#f5f0e8] to-[#ece5d8]",
    desc: "Generate thousands of personalized diplomas, awards, and badges. Just swap the name and date in your HTML template.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "app/api/certificate/route.ts",
          snippet: `import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, course, date } = await req.json();

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: { Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`, "Content-Type": "application/json" },
    body: JSON.stringify({
      html: \`<div style="width:1100px;height:800px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:8px double #1a1a1a;padding:60px;background:white">
        <p style="letter-spacing:4px;color:#666">CERTIFICATE OF COMPLETION</p>
        <h1 style="font-size:48px;margin:20px 0">\${name}</h1>
        <p style="color:#666">\${course} — \${date}</p>
      </div>\`,
      width: 1100, height: 800,
    }),
  });

  return new NextResponse(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png" },
  });
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "certificate.py",
          snippet: `import requests, os

def generate_certificate(name: str, course: str, date: str) -> bytes:
    html = f"""<div style="width:1100px;height:800px;display:flex;flex-direction:column;
      align-items:center;justify-content:center;border:8px double #1a1a1a;
      padding:60px;background:white">
      <p style="letter-spacing:4px;color:#666">CERTIFICATE OF COMPLETION</p>
      <h1 style="font-size:48px;margin:20px 0">{name}</h1>
      <p style="color:#666">{course} — {date}</p>
    </div>"""

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 1100, "height": 800},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "certificate.mjs",
          snippet: `async function generateCert(name, course, date) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:1100px;height:800px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:8px double #1a1a1a;padding:60px;background:white">
        <p style="letter-spacing:4px;color:#666">CERTIFICATE OF COMPLETION</p>
        <h1 style="font-size:48px;margin:20px 0">\${name}</h1>
        <p style="color:#666">\${course} — \${date}</p>
      </div>\`,
      width: 1100, height: 800,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "500 certificates = 500 manual edits in Canva/Photoshop. 1-2 minutes each. Name typos require full redo. 8-16 hours per batch.",
      withApi: "500 certificates = one script, ~2 minutes total. Typo fix = re-run one request. Fully automated from your student database.",
      savings: "~12 hours per certificate batch",
    },
    faq: [
      { question: "Can I use custom fonts for certificates?", answer: "Yes. Include Google Fonts or any web font via a <link> tag. HTMLPix waits for fonts to fully load before rendering." },
      { question: "What resolution works for printing?", answer: "Set deviceScaleFactor to 2 or 3 for high-DPI output. A 1100x800 certificate at 2x renders as 2200x1600 pixels — print-ready quality." },
      { question: "How do I handle special characters in names?", answer: "HTMLPix renders full Unicode. Names with accents, CJK characters, or RTL scripts render correctly as long as the font supports them." },
      { question: "Can I add signatures or seals?", answer: "Yes. Include signature images via <img> tags or use CSS to draw decorative borders, seals, and watermarks directly in your template." },
    ],
    preview: (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-1.5 text-[7px] tracking-[0.15em] text-[#1a1a1a]/40 uppercase">
          Certificate of
        </div>
        <div className="font-[family-name:var(--font-bebas-neue)] text-base text-[#1a1a1a]">
          Completion
        </div>
        <div className="mt-2 h-px w-16 bg-[#ff4d00]" />
        <div className="mt-2 text-[7px] text-[#1a1a1a]/30">Jane Doe — 2026</div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        {/* Certificate rendered output */}
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white p-2 shadow-sm md:p-3">
          <div
            className="relative flex aspect-[11/8] w-full flex-col items-center justify-center overflow-hidden"
            style={{ background: "#fffdf7" }}
          >
            {/* Ornamental double border */}
            <div className="pointer-events-none absolute inset-3 border-2 border-[#c9a96e]/30 md:inset-5" />
            <div className="pointer-events-none absolute inset-5 border border-[#c9a96e]/20 md:inset-7" />
            {/* Corner ornaments */}
            <div className="pointer-events-none absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-[#c9a96e]/40 md:top-6 md:left-6 md:h-8 md:w-8" />
            <div className="pointer-events-none absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-[#c9a96e]/40 md:top-6 md:right-6 md:h-8 md:w-8" />
            <div className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-[#c9a96e]/40 md:bottom-6 md:left-6 md:h-8 md:w-8" />
            <div className="pointer-events-none absolute right-4 bottom-4 h-6 w-6 border-r-2 border-b-2 border-[#c9a96e]/40 md:right-6 md:bottom-6 md:h-8 md:w-8" />

            <div className="relative z-10 flex flex-col items-center px-6 text-center">
              {/* Seal */}
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#c9a96e]/40 md:mb-4 md:h-12 md:w-12">
                <div className="h-4 w-4 rounded-full bg-[#c9a96e]/20 md:h-6 md:w-6" />
              </div>
              <div className="mb-1 text-[7px] font-bold tracking-[0.25em] text-[#c9a96e]/60 uppercase md:mb-2 md:text-[10px]">
                Certificate of Completion
              </div>
              <div className="mb-1 text-[7px] text-[#1a1a1a]/30 md:mb-2 md:text-[10px]">
                This is to certify that
              </div>
              <div className="mb-1 font-[family-name:var(--font-bebas-neue)] text-2xl text-[#1a1a1a] sm:text-3xl md:mb-3 md:text-5xl">
                Sarah Mitchell
              </div>
              <div className="mb-2 h-px w-32 bg-[#c9a96e]/30 md:mb-4 md:w-48" />
              <div className="mb-1 text-[8px] leading-relaxed text-[#1a1a1a]/40 md:mb-2 md:text-xs">
                has successfully completed the
              </div>
              <div className="mb-2 text-[9px] font-bold text-[#1a1a1a]/70 md:mb-4 md:text-sm">
                Full-Stack Development Bootcamp
              </div>
              <div className="flex w-full max-w-xs items-center justify-between px-4">
                <div className="text-center">
                  <div className="mb-0.5 h-px w-16 bg-[#1a1a1a]/10 md:w-20" />
                  <div className="text-[6px] text-[#1a1a1a]/30 md:text-[8px]">
                    Instructor
                  </div>
                </div>
                <div className="text-[7px] text-[#1a1a1a]/30 md:text-[9px]">
                  February 8, 2026
                </div>
                <div className="text-center">
                  <div className="mb-0.5 h-px w-16 bg-[#1a1a1a]/10 md:w-20" />
                  <div className="text-[6px] text-[#1a1a1a]/30 md:text-[8px]">
                    Director
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "email-banners",
    tag: "MARKETING",
    title: "Email Banners",
    headline: "Dynamic Email Banners That Work Everywhere",
    subtitle:
      "Image-based banners that render identically in every email client. No more Outlook CSS hacks.",
    meta: {
      title: "Dynamic Email Banners That Work Everywhere",
      description:
        "Generate dynamic email banners that render identically in every email client. No more Outlook CSS hacks. Image-based, pixel-perfect.",
    },
    problem: {
      heading: "Email HTML Rendering Is Broken",
      body: [
        "Outlook strips CSS gradients. Gmail ignores media queries. Yahoo Mail wraps your layout. Every email client has its own rendering engine, and none of them agree on how to display your banner.",
        "You end up maintaining a spreadsheet of CSS hacks, conditional comments for Outlook, and fallback images. Your banner looks different in every client, and testing across 30+ email apps is a time sink.",
      ],
    },
    solution: {
      heading: "Render as Image, Embed as <img>",
      body: [
        "Design your banner with full CSS — gradients, custom fonts, complex layouts, rounded corners. POST it to HTMLPix and get back a PNG or JPEG.",
        "Embed the resulting image as a simple <img> tag in your email. It looks identical in Outlook, Gmail, Apple Mail, and every other client. Generate different banners per campaign, segment, or A/B variant.",
      ],
    },
    code: {
      filename: "email-banner.sh",
      snippet: `curl -X POST https://api.htmlpix.com/render \\
  -H "Authorization: Bearer $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<div style=\\"width:600px;height:200px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33);border-radius:8px\\"><div style=\\"text-align:center;color:white\\"><h2 style=\\"margin:0;font-size:28px\\">Flash Sale — 50% Off</h2><p style=\\"margin:8px 0 0;opacity:0.8\\">Use code SAVE50 at checkout</p></div></div>",
    "width": 600,
    "height": 200
  }' --output banner.png`,
    },
    benefits: [
      {
        title: "Universal Rendering",
        description:
          "An <img> tag works everywhere. Outlook, Gmail, Apple Mail, Yahoo — your banner looks identical in all of them.",
      },
      {
        title: "Dynamic Per Campaign",
        description:
          "Generate unique banners for each campaign, promotion, or audience segment. Change copy and visuals per send.",
      },
      {
        title: "A/B Testable",
        description:
          "Generate multiple banner variants and split-test them. Measure which design drives more opens and clicks.",
      },
      {
        title: "No CSS Hacks",
        description:
          "Stop maintaining Outlook conditional comments and Gmail-specific overrides. The image just works.",
      },
    ],
    cta: {
      heading: "Start Generating Email Banners",
      body: "50 free renders every month. Email banners that work everywhere, starting now.",
    },
    bg: "from-[#1a1a1a] to-[#2d2d2d]",
    desc: "Dynamic headers that look identical in every email client. No more rendering bugs.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "lib/emailBanner.ts",
          snippet: `export async function generateBanner(headline: string, subtext: string) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:200px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33);border-radius:8px">
        <div style="text-align:center;color:white">
          <h2 style="margin:0;font-size:28px">\${headline}</h2>
          <p style="margin:8px 0 0;opacity:0.8">\${subtext}</p>
        </div>
      </div>\`,
      width: 600, height: 200,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "email_banner.py",
          snippet: `import requests, os

def generate_banner(headline: str, subtext: str) -> bytes:
    html = f"""<div style="width:600px;height:200px;display:flex;align-items:center;
      justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33);
      border-radius:8px">
      <div style="text-align:center;color:white">
        <h2 style="margin:0;font-size:28px">{headline}</h2>
        <p style="margin:8px 0 0;opacity:0.8">{subtext}</p>
      </div>
    </div>"""

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 600, "height": 200},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "emailBanner.mjs",
          snippet: `async function generateBanner(headline, subtext) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:200px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ff4d00,#ff6a33);border-radius:8px">
        <div style="text-align:center;color:white">
          <h2 style="margin:0;font-size:28px">\${headline}</h2>
          <p style="margin:8px 0 0;opacity:0.8">\${subtext}</p>
        </div>
      </div>\`,
      width: 600, height: 200,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Hours testing CSS across 30+ email clients. Conditional comments for Outlook. Gmail-specific overrides. Banner redesign for every campaign.",
      withApi: "Design once with full CSS, render as image. Works in every email client. Generate unique banners per campaign in seconds.",
      savings: "~8 hours/month on email CSS",
    },
    faq: [
      { question: "Will my banner look the same in Outlook?", answer: "Yes. Since the banner is rendered as an image and embedded via an <img> tag, it bypasses all email client rendering quirks. Identical in Outlook, Gmail, Apple Mail, and Yahoo." },
      { question: "What's the recommended banner size?", answer: "600px wide is the email standard. Height varies by design — 150-250px is typical for headers. HTMLPix renders any dimension you specify." },
      { question: "Can I use CSS gradients and rounded corners?", answer: "Yes. HTMLPix renders full CSS including gradients, border-radius, box-shadow, and custom fonts. The image captures exactly what a browser would display." },
      { question: "How do I embed the banner in my email?", answer: "Host the rendered image (or use HTMLPix image storage) and reference it with a standard <img> tag in your email HTML. All email clients support <img>." },
    ],
    preview: (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
        <div className="w-full rounded bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] px-3 py-2.5 text-center text-[9px] font-bold tracking-wider text-white uppercase">
          Flash Sale — 50% Off
        </div>
        <div className="flex w-full gap-1">
          <div className="h-1 flex-1 rounded-full bg-white/10" />
          <div className="h-1 flex-1 rounded-full bg-white/10" />
          <div className="h-1 flex-1 rounded-full bg-white/10" />
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-lg">
        {/* Email client context */}
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="border-b border-[#1a1a1a]/10 bg-[#fafafa] px-4 py-2.5">
            <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40">
              <span className="font-bold text-[#1a1a1a]/60">From:</span> deals@coolstore.com
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40">
              <span className="font-bold text-[#1a1a1a]/60">Subject:</span>{" "}
              <span className="text-[#1a1a1a]/60">This weekend only: 50% off everything</span>
            </div>
          </div>
          <div className="p-4 md:p-6">
            {/* The actual banner image */}
            <div
              className="relative flex aspect-[600/200] w-full items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #ff4d00 0%, #ff6a33 40%, #ff8a5c 100%)",
              }}
            >
              {/* Decorative shapes */}
              <div className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/[0.06]" />
              <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/[0.08]" />
              <div className="pointer-events-none absolute top-1/2 left-1/4 h-16 w-16 -translate-y-1/2 rotate-45 bg-white/[0.03]" />

              <div className="relative z-10 text-center px-4">
                <div className="mb-0.5 text-[7px] font-bold tracking-[0.2em] text-white/60 uppercase md:mb-1 md:text-[10px]">
                  This Weekend Only
                </div>
                <div className="mb-1 font-[family-name:var(--font-bebas-neue)] text-2xl text-white md:mb-2 md:text-5xl">
                  50% OFF EVERYTHING
                </div>
                <div className="mx-auto inline-block border border-white/30 px-3 py-0.5 text-[7px] font-bold tracking-wider text-white md:px-4 md:py-1 md:text-[10px]">
                  USE CODE: SAVE50
                </div>
              </div>
            </div>
            {/* Email body text */}
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded bg-[#1a1a1a]/5" />
              <div className="h-2 w-4/5 rounded bg-[#1a1a1a]/5" />
              <div className="h-2 w-3/5 rounded bg-[#1a1a1a]/5" />
            </div>
            <div className="mt-4 flex justify-center">
              <div className="rounded bg-[#ff4d00] px-6 py-1.5 text-[9px] font-bold tracking-wider text-white uppercase md:text-xs">
                Shop Now
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "charts-and-reports",
    tag: "DATA",
    title: "Charts & Reports",
    headline: "Turn Data Visualizations Into Shareable Images",
    subtitle:
      "Render Chart.js, D3, and HTML visualizations into PNG images. Drop into Slack, PDFs, and emails via API.",
    meta: {
      title: "Turn Data Visualizations Into Shareable Images",
      description:
        "Convert Chart.js, D3, and HTML visualizations into shareable PNG images. Drop into Slack, PDFs, and emails via API.",
    },
    problem: {
      heading: "Charts Live in the DOM, Not in Your Reports",
      body: [
        "Chart.js and D3 output live DOM elements — canvases and SVGs that exist in a browser tab. You can't paste a <canvas> into Slack, embed it in a PDF, or drop it into an email digest.",
        "Screenshot tools are manual and unreliable. Headless browser scripts require infrastructure. Your weekly report automation breaks every time Chrome updates or a dependency changes.",
      ],
    },
    solution: {
      heading: "HTML Chart In, PNG Out",
      body: [
        "Write your chart as a standalone HTML page — include Chart.js or D3 via CDN, configure your data, set your dimensions. POST the HTML to HTMLPix.",
        "We render it in a real browser, wait for the chart library to finish drawing, and return a crisp PNG. Drop it into Slack messages, PDF reports, email digests, or dashboards. Automate it on a cron schedule for recurring reports.",
      ],
    },
    code: {
      filename: "chart.sh",
      snippet: `curl -X POST https://api.htmlpix.com/render \\
  -H "Authorization: Bearer $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<!DOCTYPE html><html><head><script src=\\"https://cdn.jsdelivr.net/npm/chart.js\\"></script></head><body><canvas id=\\"c\\" width=\\"800\\" height=\\"400\\"></canvas><script>new Chart(document.getElementById(\\\"c\\\"),{type:\\\"bar\\\",data:{labels:[\\\"Mon\\\",\\\"Tue\\\",\\\"Wed\\\",\\\"Thu\\\",\\\"Fri\\\"],datasets:[{label:\\\"Renders\\\",data:[120,190,300,250,420],backgroundColor:\\\"#ff4d00\\\"}]}});</script></body></html>",
    "width": 800,
    "height": 400
  }' --output chart.png`,
    },
    benefits: [
      {
        title: "Slack & PDF Ready",
        description:
          "Drop chart images directly into Slack channels, PDF reports, or email digests. No screenshot tools needed.",
      },
      {
        title: "Automated Reporting",
        description:
          "Generate chart images on a cron schedule. Daily, weekly, or monthly reports with fresh data, fully automated.",
      },
      {
        title: "No Screenshot Tools",
        description:
          "Stop asking teammates to 'screenshot the dashboard.' The API generates consistent, high-quality images every time.",
      },
      {
        title: "Consistent Styling",
        description:
          "Same chart config, same output. No variation between screenshots taken on different screens or browsers.",
      },
    ],
    cta: {
      heading: "Start Generating Chart Images",
      body: "50 free renders every month. Turn your dashboards into shareable images today.",
    },
    bg: "from-[#1a1a1a] to-[#2a2a2a]",
    desc: "Turn D3 or Chart.js visualizations into static images you can drop into Slack, PDFs, or emails.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "lib/chartImage.ts",
          snippet: `export async function renderChart(data: number[], labels: string[]) {
  const chartConfig = JSON.stringify({
    type: "bar",
    data: { labels, datasets: [{ label: "Renders", data, backgroundColor: "#ff4d00" }] },
  });

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></head><body><canvas id="c" width="800" height="400"></canvas><script>new Chart(document.getElementById("c"), \${chartConfig});</script></body></html>\`,
      width: 800, height: 400,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "chart_image.py",
          snippet: `import requests, os, json

def render_chart(data: list, labels: list) -> bytes:
    config = json.dumps({
        "type": "bar",
        "data": {"labels": labels, "datasets": [{"label": "Renders", "data": data, "backgroundColor": "#ff4d00"}]},
    })
    html = f'<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></head><body><canvas id="c" width="800" height="400"></canvas><script>new Chart(document.getElementById("c"), {config});</script></body></html>'

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 800, "height": 400},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "chartImage.mjs",
          snippet: `async function renderChart(data, labels) {
  const config = JSON.stringify({
    type: "bar",
    data: { labels, datasets: [{ label: "Renders", data, backgroundColor: "#ff4d00" }] },
  });

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<!DOCTYPE html><html><head><script src="https://cdn.jsdelivr.net/npm/chart.js"></script></head><body><canvas id="c" width="800" height="400"></canvas><script>new Chart(document.getElementById("c"), \${config});</script></body></html>\`,
      width: 800, height: 400,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Manual screenshots of dashboards. Inconsistent quality, wrong dimensions, missing data. Relies on someone being online to capture.",
      withApi: "Automated chart rendering on a cron schedule. Consistent dimensions, fresh data, no human needed. Drop into Slack/PDF/email automatically.",
      savings: "~6 hours/month on reporting",
    },
    faq: [
      { question: "Does HTMLPix wait for Chart.js to finish rendering?", answer: "Yes. HTMLPix waits for the page to reach a stable state, including JavaScript execution. Chart.js animations complete before the screenshot is taken." },
      { question: "Can I use D3.js instead of Chart.js?", answer: "Yes. Include any JavaScript charting library via CDN. D3, Chart.js, ECharts, Plotly — anything that renders in a browser works." },
      { question: "What about interactive charts?", answer: "HTMLPix captures a static snapshot. Hover states and tooltips won't appear unless you trigger them via JavaScript in your HTML before the screenshot." },
      { question: "Can I render charts on a schedule?", answer: "Yes. Call the API from a cron job, GitHub Action, or scheduled Lambda function. Generate fresh chart images daily, weekly, or at any interval." },
    ],
    preview: (
      <div className="flex h-full items-end gap-1 p-4 pb-3">
        {[40, 65, 45, 80, 55, 70, 50].map((h, j) => (
          <div
            key={j}
            className="flex-1 rounded-t"
            style={{
              height: `${h}%`,
              background: j === 3 ? "#ff4d00" : "rgba(255,77,0,0.35)",
            }}
          />
        ))}
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        {/* Slack message context */}
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="border-b border-[#1a1a1a]/10 bg-[#fafafa] px-4 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1a1a1a]/60">
              <span className="text-[#1a1a1a]/30">#</span> engineering-metrics
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 h-7 w-7 shrink-0 rounded bg-[#4A154B]">
                <div className="flex h-full items-center justify-center text-[8px] font-bold text-white">
                  Bot
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#1a1a1a]">
                    Metrics Bot
                  </span>
                  <span className="rounded bg-[#1a1a1a]/5 px-1 py-0.5 text-[8px] text-[#1a1a1a]/40">
                    APP
                  </span>
                  <span className="text-[9px] text-[#1a1a1a]/30">9:00 AM</span>
                </div>
                <p className="mb-2 text-[11px] text-[#1a1a1a]/70">
                  Weekly API performance report — Feb 3-8, 2026
                </p>
                {/* The actual chart image */}
                <div className="overflow-hidden rounded border border-[#1a1a1a]/10 bg-[#1a1a1a]">
                  <div className="px-4 pt-4 pb-2 md:px-6 md:pt-6 md:pb-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-white/80 md:text-xs">
                        API Renders — Weekly
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-3 rounded-sm bg-[#ff4d00]" />
                          <span className="text-[7px] text-white/40 md:text-[9px]">
                            This week
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-3 rounded-sm bg-white/15" />
                          <span className="text-[7px] text-white/40 md:text-[9px]">
                            Last week
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-1 text-[8px] text-white/30 md:text-[10px]">
                      Total: 4,230 renders &middot; Avg latency: 142ms
                    </div>
                  </div>
                  {/* Chart area */}
                  <div className="relative px-4 pb-4 md:px-6 md:pb-6">
                    {/* Y-axis labels */}
                    <div className="absolute left-4 top-0 bottom-4 flex flex-col justify-between text-[6px] text-white/20 md:left-6 md:text-[8px]">
                      <span>800</span>
                      <span>600</span>
                      <span>400</span>
                      <span>200</span>
                      <span>0</span>
                    </div>
                    {/* Grid lines */}
                    <div className="ml-6 space-y-0 md:ml-8">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border-b border-white/5"
                          style={{ height: "24px" }}
                        />
                      ))}
                      {/* Bars */}
                      <div className="flex items-end gap-1 pt-0 md:gap-2" style={{ height: "96px", marginTop: "-96px" }}>
                        {[
                          { cur: 55, prev: 40 },
                          { cur: 72, prev: 58 },
                          { cur: 45, prev: 52 },
                          { cur: 88, prev: 65 },
                          { cur: 68, prev: 48 },
                        ].map((d, i) => (
                          <div key={i} className="flex flex-1 items-end justify-center gap-0.5">
                            <div
                              className="w-2 rounded-t bg-white/15 md:w-3"
                              style={{ height: `${d.prev}%` }}
                            />
                            <div
                              className="w-2 rounded-t bg-[#ff4d00] md:w-3"
                              style={{ height: `${d.cur}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* X-axis labels */}
                    <div className="ml-6 mt-1 flex justify-between text-[6px] text-white/20 md:ml-8 md:text-[8px]">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "website-screenshots",
    tag: "AUTOMATION",
    title: "Website Screenshots",
    headline: "Capture Any URL as a Pixel-Perfect Image",
    subtitle:
      "Automated website screenshots via API. Monitor visual changes, generate link previews, and archive pages — no browser infrastructure required.",
    meta: {
      title: "Screenshot API — Capture Any Website as an Image",
      description:
        "Capture pixel-perfect website screenshots via API. Automate visual monitoring, link previews, and page archival. No Puppeteer infrastructure required.",
    },
    problem: {
      heading: "Screenshots Are Manual and Fragile",
      body: [
        "Taking website screenshots means spinning up headless Chrome, navigating to a URL, waiting for assets to load, and capturing the viewport. It works on your machine until Chrome auto-updates and your Docker image breaks.",
        "Self-hosted screenshot pipelines require constant maintenance: memory limits for long pages, timeouts for slow sites, proxy rotation for geo-specific captures. It's infrastructure overhead for what should be a simple GET-to-image operation.",
      ],
    },
    solution: {
      heading: "URL In, Screenshot Out",
      body: [
        "Pass any URL to HTMLPix with your desired viewport dimensions. We navigate to the page, wait for full render (including lazy-loaded images and web fonts), and return a crisp PNG or JPEG.",
        "Use it for visual regression monitoring, link preview generation, SEO auditing, or compliance archival. Capture full pages or above-the-fold viewports. Schedule captures on a cron or trigger them from webhooks.",
      ],
    },
    code: {
      filename: "screenshot.sh",
      snippet: `curl -X POST https://api.htmlpix.com/render \\
  -H "Authorization: Bearer $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<!DOCTYPE html><html><head><meta http-equiv=\\"refresh\\" content=\\"0;url=https://example.com\\"></head><body></body></html>",
    "width": 1440,
    "height": 900
  }' --output screenshot.png`,
    },
    benefits: [
      {
        title: "Visual Monitoring",
        description:
          "Capture screenshots on a schedule and diff them. Detect layout regressions, broken assets, or unauthorized changes automatically.",
      },
      {
        title: "Link Preview Generation",
        description:
          "Generate thumbnail previews for any URL shared in your app. Rich link cards for chat apps, CMS dashboards, or bookmark tools.",
      },
      {
        title: "Compliance Archival",
        description:
          "Capture and store dated screenshots for regulatory or legal compliance. Immutable visual records of any web page.",
      },
      {
        title: "Zero Infrastructure",
        description:
          "No headless Chrome to maintain. No proxy rotation. No memory tuning. Send a URL, get an image back.",
      },
    ],
    cta: {
      heading: "Start Capturing Screenshots",
      body: "50 free renders every month. Automate your screenshot pipeline today.",
    },
    bg: "from-[#0f172a] to-[#1e293b]",
    desc: "Capture any URL as a pixel-perfect image. Visual monitoring, link previews, and page archival via API.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "app/api/screenshot/route.ts",
          snippet: `import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url") ?? "https://example.com";

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=\${url}"></head><body></body></html>\`,
      width: 1440, height: 900,
    }),
  });

  return new NextResponse(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png" },
  });
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "screenshot.py",
          snippet: `import requests, os

def capture_screenshot(url: str, width=1440, height=900) -> bytes:
    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={
            "html": f'<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url={url}"></head><body></body></html>',
            "width": width,
            "height": height,
        },
    )
    res.raise_for_status()
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "screenshot.mjs",
          snippet: `async function captureScreenshot(url, width = 1440, height = 900) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=\${url}"></head><body></body></html>\`,
      width, height,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Self-hosted Puppeteer screenshot service: 8-16 hours setup, ongoing Chrome updates, memory/timeout tuning. $100-300/mo infrastructure for reliable captures.",
      withApi: "One API call per screenshot. No browser pool to manage. Handles timeouts, retries, and rendering automatically.",
      savings: "~15 engineering hours/month",
    },
    faq: [
      { question: "Can I capture full-page screenshots?", answer: "Yes. Set the height to match the full page content, or omit the height to let HTMLPix capture the complete scrollable area." },
      { question: "How does HTMLPix handle slow-loading sites?", answer: "HTMLPix waits for network idle — all assets, fonts, and lazy-loaded images finish loading before the screenshot is captured. You can also configure custom timeout values." },
      { question: "Can I capture pages behind authentication?", answer: "For pages requiring login, render the HTML directly with your data injected. For public URLs, simply pass the URL and HTMLPix navigates to it." },
      { question: "What viewport sizes are supported?", answer: "Any width and height. Common choices: 1440x900 (desktop), 768x1024 (tablet), 375x812 (mobile). Specify per request." },
    ],
    preview: (
      <div className="flex h-full flex-col p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          <div className="ml-2 h-3 flex-1 rounded-sm bg-white/10" />
        </div>
        <div className="flex-1 rounded-sm bg-white/5 p-2">
          <div className="mb-1.5 h-1.5 w-12 rounded bg-white/15" />
          <div className="mb-1 h-1 w-full rounded bg-white/8" />
          <div className="mb-1 h-1 w-4/5 rounded bg-white/8" />
          <div className="h-1 w-3/5 rounded bg-white/8" />
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="border-b border-[#1a1a1a]/10 bg-[#fafafa] px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 rounded bg-[#1a1a1a]/5 px-3 py-1 text-center text-[9px] text-[#1a1a1a]/40">
                https://example.com
              </div>
            </div>
          </div>
          <div className="relative aspect-[1440/900] w-full overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
            <div className="p-4 md:p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[#ff4d00] md:h-8 md:w-8" />
                <div className="h-3 w-20 rounded bg-white/20 md:h-4 md:w-28" />
                <div className="ml-auto flex gap-3">
                  <div className="h-2 w-10 rounded bg-white/10 md:h-3 md:w-14" />
                  <div className="h-2 w-10 rounded bg-white/10 md:h-3 md:w-14" />
                  <div className="h-2 w-10 rounded bg-white/10 md:h-3 md:w-14" />
                </div>
              </div>
              <div className="mx-auto mt-8 max-w-md text-center md:mt-12">
                <div className="mx-auto mb-3 h-4 w-3/4 rounded bg-white/20 md:mb-4 md:h-6" />
                <div className="mx-auto mb-2 h-2 w-full rounded bg-white/10 md:h-3" />
                <div className="mx-auto mb-6 h-2 w-2/3 rounded bg-white/10 md:mb-8 md:h-3" />
                <div className="mx-auto h-6 w-24 rounded bg-[#ff4d00] md:h-8 md:w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "ecommerce-product-images",
    tag: "E-COMMERCE",
    title: "Product Images",
    headline: "Dynamic Product Images From HTML Templates",
    subtitle:
      "Generate product cards with price badges, discount overlays, and promotional banners — directly from your catalog data.",
    meta: {
      title: "Dynamic Product Images From HTML Templates",
      description:
        "Generate dynamic e-commerce product images with price badges, discount overlays, and promo banners from HTML templates via API.",
    },
    problem: {
      heading: "Product Images Don't Update Themselves",
      body: [
        "Your catalog has 10,000 SKUs. Prices change weekly. Flash sales need promotional overlays. Seasonal campaigns need new badge designs. Your design team can't manually create and update images for every product variation.",
        "Static product photography doesn't include dynamic pricing, stock badges, or personalized recommendations. You need images that combine your product photos with live data — price, discount percentage, 'Only 3 left' badges — generated on the fly.",
      ],
    },
    solution: {
      heading: "Template + Catalog Data = Product Cards",
      body: [
        "Design your product card as an HTML template — product image, title, price, discount badge, rating stars. Inject data from your catalog per request. POST to HTMLPix and get back a crisp image.",
        "Use these images for email campaigns, social ads, marketplace listings, or your own storefront. Update prices, badges, and promotions without touching a design tool. Generate thousands of product cards from a single template.",
      ],
    },
    code: {
      filename: "product-card.ts",
      snippet: `const card = await fetch("https://api.htmlpix.com/render", {
  method: "POST",
  headers: { "Authorization": \`Bearer \${key}\` },
  body: JSON.stringify({
    html: \`<div style="width:600px;height:600px;position:relative;background:white;font-family:system-ui">
      <img src="\${product.imageUrl}" style="width:100%;height:400px;object-fit:cover" />
      <div style="padding:20px">
        <h2 style="margin:0;font-size:20px">\${product.name}</h2>
        <div style="margin-top:8px;font-size:24px;font-weight:bold;color:#ff4d00">
          $\${product.price}
        </div>
      </div>
      \${product.discount ? \`<div style="position:absolute;top:16px;right:16px;background:#ff4d00;color:white;padding:6px 12px;font-weight:bold;font-size:14px">-\${product.discount}%</div>\` : ""}
    </div>\`,
    width: 600, height: 600
  })
});`,
    },
    benefits: [
      {
        title: "Live Pricing Overlays",
        description:
          "Inject current prices, discount percentages, and promo codes directly into product images. Always accurate, always up to date.",
      },
      {
        title: "Batch Generation",
        description:
          "Generate images for your entire catalog from a single template. Loop through SKUs, POST per product, done in minutes.",
      },
      {
        title: "Multi-Channel Ready",
        description:
          "Same template, different outputs. Email campaigns, social ads, marketplace listings, push notifications — one API per channel.",
      },
      {
        title: "A/B Test Layouts",
        description:
          "Swap badge colors, layout styles, or CTA text per variant. Measure which product card design drives more conversions.",
      },
    ],
    cta: {
      heading: "Start Generating Product Images",
      body: "50 free renders every month. Dynamic product cards from your catalog data.",
    },
    bg: "from-[#fef3c7] to-[#fde68a]",
    desc: "Generate product cards with price badges, discount overlays, and promo banners from your catalog data.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "lib/productCard.ts",
          snippet: `interface Product { name: string; price: number; imageUrl: string; discount?: number }

export async function generateProductCard(product: Product) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:600px;position:relative;background:white">
        <img src="\${product.imageUrl}" style="width:100%;height:400px;object-fit:cover"/>
        <div style="padding:20px"><h2>\${product.name}</h2>
        <div style="font-size:24px;color:#ff4d00;font-weight:bold">$\${product.price}</div></div>
        \${product.discount ? \`<div style="position:absolute;top:16px;right:16px;background:#ff4d00;color:white;padding:6px 12px;font-weight:bold">-\${product.discount}%</div>\` : ""}
      </div>\`,
      width: 600, height: 600,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "product_card.py",
          snippet: `import requests, os

def generate_product_card(name: str, price: float, image_url: str, discount: int = 0) -> bytes:
    badge = f'<div style="position:absolute;top:16px;right:16px;background:#ff4d00;color:white;padding:6px 12px;font-weight:bold">-{discount}%</div>' if discount else ""
    html = f"""<div style="width:600px;height:600px;position:relative;background:white">
      <img src="{image_url}" style="width:100%;height:400px;object-fit:cover"/>
      <div style="padding:20px"><h2>{name}</h2>
      <div style="font-size:24px;color:#ff4d00;font-weight:bold">\${price:.2f}</div></div>
      \${badge}</div>"""

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 600, "height": 600},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "productCard.mjs",
          snippet: `async function generateProductCard({ name, price, imageUrl, discount }) {
  const badge = discount
    ? \`<div style="position:absolute;top:16px;right:16px;background:#ff4d00;color:white;padding:6px 12px;font-weight:bold">-\${discount}%</div>\`
    : "";

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:600px;position:relative;background:white">
        <img src="\${imageUrl}" style="width:100%;height:400px;object-fit:cover"/>
        <div style="padding:20px"><h2>\${name}</h2>
        <div style="font-size:24px;color:#ff4d00;font-weight:bold">$\${price}</div></div>
        \${badge}</div>\`,
      width: 600, height: 600,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Designer creates product card mockups manually. 5-15 min per SKU. Catalog of 1,000 products = weeks of work. Price changes require re-export.",
      withApi: "One script generates all 1,000 product cards in minutes. Price updates trigger automatic re-generation. Zero design queue.",
      savings: "~40 design hours per catalog update",
    },
    faq: [
      { question: "Can I include product photos from external URLs?", answer: "Yes. Use <img> tags with your CDN URLs. HTMLPix fetches and renders remote images as part of the screenshot." },
      { question: "How do I handle different product card sizes?", answer: "Pass width and height per request. Use 600x600 for Instagram, 1200x628 for Facebook ads, 800x800 for marketplace listings." },
      { question: "Can I add dynamic discount badges?", answer: "Yes. Use conditional HTML — include or exclude badge elements based on your product data. Template logic lives in your code, not in a design tool." },
      { question: "What about product images with transparent backgrounds?", answer: "Use PNG format for transparency support. Product photos with alpha channels render correctly in the output image." },
    ],
    preview: (
      <div className="flex h-full flex-col p-3">
        <div className="relative flex-1 rounded-sm bg-[#1a1a1a]/10">
          <div className="absolute top-1.5 right-1.5 rounded-sm bg-[#ff4d00] px-1.5 py-0.5 text-[7px] font-bold text-white">
            -30%
          </div>
        </div>
        <div className="mt-2">
          <div className="text-[8px] font-bold text-[#1a1a1a]">Wireless Headphones</div>
          <div className="text-[10px] font-bold text-[#ff4d00]">$79.99</div>
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {[
            { name: "Wireless Headphones", price: "$79.99", discount: "-30%", color: "#f0f0f0" },
            { name: "Smart Watch Pro", price: "$199.00", discount: "-20%", color: "#e8e8e8" },
          ].map((item, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
              <div className="relative aspect-square" style={{ background: item.color }}>
                <div className="absolute top-2 right-2 rounded bg-[#ff4d00] px-2 py-1 text-[9px] font-bold text-white md:text-xs">
                  {item.discount}
                </div>
                <div className="flex h-full items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#1a1a1a]/10 md:h-24 md:w-24" />
                </div>
              </div>
              <div className="p-3 md:p-4">
                <div className="text-[10px] font-bold text-[#1a1a1a] md:text-sm">{item.name}</div>
                <div className="mt-1 text-sm font-bold text-[#ff4d00] md:text-lg">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    slug: "personalized-marketing",
    tag: "MARKETING",
    title: "Personalized Images",
    headline: "Personalized Marketing Images at Scale",
    subtitle:
      "Per-recipient images with name, offer, and countdown. Generated dynamically for email campaigns, retargeting ads, and push notifications.",
    meta: {
      title: "Personalized Marketing Images at Scale",
      description:
        "Generate personalized marketing images with recipient name, custom offers, and countdown timers. Dynamic image generation for email, ads, and push.",
    },
    problem: {
      heading: "Generic Images Don't Convert",
      body: [
        "Your email blasts show the same hero image to every recipient. Your retargeting ads use one generic banner for all segments. Personalization stops at the subject line because generating unique images per user seems impossible.",
        "Design tools can't template at the individual level. You'd need to create thousands of image variations — one per recipient, per offer, per countdown — and that's not feasible manually.",
      ],
    },
    solution: {
      heading: "One Template, One Image Per Recipient",
      body: [
        "Build your marketing image as an HTML template with variables: recipient name, discount amount, product recommendation, countdown timer. POST once per recipient with their data.",
        "HTMLPix renders a unique, personalized image for each person on your list. Embed in emails, serve as dynamic ad creatives, or push to notification payloads. Higher engagement, higher conversion, fully automated.",
      ],
    },
    code: {
      filename: "personalized.ts",
      snippet: `const recipients = [
  { name: "Sarah", offer: "25% off", product: "Pro Plan" },
  { name: "James", offer: "Free trial", product: "Starter" },
];

for (const r of recipients) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: { "Authorization": \`Bearer \${key}\` },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:300px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a1a,#333);padding:40px">
        <div style="color:white;text-align:center">
          <p style="font-size:16px;opacity:0.7">Hey \${r.name},</p>
          <h1 style="font-size:36px;margin:8px 0">\${r.offer}</h1>
          <p style="font-size:14px;opacity:0.5">on \${r.product}</p>
        </div>
      </div>\`,
      width: 600, height: 300
    })
  });
  await Bun.write(\`banner-\${r.name.toLowerCase()}.png\`, await res.arrayBuffer());
}`,
    },
    benefits: [
      {
        title: "Per-Recipient Personalization",
        description:
          "Each image includes the recipient's name, custom offer, and product recommendation. Not segments — individuals.",
      },
      {
        title: "Higher Engagement",
        description:
          "Personalized images in emails see 2-3x higher click-through rates. Visual personalization stands out in crowded inboxes.",
      },
      {
        title: "Dynamic Countdowns",
        description:
          "Include expiration timers rendered at generation time. Create urgency with 'Offer expires in 48 hours' banners.",
      },
      {
        title: "Multi-Channel",
        description:
          "Same template works for email banners, social ad creatives, push notification images, and landing page heroes.",
      },
    ],
    cta: {
      heading: "Start Personalizing Images",
      body: "50 free renders every month. One unique image per recipient, starting now.",
    },
    bg: "from-[#7c3aed] to-[#a78bfa]",
    desc: "Per-recipient images with name, offer, and countdown. Dynamic image generation for email, ads, and push.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "lib/personalizedImage.ts",
          snippet: `interface Recipient { name: string; offer: string; product: string }

export async function generatePersonalizedImage(r: Recipient) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:300px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a1a,#333);padding:40px">
        <div style="color:white;text-align:center">
          <p style="font-size:16px;opacity:0.7">Hey \${r.name},</p>
          <h1 style="font-size:36px;margin:8px 0">\${r.offer}</h1>
          <p style="font-size:14px;opacity:0.5">on \${r.product}</p>
        </div>
      </div>\`,
      width: 600, height: 300,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "personalized.py",
          snippet: `import requests, os

def generate_personalized(name: str, offer: str, product: str) -> bytes:
    html = f"""<div style="width:600px;height:300px;display:flex;align-items:center;
      justify-content:center;background:linear-gradient(135deg,#1a1a1a,#333);padding:40px">
      <div style="color:white;text-align:center">
        <p style="font-size:16px;opacity:0.7">Hey {name},</p>
        <h1 style="font-size:36px;margin:8px 0">{offer}</h1>
        <p style="font-size:14px;opacity:0.5">on {product}</p>
      </div>
    </div>"""

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 600, "height": 300},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "personalized.mjs",
          snippet: `async function generatePersonalized({ name, offer, product }) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:600px;height:300px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a1a,#333);padding:40px">
        <div style="color:white;text-align:center">
          <p style="font-size:16px;opacity:0.7">Hey \${name},</p>
          <h1 style="font-size:36px;margin:8px 0">\${offer}</h1>
          <p style="font-size:14px;opacity:0.5">on \${product}</p>
        </div>
      </div>\`,
      width: 600, height: 300,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Generic images for all recipients. No personalization beyond merge tags in text. Design team creates 2-3 variants max per campaign.",
      withApi: "Unique image per recipient. Thousands of personalized images generated in minutes. Zero design involvement per send.",
      savings: "~20 hours/month + higher conversions",
    },
    faq: [
      { question: "How many personalized images can I generate at once?", answer: "There's no batch limit. Loop through your recipient list and POST one request per person. The API handles concurrency — generate thousands in parallel." },
      { question: "Can I include countdown timers?", answer: "Yes. Calculate the remaining time in your code and render it as HTML text. The image captures the countdown value at generation time." },
      { question: "Do personalized images work in email?", answer: "Yes. Embed the generated image with an <img> tag. Since it's a standard image, it renders identically in every email client." },
      { question: "Can I personalize with product recommendations?", answer: "Yes. Include product images, names, and prices from your recommendation engine. Each recipient sees their own suggested products in the image." },
    ],
    preview: (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="text-[7px] text-white/50">Hey Sarah,</div>
          <div className="my-1 font-[family-name:var(--font-bebas-neue)] text-lg text-white">
            25% OFF
          </div>
          <div className="text-[7px] text-white/30">on Pro Plan</div>
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="border-b border-[#1a1a1a]/10 bg-[#fafafa] px-4 py-2.5">
            <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40">
              <span className="font-bold text-[#1a1a1a]/60">From:</span> offers@yourapp.com
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40">
              <span className="font-bold text-[#1a1a1a]/60">Subject:</span> Sarah, your exclusive offer is waiting
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="relative flex aspect-[600/300] w-full items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a1a, #333)" }}>
              <div className="relative z-10 text-center px-6">
                <div className="text-[9px] text-white/50 md:text-sm">Hey Sarah,</div>
                <div className="my-1 font-[family-name:var(--font-bebas-neue)] text-3xl text-white md:my-2 md:text-5xl">
                  25% OFF
                </div>
                <div className="text-[9px] text-white/40 md:text-sm">on Pro Plan — expires in 48h</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded bg-[#1a1a1a]/5" />
              <div className="h-2 w-3/4 rounded bg-[#1a1a1a]/5" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "blog-featured-images",
    tag: "CONTENT",
    title: "Blog Featured Images",
    headline: "Auto-Generate Blog Featured Images From Metadata",
    subtitle:
      "Consistent, branded hero images for every blog post. Generated automatically from title, category, and author — no designer needed.",
    meta: {
      title: "Auto-Generate Blog Featured Images",
      description:
        "Automatically generate branded blog featured images from post title and category. CMS webhook triggers, consistent design, zero manual work.",
    },
    problem: {
      heading: "Featured Images Are a Content Bottleneck",
      body: [
        "Every blog post needs a featured image. Without one, your post looks incomplete in feeds, search results, and social shares. But creating custom images for every post means either generic stock photos or waiting on a designer.",
        "Stock photos are overused and off-brand. Custom designs take 15-30 minutes per post and create a dependency on your design team. If you publish 3-5 posts per week, that's hours of design work just for hero images.",
      ],
    },
    solution: {
      heading: "Title + Category = Featured Image",
      body: [
        "Design one hero image template with your brand colors, logo, and layout. Inject the post title, category tag, author name, and read time per article. HTMLPix renders a unique, branded image for every post.",
        "Trigger generation from your CMS webhook (publish event), a build step, or on-demand API call. Every post gets a professional featured image the moment it's published. No stock photos, no design queue.",
      ],
    },
    code: {
      filename: "featured-image.ts",
      snippet: `// Triggered by CMS webhook on publish
export async function generateFeaturedImage(post: {
  title: string; category: string; author: string;
}) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: { "Authorization": \`Bearer \${key}\` },
    body: JSON.stringify({
      html: \`<div style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:flex-end;padding:60px;background:linear-gradient(135deg,#0f0f0f,#1a1a2e)">
        <span style="color:#ff4d00;font-size:14px;letter-spacing:2px;text-transform:uppercase">\${post.category}</span>
        <h1 style="color:white;font-size:52px;margin:12px 0 0;line-height:1.1">\${post.title}</h1>
        <p style="color:rgba(255,255,255,0.4);font-size:14px;margin-top:16px">By \${post.author}</p>
      </div>\`,
      width: 1200, height: 630
    })
  });
  return res;
}`,
    },
    benefits: [
      {
        title: "Zero Design Dependency",
        description:
          "Featured images generate automatically on publish. No design requests, no waiting, no bottleneck.",
      },
      {
        title: "Brand Consistency",
        description:
          "Every post uses the same template. Colors, fonts, and layout match your brand — always. One template change updates all future posts.",
      },
      {
        title: "SEO & Social Ready",
        description:
          "Images render at 1200x630 — the standard OG image size. Every post gets a unique social preview out of the box.",
      },
      {
        title: "CMS Integration",
        description:
          "Trigger generation from any CMS webhook, build pipeline, or API endpoint. Works with WordPress, Ghost, Sanity, Contentful, or any headless CMS.",
      },
    ],
    cta: {
      heading: "Start Generating Featured Images",
      body: "50 free renders every month. Branded blog images from post metadata.",
    },
    bg: "from-[#0f172a] to-[#1e3a5f]",
    desc: "Auto-generate branded hero images from post title, category, and author. Triggered by CMS webhooks.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "app/api/featured-image/route.ts",
          snippet: `import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, category, author } = await req.json();

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:flex-end;padding:60px;background:linear-gradient(135deg,#0f0f0f,#1a1a2e)">
        <span style="color:#ff4d00;font-size:14px;letter-spacing:2px;text-transform:uppercase">\${category}</span>
        <h1 style="color:white;font-size:52px;margin:12px 0 0;line-height:1.1">\${title}</h1>
        <p style="color:rgba(255,255,255,0.4);font-size:14px;margin-top:16px">By \${author}</p>
      </div>\`,
      width: 1200, height: 630,
    }),
  });

  return new NextResponse(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png" },
  });
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "featured_image.py",
          snippet: `import requests, os

def generate_featured_image(title: str, category: str, author: str) -> bytes:
    html = f"""<div style="width:1200px;height:630px;display:flex;flex-direction:column;
      justify-content:flex-end;padding:60px;background:linear-gradient(135deg,#0f0f0f,#1a1a2e)">
      <span style="color:#ff4d00;font-size:14px;letter-spacing:2px;text-transform:uppercase">{category}</span>
      <h1 style="color:white;font-size:52px;margin:12px 0 0;line-height:1.1">{title}</h1>
      <p style="color:rgba(255,255,255,0.4);font-size:14px;margin-top:16px">By {author}</p>
    </div>"""

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 1200, "height": 630},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "featuredImage.mjs",
          snippet: `async function generateFeaturedImage({ title, category, author }) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<div style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:flex-end;padding:60px;background:linear-gradient(135deg,#0f0f0f,#1a1a2e)">
        <span style="color:#ff4d00;font-size:14px;letter-spacing:2px;text-transform:uppercase">\${category}</span>
        <h1 style="color:white;font-size:52px;margin:12px 0 0;line-height:1.1">\${title}</h1>
        <p style="color:rgba(255,255,255,0.4);font-size:14px;margin-top:16px">By \${author}</p>
      </div>\`,
      width: 1200, height: 630,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "15-30 minutes per featured image in Canva/Figma. At 4 posts/week, that's 4-8 hours of design work per month, plus back-and-forth on revisions.",
      withApi: "Images generate automatically on publish via CMS webhook. Zero manual effort. Template changes apply to all future posts instantly.",
      savings: "~8 design hours/month",
    },
    faq: [
      { question: "Can I trigger generation from my CMS?", answer: "Yes. Set up a webhook on your CMS publish event (WordPress, Ghost, Sanity, Contentful all support webhooks). The webhook sends post metadata to your API endpoint, which calls HTMLPix." },
      { question: "What if I want different layouts per category?", answer: "Use conditional logic in your template code. Check the category and apply different background colors, layouts, or icons per post type." },
      { question: "Can I include author photos?", answer: "Yes. Include an <img> tag with the author's avatar URL. HTMLPix fetches and renders external images as part of the screenshot." },
      { question: "What size should blog featured images be?", answer: "1200x630 is the standard — it doubles as an OG image for social sharing. Adjust dimensions per use case if needed." },
      { question: "Does this work with static site generators?", answer: "Yes. Call the API during your build step (e.g., in a Next.js getStaticProps or Astro build script) to generate images at build time." },
    ],
    preview: (
      <div className="flex h-full flex-col justify-end p-4">
        <div className="mb-1 text-[7px] font-bold tracking-wider text-[#ff4d00] uppercase">
          Engineering
        </div>
        <div className="font-[family-name:var(--font-bebas-neue)] text-sm leading-tight text-white">
          Building Scalable APIs
        </div>
        <div className="mt-1 text-[6px] text-white/30">By Sarah Chen</div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm">
          <div className="relative flex aspect-[1200/630] w-full flex-col justify-end overflow-hidden p-4 md:p-8" style={{ background: "linear-gradient(135deg, #0f0f0f, #1a1a2e)" }}>
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10">
              <span className="text-[8px] font-bold tracking-[0.15em] text-[#ff4d00] uppercase md:text-xs">
                Engineering
              </span>
              <h3 className="mt-1 font-[family-name:var(--font-bebas-neue)] text-xl leading-[1.1] text-white sm:text-2xl md:mt-2 md:text-4xl lg:text-5xl">
                Building Scalable APIs<br />With Edge Functions
              </h3>
              <p className="mt-2 text-[8px] text-white/40 md:mt-3 md:text-sm">By Sarah Chen</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#ff4d00] via-[#ff6a33] to-transparent" />
          </div>
        </div>
      </div>
    ),
  },
  {
    slug: "pdf-thumbnails",
    tag: "DOCUMENTS",
    title: "PDF Thumbnails",
    headline: "Generate PDF Thumbnail Previews via API",
    subtitle:
      "First-page preview thumbnails for file managers, document portals, and search results. No PDF rendering library required.",
    meta: {
      title: "Generate PDF Thumbnail Previews via API",
      description:
        "Generate PDF thumbnail previews for file managers and document portals. First-page screenshots via API. No PDF.js or Ghostscript required.",
    },
    problem: {
      heading: "PDFs Are Black Boxes Without Previews",
      body: [
        "Users upload PDFs to your platform, but all they see is a generic file icon. No preview, no context. They have to download and open each file to know what's inside.",
        "Generating PDF thumbnails server-side means installing Ghostscript, ImageMagick, or running PDF.js in Node — each with its own dependency chain, version conflicts, and rendering quirks. It's a disproportionate amount of infrastructure for a preview image.",
      ],
    },
    solution: {
      heading: "Render the First Page as an Image",
      body: [
        "Embed the PDF in an HTML page using a simple <embed> or <iframe> tag. POST the HTML to HTMLPix with your desired thumbnail dimensions. We render the first page as a crisp PNG.",
        "Use the thumbnails in file managers, document search results, email attachments, or knowledge base listings. Users can preview documents at a glance without downloading.",
      ],
    },
    code: {
      filename: "pdf-thumbnail.ts",
      snippet: `const thumbnail = await fetch("https://api.htmlpix.com/render", {
  method: "POST",
  headers: { "Authorization": \`Bearer \${key}\` },
  body: JSON.stringify({
    html: \`<!DOCTYPE html>
      <html><body style="margin:0">
        <embed src="\${pdfUrl}" type="application/pdf"
          width="800" height="1035" />
      </body></html>\`,
    width: 800,
    height: 1035
  })
});

await Bun.write("thumbnail.png", await thumbnail.arrayBuffer());`,
    },
    benefits: [
      {
        title: "Visual File Browsing",
        description:
          "Users see document previews instead of generic file icons. Faster navigation, fewer unnecessary downloads.",
      },
      {
        title: "No PDF Library",
        description:
          "No Ghostscript, no ImageMagick, no PDF.js. HTMLPix renders the PDF in a real browser and returns the screenshot.",
      },
      {
        title: "Consistent Thumbnails",
        description:
          "Every thumbnail is the same dimensions and quality. Looks clean in grid layouts, search results, and dashboards.",
      },
      {
        title: "On-Upload Generation",
        description:
          "Trigger thumbnail generation when a user uploads a PDF. Store the image alongside the file for instant previews.",
      },
    ],
    cta: {
      heading: "Start Generating PDF Thumbnails",
      body: "50 free renders every month. Document previews from any PDF URL.",
    },
    bg: "from-[#dc2626] to-[#ef4444]",
    desc: "Generate first-page preview thumbnails for file managers, document portals, and search results.",
    integrations: {
      tabs: [
        {
          label: "Next.js",
          language: "TypeScript",
          filename: "app/api/pdf-thumbnail/route.ts",
          snippet: `import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const pdfUrl = new URL(req.url).searchParams.get("url") ?? "";

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<!DOCTYPE html><html><body style="margin:0">
        <embed src="\${pdfUrl}" type="application/pdf" width="800" height="1035"/>
      </body></html>\`,
      width: 800, height: 1035,
    }),
  });

  return new NextResponse(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=604800" },
  });
}`,
        },
        {
          label: "Python",
          language: "Python",
          filename: "pdf_thumbnail.py",
          snippet: `import requests, os

def generate_pdf_thumbnail(pdf_url: str) -> bytes:
    html = f"""<!DOCTYPE html><html><body style="margin:0">
      <embed src="{pdf_url}" type="application/pdf" width="800" height="1035"/>
    </body></html>"""

    res = requests.post(
        "https://api.htmlpix.com/render",
        headers={"Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}"},
        json={"html": html, "width": 800, "height": 1035},
    )
    return res.content`,
        },
        {
          label: "Node.js",
          language: "JavaScript",
          filename: "pdfThumbnail.mjs",
          snippet: `async function generatePdfThumbnail(pdfUrl) {
  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.HTMLPIX_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      html: \`<!DOCTYPE html><html><body style="margin:0">
        <embed src="\${pdfUrl}" type="application/pdf" width="800" height="1035"/>
      </body></html>\`,
      width: 800, height: 1035,
    }),
  });
  return Buffer.from(await res.arrayBuffer());
}`,
        },
      ],
    },
    roi: {
      manual: "Installing and maintaining Ghostscript/ImageMagick for PDF rendering. Version conflicts, security patches, memory issues with large PDFs.",
      withApi: "One API call per PDF. No system dependencies. HTMLPix renders the PDF in a real browser and returns the first-page screenshot.",
      savings: "~10 engineering hours on setup + maintenance",
    },
    faq: [
      { question: "Can I generate thumbnails for password-protected PDFs?", answer: "No. The PDF must be publicly accessible (or accessible from HTMLPix's servers) for the browser to render it. Password-protected PDFs won't display in the embed." },
      { question: "What dimensions work best for thumbnails?", answer: "Standard letter-size ratio is ~800x1035 (US Letter). For grid thumbnails, render at this size and resize client-side, or render smaller like 400x518." },
      { question: "Does it render all pages or just the first?", answer: "The browser embed shows the first page by default. For multi-page thumbnails, you'd need separate requests with page-specific rendering logic." },
      { question: "How large can the PDF be?", answer: "HTMLPix loads the PDF via the browser's built-in PDF viewer. Very large PDFs (100+ MB) may hit timeout limits. For typical documents under 20MB, rendering is fast." },
    ],
    preview: (
      <div className="flex h-full items-center justify-center p-4">
        <div className="flex h-full w-16 flex-col rounded-sm border border-white/20 bg-white/10 p-1.5">
          <div className="mb-1 h-1 w-8 rounded bg-white/30" />
          <div className="mb-0.5 h-0.5 w-full rounded bg-white/15" />
          <div className="mb-0.5 h-0.5 w-full rounded bg-white/15" />
          <div className="mb-0.5 h-0.5 w-4/5 rounded bg-white/15" />
          <div className="mt-auto text-center text-[5px] font-bold text-white/30">PDF</div>
        </div>
      </div>
    ),
    heroPreview: (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-[#1a1a1a]/10 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-3 text-[10px] font-bold tracking-wider text-[#1a1a1a]/30 uppercase md:mb-4 md:text-xs">
            Document Library
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { name: "Q4 Report.pdf", pages: "12 pages" },
              { name: "Contract.pdf", pages: "8 pages" },
              { name: "Invoice #892.pdf", pages: "2 pages" },
            ].map((doc, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="mb-2 flex aspect-[800/1035] items-center justify-center rounded border border-[#1a1a1a]/10 bg-[#fafafa] transition-all group-hover:border-[#ff4d00]/30 group-hover:shadow-md">
                  <div className="flex w-3/4 flex-col gap-1 p-2">
                    <div className="h-1.5 w-2/3 rounded bg-[#1a1a1a]/15" />
                    <div className="h-1 w-full rounded bg-[#1a1a1a]/8" />
                    <div className="h-1 w-full rounded bg-[#1a1a1a]/8" />
                    <div className="h-1 w-4/5 rounded bg-[#1a1a1a]/8" />
                    <div className="mt-1 h-1 w-1/2 rounded bg-[#1a1a1a]/8" />
                  </div>
                </div>
                <div className="text-[9px] font-medium text-[#1a1a1a] md:text-[11px]">{doc.name}</div>
                <div className="text-[8px] text-[#1a1a1a]/40 md:text-[9px]">{doc.pages}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return useCases.find((uc) => uc.slug === slug);
}

export function getAllSlugs(): string[] {
  return useCases.map((uc) => uc.slug);
}

export function getAllUseCases(): UseCase[] {
  return useCases;
}
