import Link from "next/link";

export default function Home() {
  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      {/* Blueprint grid background - warm tones */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
              linear-gradient(rgba(26,26,26,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26,26,26,0.08) 1px, transparent 1px)
            `,
          backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        }}
      />

      {/* Corner markers */}
      <div className="fixed top-4 left-4 z-50 h-8 w-8 border-t-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed top-4 right-4 z-50 h-8 w-8 border-t-2 border-r-2 border-[#1a1a1a]/20" />
      <div className="fixed bottom-4 left-4 z-50 h-8 w-8 border-b-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed right-4 bottom-4 z-50 h-8 w-8 border-r-2 border-b-2 border-[#1a1a1a]/20" />
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 bg-[#f5f0e8]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6 md:px-0">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center border-2 border-[#1a1a1a]">
              <span className="font-bold text-[#1a1a1a]">{"<>"}</span>
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#ff4d00]" />
            </div>
            <div>
              <div className="text-xs tracking-widest text-[#1a1a1a]/40 uppercase">Project</div>
              <div className="font-bold tracking-wider">HTMLPIX</div>
            </div>
          </Link>

          <div className="flex items-center gap-8 text-xs tracking-widest uppercase">
            <Link
              href="#spec"
              className="flex items-center gap-2 text-[#1a1a1a]/50 transition-colors hover:text-[#ff4d00]"
            >
              <span className="h-1 w-1 bg-current" />
              Specifications
            </Link>
            <Link
              href="#pricing"
              className="flex items-center gap-2 text-[#1a1a1a]/50 transition-colors hover:text-[#ff4d00]"
            >
              <span className="h-1 w-1 bg-current" />
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-[#1a1a1a] px-5 py-2 text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f0e8]"
            >
              ACCESS API →
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center px-8 pt-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - main content */}
            <div className="col-span-12 lg:col-span-7">
              {/* Technical annotation */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#ff4d00]/50 to-transparent" />
                <span className="text-xs tracking-widest text-[#ff4d00] uppercase">REV 2.0</span>
              </div>

              <h1 className="mb-8 font-[family-name:var(--font-bebas-neue)] text-6xl leading-tight tracking-tight md:text-8xl">
                <span className="text-[#ff4d00]">HTML</span>
                <span className="mx-4 text-[#1a1a1a]/20">→</span>
                <span>IMAGE</span>
              </h1>

              <div className="relative mb-12 border-l-2 border-[#1a1a1a]/20 pl-8">
                <div className="absolute top-0 left-0 h-2 w-2 -translate-x-[5px] bg-[#ff4d00]" />
                <p className="max-w-xl text-lg leading-relaxed text-[#1a1a1a]/60">
                  Precision rendering API for developers. Transform your HTML and CSS markup into
                  pixel-perfect image assets with sub-200ms latency.
                </p>
              </div>

              {/* Specs table */}
              <div className="mb-8 border-2 border-[#1a1a1a]/10">
                <div className="grid grid-cols-3 text-xs">
                  {[
                    { label: "AVG LATENCY", value: "<200ms" },
                    { label: "UPTIME SLA", value: "99.9%" },
                    { label: "FORMATS", value: "PNG/JPG/WEBP" },
                  ].map((spec, i) => (
                    <div key={i} className={`p-4 ${i !== 2 ? "border-r-2 border-[#1a1a1a]/10" : ""}`}>
                      <div className="mb-1 tracking-wider text-[#1a1a1a]/40 uppercase">{spec.label}</div>
                      <div className="text-lg font-bold text-[#ff4d00]">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-4 bg-[#ff4d00] px-8 py-4 text-[#f5f0e8] transition-colors hover:bg-[#1a1a1a]"
              >
                <span className="text-sm font-bold tracking-widest uppercase">Request API Access</span>
                <svg
                  className="h-5 w-5 transform transition-transform group-hover:translate-x-1"
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

            {/* Right side - technical diagram */}
            <div className="col-span-12 lg:col-span-5">
              <div className="relative">
                {/* Diagram box */}
                <div className="relative border-2 border-[#1a1a1a]/20 bg-[#f5f0e8] p-8">
                  {/* Corner annotations */}
                  <div className="absolute -top-6 left-4 text-xs text-[#1a1a1a]/30">FIG. 01</div>
                  <div className="absolute -top-6 right-4 text-xs text-[#1a1a1a]/30">SCALE 1:1</div>

                  {/* Flow diagram */}
                  <div className="space-y-6">
                    {/* Input */}
                    <div className="border-2 border-dashed border-[#1a1a1a]/20 p-4">
                      <div className="mb-2 text-xs text-[#ff4d00]">INPUT</div>
                      <pre className="text-sm text-[#1a1a1a]/70">
                        {`<div class="card">
    <h1>Hello</h1>
  </div>`}
                      </pre>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[#ff4d00]">
                        <div className="h-px w-8 bg-current" />
                        <span className="text-xs font-bold">PROCESS</span>
                        <div className="h-px w-8 bg-current" />
                        <div className="h-0 w-0 border-y-4 border-l-4 border-y-transparent border-l-current" />
                      </div>
                    </div>

                    {/* Processing steps */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {["PARSE", "RENDER", "ENCODE"].map((step, i) => (
                        <div
                          key={i}
                          className="border-2 border-[#1a1a1a]/10 py-2 font-bold text-[#1a1a1a]/50"
                        >
                          {step}
                        </div>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[#ff4d00]">
                        <div className="h-px w-8 bg-current" />
                        <span className="text-xs font-bold">OUTPUT</span>
                        <div className="h-px w-8 bg-current" />
                        <div className="h-0 w-0 border-y-4 border-l-4 border-y-transparent border-l-current" />
                      </div>
                    </div>

                    {/* Output */}
                    <div className="border-2 border-[#ff4d00] bg-[#ff4d00]/5 p-4">
                      <div className="mb-2 text-xs font-bold text-[#ff4d00]">OUTPUT</div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-16 items-center justify-center border-2 border-[#1a1a1a]/30 text-[#1a1a1a]/50">
                          .PNG
                        </div>
                        <div className="text-xs text-[#1a1a1a]/50">
                          <div>1200 × 630 px</div>
                          <div>24-bit color</div>
                          <div>~245 KB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dimension lines */}
                  <div className="absolute top-0 -right-8 bottom-0 flex flex-col items-center justify-center">
                    <div className="h-full w-px bg-[#1a1a1a]/10" />
                    <div className="absolute top-0 h-px w-4 bg-[#1a1a1a]/10" />
                    <div className="absolute bottom-0 h-px w-4 bg-[#1a1a1a]/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Specifications Section */}
      <section id="spec" className="relative z-10 px-8 py-32">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-16 flex items-center gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 02
            </div>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide">
              Technical Specifications
            </h2>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "01",
                title: "Viewport Control",
                desc: "Custom width & height. Perfect for OG images (1200×630), social cards, or any dimension.",
              },
              {
                id: "02",
                title: "CSS Injection",
                desc: "Pass inline styles or external CSS. Full support for modern CSS including Grid and Flexbox.",
              },
              {
                id: "03",
                title: "Font Loading",
                desc: "Google Fonts auto-detected. Custom fonts via @font-face. Perfect typography every time.",
              },
              {
                id: "04",
                title: "Output Formats",
                desc: "PNG for transparency, JPEG for photos, WebP for optimal size. Configurable quality.",
              },
            ].map((spec, i) => (
              <div
                key={i}
                className="group border-t-2 border-[#1a1a1a] p-6 transition-colors hover:bg-[#1a1a1a]/5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-xs text-[#1a1a1a]/30">{spec.id}</span>
                  <div className="h-2 w-2 bg-[#1a1a1a]/10 transition-colors group-hover:bg-[#ff4d00]" />
                </div>
                <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-[#1a1a1a]">
                  {spec.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/50">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Code Example */}
      <section className="relative z-10 bg-[#1a1a1a] px-8 py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-center gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 03
            </div>
            <div className="h-px flex-grow bg-[#f5f0e8]/10" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide text-[#f5f0e8]">
              Implementation
            </h2>
            <div className="h-px flex-grow bg-[#f5f0e8]/10" />
          </div>

          <div className="relative border-2 border-[#f5f0e8]/20">
            {/* Tab */}
            <div className="absolute -top-px left-8 bg-[#1a1a1a] px-4">
              <span className="text-xs tracking-wider text-[#ff4d00] uppercase">api-request.ts</span>
            </div>

            <div className="p-8 pt-10">
              <pre className="overflow-x-auto text-sm">
                <code className="text-[#f5f0e8]/70">
                  {`const renderImage = async () => {
    const response = await fetch('https://api.htmlpix.com/render', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.HTMLPIX_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html: '<div class="og-card">...</div>',
        css: '.og-card { background: #fff; }',
        viewport: { width: 1200, height: 630 },
        format: 'png'
      })
    });

    return response.arrayBuffer();
  };`}
                </code>
              </pre>
            </div>

            {/* Bottom annotations */}
            <div className="flex justify-between border-t border-[#f5f0e8]/10 px-8 py-3 text-xs text-[#f5f0e8]/30">
              <span>TypeScript / Node.js</span>
              <span>Lines: 18</span>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-8 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-center gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 04
            </div>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide">
              Pricing Schedule
            </h2>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                tier: "TIER-A",
                name: "Starter",
                price: 8,
                renders: "1,000",
                desc: "For prototypes & side projects",
              },
              {
                tier: "TIER-B",
                name: "Pro",
                price: 15,
                renders: "3,000",
                desc: "For production applications",
                recommended: true,
              },
              {
                tier: "TIER-C",
                name: "Scale",
                price: 35,
                renders: "10,000",
                desc: "For high-volume requirements",
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 transition-all hover:-translate-y-1 ${
                  plan.recommended
                    ? "border-2 border-[#ff4d00] bg-[#1a1a1a] text-[#f5f0e8]"
                    : "border-2 border-[#1a1a1a]"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-8 bg-[#ff4d00] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
                    Popular
                  </div>
                )}

                <div className={`mb-2 text-xs ${plan.recommended ? "text-[#ff4d00]" : "text-[#1a1a1a]/30"}`}>
                  {plan.tier}
                </div>
                <h3 className="mb-1 font-[family-name:var(--font-bebas-neue)] text-3xl">{plan.name}</h3>
                <p className={`mb-6 text-sm ${plan.recommended ? "text-[#f5f0e8]/50" : "text-[#1a1a1a]/40"}`}>
                  {plan.desc}
                </p>

                <div
                  className={`mb-6 border-y py-6 ${plan.recommended ? "border-[#f5f0e8]/10" : "border-[#1a1a1a]/10"}`}
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-[family-name:var(--font-bebas-neue)] text-6xl ${plan.recommended ? "text-[#ff4d00]" : "text-[#ff4d00]"}`}
                    >
                      ${plan.price}
                    </span>
                    <span className={plan.recommended ? "text-[#f5f0e8]/30" : "text-[#1a1a1a]/30"}>
                      /month
                    </span>
                  </div>
                  <div
                    className={`mt-2 text-sm ${plan.recommended ? "text-[#f5f0e8]/50" : "text-[#1a1a1a]/50"}`}
                  >
                    {plan.renders} renders included
                  </div>
                </div>

                <ul className="mb-8 space-y-3 text-sm">
                  {[
                    "All export formats",
                    "Custom viewports",
                    "Google Fonts",
                    "API access",
                    "Email support",
                  ].map((f, j) => (
                    <li
                      key={j}
                      className={`flex items-center gap-3 ${plan.recommended ? "text-[#f5f0e8]/60" : "text-[#1a1a1a]/60"}`}
                    >
                      <div className="h-1.5 w-1.5 bg-[#ff4d00]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block py-3 text-center text-sm font-bold tracking-wider uppercase transition-colors ${
                    plan.recommended
                      ? "bg-[#ff4d00] text-white hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
                      : "bg-[#1a1a1a] text-[#f5f0e8] hover:bg-[#ff4d00]"
                  }`}
                >
                  Select {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="relative z-10 bg-[#ff4d00] px-8 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-6xl text-white md:text-8xl">
            READY TO BUILD?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/70">
            Get your API key and start rendering images in minutes. Full documentation included.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-4 bg-white px-10 py-5 font-bold tracking-wider text-[#ff4d00] uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white"
          >
            Access API Documentation
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <footer className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-8 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#1a1a1a]">
              <span className="text-xs font-bold text-[#1a1a1a]">HP</span>
            </div>
            <span className="font-bold tracking-wider">HTMLPIX</span>
          </div>
          <div className="flex gap-8 text-xs tracking-widest text-[#1a1a1a]/30 uppercase">
            <Link href="#" className="transition-colors hover:text-[#ff4d00]">
              Documentation
            </Link>
            <Link href="#" className="transition-colors hover:text-[#ff4d00]">
              GitHub
            </Link>
            <Link href="#" className="transition-colors hover:text-[#ff4d00]">
              Status
            </Link>
          </div>
          <span className="text-xs text-[#1a1a1a]/20">© 2025 HTMLPix v2.0</span>
        </div>
      </footer>
    </div>
  );
}
