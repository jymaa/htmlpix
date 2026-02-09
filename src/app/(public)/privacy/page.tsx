import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "HTMLPix privacy policy. How we collect, use, and protect your data.",
  openGraph: {
    images: [
      {
        url: "/api/og?variant=standard&title=Privacy+Policy&tag=LEGAL",
        width: 1200,
        height: 630,
        alt: "HTMLPix Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-[#1a1a1a]/40">Last updated: February 8, 2026</p>

        <div className="space-y-10 text-sm leading-relaxed text-[#1a1a1a]/70 [&_h2]:mb-3 [&_h2]:font-[family-name:var(--font-bebas-neue)] [&_h2]:text-2xl [&_h2]:tracking-wide [&_h2]:text-[#1a1a1a] [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <section>
            <h2>1. Introduction</h2>
            <p>
              HTMLPix (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates the HTMLPix.com website
              and API service. This Privacy Policy explains how we collect, use, and protect your
              information when you use our service.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p className="mb-3">
              <strong className="text-[#1a1a1a]">Account information.</strong> When you create an
              account, we collect your name, email address, and authentication credentials (including
              data from third-party login providers like Google).
            </p>
            <p className="mb-3">
              <strong className="text-[#1a1a1a]">Usage data.</strong> We collect information about
              how you use our service, including API requests, render counts, timestamps, and error
              logs.
            </p>
            <p className="mb-3">
              <strong className="text-[#1a1a1a]">Payment information.</strong> Billing details are
              processed by our third-party payment processor. We do not store your full credit card
              number.
            </p>
            <p>
              <strong className="text-[#1a1a1a]">Content you submit.</strong> When you use our API,
              you send us HTML and CSS content for rendering. We process this content to generate
              images and may temporarily cache it to deliver the service.
            </p>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>Provide, maintain, and improve the service</li>
              <li>Process transactions and send billing-related communications</li>
              <li>Enforce usage quotas and rate limits</li>
              <li>Send service updates and technical notices</li>
              <li>Respond to support requests</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Retention</h2>
            <p>
              Rendered images are temporarily cached and automatically deleted according to our
              retention policies. Account data is retained for as long as your account is active. You
              may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2>5. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with third-party service
              providers who help us operate the service (hosting, payment processing, analytics),
              subject to confidentiality obligations. We may also disclose information if required by
              law or to protect our rights.
            </p>
          </section>

          <section>
            <h2>6. Security</h2>
            <p>
              We use industry-standard security measures to protect your data, including encryption
              in transit (TLS) and at rest. API keys are hashed before storage. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              We use essential cookies to manage authentication sessions. We do not use advertising
              or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2>8. Your Rights</h2>
            <p>
              You may access, correct, or delete your personal information by contacting us. If you
              are in the EU/EEA, you have additional rights under the GDPR, including the right to
              data portability and the right to lodge a complaint with a supervisory authority.
            </p>
          </section>

          <section>
            <h2>9. Changes</h2>
            <p>
              We may update this policy from time to time. We will notify you of material changes by
              email or by posting a notice on our website.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              Questions about this policy? Email us at{" "}
              <a
                href="mailto:support@htmlpix.com"
                className="text-[#ff4d00] underline underline-offset-2 transition-colors hover:text-[#1a1a1a]"
              >
                support@htmlpix.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
