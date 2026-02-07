import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for HTML-to-image rendering. Start free with 50 renders per month, then scale to thousands. No credit card required for the free tier.",
};

const plans = [
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
];

const features = [
  "All export formats",
  "Custom viewports",
  "Google Fonts",
  "API access",
  "Email support",
];

const faqs = [
  {
    question: "How does the free tier work?",
    answer:
      "The free tier gives you 50 renders per month with full access to all features — every export format, custom viewports, Google Fonts, and API access. No credit card is required to get started. Your quota resets at the beginning of each billing cycle.",
  },
  {
    question: "What happens when I exceed my render quota?",
    answer:
      "When you hit your monthly render limit, subsequent API requests will return a 429 status code. Your existing rendered images remain accessible. You can upgrade your plan at any time to unlock more renders immediately.",
  },
  {
    question: "Can I change or cancel my plan at any time?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your plan at any time from your dashboard. Upgrades take effect immediately with a prorated charge. Downgrades and cancellations take effect at the end of your current billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure payment processor. All payments are processed in USD.",
  },
  {
    question: "Do unused renders roll over to the next month?",
    answer:
      "No, unused renders do not roll over. Each billing cycle starts fresh with your plan's full render allocation. If you consistently need more renders, consider upgrading to the next tier for better value per render.",
  },
];

export default function PricingPage() {
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

      {/* Pricing Section */}
      <section className="relative z-10 px-4 pt-32 pb-16 md:px-8 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-4 text-center">
            <div className="mb-4 text-xs tracking-widest text-[#ff4d00] uppercase">
              PRICING SCHEDULE
            </div>
            <h1 className="mb-4 font-[family-name:var(--font-bebas-neue)] text-5xl tracking-wide md:text-7xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-[#1a1a1a]/60 md:text-lg">
              Start free, scale as you grow. Every plan includes full API access
              and all export formats.
            </p>
          </div>

          {/* Divider */}
          <div className="mx-auto mb-12 flex max-w-xs items-center gap-4 md:mb-16">
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
            <div className="h-2 w-2 bg-[#ff4d00]" />
            <div className="h-px flex-grow bg-[#1a1a1a]/10" />
          </div>

          {/* Pricing cards */}
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {plans.map((plan, i) => (
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

                <div
                  className={`mb-2 text-xs ${plan.recommended ? "text-[#ff4d00]" : "text-[#1a1a1a]/30"}`}
                >
                  {plan.tier}
                </div>
                <h3 className="mb-1 font-[family-name:var(--font-bebas-neue)] text-3xl">
                  {plan.name}
                </h3>
                <p
                  className={`mb-6 text-sm ${plan.recommended ? "text-[#f5f0e8]/50" : "text-[#1a1a1a]/40"}`}
                >
                  {plan.desc}
                </p>

                <div
                  className={`mb-6 border-y py-6 ${plan.recommended ? "border-[#f5f0e8]/10" : "border-[#1a1a1a]/10"}`}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-bebas-neue)] text-6xl text-[#ff4d00]">
                      {plan.price === 0 ? "Free" : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span
                        className={
                          plan.recommended
                            ? "text-[#f5f0e8]/30"
                            : "text-[#1a1a1a]/30"
                        }
                      >
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
                  {features.map((f, j) => (
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

      {/* FAQ Section */}
      <section className="relative z-10 px-4 py-16 md:px-8 md:py-32">
        <div className="mx-auto max-w-3xl">
          {/* Section header */}
          <div className="mb-8 flex flex-col gap-4 md:mb-16 md:flex-row md:items-center md:gap-8">
            <div className="text-xs tracking-widest whitespace-nowrap text-[#ff4d00] uppercase">
              FAQ
            </div>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
            <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide md:text-4xl">
              Common Questions
            </h2>
            <div className="hidden h-px flex-grow bg-[#1a1a1a]/10 md:block" />
          </div>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-t-2 border-[#1a1a1a]/10 py-8 last:border-b-2"
              >
                <div className="mb-1 flex items-start gap-4">
                  <span className="mt-1 text-xs text-[#1a1a1a]/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-3 font-[family-name:var(--font-bebas-neue)] text-xl tracking-wide text-[#1a1a1a] md:text-2xl">
                      {faq.question}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/50">
                      {faq.answer}
                    </p>
                  </div>
                </div>
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
            50 free renders per month. No credit card required. Get your API key
            in under a minute.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white px-6 py-4 font-bold tracking-wider text-[#ff4d00] uppercase transition-colors hover:bg-[#1a1a1a] hover:text-white md:gap-4 md:px-10 md:py-5"
          >
            Start Free
            <svg
              className="h-4 w-4 md:h-5 md:w-5"
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
              <span className="text-xs font-bold text-[#1a1a1a]">{"<>"}</span>
            </div>
            <span className="font-bold tracking-wider">HTMLPIX</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs tracking-widest text-[#1a1a1a]/30 uppercase md:gap-8">
            <Link
              href="/docs"
              className="transition-colors hover:text-[#ff4d00]"
            >
              Docs
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-[#ff4d00]"
            >
              Pricing
            </Link>
            <Link
              href="/status"
              className="transition-colors hover:text-[#ff4d00]"
            >
              Status
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-[#ff4d00]"
            >
              Login
            </Link>
          </div>
          <span className="text-xs text-[#1a1a1a]/20">&copy; 2026 HTMLPix</span>
        </div>
      </footer>
    </div>
  );
}
