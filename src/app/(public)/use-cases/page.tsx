import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { getAllUseCases } from "./data";

export const metadata: Metadata = {
  title: "Use Cases — HTMLPix",
  description:
    "Explore what developers build with HTMLPix: OG images, social cards, invoices, certificates, email banners, charts, screenshots, product images, and more.",
  alternates: { canonical: "/use-cases" },
};

export default function UseCasesIndex() {
  const useCases = getAllUseCases();

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
      <BreadcrumbJsonLd />

      {/* Hero */}
      <section className="relative z-10 px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-0.5 flex-grow bg-gradient-to-r from-[#ff4d00]/50 to-transparent" />
            <span className="text-[10px] tracking-wider text-[#1a1a1a]/30 uppercase">
              USE CASES
            </span>
          </div>

          <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-5xl leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            What Developers Build
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-[#1a1a1a]/50 md:text-base">
            HTMLPix turns HTML into pixel-perfect images. Here&apos;s how teams use it across
            marketing, commerce, content, and automation.
          </p>

          <div className="mt-6 h-px w-full bg-[#1a1a1a]/10" />
        </div>
      </section>

      {/* Grid */}
      <section className="relative z-10 px-4 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <Link
                key={uc.slug}
                href={`/use-cases/${uc.slug}`}
                className="group"
              >
                <div
                  className={`mb-4 h-36 overflow-hidden border-2 border-[#1a1a1a]/10 bg-gradient-to-br ${uc.bg} transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:shadow-[#ff4d00]/5`}
                >
                  {uc.preview}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#ff4d00] uppercase">
                    {uc.tag}
                  </span>
                  <div className="h-px flex-grow bg-[#1a1a1a]/10" />
                </div>
                <h3 className="mt-1.5 font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide">
                  {uc.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#1a1a1a]/40">
                  {uc.desc}
                </p>
                <span className="mt-2 inline-block text-[10px] font-bold tracking-wider text-[#ff4d00] uppercase">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 overflow-hidden bg-[#ff4d00] px-4 py-16 md:px-8 md:py-32">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border-[40px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full border-[60px] border-white/5" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-4xl text-white sm:text-6xl md:mb-6 md:text-7xl">
            Start Building Today
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-white/60 md:mb-10 md:text-lg">
            50 free renders every month. HTML in, image out. Your first API call is seconds away.
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
            <a
              href="https://status.htmlpix.com"
              className="transition-colors hover:text-[#ff4d00]"
            >
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
