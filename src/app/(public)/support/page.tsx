import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with HTMLPix. Docs, API reference, quickstart guides, and direct email support from the team.",
  openGraph: {
    images: [
      {
        url: "/api/og?variant=standard&title=Support&tag=HELP&subtitle=Docs%2C+API+reference%2C+quickstart+guides%2C+and+direct+email+support.",
        width: 1200,
        height: 630,
        alt: "HTMLPix Support",
      },
    ],
  },
};

const resources = [
  {
    label: "QUICKSTART",
    title: "Getting Started",
    description: "Set up your account, grab your API key, and render your first image in under two minutes.",
    href: "/docs/quickstart",
  },
  {
    label: "API REFERENCE",
    title: "Endpoints & Parameters",
    description:
      "Full reference for signed OG image delivery via /v1/image-url and /v1/image.",
    href: "/docs/endpoints",
  },
  {
    label: "AUTHENTICATION",
    title: "API Key & Auth",
    description: "How to authenticate requests, manage your API key, and handle authorization errors.",
    href: "/docs/authentication",
  },
  {
    label: "ERROR CODES",
    title: "Errors & Troubleshooting",
    description: "Common error codes, what they mean, and how to resolve them quickly.",
    href: "/docs/errors",
  },
  {
    label: "RATE LIMITS",
    title: "Quotas & Rate Limits",
    description:
      "Understand your monthly render quota, rate limit headers, and what happens when you exceed them.",
    href: "/docs/rate-limits",
  },
  {
    label: "FAQ",
    title: "Frequently Asked Questions",
    description: "Answers to the most common questions about billing, plans, image storage, and more.",
    href: "/docs/faq",
  },
];

export default function SupportPage() {
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

      {/* Hero */}
      <section className="relative z-10 px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-xs tracking-widest text-[#ff4d00] uppercase">SUPPORT</div>
          <h1 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-5xl tracking-wide md:text-7xl">
            How Can We Help?
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#1a1a1a]/60 md:text-lg">
            Everything you need is in the docs. If you get stuck, we&apos;re one email away.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-10 flex max-w-xs items-center gap-4 md:mt-14">
          <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          <div className="h-2 w-2 bg-[#ff4d00]" />
          <div className="h-px flex-grow bg-[#1a1a1a]/10" />
        </div>
      </section>

      {/* Documentation Resources */}
      <section className="relative z-10 px-4 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">DOCS</div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Browse the Documentation
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <Link
                key={i}
                href={r.href}
                className="group border-2 border-[#1a1a1a]/10 p-6 transition-all hover:-translate-y-1 hover:border-[#1a1a1a]"
              >
                <div className="mb-3 text-xs tracking-widest text-[#ff4d00] uppercase">{r.label}</div>
                <h3 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide transition-colors group-hover:text-[#ff4d00]">
                  {r.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/50">{r.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold tracking-wider text-[#1a1a1a]/30 uppercase transition-colors group-hover:text-[#ff4d00]">
                  Read more
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 px-4 pb-16 md:px-8 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">CONTACT</div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Still Need Help?
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="border-2 border-[#1a1a1a] p-8 md:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
              <div className="flex-1">
                <p className="mb-4 text-sm leading-relaxed text-[#1a1a1a]/60">
                  Can&apos;t find the answer in the docs? Send us an email. We typically reply within a few
                  hours on business days.
                </p>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/40">
                  Include your account email and what you&apos;re trying to do so we can jump in faster.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="mailto:support@htmlpix.com"
                  className="inline-flex items-center gap-3 bg-[#1a1a1a] px-6 py-4 text-sm font-bold tracking-wider text-[#f5f0e8] uppercase transition-colors hover:bg-[#ff4d00] md:px-8"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  support@htmlpix.com
                </a>
              </div>
            </div>
          </div>
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
