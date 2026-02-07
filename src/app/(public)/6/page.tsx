import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

export default function LandingV6() {
  return (
    <div
      className="relative min-h-screen overflow-hidden font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      {/* Minimal dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, #1a1a1a 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <PublicHeader />

      {/* ──────────────── HERO ──────────────── */}
      <section className="relative z-10 px-4 pt-32 pb-20 md:px-8 md:pt-44 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-6xl leading-[0.9] tracking-tight sm:text-7xl md:text-[6.5rem] lg:text-[8rem]">
              One API Call.
              <br />
              <span className="text-[#ff4d00]">Any HTML.</span>
              <br />
              Perfect Image.
            </h1>

            <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-[#1a1a1a]/50 md:text-lg">
              Stop wrestling with Puppeteer, Playwright, and headless browser infrastructure.
              Send HTML, get a screenshot. That simple.
            </p>

            {/* Inline mini code example */}
            <div className="mx-auto mb-10 max-w-xl overflow-hidden rounded-sm border border-[#1a1a1a]/15 bg-[#1a1a1a] text-left">
              <div className="flex items-center gap-2 border-b border-[#f5f0e8]/5 px-4 py-2">
                <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <div className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <div className="h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[10px] text-[#f5f0e8]/30">curl</span>
              </div>
              <div className="overflow-x-auto px-4 py-3">
                <pre className="text-xs leading-relaxed md:text-[13px]">
                  <span className="text-[#dcdcaa]">curl</span>
                  <span className="text-[#f5f0e8]/50"> -X POST </span>
                  <span className="text-[#ce9178]">https://api.htmlpix.com/render</span>
                  <span className="text-[#f5f0e8]/50">{` \\\n  -H `}</span>
                  <span className="text-[#ce9178]">{`"Authorization: Bearer $KEY"`}</span>
                  <span className="text-[#f5f0e8]/50">{` \\\n  -d `}</span>
                  <span className="text-[#ce9178]">{`'{"html":"<h1>Hello</h1>","viewport":{"width":1200,"height":630}}'`}</span>
                  <span className="text-[#f5f0e8]/50">{` \\\n  -o `}</span>
                  <span className="text-[#9cdcfe]">output.png</span>
                </pre>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex items-center gap-3 bg-[#ff4d00] px-10 py-4 text-[#f5f0e8] transition-all hover:bg-[#1a1a1a] hover:shadow-xl"
              >
                <span className="text-sm font-bold tracking-widest uppercase">Get API Key — Free</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-xs text-[#1a1a1a]/30">No credit card required</span>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-px bg-[#1a1a1a]/10 md:grid-cols-4">
              {[
                { value: "<200ms", label: "Latency" },
                { value: "99.9%", label: "Uptime" },
                { value: "PNG/JPG/WebP", label: "Formats" },
                { value: "0", label: "Cold starts" },
              ].map((s, i) => (
                <div key={i} className="bg-[#f5f0e8] px-4 py-5 text-center">
                  <div className="font-[family-name:var(--font-bebas-neue)] text-xl text-[#ff4d00] md:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] tracking-wider text-[#1a1a1a]/30 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── PAIN POINTS ──────────────── */}
      <section className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            Problems You&apos;ll Never Deal With Again
          </h2>
          <p className="mx-auto mb-16 max-w-md text-center text-sm text-[#1a1a1a]/40">
            Every developer who&apos;s self-hosted Puppeteer knows these pain points.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                problem: "Browser crashes at 3 AM",
                solution: "Our pool auto-heals. We monitor, you sleep.",
              },
              {
                problem: "Cold starts killing latency",
                solution: "Pre-warmed browsers. Every request hits a hot instance.",
              },
              {
                problem: "Memory leaks after 1,000 renders",
                solution: "Isolated contexts per render. Zero accumulation.",
              },
              {
                problem: "Fonts not loading in time",
                solution: "We detect and wait for every font before capture.",
              },
              {
                problem: "Docker images are 2 GB",
                solution: "No Docker needed. It's an HTTP call.",
              },
              {
                problem: "Scaling past 10 concurrent renders",
                solution: "Our cluster scales horizontally. You just call the API.",
              },
            ].map((item, i) => (
              <div key={i} className="group border-2 border-[#1a1a1a]/10 p-6 transition-colors hover:border-[#ff4d00]/30">
                <div className="mb-3 flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1a1a1a]/20">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-[#1a1a1a]/60 line-through decoration-[#ff4d00]/40">
                    {item.problem}
                  </span>
                </div>
                <div className="flex items-start gap-3 pl-0">
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ff4d00]">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[#1a1a1a]/80">{item.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── COMPARISON TABLE ──────────────── */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide text-[#f5f0e8] md:text-5xl">
            Self-Hosted vs. HTMLPix
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-sm text-[#f5f0e8]/30">
            Why manage a rendering cluster when you can make an API call?
          </p>

          <div className="overflow-hidden border border-[#f5f0e8]/10">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-[#f5f0e8]/10 text-xs font-bold tracking-wider uppercase">
              <div className="p-4 text-[#f5f0e8]/30" />
              <div className="border-l border-[#f5f0e8]/10 p-4 text-center text-[#f5f0e8]/50">DIY Puppeteer</div>
              <div className="border-l border-[#ff4d00]/30 bg-[#ff4d00]/10 p-4 text-center text-[#ff4d00]">
                HTMLPix
              </div>
            </div>

            {/* Rows */}
            {[
              { feature: "Setup time", diy: "Hours to days", pix: "60 seconds" },
              { feature: "Infrastructure", diy: "VPS + Docker + monitoring", pix: "None" },
              { feature: "Cold starts", diy: "2-5 seconds", pix: "0 ms" },
              { feature: "Scaling", diy: "Manual orchestration", pix: "Automatic" },
              { feature: "Font handling", diy: "DIY font injection", pix: "Auto-detected" },
              { feature: "Maintenance", diy: "Ongoing", pix: "Zero" },
              { feature: "Cost", diy: "$20-50/mo + eng time", pix: "From $0/mo" },
            ].map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-[#f5f0e8]/[0.02]" : ""} ${i < 6 ? "border-b border-[#f5f0e8]/5" : ""}`}
              >
                <div className="p-4 text-xs font-bold text-[#f5f0e8]/50">{row.feature}</div>
                <div className="border-l border-[#f5f0e8]/5 p-4 text-center text-xs text-[#f5f0e8]/30">
                  {row.diy}
                </div>
                <div className="border-l border-[#ff4d00]/10 bg-[#ff4d00]/5 p-4 text-center text-xs font-bold text-[#ff4d00]">
                  {row.pix}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── FEATURES — COMPACT ──────────────── */}
      <section className="relative z-10 border-b-2 border-[#1a1a1a]/10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            Everything You Need
          </h2>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Custom Viewports",
                desc: "Any width and height. Standard presets for OG, Twitter, Instagram, or go fully custom.",
              },
              {
                title: "CSS Injection",
                desc: "Pass CSS alongside your HTML. Grid, Flexbox, animations, variables — full modern CSS support.",
              },
              {
                title: "Google Fonts",
                desc: "Auto-detected from your HTML. We load and wait for them. Custom fonts via @font-face also supported.",
              },
              {
                title: "3 Output Formats",
                desc: "PNG for transparency, JPEG for photos, WebP for optimal compression. Quality control 1-100.",
              },
              {
                title: "Remote Assets",
                desc: "Images, stylesheets, scripts — all fetched and rendered. Your HTML works like a real browser.",
              },
              {
                title: "JavaScript Execution",
                desc: "Full Chromium rendering. JS runs, DOM settles, then we capture. Dynamic content works out of the box.",
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1 h-2 w-2 flex-shrink-0 bg-[#ff4d00]" />
                <div>
                  <h3 className="mb-1 text-sm font-bold text-[#1a1a1a]">{f.title}</h3>
                  <p className="text-xs leading-relaxed text-[#1a1a1a]/45">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── PRICING — HORIZONTAL ──────────────── */}
      <section className="relative z-10 px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
            Predictable Pricing
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-sm text-[#1a1a1a]/40">
            All plans include every feature. Pick the volume that fits.
            Upgrade or downgrade anytime.
          </p>

          {/* Desktop: horizontal layout */}
          <div className="hidden lg:block">
            <div className="overflow-hidden border-2 border-[#1a1a1a]/15">
              {/* Header row */}
              <div className="grid grid-cols-5 border-b-2 border-[#1a1a1a]/10 text-xs font-bold tracking-wider uppercase">
                <div className="p-5 text-[#1a1a1a]/30">Plan</div>
                <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-[#1a1a1a]/50">Renders/mo</div>
                <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-[#1a1a1a]/50">Price</div>
                <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-[#1a1a1a]/50">Per Render</div>
                <div className="border-l border-[#1a1a1a]/10 p-5" />
              </div>

              {[
                { name: "Free", renders: "50", price: "$0", per: "$0.00", planId: "free" },
                { name: "Starter", renders: "1,000", price: "$8/mo", per: "$0.008", planId: "starter" },
                { name: "Pro", renders: "3,000", price: "$15/mo", per: "$0.005", planId: "pro", popular: true },
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
                  <div className="border-l border-[#1a1a1a]/10 p-5 text-center text-sm font-bold">{plan.renders}</div>
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

      {/* ──────────────── CTA ──────────────── */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-block border border-[#ff4d00]/30 bg-[#ff4d00]/10 px-4 py-1.5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#ff4d00] uppercase">
              50 free renders/month — forever
            </span>
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-4xl text-[#f5f0e8] sm:text-6xl md:text-7xl">
            Replace Your Rendering
            <br />
            <span className="text-[#ff4d00]">Infrastructure Today</span>
          </h2>
          <p className="mx-auto mb-8 max-w-md text-base text-[#f5f0e8]/40">
            Delete your Puppeteer setup. Cancel your rendering VPS.
            Make an API call instead.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 bg-[#ff4d00] px-10 py-4 text-white transition-colors hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
            >
              <span className="text-sm font-bold tracking-widest uppercase">Start Free</span>
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
              className="text-xs font-bold tracking-widest text-[#f5f0e8]/30 uppercase transition-colors hover:text-[#ff4d00]"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer className="relative z-10 border-t-2 border-[#1a1a1a]/10 px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
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
