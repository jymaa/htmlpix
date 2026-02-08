import type { Metadata } from "next";
import { Space_Mono, Bebas_Neue } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "block",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "block",
  preload: true,
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: `${process.env.NODE_ENV === "production" ? "" : "[DEV] "}HTMLPix - HTML to Image API`,
    template: "%s | HTMLPix",
  },
  description:
    "Generate images from HTML/CSS with a single API call. OG images, social cards, receipts, certificates — at scale. Free tier included.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://htmlpix.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "HTMLPix",
    title: "HTMLPix - HTML to Image API",
    description:
      "Generate images from HTML/CSS with a single API call. OG images, social cards, receipts, certificates — at scale.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HTMLPix - HTML to Image API",
    description: "Generate images from HTML/CSS with a single API call. Free tier included.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="HTMLPix" />
      </head>
      <body className={`${spaceMono.variable} ${bebasNeue.variable} antialiased`}>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HTMLPix",
            url: "https://htmlpix.com",
            logo: "https://htmlpix.com/logo.png",
            description: "HTML to Image API. Generate images from HTML/CSS with a single API call.",
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@htmlpix.com",
              contactType: "customer support",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
