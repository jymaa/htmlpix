import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { getAllSlugs, getUseCaseBySlug, getAllUseCases } from "../data";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) return {};
  const ogUrl = `/api/og?variant=standard&title=${encodeURIComponent(uc.meta.title)}&tag=${encodeURIComponent(uc.tag)}&subtitle=${encodeURIComponent(uc.desc)}`;
  return {
    title: uc.meta.title,
    description: uc.meta.description,
    alternates: { canonical: `/use-cases/${uc.slug}` },
    openGraph: {
      title: `${uc.meta.title} | HTMLPix`,
      description: uc.meta.description,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: uc.meta.title }],
    },
    twitter: {
      images: [{ url: ogUrl, width: 1200, height: 630, alt: uc.meta.title }],
    },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCaseBySlug(slug);
  if (!uc) notFound();

  const otherUseCases = getAllUseCases().filter((u) => u.slug !== slug);

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
          "@type": "Article",
          headline: uc.headline,
          description: uc.meta.description,
          url: `https://htmlpix.com/use-cases/${uc.slug}`,
          publisher: {
            "@type": "Organization",
            name: "HTMLPix",
            url: "https://htmlpix.com",
          },
        }}
      />
      <BreadcrumbJsonLd />

      {/* Hero */}
      <section className="relative z-10 px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-0.5 flex-grow bg-gradient-to-r from-[#ff4d00]/50 to-transparent" />
            <span className="text-[10px] tracking-wider text-[#1a1a1a]/30 uppercase">
              USE CASE
            </span>
          </div>

          <span className="mb-4 inline-block bg-[#ff4d00] px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-white uppercase">
            {uc.tag}
          </span>

          <h1 className="mb-6 font-[family-name:var(--font-bebas-neue)] text-5xl leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {uc.headline}
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-[#1a1a1a]/50 md:text-base">
            {uc.subtitle}
          </p>

          <div className="mt-6 h-px w-full bg-[#1a1a1a]/10" />
        </div>
      </section>

      {/* Preview — shows the actual rendered output */}
      <section className="relative z-10 px-4 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-4 md:mb-8">
            <span className="text-[10px] tracking-wider text-[#1a1a1a]/30 uppercase">
              FIG. 01 — OUTPUT PREVIEW
            </span>
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
            <span className="text-[10px] text-[#1a1a1a]/30">SCALE 1:1</span>
          </div>
          {uc.heroPreview}
          <div className="mt-4 flex items-center justify-between text-[10px] text-[#1a1a1a]/30">
            <span>
              Rendered with HTMLPix. What you design is what you get.
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
              PIXEL-PERFECT
            </span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="relative z-10 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 01
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              {uc.problem.heading}
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="space-y-4">
            {uc.problem.body.map((p, i) => (
              <p
                key={i}
                className="max-w-3xl text-sm leading-relaxed text-[#1a1a1a]/50 md:text-base"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="relative z-10 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 02
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              {uc.solution.heading}
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="space-y-4">
            {uc.solution.body.map((p, i) => (
              <p
                key={i}
                className="max-w-3xl text-sm leading-relaxed text-[#1a1a1a]/50 md:text-base"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="relative z-10 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 03
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Example
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="relative">
            <div className="absolute -top-6 left-4 text-[10px] text-[#1a1a1a]/30">
              FIG. 02
            </div>
            <div className="absolute -top-6 right-4 text-[10px] text-[#1a1a1a]/30 uppercase">
              {uc.code.filename}
            </div>

            <div className="relative border-2 border-[#1a1a1a]/20 bg-[#1a1a1a] shadow-[4px_4px_0_0_rgba(26,26,26,0.08)]">
              <div className="flex items-center justify-between border-b border-[#f5f0e8]/10 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="h-4 w-px bg-[#f5f0e8]/10" />
                  <span className="text-[11px] text-[#f5f0e8]/40">
                    {uc.code.filename}
                  </span>
                </div>
              </div>

              <pre className="overflow-x-auto p-4 text-[12px] leading-[1.9] text-[#a5d6a7] md:p-6 md:text-[13px]">
                <code>{uc.code.snippet}</code>
              </pre>
            </div>

            <div className="mt-3 text-[10px] text-[#1a1a1a]/30">
              Copy, paste, run. That&apos;s it.
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 04
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Why HTMLPix
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {uc.benefits.map((b, i) => (
              <div key={i} className="border-2 border-[#1a1a1a]/10 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center bg-[#ff4d00] font-[family-name:var(--font-bebas-neue)] text-sm text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide">
                    {b.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/50">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Use Cases */}
      <section className="relative z-10 bg-[#1a1a1a] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              SECTION 05
            </div>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-[#f5f0e8] md:text-4xl">
              Other Use Cases
            </h2>
            <div className="hidden h-px flex-grow bg-[#f5f0e8]/10 md:block" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherUseCases.map((other) => (
              <Link
                key={other.slug}
                href={`/use-cases/${other.slug}`}
                className="group"
              >
                <div
                  className={`mb-4 h-36 overflow-hidden border border-[#f5f0e8]/10 bg-gradient-to-br ${other.bg} transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:shadow-[#ff4d00]/5`}
                >
                  {other.preview}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#ff4d00] uppercase">
                    {other.tag}
                  </span>
                  <div className="h-px flex-grow bg-[#f5f0e8]/10" />
                </div>
                <h3 className="mt-1.5 font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide text-[#f5f0e8]">
                  {other.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#f5f0e8]/40">
                  {other.desc}
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
            {uc.cta.heading}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-white/60 md:mb-10 md:text-lg">
            {uc.cta.body}
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
