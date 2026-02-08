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
