import Link from "next/link";

export default function LandingVariant1() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-[family-name:var(--font-space-mono)] text-[#e0e0e0]">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)",
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 right-0 left-0 z-40 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm">
            <span className="text-[#ff4d00]">$</span>
            <span className="font-bold tracking-wider">htmlpix</span>
            <span className="text-[#555]">v2.0</span>
          </Link>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/docs" className="hidden text-[#777] transition-colors hover:text-[#ff4d00] sm:inline">
              docs
            </Link>
            <Link href="/#pricing" className="hidden text-[#777] transition-colors hover:text-[#ff4d00] sm:inline">
              pricing
            </Link>
            <Link
              href="/login"
              className="border border-[#ff4d00]/50 px-4 py-1.5 text-[#ff4d00] transition-colors hover:bg-[#ff4d00] hover:text-white"
            >
              sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center px-6 pt-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Breadcrumb line */}
          <div className="mb-12 flex items-center gap-3 text-xs text-[#555]">
            <span className="text-[#ff4d00]">~</span>
            <span>/</span>
            <span>api</span>
            <span>/</span>
            <span className="text-[#e0e0e0]">render</span>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left - copy */}
            <div>
              <h1 className="mb-8 font-[family-name:var(--font-bebas-neue)] text-5xl leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
                <span className="text-[#ff4d00]">HTML IN.</span>
                <br />
                <span className="text-[#e0e0e0]">IMAGE OUT.</span>
              </h1>

              <p className="mb-10 max-w-md text-sm leading-relaxed text-[#777]">
                One POST request. Your HTML and CSS go in, a pixel-perfect screenshot comes back.
                No Puppeteer. No Chrome. No infrastructure. Just an API key and a fetch call.
              </p>

              {/* Stats row */}
              <div className="mb-10 flex gap-8 border-t border-b border-[#1a1a1a] py-4 text-xs">
                <div>
                  <div className="text-[#555]">latency</div>
                  <div className="font-bold text-[#28c840]">&lt;200ms</div>
                </div>
                <div>
                  <div className="text-[#555]">uptime</div>
                  <div className="font-bold text-[#28c840]">99.9%</div>
                </div>
                <div>
                  <div className="text-[#555]">formats</div>
                  <div className="font-bold text-[#e0e0e0]">png/jpg/webp</div>
                </div>
                <div>
                  <div className="text-[#555]">free tier</div>
                  <div className="font-bold text-[#ff4d00]">50/mo</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="bg-[#ff4d00] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#ff6a2a]"
                >
                  Get API Key &rarr;
                </Link>
                <Link
                  href="/docs"
                  className="border border-[#333] px-6 py-3 text-sm text-[#999] transition-colors hover:border-[#ff4d00] hover:text-[#ff4d00]"
                >
                  Read Docs
                </Link>
              </div>
            </div>

            {/* Right - terminal */}
            <div className="relative">
              {/* Terminal window */}
              <div className="overflow-hidden rounded border border-[#222] bg-[#111]">
                {/* Title bar */}
                <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 text-[11px] text-[#555]">terminal</span>
                </div>

                {/* Terminal content */}
                <div className="p-5 text-[13px] leading-relaxed">
                  {/* Curl command */}
                  <div className="mb-1">
                    <span className="text-[#28c840]">$</span>{" "}
                    <span className="text-[#e0e0e0]">curl</span>{" "}
                    <span className="text-[#ff4d00]">-X POST</span>{" "}
                    <span className="text-[#e0e0e0]">https://api.htmlpix.com/render</span>{" "}
                    <span className="text-[#555]">\</span>
                  </div>
                  <div className="mb-1 pl-4">
                    <span className="text-[#ff4d00]">-H</span>{" "}
                    <span className="text-[#a5d6a7]">{`"Authorization: Bearer $HTMLPIX_KEY"`}</span>{" "}
                    <span className="text-[#555]">\</span>
                  </div>
                  <div className="mb-1 pl-4">
                    <span className="text-[#ff4d00]">-H</span>{" "}
                    <span className="text-[#a5d6a7]">{`"Content-Type: application/json"`}</span>{" "}
                    <span className="text-[#555]">\</span>
                  </div>
                  <div className="mb-1 pl-4">
                    <span className="text-[#ff4d00]">-d</span>{" "}
                    <span className="text-[#a5d6a7]">{`'{"html": "<h1>Hello</h1>", "viewport": {"width": 1200, "height": 630}}'`}</span>{" "}
                    <span className="text-[#555]">\</span>
                  </div>
                  <div className="mb-4 pl-4">
                    <span className="text-[#ff4d00]">-o</span>{" "}
                    <span className="text-[#e0e0e0]">output.png</span>
                  </div>

                  {/* Response */}
                  <div className="border-t border-[#1a1a1a] pt-4">
                    <div className="mb-2 text-[#555]">{`# Response: 200 OK (143ms)`}</div>
                    <div className="text-[#777]">
                      <span className="text-[#555]">{`{`}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#81c784]">{`"url"`}</span>
                      <span className="text-[#555]">: </span>
                      <span className="text-[#a5d6a7]">{`"https://cdn.htmlpix.com/img/abc123.png"`}</span>
                      <span className="text-[#555]">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#81c784]">{`"width"`}</span>
                      <span className="text-[#555]">: </span>
                      <span className="text-[#ffcc80]">1200</span>
                      <span className="text-[#555]">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#81c784]">{`"height"`}</span>
                      <span className="text-[#555]">: </span>
                      <span className="text-[#ffcc80]">630</span>
                      <span className="text-[#555]">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#81c784]">{`"size"`}</span>
                      <span className="text-[#555]">: </span>
                      <span className="text-[#a5d6a7]">{`"24.3 KB"`}</span>
                    </div>
                    <div>
                      <span className="text-[#555]">{`}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annotation */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#444]">
                <span>that&apos;s it. that&apos;s the whole API.</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                  live
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - 3 steps */}
      <section className="border-t border-[#1a1a1a] px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-xs text-[#555]">
            <span className="text-[#ff4d00]">#</span> how it works
          </div>

          <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Send HTML",
                desc: "POST your HTML, CSS, and viewport config to /render. Any valid HTML works — Tailwind, inline styles, even full pages.",
                code: `{ "html": "<div>...</div>" }`,
              },
              {
                step: "02",
                title: "We Render",
                desc: "Chromium renders your HTML in an isolated browser context. Fonts load, CSS applies, JavaScript executes.",
                code: `chromium → screenshot → encode`,
              },
              {
                step: "03",
                title: "Get Image",
                desc: "Receive a PNG, JPEG, or WebP back. Hosted on our CDN or as raw bytes — your choice.",
                code: `→ image/png (24.3 KB)`,
              },
            ].map((item) => (
              <div key={item.step} className="bg-[#0a0a0a] p-8">
                <div className="mb-4 text-[10px] text-[#ff4d00]">STEP {item.step}</div>
                <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide">
                  {item.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-[#666]">{item.desc}</p>
                <code className="text-xs text-[#28c840]">{item.code}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases - compact grid */}
      <section className="border-t border-[#1a1a1a] px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-xs text-[#555]">
            <span className="text-[#ff4d00]">#</span> use cases
          </div>

          <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "OG Images",
                desc: "Dynamic per-page social previews. Every blog post, product, profile gets a unique card.",
                cmd: "og:generate",
              },
              {
                name: "Social Cards",
                desc: "Twitter/X, LinkedIn, Discord. Auto-generate from your app data in real-time.",
                cmd: "social:render",
              },
              {
                name: "Invoices",
                desc: "Pixel-perfect receipts from HTML templates. Email-ready. Print-ready.",
                cmd: "invoice:create",
              },
              {
                name: "Certificates",
                desc: "Personalized diplomas, awards, badges at scale with dynamic data.",
                cmd: "cert:issue",
              },
              {
                name: "Email Banners",
                desc: "Dynamic headers that look identical in every email client.",
                cmd: "email:banner",
              },
              {
                name: "Charts & Reports",
                desc: "Render D3/Chart.js visualizations as static images for Slack, PDF, email.",
                cmd: "chart:export",
              },
            ].map((uc) => (
              <div key={uc.cmd} className="group bg-[#0a0a0a] p-6 transition-colors hover:bg-[#111]">
                <div className="mb-1 text-[10px] text-[#555] transition-colors group-hover:text-[#ff4d00]">
                  $ {uc.cmd}
                </div>
                <h3 className="mb-2 text-base font-bold text-[#e0e0e0]">{uc.name}</h3>
                <p className="text-xs leading-relaxed text-[#555]">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example - TypeScript */}
      <section className="border-t border-[#1a1a1a] px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-xs text-[#555]">
            <span className="text-[#ff4d00]">#</span> integration
          </div>

          <h2 className="mb-8 font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            <span className="text-[#ff4d00]">5 lines</span> to your first render
          </h2>

          <div className="overflow-hidden rounded border border-[#222] bg-[#111]">
            <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11px] text-[#555]">og-image.ts</span>
              </div>
              <span className="text-[11px] text-[#555]">TypeScript</span>
            </div>

            <pre className="overflow-x-auto p-5 text-[13px] leading-[1.8]">
              <code>
                <span className="text-[#c586c0]">const</span>
                <span className="text-[#9cdcfe]"> image</span>
                <span className="text-[#e0e0e0]/50"> = </span>
                <span className="text-[#c586c0]">await</span>
                <span className="text-[#dcdcaa]"> fetch</span>
                <span className="text-[#e0e0e0]/50">(</span>
                <span className="text-[#a5d6a7]">{`"https://api.htmlpix.com/render"`}</span>
                <span className="text-[#e0e0e0]/50">{`, {`}</span>
                {"\n"}
                <span className="text-[#e0e0e0]/50">{"  "}</span>
                <span className="text-[#9cdcfe]">method</span>
                <span className="text-[#e0e0e0]/50">{`: `}</span>
                <span className="text-[#a5d6a7]">{`"POST"`}</span>
                <span className="text-[#e0e0e0]/50">,</span>
                {"\n"}
                <span className="text-[#e0e0e0]/50">{"  "}</span>
                <span className="text-[#9cdcfe]">headers</span>
                <span className="text-[#e0e0e0]/50">{`: { `}</span>
                <span className="text-[#a5d6a7]">{`"Authorization"`}</span>
                <span className="text-[#e0e0e0]/50">{`: `}</span>
                <span className="text-[#a5d6a7]">{`\`Bearer \${`}</span>
                <span className="text-[#9cdcfe]">key</span>
                <span className="text-[#a5d6a7]">{`}\``}</span>
                <span className="text-[#e0e0e0]/50">{` },`}</span>
                {"\n"}
                <span className="text-[#e0e0e0]/50">{"  "}</span>
                <span className="text-[#9cdcfe]">body</span>
                <span className="text-[#e0e0e0]/50">{`: `}</span>
                <span className="text-[#9cdcfe]">JSON</span>
                <span className="text-[#e0e0e0]/50">.</span>
                <span className="text-[#dcdcaa]">stringify</span>
                <span className="text-[#e0e0e0]/50">{`({ `}</span>
                <span className="text-[#9cdcfe]">html</span>
                <span className="text-[#e0e0e0]/50">,</span>
                <span className="text-[#9cdcfe]"> viewport</span>
                <span className="text-[#e0e0e0]/50">{`: { `}</span>
                <span className="text-[#9cdcfe]">width</span>
                <span className="text-[#e0e0e0]/50">{`: `}</span>
                <span className="text-[#b5cea8]">1200</span>
                <span className="text-[#e0e0e0]/50">{`, `}</span>
                <span className="text-[#9cdcfe]">height</span>
                <span className="text-[#e0e0e0]/50">{`: `}</span>
                <span className="text-[#b5cea8]">630</span>
                <span className="text-[#e0e0e0]/50">{` } })`}</span>
                {"\n"}
                <span className="text-[#e0e0e0]/50">{`});`}</span>
              </code>
            </pre>
          </div>

          <p className="mt-4 text-xs text-[#555]">
            Works with any language. If it can make HTTP requests, it can use HTMLPix.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-[#1a1a1a] px-6 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-xs text-[#555]">
            <span className="text-[#ff4d00]">#</span> pricing
          </div>

          <div className="grid gap-px bg-[#1a1a1a] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Free", price: "$0", renders: "50", desc: "No credit card", planId: "free" },
              { name: "Starter", price: "$8", renders: "1,000", desc: "Side projects", planId: "starter" },
              { name: "Pro", price: "$15", renders: "3,000", desc: "Production", planId: "pro", popular: true },
              { name: "Scale", price: "$35", renders: "10,000", desc: "High volume", planId: "scale" },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#0a0a0a] p-8 ${plan.popular ? "ring-1 ring-[#ff4d00]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-px right-4 left-4 h-px bg-[#ff4d00]" />
                )}
                <div className="mb-1 text-[10px] text-[#555]">{plan.popular ? "RECOMMENDED" : "\u00A0"}</div>
                <h3 className="mb-1 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide">
                  {plan.name}
                </h3>
                <p className="mb-6 text-xs text-[#555]">{plan.desc}</p>
                <div className="mb-1 font-[family-name:var(--font-bebas-neue)] text-4xl text-[#ff4d00]">
                  {plan.price}
                </div>
                <div className="mb-6 text-xs text-[#555]">/month</div>
                <div className="mb-6 border-t border-[#1a1a1a] pt-4 text-sm text-[#999]">
                  {plan.renders} renders/mo
                </div>
                <Link
                  href={`/login?plan=${plan.planId}`}
                  className={`block py-2.5 text-center text-xs font-bold tracking-wider uppercase transition-colors ${
                    plan.popular
                      ? "bg-[#ff4d00] text-white hover:bg-[#ff6a2a]"
                      : "border border-[#333] text-[#999] hover:border-[#ff4d00] hover:text-[#ff4d00]"
                  }`}
                >
                  {plan.price === "$0" ? "Start Free" : "Select"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#1a1a1a] px-6 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-block border border-[#222] bg-[#111] px-4 py-2 text-[13px]">
            <span className="text-[#28c840]">$</span>{" "}
            <span className="text-[#e0e0e0]">htmlpix init</span>
          </div>
          <h2 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide sm:text-6xl md:text-7xl">
            <span className="text-[#ff4d00]">YOUR HTML</span>
            <br />
            <span className="text-[#e0e0e0]">DESERVES PIXELS</span>
          </h2>
          <p className="mb-8 text-sm text-[#555]">
            50 free renders/month. No credit card. API key in 30 seconds.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#ff4d00] px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-[#ff6a2a]"
          >
            Get Your API Key &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-[11px] text-[#444]">
          <span>htmlpix &copy; 2026</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-[#ff4d00]">docs</Link>
            <a href="https://status.htmlpix.com" className="hover:text-[#ff4d00]">status</a>
            <Link href="/login" className="hover:text-[#ff4d00]">login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
