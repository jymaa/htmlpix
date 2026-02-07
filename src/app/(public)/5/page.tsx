import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

export default function LandingV5() {
  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      {/* Diagonal grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #1a1a1a 1px, transparent 1px), linear-gradient(-45deg, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <PublicHeader />

      {/* ──────────────── HERO ──────────────── */}
      <section className="relative z-10 min-h-screen px-4 pt-32 pb-20 md:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — copy */}
            <div>
              <div className="mb-6 inline-block border border-[#ff4d00]/30 bg-[#ff4d00]/5 px-4 py-1.5">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff4d00] uppercase">
                  No Puppeteer Required
                </span>
              </div>

              <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-[5rem] lg:text-[5.5rem]">
                Every Page
                <br />
                Deserves a<br />
                <span className="relative inline-block text-[#ff4d00]">
                  Beautiful Preview
                  <div className="absolute -bottom-2 left-0 h-1 w-full bg-[#ff4d00]/20" />
                </span>
              </h1>

              <p className="mb-8 max-w-md text-base leading-relaxed text-[#1a1a1a]/50 md:text-lg">
                Turn your HTML templates into stunning images — OG cards, receipts,
                certificates, banners — with a single API call and zero infrastructure.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-3 bg-[#ff4d00] px-8 py-4 text-[#f5f0e8] transition-all hover:bg-[#1a1a1a]"
                >
                  <span className="text-sm font-bold tracking-widest uppercase">Start Building Free</span>
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#1a1a1a]/15 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors hover:border-[#1a1a1a]"
                >
                  View Docs
                </Link>
              </div>
            </div>

            {/* Right — visual showcase */}
            <div className="relative">
              {/* Floating cards showing different output types */}
              <div className="relative mx-auto w-full max-w-md">
                {/* Main card — OG Image */}
                <div className="relative z-20 overflow-hidden border-2 border-[#1a1a1a]/20 bg-white shadow-2xl shadow-[#1a1a1a]/10">
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] px-8 py-10">
                    <div className="mb-3 text-[10px] font-bold tracking-wider text-[#ff4d00] uppercase">Blog Post</div>
                    <div className="mb-2 font-[family-name:var(--font-bebas-neue)] text-2xl leading-tight text-white">
                      How We Scaled Our API to 10M Requests
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <div className="h-4 w-4 rounded-full bg-[#ff4d00]" />
                      <span>htmlpix.com</span>
                      <span className="text-white/20">|</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-[#f5f0e8] px-4 py-2">
                    <span className="text-[10px] tracking-wider text-[#1a1a1a]/40 uppercase">OG Image</span>
                    <span className="text-[10px] font-bold text-[#ff4d00]">1200 x 630</span>
                  </div>
                </div>

                {/* Stacked card — Social */}
                <div className="absolute -right-4 -bottom-6 z-10 w-48 overflow-hidden border-2 border-[#1a1a1a]/10 bg-white shadow-xl md:-right-8">
                  <div className="bg-gradient-to-br from-[#ff4d00] to-[#ff6a33] p-4">
                    <div className="mb-1 text-[8px] font-bold tracking-wider text-white/70 uppercase">Tweet Card</div>
                    <div className="font-[family-name:var(--font-bebas-neue)] text-sm text-white">
                      Product Launch
                    </div>
                  </div>
                  <div className="px-3 py-1.5">
                    <span className="text-[8px] text-[#1a1a1a]/40">1080 x 1080</span>
                  </div>
                </div>

                {/* Stacked card — Receipt */}
                <div className="absolute -top-4 -left-4 z-30 w-36 overflow-hidden border-2 border-[#1a1a1a]/10 bg-white shadow-xl md:-left-8">
                  <div className="p-4">
                    <div className="mb-2 text-[8px] font-bold tracking-wider text-[#1a1a1a]/40 uppercase">
                      Receipt
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[7px] text-[#1a1a1a]/50">
                        <span>Item 1</span>
                        <span>$29.00</span>
                      </div>
                      <div className="flex justify-between text-[7px] text-[#1a1a1a]/50">
                        <span>Item 2</span>
                        <span>$15.00</span>
                      </div>
                      <div className="border-t border-dashed border-[#1a1a1a]/10 pt-1">
                        <div className="flex justify-between text-[7px] font-bold">
                          <span>Total</span>
                          <span>$44.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#f5f0e8] px-3 py-1">
                    <span className="text-[7px] text-[#ff4d00]">PNG</span>
                  </div>
                </div>

                {/* Decorative dots */}
                <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
                  {[0, 1, 2].map((j) => (
                    <div
                      key={j}
                      className={`h-2 w-2 rounded-full ${j === 0 ? "bg-[#ff4d00]" : "bg-[#1a1a1a]/10"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── STATS BAR ──────────────── */}
      <section className="relative z-10 border-y-2 border-[#1a1a1a]/10 bg-[#1a1a1a] px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { value: "<200ms", label: "Average Latency" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "3", label: "Output Formats" },
            { value: "0", label: "Cold Starts" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-[family-name:var(--font-bebas-neue)] text-3xl text-[#ff4d00] md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] tracking-wider text-[#f5f0e8]/40 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────── USE CASE GALLERY ──────────────── */}
      <section className="relative z-10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff4d00] uppercase">Use Cases</span>
          </div>
          <h2 className="mb-4 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            One API, Infinite Possibilities
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-sm text-[#1a1a1a]/40">
            Any HTML you can write, we can render. Here&apos;s what developers are building.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "OG Images",
                tag: "SEO",
                desc: "Dynamic previews for every page. Unique branded images that boost CTR from search and social.",
                bg: "from-[#1a1a1a] to-[#333]",
                preview: (
                  <div className="flex h-full flex-col justify-between p-3">
                    <div className="text-[8px] font-bold text-[#ff4d00]">BLOG</div>
                    <div className="font-[family-name:var(--font-bebas-neue)] text-sm text-white">Article Title</div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-[#ff4d00]" />
                      <span className="text-[7px] text-white/50">htmlpix.com</span>
                    </div>
                  </div>
                ),
              },
              {
                title: "Social Cards",
                tag: "Social",
                desc: "Twitter/X, LinkedIn, Discord — auto-generate cards from app data. Real-time, always fresh.",
                bg: "from-[#ff4d00] to-[#ff6a33]",
                preview: (
                  <div className="flex h-full items-center justify-center p-3">
                    <div className="text-center">
                      <div className="font-[family-name:var(--font-bebas-neue)] text-lg text-white">Launch Day</div>
                      <div className="text-[7px] text-white/60">@yourapp</div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Receipts",
                tag: "Commerce",
                desc: "Pixel-perfect documents from templates. Attach to emails, archive as images, print-ready quality.",
                bg: "from-[#f5f0e8] to-[#e8e0d5]",
                preview: (
                  <div className="flex h-full flex-col justify-between p-3">
                    <div className="text-[8px] font-bold text-[#1a1a1a]/50">RECEIPT</div>
                    <div className="space-y-0.5">
                      <div className="h-1 w-3/4 rounded-full bg-[#1a1a1a]/10" />
                      <div className="h-1 w-1/2 rounded-full bg-[#1a1a1a]/10" />
                    </div>
                    <div className="text-right text-[8px] font-bold text-[#1a1a1a]">$44.00</div>
                  </div>
                ),
              },
              {
                title: "Certificates",
                tag: "Education",
                desc: "Personalized diplomas and awards at scale. Inject names, dates, course data — each one unique.",
                bg: "from-[#f5f0e8] to-[#ece5d8]",
                preview: (
                  <div className="flex h-full flex-col items-center justify-center p-3 text-center">
                    <div className="mb-1 text-[7px] tracking-wider text-[#1a1a1a]/40 uppercase">Certificate of</div>
                    <div className="font-[family-name:var(--font-bebas-neue)] text-sm text-[#1a1a1a]">Completion</div>
                    <div className="mt-1 h-px w-12 bg-[#ff4d00]" />
                  </div>
                ),
              },
              {
                title: "Email Headers",
                tag: "Marketing",
                desc: "Dynamic banners that bypass email client rendering issues. Looks identical everywhere.",
                bg: "from-[#1a1a1a] to-[#2d2d2d]",
                preview: (
                  <div className="flex h-full items-center justify-center p-3">
                    <div className="w-full rounded bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] px-3 py-2 text-center text-[8px] font-bold text-white">
                      SALE: 50% OFF
                    </div>
                  </div>
                ),
              },
              {
                title: "Data Cards",
                tag: "Analytics",
                desc: "Export dashboards, charts, and data visualizations as shareable images for reports and Slack.",
                bg: "from-[#1a1a1a] to-[#2a2a2a]",
                preview: (
                  <div className="flex h-full items-end gap-1 p-3">
                    {[40, 65, 45, 80, 55, 70].map((h, j) => (
                      <div
                        key={j}
                        className="flex-1 rounded-t bg-[#ff4d00]/60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                ),
              },
            ].map((uc, i) => (
              <div key={i} className="group">
                {/* Preview card */}
                <div
                  className={`mb-4 h-40 overflow-hidden border-2 border-[#1a1a1a]/10 bg-gradient-to-br ${uc.bg} transition-transform group-hover:-translate-y-1 group-hover:shadow-lg`}
                >
                  {uc.preview}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-[#ff4d00] uppercase">{uc.tag}</span>
                  <div className="h-px flex-grow bg-[#1a1a1a]/10" />
                </div>
                <h3 className="mt-1 font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide">{uc.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#1a1a1a]/50">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── HOW IT WORKS ──────────────── */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff4d00] uppercase">Process</span>
          </div>
          <h2 className="mb-16 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide text-[#f5f0e8] md:text-5xl">
            Three Steps. That&apos;s All.
          </h2>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-[#ff4d00]/30 to-transparent md:block" />

            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {[
                {
                  num: "01",
                  title: "Write Your HTML",
                  desc: "Design your template with any HTML and CSS. Use Tailwind, custom fonts, images — whatever you need.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  ),
                },
                {
                  num: "02",
                  title: "Call Our API",
                  desc: "One POST request with your HTML, CSS, viewport size, and output format. We handle everything else.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  ),
                },
                {
                  num: "03",
                  title: "Get Your Image",
                  desc: "Receive a PNG, JPEG, or WebP in the response body. Cache it, serve it, embed it. Done.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                  ),
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center border-2 border-[#ff4d00]/20 text-[#ff4d00]">
                    {step.icon}
                    <div className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center bg-[#ff4d00] font-[family-name:var(--font-bebas-neue)] text-sm text-white">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-[#f5f0e8]">
                    {step.title}
                  </h3>
                  <p className="mx-auto max-w-xs text-sm leading-relaxed text-[#f5f0e8]/40">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── CODE EXAMPLE ──────────────── */}
      <section className="relative z-10 bg-[#0d0d0d] px-4 py-20 md:px-8 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[#ff4d00]/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <h2 className="mb-2 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide text-[#f5f0e8] md:text-5xl">
            Integrate in Minutes
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-sm text-[#f5f0e8]/30">
            Works with any language that can make HTTP requests. Here&apos;s TypeScript.
          </p>

          <div className="overflow-hidden rounded-sm border border-[#f5f0e8]/10">
            <div className="flex items-center gap-2 border-b border-[#f5f0e8]/5 bg-[#111] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-[#f5f0e8]/40">generate-og.ts</span>
            </div>

            <div className="overflow-x-auto bg-[#0a0a0a] p-6">
              <pre className="text-[13px] leading-[1.8]">
                <code>
                  <span className="text-[#6a9955]">{`// Generate a unique OG image for each blog post\n`}</span>
                  <span className="text-[#c586c0]">export async function</span>
                  <span className="text-[#dcdcaa]"> generateOG</span>
                  <span className="text-[#f5f0e8]/50">{`(title: string, author: string) {\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  "}</span>
                  <span className="text-[#c586c0]">const</span>
                  <span className="text-[#9cdcfe]"> res</span>
                  <span className="text-[#f5f0e8]/50"> = </span>
                  <span className="text-[#c586c0]">await</span>
                  <span className="text-[#dcdcaa]"> fetch</span>
                  <span className="text-[#f5f0e8]/50">(</span>
                  <span className="text-[#ce9178]">{`'https://api.htmlpix.com/render'`}</span>
                  <span className="text-[#f5f0e8]/50">{`, {\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"    "}</span>
                  <span className="text-[#9cdcfe]">method</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#ce9178]">{`'POST'`}</span>
                  <span className="text-[#f5f0e8]/50">{`,\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"    "}</span>
                  <span className="text-[#9cdcfe]">headers</span>
                  <span className="text-[#f5f0e8]/50">{`: { `}</span>
                  <span className="text-[#ce9178]">{`'Authorization'`}</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#ce9178]">{`\`Bearer \${`}</span>
                  <span className="text-[#9cdcfe]">API_KEY</span>
                  <span className="text-[#ce9178]">{`}\``}</span>
                  <span className="text-[#f5f0e8]/50">{` },\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"    "}</span>
                  <span className="text-[#9cdcfe]">body</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#9cdcfe]">JSON</span>
                  <span className="text-[#f5f0e8]/50">{`.`}</span>
                  <span className="text-[#dcdcaa]">stringify</span>
                  <span className="text-[#f5f0e8]/50">{`({\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"      "}</span>
                  <span className="text-[#9cdcfe]">html</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#ce9178]">{`\`<div class="og">\${`}</span>
                  <span className="text-[#9cdcfe]">title</span>
                  <span className="text-[#ce9178]">{`} by \${`}</span>
                  <span className="text-[#9cdcfe]">author</span>
                  <span className="text-[#ce9178]">{`}</div>\``}</span>
                  <span className="text-[#f5f0e8]/50">{`,\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"      "}</span>
                  <span className="text-[#9cdcfe]">viewport</span>
                  <span className="text-[#f5f0e8]/50">{`: { `}</span>
                  <span className="text-[#9cdcfe]">width</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#b5cea8]">1200</span>
                  <span className="text-[#f5f0e8]/50">{`, `}</span>
                  <span className="text-[#9cdcfe]">height</span>
                  <span className="text-[#f5f0e8]/50">{`: `}</span>
                  <span className="text-[#b5cea8]">630</span>
                  <span className="text-[#f5f0e8]/50">{` },\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"    }"}</span>
                  <span className="text-[#f5f0e8]/50">{`),\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  }"}</span>
                  <span className="text-[#f5f0e8]/50">{`);\n\n`}</span>
                  <span className="text-[#f5f0e8]/50">{"  "}</span>
                  <span className="text-[#c586c0]">return</span>
                  <span className="text-[#9cdcfe]"> res</span>
                  <span className="text-[#f5f0e8]/50">{`.`}</span>
                  <span className="text-[#dcdcaa]">arrayBuffer</span>
                  <span className="text-[#f5f0e8]/50">{`(); `}</span>
                  <span className="text-[#6a9955]">// PNG binary</span>
                  <span className="text-[#f5f0e8]/50">{`\n}`}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── TESTIMONIAL / SOCIAL PROOF ──────────────── */}
      <section className="relative z-10 border-y-2 border-[#1a1a1a]/10 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff4d00] uppercase">
              Developer Feedback
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                quote:
                  "We were running our own Puppeteer cluster. Switched to HTMLPix and deleted 2,000 lines of infra code. The API just works.",
                author: "Sarah K.",
                role: "CTO, SaaS Startup",
              },
              {
                quote:
                  "Generating OG images used to be our most fragile pipeline. Now it's a single fetch call. Our preview images went from broken 30% of the time to 100% reliable.",
                author: "Marcus L.",
                role: "Full-Stack Developer",
              },
            ].map((t, i) => (
              <div key={i} className="border-l-2 border-[#ff4d00] pl-6">
                <p className="mb-4 text-sm leading-relaxed text-[#1a1a1a]/70">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-xs font-bold text-[#1a1a1a]">{t.author}</div>
                  <div className="text-[10px] text-[#1a1a1a]/40">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── PRICING ──────────────── */}
      <section className="relative z-10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff4d00] uppercase">Pricing</span>
          </div>
          <h2 className="mb-3 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            Start Free, Scale Seamlessly
          </h2>
          <p className="mx-auto mb-16 max-w-md text-center text-sm text-[#1a1a1a]/40">
            Every plan includes all features. You&apos;re only paying for volume.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Free", price: 0, renders: "50", planId: "free" },
              { name: "Starter", price: 8, renders: "1,000", planId: "starter" },
              { name: "Pro", price: 15, renders: "3,000", planId: "pro", popular: true },
              { name: "Scale", price: 35, renders: "10,000", planId: "scale" },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col border-2 p-8 transition-all hover:-translate-y-1 ${
                  plan.popular ? "border-[#ff4d00] bg-[#1a1a1a] text-[#f5f0e8]" : "border-[#1a1a1a]/15"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff4d00] px-4 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    Recommended
                  </div>
                )}

                <h3 className="mb-1 font-[family-name:var(--font-bebas-neue)] text-3xl">{plan.name}</h3>

                <div className="mb-6 flex items-baseline gap-1">
                  <span
                    className={`font-[family-name:var(--font-bebas-neue)] text-5xl ${plan.popular ? "text-[#ff4d00]" : "text-[#ff4d00]"}`}
                  >
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className={plan.popular ? "text-[#f5f0e8]/30" : "text-[#1a1a1a]/30"}>/mo</span>
                  )}
                </div>

                <div
                  className={`mb-6 border-y py-4 text-sm ${plan.popular ? "border-[#f5f0e8]/10 text-[#f5f0e8]/60" : "border-[#1a1a1a]/10 text-[#1a1a1a]/60"}`}
                >
                  <span className="font-bold">{plan.renders}</span> renders/month
                </div>

                <ul className="mb-8 flex-grow space-y-2">
                  {["All formats", "Any viewport", "Google Fonts", "REST API"].map((f, j) => (
                    <li
                      key={j}
                      className={`flex items-center gap-2 text-xs ${plan.popular ? "text-[#f5f0e8]/50" : "text-[#1a1a1a]/40"}`}
                    >
                      <div className="h-1 w-1 bg-[#ff4d00]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/login?plan=${plan.planId}`}
                  className={`mt-auto block py-3 text-center text-xs font-bold tracking-wider uppercase transition-colors ${
                    plan.popular
                      ? "bg-[#ff4d00] text-white hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
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

      {/* ──────────────── CTA ──────────────── */}
      <section className="relative z-10 overflow-hidden bg-[#ff4d00] px-4 py-20 md:px-8 md:py-28">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border-[40px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full border-[60px] border-white/5" />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-4xl text-white sm:text-6xl md:text-7xl">
            Your First Image is
            <br />
            60 Seconds Away
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-white/70">
            Sign up, grab your API key, make your first render. No credit card, no commitment, no catch.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white px-8 py-4 font-bold tracking-wider text-[#ff4d00] uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white"
          >
            Create Free Account
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
            <Link href="/status" className="transition-colors hover:text-[#ff4d00]">Status</Link>
            <Link href="/login" className="transition-colors hover:text-[#ff4d00]">Login</Link>
          </div>
          <span className="text-xs text-[#1a1a1a]/20">&copy; 2026 HTMLPix</span>
        </div>
      </footer>
    </div>
  );
}
