import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";

export const metadata = {
  title: "Status",
  description: "HTMLPix API status and health monitoring.",
};

export default function StatusPage() {
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
          backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        }}
      />

      {/* Corner markers */}
      <div className="fixed top-4 left-4 z-50 h-8 w-8 border-t-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed top-4 right-4 z-50 h-8 w-8 border-t-2 border-r-2 border-[#1a1a1a]/20" />
      <div className="fixed bottom-4 left-4 z-50 h-8 w-8 border-b-2 border-l-2 border-[#1a1a1a]/20" />
      <div className="fixed right-4 bottom-4 z-50 h-8 w-8 border-r-2 border-b-2 border-[#1a1a1a]/20" />

      <PublicHeader />

      <section className="relative z-10 px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Section header */}
          <div className="mb-12 flex items-center gap-4 md:mb-16 md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">SYSTEM</div>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          </div>

          <h1 className="mb-8 font-[family-name:var(--font-bebas-neue)] text-5xl tracking-tight md:mb-12 md:text-7xl">
            System Status
          </h1>

          {/* Placeholder message */}
          <div className="mb-10 border-l-2 border-[#1a1a1a]/20 pl-6 md:mb-14 md:pl-8">
            <div className="absolute top-0 left-0 h-2 w-2 -translate-x-[5px] bg-[#ff4d00]" />
            <p className="max-w-xl text-base leading-relaxed text-[#1a1a1a]/60 md:text-lg">
              Status monitoring coming soon. For real-time updates, check our API health endpoints.
            </p>
          </div>

          {/* Health endpoints */}
          <div className="mb-10 border-2 border-[#1a1a1a]/10 md:mb-14">
            <div className="border-b-2 border-[#1a1a1a]/10 px-6 py-4">
              <span className="text-xs font-bold tracking-wider text-[#1a1a1a]/40 uppercase">
                Health Endpoints
              </span>
            </div>
            <div className="divide-y-2 divide-[#1a1a1a]/10">
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#1a1a1a]/[0.03]">
                <div>
                  <div className="mb-1 text-sm font-bold">
                    <span className="text-[#ff4d00]">GET</span>{" "}
                    <span className="text-[#1a1a1a]">/healthz</span>
                  </div>
                  <div className="text-xs text-[#1a1a1a]/40">Basic server health check</div>
                </div>
                <Link
                  href="/healthz"
                  className="border-2 border-[#1a1a1a]/10 px-3 py-1.5 text-xs tracking-wider text-[#1a1a1a]/50 transition-colors hover:border-[#ff4d00] hover:text-[#ff4d00]"
                >
                  CHECK
                </Link>
              </div>
              <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#1a1a1a]/[0.03]">
                <div>
                  <div className="mb-1 text-sm font-bold">
                    <span className="text-[#ff4d00]">GET</span>{" "}
                    <span className="text-[#1a1a1a]">/readyz</span>
                  </div>
                  <div className="text-xs text-[#1a1a1a]/40">Readiness check (browser pool status)</div>
                </div>
                <Link
                  href="/readyz"
                  className="border-2 border-[#1a1a1a]/10 px-3 py-1.5 text-xs tracking-wider text-[#1a1a1a]/50 transition-colors hover:border-[#ff4d00] hover:text-[#ff4d00]"
                >
                  CHECK
                </Link>
              </div>
            </div>
          </div>

          {/* Support note */}
          <div className="text-sm text-[#1a1a1a]/40">
            Need help?{" "}
            <a
              href="mailto:support@htmlpix.com"
              className="text-[#ff4d00] transition-colors hover:text-[#1a1a1a]"
            >
              support@htmlpix.com
            </a>
          </div>
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
          <span className="text-xs text-[#1a1a1a]/20">&copy; 2026 HTMLPix</span>
        </div>
      </footer>
    </div>
  );
}
