import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

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
      <PublicHeader />
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center px-4 pt-24 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-12 gap-4 md:gap-8">
            {/* Left side - main content */}
            <div className="col-span-12 lg:col-span-7">
              {/* Technical annotation */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-0.5 flex-grow bg-gradient-to-r from-[#ff4d00]/50 to-transparent" />
                <span className="text-xs tracking-widest text-[#ff4d00] uppercase">REV 2.0</span>
              </div>

              <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-5xl leading-tight tracking-tight sm:text-6xl md:mb-8 md:text-8xl">
                <span className="text-[#ff4d00]">HTML</span>
                <span className="mx-2 text-[#1a1a1a]/20 md:mx-4">→</span>
                <span>IMAGE</span>
              </h1>

              <div className="relative mb-8 border-l-2 border-[#1a1a1a]/20 pl-6 md:mb-12 md:pl-8">
                <div className="absolute top-0 left-0 h-2 w-2 -translate-x-[5px] bg-[#ff4d00]" />
                <p className="max-w-xl text-base leading-relaxed text-[#1a1a1a]/60 md:text-lg">
                  Generate images from HTML/CSS with a single API call. OG images, social cards,
                  receipts, certificates — at scale. Free tier included.
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

              <Link
                href="/login"
                className="group inline-flex items-center gap-3 bg-[#ff4d00] px-6 py-3 text-[#f5f0e8] transition-colors hover:bg-[#1a1a1a] md:gap-4 md:px-8 md:py-4"
              >
                <span className="text-xs font-bold tracking-widest uppercase md:text-sm">
                  Start Free
                </span>
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

            {/* Right side - technical diagram */}
            <div className="col-span-12 mt-8 lg:col-span-5 lg:mt-0">
              <div className="relative">
                {/* Diagram box */}
                <div className="relative border-2 border-[#1a1a1a]/20 bg-[#f5f0e8] p-4 md:p-8">
                  {/* Corner annotations */}
                  <div className="absolute -top-6 left-4 text-xs text-[#1a1a1a]/30">FIG. 01</div>
                  <div className="absolute -top-6 right-4 text-xs text-[#1a1a1a]/30">SCALE 1:1</div>

                  {/* Flow diagram */}
                  <div className="space-y-6">
                    {/* Input */}
                    <div className="relative overflow-hidden border-2 border-dashed border-[#1a1a1a]/20 bg-[#1a1a1a]/[0.03] p-4">
                      {/* Subtle grid pattern */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-30"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, #1a1a1a 1px, transparent 1px), linear-gradient(#1a1a1a 1px, transparent 1px)",
                          backgroundSize: "8px 8px",
                          opacity: 0.03,
                        }}
                      />
                      <div className="relative">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-[#1a1a1a]/20" />
                            <div className="h-2 w-2 rounded-full bg-[#1a1a1a]/20" />
                            <div className="h-2 w-2 rounded-full bg-[#1a1a1a]/20" />
                          </div>
                          <span className="text-[10px] tracking-wider text-[#ff4d00] uppercase">
                            input.html
                          </span>
                        </div>
                        <pre className="text-xs leading-relaxed md:text-sm">
                          <code>
                            <div>
                              <span className="text-[#1a1a1a]/40">&lt;</span>
                              <span className="font-medium text-[#ff4d00]">div</span>
                              <span className="text-[#1a1a1a]/60"> class</span>
                              <span className="text-[#1a1a1a]/40">=</span>
                              <span className="text-[#0d7377]">&quot;card&quot;</span>
                              <span className="text-[#1a1a1a]/40">&gt;</span>
                            </div>
                            <div>
                              <span className="text-[#1a1a1a]/40"> &lt;</span>
                              <span className="font-medium text-[#ff4d00]">h1</span>
                              <span className="text-[#1a1a1a]/40">&gt;</span>
                              <span className="text-[#1a1a1a]/80">Hello</span>
                              <span className="text-[#1a1a1a]/40">&lt;/</span>
                              <span className="font-medium text-[#ff4d00]">h1</span>
                              <span className="text-[#1a1a1a]/40">&gt;</span>
                            </div>
                            <div>
                              <span className="text-[#1a1a1a]/40">&lt;/</span>
                              <span className="font-medium text-[#ff4d00]">div</span>
                              <span className="text-[#1a1a1a]/40">&gt;</span>
                            </div>
                          </code>
                        </pre>
                      </div>
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
                    <div className="relative overflow-hidden border-2 border-[#ff4d00] bg-gradient-to-br from-[#ff4d00]/10 to-[#ff4d00]/5 p-4">
                      {/* Animated scan line */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-20"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, transparent 45%, #ff4d00 50%, transparent 55%, transparent 100%)",
                          backgroundSize: "100% 200%",
                          animation: "scanline 3s linear infinite",
                        }}
                      />
                      <style>{`@keyframes scanline { 0% { background-position: 0% 0%; } 100% { background-position: 0% 200%; } }`}</style>

                      <div className="relative">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-[#28c840]" />
                            <span className="text-[10px] font-bold tracking-wider text-[#ff4d00] uppercase">
                              Output Ready
                            </span>
                          </div>
                          <span className="text-[10px] text-[#1a1a1a]/40">✓ Rendered</span>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Image preview mockup */}
                          <div className="relative flex h-14 w-20 items-center justify-center overflow-hidden border-2 border-[#1a1a1a]/20 bg-white">
                            {/* Mini preview of "Hello" card */}
                            <div className="flex h-8 w-14 flex-col items-center justify-center rounded-sm bg-gradient-to-br from-[#f5f0e8] to-[#e8e0d5] shadow-sm">
                              <div className="text-[6px] font-bold text-[#1a1a1a]">Hello</div>
                            </div>
                            {/* Format badge */}
                            <div className="absolute right-0 bottom-0 bg-[#ff4d00] px-1 py-0.5 text-[6px] font-bold text-white">
                              PNG
                            </div>
                          </div>

                          {/* Specs */}
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[#1a1a1a]/40">Dimensions</span>
                              <span className="font-mono font-medium text-[#1a1a1a]/70">1200×630</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#1a1a1a]/40">Depth</span>
                              <span className="font-mono font-medium text-[#1a1a1a]/70">24-bit</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#1a1a1a]/40">Size</span>
                              <span className="font-mono font-medium text-[#1a1a1a]/70">~245KB</span>
                            </div>
                          </div>
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
      <section id="spec" className="relative z-10 px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 02
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Technical Specifications
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
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
      {/* Use Cases */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              USE CASES
            </div>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-[#f5f0e8] md:text-4xl">
              What Will You Build?
            </h2>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[
              {
                title: "OG Images",
                desc: "Dynamic Open Graph images for every page. Boost click-through rates on social media with unique, branded previews.",
                tag: "SEO",
              },
              {
                title: "Social Cards",
                desc: "Auto-generate Twitter/X cards, LinkedIn previews, and Discord embeds from your app data in real-time.",
                tag: "SOCIAL",
              },
              {
                title: "Receipts & Invoices",
                desc: "Pixel-perfect PDF-quality receipts rendered from HTML templates. Email-ready, print-ready.",
                tag: "COMMERCE",
              },
              {
                title: "Certificates",
                desc: "Generate personalized certificates, diplomas, and awards at scale with dynamic data injection.",
                tag: "EDUCATION",
              },
              {
                title: "Email Headers",
                desc: "Dynamic email banner images that bypass rendering inconsistencies across email clients.",
                tag: "MARKETING",
              },
              {
                title: "Dynamic Banners",
                desc: "Real-time promotional banners, countdown timers, and personalized hero images for any platform.",
                tag: "ADS",
              },
            ].map((useCase, i) => (
              <div
                key={i}
                className="group border border-[#f5f0e8]/10 p-6 transition-colors hover:border-[#ff4d00]/50"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-[#ff4d00] uppercase">
                    {useCase.tag}
                  </span>
                  <div className="h-1.5 w-1.5 bg-[#f5f0e8]/10 transition-colors group-hover:bg-[#ff4d00]" />
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-[#f5f0e8]">
                  {useCase.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#f5f0e8]/40">
                  {useCase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="relative z-10 overflow-hidden bg-[#0d0d0d] px-4 py-16 md:px-8 md:py-32">
        {/* Ambient glow effect */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff4d00]/5 blur-[120px]" />
        </div>

        {/* Scan lines overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)",
          }}
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 03
            </div>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-[#f5f0e8] md:text-4xl">
              Implementation
            </h2>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
          </div>

          {/* Terminal-style code window */}
          <div className="group relative">
            {/* Outer glow on hover */}
            <div className="absolute -inset-px rounded-sm bg-gradient-to-b from-[#ff4d00]/20 to-transparent opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative overflow-hidden rounded-sm border border-[#f5f0e8]/10 bg-[#0a0a0a]">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-[#f5f0e8]/5 bg-[#111] px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Traffic lights */}
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57] opacity-80" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e] opacity-80" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840] opacity-80" />
                  </div>
                  {/* Separator */}
                  <div className="h-4 w-px bg-[#f5f0e8]/10" />
                  {/* File tab */}
                  <div className="flex items-center gap-2 rounded bg-[#1a1a1a] px-3 py-1">
                    <svg className="h-4 w-4 text-[#3178c6]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h18v18H3V3zm16.525 13.707c0-.131-.061-.262-.183-.391-.117-.131-.354-.262-.704-.391a5.77 5.77 0 0 0-.978-.262 4.588 4.588 0 0 1-.635-.183 1.488 1.488 0 0 1-.387-.209.387.387 0 0 1-.13-.313c0-.131.052-.235.157-.313.104-.078.261-.117.47-.117.209 0 .374.052.496.157.122.104.196.235.222.391h.887a1.4 1.4 0 0 0-.209-.639 1.344 1.344 0 0 0-.496-.478c-.209-.122-.465-.183-.765-.183-.287 0-.539.052-.757.157a1.205 1.205 0 0 0-.5.435c-.117.183-.174.391-.174.626 0 .287.091.513.274.678.183.166.474.3.874.4.287.074.513.148.678.222.166.074.287.157.365.248a.507.507 0 0 1 .117.339.45.45 0 0 1-.183.365c-.122.096-.3.144-.535.144-.248 0-.448-.057-.6-.17a.714.714 0 0 1-.274-.47h-.9c.013.261.083.496.209.704.126.209.309.374.548.496.239.122.526.183.861.183.313 0 .587-.052.822-.157.235-.104.418-.252.548-.443.131-.191.196-.413.196-.665zM8.837 16.413V15.1h2.687v-1.018H8.837v-1.3h3.009V11.76H7.7v4.652h1.137z" />
                    </svg>
                    <span className="text-xs text-[#f5f0e8]/70">api-request.ts</span>
                    <span className="text-[10px] text-[#f5f0e8]/30">M</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#f5f0e8]/30">
                  <span className="hidden sm:inline">UTF-8</span>
                  <span className="hidden sm:inline">TypeScript</span>
                  <span>Ln 1, Col 1</span>
                </div>
              </div>

              {/* Code content with line numbers */}
              <div className="relative overflow-x-auto p-4 md:p-6">
                <pre className="text-[13px] leading-relaxed md:text-sm">
                  <code>
                    {/* Line 1 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">1</span>
                      <span>
                        <span className="text-[#c586c0]">const</span>
                        <span className="text-[#9cdcfe]"> renderImage</span>
                        <span className="text-[#f5f0e8]/50"> = </span>
                        <span className="text-[#c586c0]">async</span>
                        <span className="text-[#f5f0e8]/50"> () </span>
                        <span className="text-[#569cd6]">{`=>`}</span>
                        <span className="text-[#ffd700]"> {`{`}</span>
                      </span>
                    </div>
                    {/* Line 2 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">2</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#c586c0]">const</span>
                        <span className="text-[#9cdcfe]"> response</span>
                        <span className="text-[#f5f0e8]/50"> = </span>
                        <span className="text-[#c586c0]">await</span>
                        <span className="text-[#dcdcaa]"> fetch</span>
                        <span className="text-[#da70d6]">(</span>
                        <span className="text-[#ce9178]">{`'https://api.htmlpix.com/render'`}</span>
                        <span className="text-[#f5f0e8]/50">, </span>
                        <span className="text-[#ffd700]">{`{`}</span>
                      </span>
                    </div>
                    {/* Line 3 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">3</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">method</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#ce9178]">{`'POST'`}</span>
                        <span className="text-[#f5f0e8]/50">,</span>
                      </span>
                    </div>
                    {/* Line 4 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">4</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">headers</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#da70d6]">{`{`}</span>
                      </span>
                    </div>
                    {/* Line 5 */}
                    <div className="group/line flex rounded-sm transition-colors hover:bg-[#ff4d00]/5">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none group-hover/line:text-[#ff4d00]/50">
                        5
                      </span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#ce9178]">{`'Authorization'`}</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#ce9178]">{`\`Bearer \${`}</span>
                        <span className="text-[#9cdcfe]">process.env.HTMLPIX_KEY</span>
                        <span className="text-[#ce9178]">{`}\``}</span>
                        <span className="text-[#f5f0e8]/50">,</span>
                      </span>
                    </div>
                    {/* Line 6 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">6</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#ce9178]">{`'Content-Type'`}</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#ce9178]">{`'application/json'`}</span>
                      </span>
                    </div>
                    {/* Line 7 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">7</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#da70d6]">{`}`}</span>
                        <span className="text-[#f5f0e8]/50">,</span>
                      </span>
                    </div>
                    {/* Line 8 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">8</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">body</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#9cdcfe]">JSON</span>
                        <span className="text-[#f5f0e8]/50">.</span>
                        <span className="text-[#dcdcaa]">stringify</span>
                        <span className="text-[#da70d6]">(</span>
                        <span className="text-[#179fff]">{`{`}</span>
                      </span>
                    </div>
                    {/* Line 9 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">9</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">html</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#ce9178]">{`'<div class="og-card">...</div>'`}</span>
                        <span className="text-[#f5f0e8]/50">,</span>
                      </span>
                    </div>
                    {/* Line 10 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">10</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">css</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#ce9178]">{`'.og-card { background: #fff; }'`}</span>
                        <span className="text-[#f5f0e8]/50">,</span>
                      </span>
                    </div>
                    {/* Line 11 */}
                    <div className="group/line flex rounded-sm transition-colors hover:bg-[#ff4d00]/5">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none group-hover/line:text-[#ff4d00]/50">
                        11
                      </span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">viewport</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#da70d6]">{`{`}</span>
                        <span className="text-[#9cdcfe]"> width</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#b5cea8]">1200</span>
                        <span className="text-[#f5f0e8]/50">, </span>
                        <span className="text-[#9cdcfe]">height</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#b5cea8]">630</span>
                        <span className="text-[#da70d6]"> {`}`}</span>
                        <span className="text-[#f5f0e8]/50">,</span>
                      </span>
                    </div>
                    {/* Line 12 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">12</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#9cdcfe]">format</span>
                        <span className="text-[#f5f0e8]/50">: </span>
                        <span className="text-[#ce9178]">{`'png'`}</span>
                      </span>
                    </div>
                    {/* Line 13 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">13</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#179fff]">{`}`}</span>
                        <span className="text-[#da70d6]">)</span>
                      </span>
                    </div>
                    {/* Line 14 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">14</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#ffd700]">{`}`}</span>
                        <span className="text-[#da70d6]">)</span>
                        <span className="text-[#f5f0e8]/50">;</span>
                      </span>
                    </div>
                    {/* Line 15 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">15</span>
                      <span />
                    </div>
                    {/* Line 16 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">16</span>
                      <span>
                        <span className="text-[#f5f0e8]/50"> </span>
                        <span className="text-[#c586c0]">return</span>
                        <span className="text-[#9cdcfe]"> response</span>
                        <span className="text-[#f5f0e8]/50">.</span>
                        <span className="text-[#dcdcaa]">arrayBuffer</span>
                        <span className="text-[#da70d6]">()</span>
                        <span className="text-[#f5f0e8]/50">;</span>
                      </span>
                    </div>
                    {/* Line 17 */}
                    <div className="flex">
                      <span className="mr-6 w-6 shrink-0 text-right text-[#f5f0e8]/20 select-none">17</span>
                      <span>
                        <span className="text-[#ffd700]">{`}`}</span>
                        <span className="text-[#f5f0e8]/50">;</span>
                      </span>
                    </div>
                  </code>
                </pre>

                {/* Cursor blink animation */}
                <div className="absolute bottom-6 left-[52px] h-5 w-0.5 animate-pulse bg-[#ff4d00] md:left-[58px]" />
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between border-t border-[#f5f0e8]/5 bg-[#007acc] px-4 py-1 text-[11px] text-white">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Ready
                  </span>
                  <span className="hidden sm:inline">0 Problems</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline">Spaces: 2</span>
                  <span>TypeScript</span>
                </div>
              </div>
            </div>

            {/* Decorative corner brackets */}
            <div className="absolute -top-2 -left-2 h-4 w-4 border-t-2 border-l-2 border-[#ff4d00]/30" />
            <div className="absolute -top-2 -right-2 h-4 w-4 border-t-2 border-r-2 border-[#ff4d00]/30" />
            <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-[#ff4d00]/30" />
            <div className="absolute -right-2 -bottom-2 h-4 w-4 border-r-2 border-b-2 border-[#ff4d00]/30" />
          </div>

          {/* Code annotation */}
          <div className="mt-6 flex items-center justify-between text-xs text-[#f5f0e8]/30">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#28c840]" />
                No errors
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">TypeScript 5.3</span>
            </div>
            <span>Copy to clipboard →</span>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 04
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Pricing Schedule
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {[
              {
                tier: "TIER-0",
                name: "Free",
                planId: "free",
                price: 0,
                renders: "50",
                desc: "Try it out — no credit card required",
              },
              {
                tier: "TIER-A",
                name: "Starter",
                planId: "starter",
                price: 8,
                renders: "1,000",
                desc: "For prototypes & side projects",
              },
              {
                tier: "TIER-B",
                name: "Pro",
                planId: "pro",
                price: 15,
                renders: "3,000",
                desc: "For production applications",
                recommended: true,
              },
              {
                tier: "TIER-C",
                name: "Scale",
                planId: "scale",
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
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className={plan.recommended ? "text-[#f5f0e8]/30" : "text-[#1a1a1a]/30"}>
                        /month
                      </span>
                    )}
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
                  href={`/login?plan=${plan.planId}`}
                  className={`block py-3 text-center text-sm font-bold tracking-wider uppercase transition-colors ${
                    plan.recommended
                      ? "bg-[#ff4d00] text-white hover:bg-[#f5f0e8] hover:text-[#1a1a1a]"
                      : "bg-[#1a1a1a] text-[#f5f0e8] hover:bg-[#ff4d00]"
                  }`}
                >
                  {plan.price === 0 ? "Start Free" : `Select ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="relative z-10 bg-[#ff4d00] px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-4xl text-white sm:text-6xl md:mb-6 md:text-8xl">
            READY TO BUILD?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-white/70 md:mb-10 md:text-lg">
            50 free renders per month. No credit card required. Get your API key in under a minute.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white px-6 py-4 font-bold tracking-wider text-[#ff4d00] uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white md:gap-4 md:px-10 md:py-5"
          >
            Start Free
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <span className="text-xs font-bold text-[#1a1a1a]">{"<>"}</span>
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
            <Link href="/status" className="transition-colors hover:text-[#ff4d00]">
              Status
            </Link>
            <Link href="/login" className="transition-colors hover:text-[#ff4d00]">
              Login
            </Link>
          </div>
          <span className="text-xs text-[#1a1a1a]/20">© 2026 HTMLPix</span>
        </div>
      </footer>
    </div>
  );
}
