import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { getOgMetadataImage } from "@/lib/og";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getOgMetadataImage({
    variant: "standard",
    title: "API Documentation",
    tag: "DOCS",
    subtitle:
      "Complete guide to the HTMLPix rendering API. Endpoints, authentication, examples, and more.",
    alt: "HTMLPix API Documentation",
  });

  return {
    openGraph: {
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <BreadcrumbJsonLd />
      <PublicHeader />
      <div className="mx-auto max-w-7xl px-8 pt-24 pb-8">
        <div className="flex gap-8">
          <DocsSidebar />
          <main className="max-w-3xl min-w-0 flex-1">
            <article>{children}</article>
          </main>
          <DocsToc />
        </div>
      </div>
    </div>
  );
}
