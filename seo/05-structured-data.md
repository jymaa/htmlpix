# Structured Data Plan — HTMLPix.com

## Current State: No structured data anywhere.

---

## Implementation Plan

### 1. Homepage — SoftwareApplication + Organization

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "HTMLPix",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "description": "HTML to Image API. Convert HTML/CSS to PNG, JPG, or WebP with a single API call.",
  "url": "https://htmlpix.com",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free",
      "price": "0",
      "priceCurrency": "USD",
      "description": "50 renders per month"
    },
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "8",
      "priceCurrency": "USD",
      "billingIncrement": "month",
      "description": "1,000 renders per month"
    },
    {
      "@type": "Offer",
      "name": "Pro",
      "price": "15",
      "priceCurrency": "USD",
      "billingIncrement": "month",
      "description": "3,000 renders per month"
    },
    {
      "@type": "Offer",
      "name": "Scale",
      "price": "35",
      "priceCurrency": "USD",
      "billingIncrement": "month",
      "description": "10,000 renders per month"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "0"
  }
}
```

*Note: Only add aggregateRating once you have real reviews. Don't fabricate.*

### 2. FAQ Page — FAQPage Schema

Apply to `/docs/faq` page. This is the **highest-impact structured data** — can immediately generate rich results.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I use Google Fonts in my HTML?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Pass font names in the googleFonts array..."
      }
    },
    {
      "@type": "Question",
      "name": "What are the dimensions for OG images?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The standard OG image size is 1200×630 pixels..."
      }
    }
  ]
}
```

### 3. Quickstart — HowTo Schema

Apply to `/docs/quickstart`.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Generate an Image from HTML with HTMLPix",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Get your API key",
      "text": "Sign up and get your API key from the dashboard."
    },
    {
      "@type": "HowToStep",
      "name": "Send your HTML",
      "text": "Make a POST request to /render with your HTML content."
    },
    {
      "@type": "HowToStep",
      "name": "Get your image",
      "text": "Receive the image URL in the response."
    }
  ]
}
```

### 4. All Pages — BreadcrumbList

Every page should have breadcrumb structured data.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://htmlpix.com" },
    { "@type": "ListItem", "position": 2, "name": "Docs", "item": "https://htmlpix.com/docs" },
    { "@type": "ListItem", "position": 3, "name": "Quick Start" }
  ]
}
```

### 5. Blog Articles (Future) — Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Convert HTML to Image Programmatically",
  "author": { "@type": "Organization", "name": "HTMLPix" },
  "datePublished": "2026-02-01",
  "dateModified": "2026-02-01",
  "publisher": {
    "@type": "Organization",
    "name": "HTMLPix",
    "url": "https://htmlpix.com"
  }
}
```

### 6. Organization — Sitewide

Add to root layout:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HTMLPix",
  "url": "https://htmlpix.com",
  "logo": "https://htmlpix.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@htmlpix.com",
    "contactType": "customer support"
  },
  "sameAs": []
}
```

---

## Implementation Approach

Create a reusable `JsonLd` component:

```tsx
// src/components/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Then use in each page:

```tsx
// In layout.tsx or page.tsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // ...
}} />
```

---

## Priority

1. **FAQPage on /docs/faq** — Immediate rich results potential
2. **BreadcrumbList on all pages** — Improves SERP appearance
3. **SoftwareApplication on homepage** — Product visibility
4. **HowTo on quickstart** — Step-by-step rich results
5. **Organization sitewide** — Brand knowledge graph
6. **Article on blog** — When blog launches
