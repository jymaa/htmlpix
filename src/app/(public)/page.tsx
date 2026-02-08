import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { JsonLd } from "@/components/JsonLd";

export default function LandingVariant2() {
  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      {/* Blueprint grid background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,26,26,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,26,26,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Corner markers */}
      <div className="fixed top-4 left-4 z-50 h-8 w-8 border-t-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed top-4 right-4 z-50 h-8 w-8 border-t-2 border-r-2 border-[#1a1a1a]/20" />
      <div className="fixed bottom-4 left-4 z-50 h-8 w-8 border-b-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed right-4 bottom-4 z-50 h-8 w-8 border-r-2 border-b-2 border-[#1a1a1a]/20" />

      <PublicHeader />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "HTMLPix",
          url: "https://htmlpix.com",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          description:
            "HTML to Image API. Generate pixel-perfect screenshots from HTML/CSS with a single POST request.",
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "USD",
              description: "50 renders per month",
            },
            {
              "@type": "Offer",
              name: "Starter",
              price: "8",
              priceCurrency: "USD",
              description: "1,000 renders per month",
            },
            {
              "@type": "Offer",
              name: "Pro",
              price: "15",
              priceCurrency: "USD",
              description: "3,000 renders per month",
            },
            {
              "@type": "Offer",
              name: "Scale",
              price: "35",
              priceCurrency: "USD",
              description: "10,000 renders per month",
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen items-center px-4 pt-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-12 gap-6 md:gap-12">
            {/* Left — copy */}
            <div className="col-span-12 lg:col-span-6">
              {/* Technical annotation line */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#ff4d00]/50 to-transparent" />
                <span className="text-[10px] tracking-wider text-[#1a1a1a]/30 uppercase">FIG. 01 — HERO</span>
              </div>

              <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-5xl leading-[0.9] tracking-tight sm:text-7xl md:mb-8 md:text-8xl lg:text-9xl">
                <span className="text-[#ff4d00]">HTML IN.</span>
                <br />
                <span>IMAGE OUT.</span>
                <span className="sr-only"> — HTML to Image API for Developers</span>
              </h1>

              <div className="relative mb-8 md:mb-10">
                <p className="max-w-md text-sm leading-relaxed text-[#1a1a1a]/50 md:text-base">
                  Having to maintain headless Chrome and Puppeteer is a pain. Send us your HTML, get back a
                  pixel-perfect screenshot. One POST request. One API key. No more headaches.
                </p>
              </div>

              {/* Specs table */}
              <div className="mb-6 border-2 border-[#1a1a1a]/10 md:mb-8">
                <div className="grid grid-cols-3 text-xs">
                  {[
                    { label: "AVG LATENCY", value: "<200ms" },
                    { label: "UPTIME SLA", value: "99.9%" },
                    { label: "FORMATS", value: "PNG/JPG/WEBP" },
                  ].map((spec, i) => (
                    <div key={i} className={`p-2 md:p-4 ${i !== 2 ? "border-r-2 border-[#1a1a1a]/10" : ""}`}>
                      <div className="mb-1 text-[10px] tracking-wider text-[#1a1a1a]/40 uppercase md:text-xs">
                        {spec.label}
                      </div>
                      <div className="text-sm font-bold text-[#ff4d00] md:text-lg">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 bg-[#ff4d00] px-6 py-3 text-[#f5f0e8] transition-colors hover:bg-[#1a1a1a] md:gap-4 md:px-8 md:py-4"
                >
                  <span className="text-xs font-bold tracking-widest uppercase md:text-sm">Get API Key</span>
                  <svg
                    className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 border-2 border-[#1a1a1a]/20 px-6 py-3 text-xs font-bold tracking-widest text-[#1a1a1a]/60 uppercase transition-colors hover:border-[#ff4d00] hover:text-[#ff4d00] md:px-8 md:py-4 md:text-sm"
                >
                  Read Docs
                </Link>
              </div>
            </div>

            {/* Right — terminal on blueprint paper */}
            <div className="col-span-12 mt-8 lg:col-span-6 lg:mt-6">
              <div className="relative">
                {/* Diagram annotations */}
                <div className="absolute -top-6 left-0 text-[10px] text-[#1a1a1a]/30">FIG. 02</div>
                <div className="absolute -top-6 right-0 text-[10px] text-[#1a1a1a]/30">SCALE 1:1</div>

                {/* Terminal box */}
                <div className="relative border-2 border-[#1a1a1a]/20 bg-[#1a1a1a] p-0 shadow-[4px_4px_0_0_rgba(26,26,26,0.08)]">
                  {/* Title bar */}
                  <div className="flex items-center gap-2 border-b border-[#f5f0e8]/10 px-4 py-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-3 text-[11px] text-[#f5f0e8]/30">terminal</span>
                  </div>

                  {/* Terminal content */}
                  <div className="p-4 text-[12px] leading-relaxed md:p-5 md:text-[13px]">
                    {/* Curl command */}
                    <div className="mb-1">
                      <span className="text-[#28c840]">$</span> <span className="text-[#f5f0e8]">curl</span>{" "}
                      <span className="text-[#ff4d00]">-X POST</span>{" "}
                      <span className="text-[#f5f0e8]/80">api.htmlpix.com/render</span>{" "}
                      <span className="text-[#f5f0e8]/20">\</span>
                    </div>
                    <div className="mb-1 pl-4">
                      <span className="text-[#ff4d00]">-H</span>{" "}
                      <span className="text-[#a5d6a7]">{`"Authorization: Bearer $KEY"`}</span>{" "}
                      <span className="text-[#f5f0e8]/20">\</span>
                    </div>
                    <div className="mb-1 pl-4">
                      <span className="text-[#ff4d00]">-H</span>{" "}
                      <span className="text-[#a5d6a7]">{`"Content-Type: application/json"`}</span>{" "}
                      <span className="text-[#f5f0e8]/20">\</span>
                    </div>
                    <div className="mb-1 pl-4">
                      <span className="text-[#ff4d00]">-d</span>{" "}
                      <span className="text-[#a5d6a7]">{`'{"html":"<h1>Hello</h1>","width":1200,"height":630}'`}</span>{" "}
                    </div>

                    {/* Response */}
                    <div className="border-t border-[#f5f0e8]/10 pt-4">
                      <div className="mb-2 text-[#f5f0e8]/30">{`# 200 OK (143ms)`}</div>
                      <div>
                        <span className="text-[#f5f0e8]/30">{`{`}</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#81c784]">{`"id"`}</span>
                        <span className="text-[#f5f0e8]/30">: </span>
                        <span className="text-[#a5d6a7]">{`"abc123"`}</span>
                        <span className="text-[#f5f0e8]/30">,</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#81c784]">{`"url"`}</span>
                        <span className="text-[#f5f0e8]/30">: </span>
                        <span className="text-[#a5d6a7]">{`"https://api.htmlpix.com/images/abc123.png"`}</span>
                        <span className="text-[#f5f0e8]/30">,</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#81c784]">{`"imageKey"`}</span>
                        <span className="text-[#f5f0e8]/30">: </span>
                        <span className="text-[#a5d6a7]">{`"abc123.png"`}</span>
                      </div>
                      <div>
                        <span className="text-[#f5f0e8]/30">{`}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right dimension line */}
                <div className="absolute top-0 -right-6 bottom-0 hidden flex-col items-center justify-center md:flex">
                  <div className="h-full w-px bg-[#1a1a1a]/10" />
                  <div className="absolute top-0 h-px w-3 bg-[#1a1a1a]/10" />
                  <div className="absolute bottom-0 h-px w-3 bg-[#1a1a1a]/10" />
                </div>

                {/* Annotation below */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-[#1a1a1a]/30">
                  <span>that&apos;s it. that&apos;s the whole API.</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS (from /4 style) ──────────────── */}
      <section className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Section header with blueprint annotation */}
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 01
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              How It Works
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <span className="hidden text-[10px] text-[#1a1a1a]/30 md:block">FIG. 03</span>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-0">
            {[
              {
                step: "01",
                title: "Send Your HTML",
                desc: "POST your HTML, CSS, and viewport settings to our API. Tailwind, Google Fonts, inline styles. It all works.",
                code: `POST /render\n{ "html": "<div>...</div>" }`,
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We Render It",
                desc: "Our rendering cluster boots a real browser, injects your HTML, waits for fonts and assets, and captures a screenshot.",
                code: `→ Parse → Render → Encode`,
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Get Your Image",
                desc: "Receive a PNG, JPEG, or WebP binary in the response. Average turnaround under 200ms. Cache it, serve it, done.",
                code: `Content-Type: image/png\n← 24.3 KB`,
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z"
                    />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {/* Connector line between steps */}
                {i < 2 && (
                  <div className="absolute top-12 right-0 hidden h-px w-full bg-gradient-to-r from-transparent via-[#ff4d00]/30 to-transparent md:block" />
                )}
                <div
                  className={`relative p-6 md:p-8 ${i === 1 ? "md:border-x-2 md:border-[#1a1a1a]/10" : ""}`}
                >
                  {/* Step number badge + icon */}
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center bg-[#ff4d00] font-[family-name:var(--font-bebas-neue)] text-lg text-white shadow-[2px_2px_0_0_rgba(26,26,26,0.1)]">
                      {item.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center border-2 border-dashed border-[#1a1a1a]/15 text-[#ff4d00]">
                      {item.icon}
                    </div>
                    <div className="h-px flex-grow bg-[#1a1a1a]/10" />
                  </div>
                  <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#1a1a1a]/50">{item.desc}</p>
                  {/* Dashed code block */}
                  <pre className="border-2 border-dashed border-[#1a1a1a]/10 bg-[#1a1a1a]/[0.03] p-3 text-xs leading-relaxed text-[#0d7377]">
                    {item.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── USE CASES (from /5 gallery style) ──────────────── */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 02
            </div>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-[#f5f0e8] md:text-4xl">
              What Developers Build
            </h2>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
            <span className="hidden text-[10px] text-[#f5f0e8]/20 md:block">FIG. 04</span>
          </div>

          <p className="mx-auto -mt-6 mb-12 max-w-lg text-center text-sm text-[#f5f0e8]/30 md:-mt-10 md:mb-16">
            If it renders in a browser, we can screenshot it. Here&apos;s what teams ship with HTMLPix.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "OG Images",
                tag: "SEO",
                desc: "Generate a unique social preview for every page on your site. More clicks from Google, Twitter, and LinkedIn.",
                bg: "from-[#1a1a1a] to-[#333]",
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
              },
              {
                title: "Social Cards",
                tag: "SOCIAL",
                desc: "Branded cards for Twitter/X, LinkedIn, and Discord. Generated from your app data on every request.",
                bg: "from-[#ff4d00] to-[#ff6a33]",
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
              },
              {
                title: "Invoices",
                tag: "COMMERCE",
                desc: "Pixel-perfect receipts from HTML templates. Email-ready, print-ready, archive-ready.",
                bg: "from-[#f5f0e8] to-[#e8e0d5]",
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
              },
              {
                title: "Certificates",
                tag: "EDUCATION",
                desc: "Generate thousands of personalized diplomas, awards, and badges. Just swap the name and date in your HTML template.",
                bg: "from-[#f5f0e8] to-[#ece5d8]",
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
              },
              {
                title: "Email Banners",
                tag: "MARKETING",
                desc: "Dynamic headers that look identical in every email client. No more rendering bugs.",
                bg: "from-[#1a1a1a] to-[#2d2d2d]",
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
              },
              {
                title: "Charts & Reports",
                tag: "DATA",
                desc: "Turn D3 or Chart.js visualizations into static images you can drop into Slack, PDFs, or emails.",
                bg: "from-[#1a1a1a] to-[#2a2a2a]",
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
              },
            ].map((uc, i) => (
              <div key={i} className="group">
                {/* Preview card with hover lift */}
                <div
                  className={`mb-4 h-44 overflow-hidden border border-[#f5f0e8]/10 bg-gradient-to-br ${uc.bg} transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:shadow-[#ff4d00]/5`}
                >
                  {uc.preview}
                </div>
                {/* Tag + line */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#ff4d00] uppercase">
                    {uc.tag}
                  </span>
                  <div className="h-px flex-grow bg-[#f5f0e8]/10" />
                </div>
                <h3 className="mt-1.5 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-[#f5f0e8]">
                  {uc.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#f5f0e8]/40">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="relative z-10 px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 03
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              <span className="text-[#ff4d00]">5 Lines</span> to Your First Render
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="relative">
            {/* Annotations */}
            <div className="absolute -top-6 left-4 text-[10px] text-[#1a1a1a]/30">FIG. 05</div>
            <div className="absolute -top-6 right-4 text-[10px] text-[#1a1a1a]/30">TYPESCRIPT</div>

            {/* Code window */}
            <div className="relative border-2 border-[#1a1a1a]/20 bg-[#1a1a1a] shadow-[4px_4px_0_0_rgba(26,26,26,0.08)]">
              {/* Chrome bar */}
              <div className="flex items-center justify-between border-b border-[#f5f0e8]/10 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="h-4 w-px bg-[#f5f0e8]/10" />
                  <span className="text-[11px] text-[#f5f0e8]/40">og-image.ts</span>
                </div>
                <span className="text-[11px] text-[#f5f0e8]/20">TypeScript</span>
              </div>

              {/* Code content */}
              <pre className="overflow-x-auto p-4 text-[12px] leading-[1.9] md:p-6 md:text-[13px]">
                <code>
                  <span className="text-[#c586c0]">const</span>
                  <span className="text-[#9cdcfe]"> image</span>
                  <span className="text-[#f5f0e8]/40"> = </span>
                  <span className="text-[#c586c0]">await</span>
                  <span className="text-[#dcdcaa]"> fetch</span>
                  <span className="text-[#f5f0e8]/40">(</span>
                  <span className="text-[#a5d6a7]">{`"https://api.htmlpix.com/render"`}</span>
                  <span className="text-[#f5f0e8]/40">{`, {`}</span>
                  {"\n"}
                  <span className="text-[#f5f0e8]/40">{"  "}</span>
                  <span className="text-[#9cdcfe]">method</span>
                  <span className="text-[#f5f0e8]/40">{`: `}</span>
                  <span className="text-[#a5d6a7]">{`"POST"`}</span>
                  <span className="text-[#f5f0e8]/40">,</span>
                  {"\n"}
                  <span className="text-[#f5f0e8]/40">{"  "}</span>
                  <span className="text-[#9cdcfe]">headers</span>
                  <span className="text-[#f5f0e8]/40">{`: { `}</span>
                  <span className="text-[#a5d6a7]">{`"Authorization"`}</span>
                  <span className="text-[#f5f0e8]/40">{`: `}</span>
                  <span className="text-[#a5d6a7]">{`\`Bearer \${`}</span>
                  <span className="text-[#9cdcfe]">key</span>
                  <span className="text-[#a5d6a7]">{`}\``}</span>
                  <span className="text-[#f5f0e8]/40">{` },`}</span>
                  {"\n"}
                  <span className="text-[#f5f0e8]/40">{"  "}</span>
                  <span className="text-[#9cdcfe]">body</span>
                  <span className="text-[#f5f0e8]/40">{`: `}</span>
                  <span className="text-[#9cdcfe]">JSON</span>
                  <span className="text-[#f5f0e8]/40">.</span>
                  <span className="text-[#dcdcaa]">stringify</span>
                  <span className="text-[#f5f0e8]/40">{`({ `}</span>
                  <span className="text-[#9cdcfe]">html</span>
                  <span className="text-[#f5f0e8]/40">{`, `}</span>
                  <span className="text-[#9cdcfe]">width</span>
                  <span className="text-[#f5f0e8]/40">{`: `}</span>
                  <span className="text-[#b5cea8]">1200</span>
                  <span className="text-[#f5f0e8]/40">{`, `}</span>
                  <span className="text-[#9cdcfe]">height</span>
                  <span className="text-[#f5f0e8]/40">{`: `}</span>
                  <span className="text-[#b5cea8]">630</span>
                  <span className="text-[#f5f0e8]/40">{` })`}</span>
                  {"\n"}
                  <span className="text-[#f5f0e8]/40">{`});`}</span>
                </code>
              </pre>
            </div>

            {/* Annotation below code */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-[#1a1a1a]/30">
              <span>Works with any language. If it can make HTTP requests, it can use HTMLPix.</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0d7377]" />
                No errors
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 04
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Predictable Pricing
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <p className="mx-auto -mt-8 mb-12 max-w-lg text-center text-sm text-[#1a1a1a]/40 md:-mt-10 md:mb-16">
            Every plan gets every feature. You just pick how many renders you need. Change plans anytime.
          </p>

          {/* Desktop: horizontal table */}
          <div className="hidden lg:block">
            <div className="overflow-hidden border-2 border-[#1a1a1a]/15">
              {/* Header row */}
              <div className="grid grid-cols-5 border-b-2 border-[#1a1a1a]/10 text-xs font-bold tracking-wider uppercase">
                <div className="p-5 text-[#1a1a1a]/30">Plan</div>
                <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-[#1a1a1a]/50">
                  Renders/mo
                </div>
                <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-[#1a1a1a]/50">Price</div>
                <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-[#1a1a1a]/50">
                  Per Render
                </div>
                <div className="border-l border-[#1a1a1a]/10 p-5" />
              </div>

              {[
                { name: "Free", renders: "50", price: "$0", per: "$0.00", planId: "free" },
                { name: "Starter", renders: "1,000", price: "$8/mo", per: "$0.008", planId: "starter" },
                {
                  name: "Pro",
                  renders: "3,000",
                  price: "$15/mo",
                  per: "$0.005",
                  planId: "pro",
                  popular: true,
                },
                { name: "Scale", renders: "10,000", price: "$35/mo", per: "$0.0035", planId: "scale" },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-5 items-center ${i < 3 ? "border-b border-[#1a1a1a]/10" : ""} ${
                    plan.popular ? "bg-[#ff4d00]/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 p-5">
                    <span className="font-[family-name:var(--font-bebas-neue)] text-xl">{plan.name}</span>
                    {plan.popular && (
                      <span className="bg-[#ff4d00] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-sm font-bold">
                    {plan.renders}
                  </div>
                  <div className="border-l border-[#1a1a1a]/10 p-5 text-center">
                    <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-[#ff4d00]">
                      {plan.price}
                    </span>
                  </div>
                  <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-xs text-[#1a1a1a]/40">
                    {plan.per}
                  </div>
                  <div className="border-l border-[#1a1a1a]/10 p-5 text-center">
                    <Link
                      href={`/login?plan=${plan.planId}`}
                      className={`inline-block px-6 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                        plan.popular
                          ? "bg-[#ff4d00] text-white hover:bg-[#1a1a1a]"
                          : "border border-[#1a1a1a]/20 text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
                      }`}
                    >
                      {plan.price === "$0" ? "Start Free" : "Select"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: card layout */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {[
              { name: "Free", renders: "50", price: 0, planId: "free" },
              { name: "Starter", renders: "1,000", price: 8, planId: "starter" },
              { name: "Pro", renders: "3,000", price: 15, planId: "pro", popular: true },
              { name: "Scale", renders: "10,000", price: 35, planId: "scale" },
            ].map((plan, i) => (
              <div
                key={i}
                className={`flex flex-col border-2 p-6 ${
                  plan.popular ? "border-[#ff4d00] bg-[#ff4d00]/5" : "border-[#1a1a1a]/15"
                }`}
              >
                {plan.popular && (
                  <span className="mb-3 self-start bg-[#ff4d00] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    Popular
                  </span>
                )}
                <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl">{plan.name}</h3>
                <div className="mt-1 mb-3 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-4xl text-[#ff4d00]">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-xs text-[#1a1a1a]/30">/mo</span>}
                </div>
                <div className="mb-4 text-xs text-[#1a1a1a]/50">
                  <span className="font-bold">{plan.renders}</span> renders/month
                </div>
                <Link
                  href={`/login?plan=${plan.planId}`}
                  className={`mt-auto block py-3 text-center text-xs font-bold tracking-wider uppercase transition-colors ${
                    plan.popular
                      ? "bg-[#ff4d00] text-white hover:bg-[#1a1a1a]"
                      : "bg-[#1a1a1a] text-[#f5f0e8] hover:bg-[#ff4d00]"
                  }`}
                >
                  {plan.price === 0 ? "Start Free" : `Choose ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 overflow-hidden bg-[#ff4d00] px-4 py-16 md:px-8 md:py-32">
        {/* Blueprint decorative elements */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border-[40px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full border-[60px] border-white/5" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-4xl text-white sm:text-6xl md:mb-6 md:text-8xl">
            YOUR HTML
            <br />
            DESERVES PIXELS
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-white/60 md:mb-10 md:text-lg">
            50 free renders every month. No credit card. Your API key is 30 seconds away.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-3 bg-white px-6 py-4 font-bold tracking-wider text-[#ff4d00] uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white md:gap-4 md:px-10 md:py-5"
          >
            Get Your API Key
            <svg
              className="h-4 w-4 transform transition-transform group-hover:translate-x-1 md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#1a1a1a]">
              <span className="text-xs font-bold text-[#1a1a1a]">{"</>"}</span>
            </div>
            <span className="font-bold tracking-wider">HTMLPIX</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs tracking-widest text-[#1a1a1a]/30 uppercase md:gap-8">
            <Link href="/docs" className="transition-colors hover:text-[#ff4d00]">
              Docs
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-[#ff4d00]">
              Pricing
            </Link>
            <Link href="/support" className="transition-colors hover:text-[#ff4d00]">
              Support
            </Link>
            <Link href="/docs/faq" className="transition-colors hover:text-[#ff4d00]">
              FAQ
            </Link>
            <a href="https://status.htmlpix.com" className="transition-colors hover:text-[#ff4d00]">
              Status
            </a>
            <Link href="/login" className="transition-colors hover:text-[#ff4d00]">
              Login
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#ff4d00]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#ff4d00]">
              Terms
            </Link>
          </div>
          <span className="text-xs text-[#1a1a1a]/20">&copy; 2026 HTMLPix</span>
        </div>
      </footer>
    </div>
  );
}
