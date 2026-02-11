import type { Metadata } from "next";
import { getOgMetadataImage } from "@/lib/og";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getOgMetadataImage({
    variant: "standard",
    title: "Terms of Service",
    tag: "LEGAL",
    alt: "HTMLPix Terms of Service",
  });

  return {
    title: "Terms of Service",
    description: "HTMLPix terms of service. Rules and guidelines for using our HTML-to-image API.",
    openGraph: {
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function TermsPage() {
  return (
    <div
      className="min-h-screen font-[family-name:var(--font-space-mono)] text-[#1a1a1a]"
      style={{ background: "#f5f0e8" }}
    >
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="mb-2 font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wide md:text-5xl">
          Terms of Service
        </h1>
        <p className="mb-12 text-sm text-[#1a1a1a]/40">Last updated: February 8, 2026</p>

        <div className="space-y-10 text-sm leading-relaxed text-[#1a1a1a]/70 [&_h2]:mb-3 [&_h2]:font-[family-name:var(--font-bebas-neue)] [&_h2]:text-2xl [&_h2]:tracking-wide [&_h2]:text-[#1a1a1a] [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <section>
            <h2>1. Agreement</h2>
            <p>
              By accessing or using HTMLPix (&quot;the Service&quot;), operated by HTMLPix
              (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;), you agree to be bound by these Terms
              of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              HTMLPix provides an API that converts HTML and CSS into images. We also provide a web
              dashboard for managing your account, API keys, and usage.
            </p>
          </section>

          <section>
            <h2>3. Accounts</h2>
            <p>
              You must create an account to use the API. You are responsible for maintaining the
              security of your account and API keys. You are responsible for all activity that occurs
              under your account. Notify us immediately if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Generate content that is illegal, harmful, or infringes on intellectual property rights</li>
              <li>Attempt to circumvent rate limits, quotas, or security measures</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Resell access to the API without our written permission</li>
              <li>Use the Service to send spam or phishing content</li>
            </ul>
          </section>

          <section>
            <h2>5. API Usage & Rate Limits</h2>
            <p>
              Your use of the API is subject to the rate limits and quotas of your plan. If you
              exceed your limits, requests may be throttled or rejected. We reserve the right to
              modify rate limits with reasonable notice.
            </p>
          </section>

          <section>
            <h2>6. Payment & Billing</h2>
            <p>
              Paid plans are billed in advance on a monthly or annual basis. All fees are
              non-refundable except as required by law. We may change pricing with 30 days&apos;
              notice. Continued use after a price change constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              You retain ownership of the HTML, CSS, and content you submit to the Service. We
              retain ownership of the Service, its code, and infrastructure. We claim no ownership
              over the images generated from your content.
            </p>
          </section>

          <section>
            <h2>8. Availability & SLA</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted service. The
              Service is provided &quot;as is.&quot; We may perform maintenance that temporarily
              affects availability, and will provide notice when possible.
            </p>
          </section>

          <section>
            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, HTMLPix shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or
              revenue, whether incurred directly or indirectly. Our total liability for any claim
              arising from the Service is limited to the amount you paid us in the 12 months
              preceding the claim.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              You may cancel your account at any time. We may suspend or terminate your access if
              you violate these terms, with or without notice. Upon termination, your right to use
              the Service ceases immediately. Cached images and data will be deleted according to our
              retention policies.
            </p>
          </section>

          <section>
            <h2>11. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of material changes by
              email or by posting a notice on our website. Continued use of the Service after changes
              constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
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
