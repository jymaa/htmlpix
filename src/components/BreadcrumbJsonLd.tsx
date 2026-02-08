"use client";

import { usePathname } from "next/navigation";

const BASE_URL = "https://htmlpix.com";

const LABELS: Record<string, string> = {
  docs: "Docs",
  quickstart: "Quick Start",
  authentication: "Authentication",
  endpoints: "Endpoints",
  examples: "Examples",
  "rate-limits": "Rate Limits",
  "image-storage": "Image Storage",
  errors: "Errors",
  faq: "FAQ",
};

export function BreadcrumbJsonLd() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((seg, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: LABELS[seg] ?? seg,
    item: `${BASE_URL}/${segments.slice(0, i + 1).join("/")}`,
  }));

  // Prepend Home
  items.unshift({ "@type": "ListItem", position: 0, name: "Home", item: BASE_URL });
  // Re-index positions
  items.forEach((item, i) => (item.position = i + 1));

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
