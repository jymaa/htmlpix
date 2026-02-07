import type { Metadata } from "next";
import { Space_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: `${process.env.NODE_ENV === "production" ? "" : "[DEV] "}HTMLPix - HTML to Image API`,
    template: "%s | HTMLPix",
  },
  description:
    "Generate images from HTML/CSS with a single API call. OG images, social cards, receipts, certificates — at scale. Free tier included.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://htmlpix.com"),
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
      <body className={`${spaceMono.variable} ${bebasNeue.variable} antialiased`}>{children}</body>
    </html>
  );
}
