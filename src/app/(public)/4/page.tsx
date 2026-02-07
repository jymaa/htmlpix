import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

export default function LandingV4() {
  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <PublicHeader />

      {/* ──────────────── HERO ──────────────── */}
      <section className="relative z-10 flex min-h-screen flex-col justify-center px-4 pt-24 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-6xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#28c840]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#1a1a1a]/40 uppercase">
              API Status: Operational
            </span>
          </div>

          <h1 className="mb-6 max-w-4xl font-[family-name:var(--font-bebas-neue)] text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-[5.5rem] lg:text-[7rem]">
            Render Any HTML
            <br />
            <span className="text-[#ff4d00]">to a Pixel-Perfect Image</span>
          </h1>

          <p className="mb-10 max-w-xl text-base leading-relaxed text-[#1a1a1a]/50 md:text-lg">
            One POST request. Sub-200ms response. No headless browsers to manage,
            no infrastructure to maintain. Just send HTML, get an image back.
          </p>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 bg-[#ff4d00] px-8 py-4 text-[#f5f0e8] transition-all hover:bg-[#1a1a1a] hover:shadow-lg"
            >
              <span className="text-sm font-bold tracking-widest uppercase">Get Free API Key</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 border-2 border-[#1a1a1a]/20 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors hover:border-[#1a1a1a]"
            >
              Read the Docs
            </Link>
          </div>

          {/* Social proof bar */}
          <div className="flex flex-wrap items-center gap-6 border-t-2 border-[#1a1a1a]/10 pt-8 md:gap-10">
            {[
              { value: "2M+", label: "Images rendered" },
              { value: "1,200+", label: "Developers" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "<200ms", label: "Avg latency" },
            ].map((stat, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-[#ff4d00] md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-[10px] tracking-wider text-[#1a1a1a]/40 uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <section className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide whitespace-nowrap md:text-4xl">
              How It Works
            </h2>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-0">
            {[
              {
                step: "01",
                title: "Send Your HTML",
                desc: "POST your HTML, CSS, and viewport settings to our API. Tailwind, Google Fonts, inline styles — it all works.",
                code: `POST /render\n{ "html": "<div>...</div>" }`,
              },
              {
                step: "02",
                title: "We Render It",
                desc: "Our rendering cluster boots a real browser, injects your HTML, waits for fonts and assets, and captures a screenshot.",
                code: `→ Parse → Render → Encode`,
              },
              {
                step: "03",
                title: "Get Your Image",
                desc: "Receive a PNG, JPEG, or WebP binary in the response. Average turnaround under 200ms. Cache it, serve it, done.",
                code: `Content-Type: image/png\n← 245 KB`,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="absolute top-12 right-0 hidden h-px w-full bg-gradient-to-r from-transparent via-[#ff4d00]/30 to-transparent md:block" />
                )}
                <div className={`relative p-8 ${i === 1 ? "md:border-x-2 md:border-[#1a1a1a]/10" : ""}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center bg-[#ff4d00] font-[family-name:var(--font-bebas-neue)] text-lg text-white">
                      {item.step}
                    </span>
                    <div className="h-px flex-grow bg-[#1a1a1a]/10" />
                  </div>
                  <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#1a1a1a]/50">{item.desc}</p>
                  <pre className="border-2 border-dashed border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] p-3 text-xs leading-relaxed text-[#1a1a1a]/60">
                    {item.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── FEATURES ──────────────── */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-[#f5f0e8] md:text-4xl">
              Built for Production
            </h2>
            <div className="h-px flex-grow bg-[#f5f0e8]/10" />
          </div>

          <div className="grid gap-px bg-[#f5f0e8]/10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Any Viewport Size",
                desc: "1200x630 for OG images, 1080x1080 for Instagram, or any custom dimension. You set the viewport, we fill it.",
              },
              {
                title: "Full CSS Support",
                desc: "Grid, Flexbox, animations, gradients, custom properties — rendered in a real Chromium engine. What you see is what you get.",
              },
              {
                title: "Automatic Font Loading",
                desc: "Google Fonts auto-detected from your HTML. Custom fonts via @font-face. We wait until every glyph is rendered.",
              },
              {
                title: "3 Output Formats",
                desc: "PNG for transparency, JPEG for photos, WebP for smallest size. Control quality from 1-100.",
              },
              {
                title: "Asset Fetching",
                desc: "Remote images, stylesheets, and scripts are fetched and rendered. Your HTML works exactly like in a browser.",
              },
              {
                title: "Instant Response",
                desc: "Pre-warmed browser pool means no cold starts. Your image is rendered and returned in a single HTTP response.",
              },
            ].map((feat, i) => (
              <div key={i} className="group bg-[#1a1a1a] p-8 transition-colors hover:bg-[#1a1a1a]/80">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-1.5 w-1.5 bg-[#ff4d00] transition-transform group-hover:scale-150" />
                  <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide text-[#f5f0e8]">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#f5f0e8]/40">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CODE EXAMPLE ──────────────── */}
      <section className="relative z-10 bg-[#0d0d0d] px-4 py-20 md:px-8 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4d00]/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-12 flex items-center gap-6">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-[#f5f0e8] md:text-4xl">
              Simple Integration
            </h2>
            <div className="h-px flex-grow bg-[#f5f0e8]/10" />
          </div>

          <div className="overflow-hidden rounded-sm border border-[#f5f0e8]/10 bg-[#0a0a0a]">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-[#f5f0e8]/5 bg-[#111] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-[#f5f0e8]/40">render.ts</span>
            </div>

            {/* Code */}
            <div className="overflow-x-auto p-6">
              <pre className="text-[13px] leading-[1.8]">
                <code>
                  <span className="text-[#c586c0]">const</span>
                  <span className="text-[#9cdcfe]"> image</span>
                  <span className="text-[#f5f0e8]/50"> = </span>
                  <span className="text-[#c586c0]">await</span>
                  <span className="text-[#dcdcaa]"> fetch</span>
                  <span className="text-[#f5f0e8]/50">(</span>
                  <span className="text-[#ce9178]">{`'https://api.htmlpix.com/render'`}</span>
                  <span className="text-[#f5f0e8]/50">{`, {\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  "}</span>
                  <span className="text-[#9cdcfe]">method</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#ce9178]">{`'POST'`}</span>
                  <span className="text-[#f5f0e8]/50">{`,\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  "}</span>
                  <span className="text-[#9cdcfe]">headers</span>
                  <span className="text-[#f5f0e8]/50">{`: { `}</span>
                  <span className="text-[#ce9178]">{`'Authorization'`}</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#ce9178]">{`\`Bearer \${`}</span>
                  <span className="text-[#9cdcfe]">API_KEY</span>
                  <span className="text-[#ce9178]">{`}\``}</span>
                  <span className="text-[#f5f0e8]/50">{` },\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  "}</span>
                  <span className="text-[#9cdcfe]">body</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#9cdcfe]">JSON</span>
                  <span className="text-[#f5f0e8]/50">{`.`}</span>
                  <span className="text-[#dcdcaa]">stringify</span>
                  <span className="text-[#f5f0e8]/50">{`({\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"    "}</span>
                  <span className="text-[#9cdcfe]">html</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#ce9178]">{`'<div class="card">Hello World</div>'`}</span>
                  <span className="text-[#f5f0e8]/50">{`,\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"    "}</span>
                  <span className="text-[#9cdcfe]">viewport</span>
                  <span className="text-[#f5f0e8]/50">{`: { `}</span>
                  <span className="text-[#9cdcfe]">width</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#b5cea8]">1200</span>
                  <span className="text-[#f5f0e8]/50">{`, `}</span>
                  <span className="text-[#9cdcfe]">height</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#b5cea8]">630</span>
                  <span className="text-[#f5f0e8]/50">{` }\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  }"}</span>
                  <span className="text-[#f5f0e8]/50">{`)\n`}</span>
                  <span className="text-[#f5f0e8]/50">{`})`}</span>
                  <span className="text-[#f5f0e8]/50">{`;`}</span>
                </code>
              </pre>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#f5f0e8]/30">
            That&apos;s it. 8 lines. No Puppeteer, no Docker, no browser pool to manage.
          </p>
        </div>
      </section>

      {/* ──────────────── USE CASES ──────────────── */}
      <section className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex items-center gap-6">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              What Developers Build
            </h2>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tag: "SEO",
                title: "OG Images",
                desc: "Dynamic Open Graph images for every blog post, product page, and user profile. Unique previews that drive clicks from social feeds.",
              },
              {
                tag: "Social",
                title: "Social Cards",
                desc: "Auto-generate Twitter/X cards, LinkedIn previews, and Discord embeds. Your app data, rendered in real-time, zero manual design work.",
              },
              {
                tag: "Commerce",
                title: "Receipts & Invoices",
                desc: "Pixel-perfect, PDF-quality documents from HTML templates. Email-ready, print-ready, archive-ready.",
              },
              {
                tag: "Education",
                title: "Certificates",
                desc: "Personalized diplomas, course completions, and awards generated at scale. Each one unique, each one beautiful.",
              },
              {
                tag: "Marketing",
                title: "Email Banners",
                desc: "Dynamic email headers that bypass the rendering chaos of email clients. Looks perfect in Gmail, Outlook, everywhere.",
              },
              {
                tag: "Ads",
                title: "Dynamic Banners",
                desc: "Real-time promotional images, personalized hero banners, and countdown timers. A/B test visuals without a designer.",
              },
            ].map((uc, i) => (
              <div key={i} className="group border-l-2 border-[#1a1a1a]/10 pl-6 transition-colors hover:border-[#ff4d00]">
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#ff4d00] uppercase">{uc.tag}</span>
                <h3 className="mt-1 mb-2 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide">
                  {uc.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/50">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── PRICING ──────────────── */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 text-center">
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide text-[#f5f0e8] md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-sm text-[#f5f0e8]/40">
              Start free. Scale when you&apos;re ready. No surprises.
            </p>
          </div>

          {/* Anchoring note */}
          <div className="mx-auto mb-12 max-w-md text-center">
            <p className="text-xs text-[#f5f0e8]/30">
              Self-hosting Puppeteer on a VPS costs $20-50/mo + your engineering time.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { tier: "Free", price: 0, renders: "50", desc: "Try it — no card needed", planId: "free" },
              { tier: "Starter", price: 8, renders: "1,000", desc: "Side projects & prototypes", planId: "starter" },
              {
                tier: "Pro",
                price: 15,
                renders: "3,000",
                desc: "Production apps",
                planId: "pro",
                recommended: true,
              },
              { tier: "Scale", price: 35, renders: "10,000", desc: "High-volume workloads", planId: "scale" },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col p-8 ${
                  plan.recommended
                    ? "border-2 border-[#ff4d00] bg-[#ff4d00]/5"
                    : "border border-[#f5f0e8]/10"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 right-8 bg-[#ff4d00] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    Most Popular
                  </div>
                )}

                <div className="mb-1 text-[10px] font-bold tracking-wider text-[#ff4d00] uppercase">{plan.tier}</div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-5xl text-[#f5f0e8]">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-xs text-[#f5f0e8]/30">/mo</span>}
                </div>
                <p className="mb-6 text-xs text-[#f5f0e8]/40">{plan.desc}</p>

                <div className="mb-6 border-t border-[#f5f0e8]/10 pt-4">
                  <div className="text-sm text-[#f5f0e8]/60">
                    <span className="font-bold text-[#f5f0e8]">{plan.renders}</span> renders/month
                  </div>
                </div>

                <ul className="mb-8 flex-grow space-y-2 text-xs text-[#f5f0e8]/40">
                  {["All formats (PNG/JPG/WebP)", "Custom viewports", "Google Fonts", "API access"].map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="h-1 w-1 bg-[#ff4d00]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/login?plan=${plan.planId}`}
                  className={`block py-3 text-center text-xs font-bold tracking-wider uppercase transition-colors ${
                    plan.recommended
                      ? "bg-[#ff4d00] text-white hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
                      : "border border-[#f5f0e8]/20 text-[#f5f0e8]/60 hover:bg-[#ff4d00] hover:text-white"
                  }`}
                >
                  {plan.price === 0 ? "Start Free" : `Choose ${plan.tier}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── FAQ ──────────────── */}
      <section className="relative z-10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            Common Questions
          </h2>

          <div className="divide-y-2 divide-[#1a1a1a]/10">
            {[
              {
                q: "What happens if I exceed my render limit?",
                a: "Your API calls will return a 429 status code. We never charge overages — upgrade your plan to increase your limit, or wait for the next billing cycle.",
              },
              {
                q: "Is there a rate limit?",
                a: "Free tier: 10 requests/minute. Paid plans: 60 requests/minute. Need more? Contact us for custom limits.",
              },
              {
                q: "Can I use custom fonts?",
                a: "Yes. Google Fonts are auto-detected. For custom fonts, use @font-face in your CSS pointing to a publicly accessible font file.",
              },
              {
                q: "How do you handle external assets?",
                a: "We fetch remote images, stylesheets, and scripts referenced in your HTML. Assets are subject to a domain allowlist and size limits for security.",
              },
              {
                q: "Is the rendered image cached?",
                a: "We return the image directly in the response. You can cache it yourself however you like — CDN, S3, local filesystem.",
              },
              {
                q: "Do you support JavaScript rendering?",
                a: "Yes. We render in a real Chromium browser, so JavaScript runs and the DOM is fully interactive before we capture the screenshot.",
              },
            ].map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="mb-2 text-sm font-bold text-[#1a1a1a]">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/50">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CTA ──────────────── */}
      <section className="relative z-10 bg-[#ff4d00] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-4xl text-white sm:text-6xl md:text-7xl">
            Ship Images, Not Infrastructure
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-white/70">
            50 free renders every month. No credit card. Get your API key in under 60 seconds.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white px-8 py-4 font-bold tracking-wider text-[#ff4d00] uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white"
          >
            Get Your Free API Key
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#1a1a1a]">
              <span className="text-xs font-bold">{"<>"}</span>
            </div>
            <span className="font-bold tracking-wider">HTMLPIX</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs tracking-widest text-[#1a1a1a]/30 uppercase">
            <Link href="/docs" className="transition-colors hover:text-[#ff4d00]">Docs</Link>
            <Link href="/#pricing" className="transition-colors hover:text-[#ff4d00]">Pricing</Link>
            <a href="https://status.htmlpix.com" className="transition-colors hover:text-[#ff4d00]">Status</a>
            <Link href="/login" className="transition-colors hover:text-[#ff4d00]">Login</Link>
          </div>
          <span className="text-xs text-[#1a1a1a]/20">&copy; 2026 HTMLPix</span>
        </div>
      </footer>
    </div>
  );
}
