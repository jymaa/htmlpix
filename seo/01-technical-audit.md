# Technical SEO Audit — HTMLPix.com

## 1. Crawlability & Indexation

### robots.txt — MISSING

**Issue:** No `robots.txt` file exists. Next.js serves a default, but an explicit one is needed.

**Impact:** Medium — search engines will crawl everything by default, including protected routes.

**Fix:** Create `src/app/robots.ts`:
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api-keys",
          "/templates",  // protected template editor, NOT public gallery
          "/media",
          "/playground",
          "/settings",
          "/checkout",
          "/api/",
        ],
      },
    ],
    sitemap: "https://htmlpix.com/sitemap.xml",
  };
}
```

### XML Sitemap — EXISTS, NEEDS FIXES

**Current state:** `src/app/sitemap.ts` generates 12 URLs.

**Issues:**
1. Lists `/pricing` which is a **deleted page** (returns 404)
2. Missing `changeFrequency` on most entries
3. No `lastModified` dates
4. Missing `/support` page
5. Will need dynamic expansion for templates, tools, blog, comparisons

**Fix:** Remove `/pricing`, add `/support`, add `lastModified` and `changeFrequency` to all. Plan for dynamic sitemap generation as page count grows (split into `/sitemap-docs.xml`, `/sitemap-tools.xml`, `/sitemap-templates.xml`, etc.).

### Canonical Tags — MISSING

**Issue:** No explicit canonical tags on any page. Next.js uses `metadataBase` but individual pages don't set `alternates.canonical`.

**Impact:** Medium — risk of duplicate content if pages are accessible via multiple URLs (www vs non-www, trailing slash variants).

**Fix:** Add to root layout or per-page:
```ts
export const metadata = {
  alternates: {
    canonical: "https://htmlpix.com/",
  },
};
```

### Protected Routes Exposure

**Issue:** Protected routes (`/dashboard`, `/api-keys`, etc.) are client-side gated but not blocked from crawling. Googlebot may attempt to index these pages.

**Impact:** Low — they redirect to `/login`, but wastes crawl budget.

**Fix:** robots.txt disallow (above) + add `noindex` meta to protected layout.

---

## 2. Meta Tags Audit

### Root Layout (Global)
- **Title:** "HTMLPix - HTML to Image API" — Good, includes brand + primary keyword
- **Description:** "Generate images from HTML/CSS with a single API call..." — Good, compelling
- **OG tags:** Present (type, siteName, title, description) — Missing `og:image`
- **Twitter tags:** Present (card, title, description) — Missing `twitter:image`

**Missing: OG Image.** This is critical. Use your own API to generate a branded OG image.

### Per-Page Meta Tags

| Page | Title | Description | OG Override | Issues |
|------|-------|-------------|-------------|--------|
| `/` (home) | Inherits root | Inherits root | None | No page-specific OG image |
| `/login` | None | None | None | **Missing title + description entirely** |
| `/support` | Custom | Custom | None | Good |
| `/docs` | Custom | Custom | None | Good |
| `/docs/quickstart` | Custom | Custom | None | Good |
| `/docs/authentication` | Custom | Custom | None | Good |
| `/docs/endpoints` | Custom | Custom | None | Good |
| `/docs/examples` | Custom | Custom | None | Good |
| `/docs/errors` | Custom | Custom | None | Good |
| `/docs/faq` | Custom | Custom | None | Good |
| `/docs/rate-limits` | Custom | Custom | None | Good |
| `/docs/image-storage` | Custom | Custom | None | Good |

**Priority Fixes:**
1. Add title + description to `/login`
2. Generate and set OG image for all pages (use HTMLPix API)
3. Consider unique OG images per major section (docs, tools, templates)

---

## 3. Structured Data — MISSING ENTIRELY

No JSON-LD or schema.org markup anywhere.

### Recommended Schema Implementation

| Page | Schema Type | Benefit |
|------|------------|---------|
| Homepage | `SoftwareApplication` + `Organization` | Rich snippet with rating, pricing |
| `/docs/faq` | `FAQPage` | FAQ rich results in SERP |
| `/docs/quickstart` | `HowTo` | How-to rich results |
| Pricing section | `Product` with `Offer` | Price display in SERP |
| All pages | `BreadcrumbList` | Breadcrumb display in SERP |
| Blog (future) | `Article` | Article rich results |
| Template gallery (future) | `SoftwareSourceCode` | Code snippet results |

**Highest Impact:** FAQPage schema on `/docs/faq` — this can immediately generate rich results with expandable Q&A in search.

---

## 4. URL Structure — GOOD

Current URL structure is clean and logical:
- `/docs/{topic}` — documentation
- `/login` — authentication
- `/support` — help
- `/#pricing` — pricing (anchor on homepage)

**Recommendation for new pages:**
```
/tools/{tool-name}          — free online tools
/templates/{category}       — template gallery categories
/templates/{category}/{name} — individual templates
/compare/{a}-vs-{b}         — comparison pages
/alternative/{competitor}    — alternative pages
/blog/{slug}                — blog posts
/use-cases/{use-case}       — use case pages
/docs/sdk/{language}         — language SDKs
/docs/integrations/{framework} — framework integrations
```

---

## 5. Page Speed & Core Web Vitals

**Framework:** Next.js 16 with App Router — generally excellent for CWV.

**Potential Issues:**
- Blueprint grid background pattern (complex CSS) may affect CLS
- `Bebas Neue` + `Space Mono` custom fonts — needs `font-display: swap`
- No `<link rel="preload">` for critical fonts visible
- Large homepage with multiple sections — consider lazy loading below-fold sections
- No image optimization visible (no `<Image>` components on public pages since there are no images)

**Recommendations:**
1. Verify font loading with `font-display: swap` (check `next/font` config)
2. Add `fetchPriority="high"` to above-fold content
3. Lazy load pricing section and use case cards
4. Test with PageSpeed Insights once deployed
5. Set up CWV monitoring in Search Console

---

## 6. Mobile Friendliness — GOOD

- Responsive design with Tailwind breakpoints
- Mobile hamburger menu via Sheet component
- Pricing switches from table to card layout on mobile
- Viewport meta tag present (Next.js default)

---

## 7. Security & HTTPS — GOOD

- Site will be HTTPS (assumed from `metadataBase: https://htmlpix.com`)
- No mixed content concerns visible in codebase
- Recommend adding HSTS header and CSP

---

## 8. Internal Linking — WEAK

**Current state:** Minimal cross-linking between pages.

| From | Links To |
|------|----------|
| Homepage | `/docs`, `/#pricing`, `/login` |
| Docs index | All doc pages |
| Support | All doc pages |
| Header nav | `/docs`, `/#pricing`, `/login` |
| Footer | `/docs`, `/#pricing`, `/login` (status link is external) |

**Issues:**
1. No links from docs back to homepage use cases
2. No "Related pages" sections in docs
3. No links between docs pages (e.g., errors page doesn't link to rate-limits)
4. Footer has only 4 links — should have 8-12
5. No breadcrumbs

**Recommendations:**
1. Add breadcrumbs to all pages (with BreadcrumbList schema)
2. Add "Related docs" section at bottom of each doc page
3. Add "Next steps" CTAs in docs (e.g., after quickstart → authentication → endpoints)
4. Expand footer with links to future pages (tools, templates, blog, comparisons)
5. Add contextual links within doc content

---

## 9. Heading Structure

### Homepage
- H1: "HTML IN. IMAGE OUT." — Good, attention-grabbing, but not keyword-rich
- Sections use visual hierarchy but check if H2s contain keywords

**Recommendation:** Consider making the H1 more SEO-friendly while keeping the visual headline. Options:
- Visually show "HTML IN. IMAGE OUT." but wrap in a `<span>`, with an SR-only H1 like "HTML to Image API — Convert HTML/CSS to PNG, JPG, WebP"
- Or add a keyword-rich subtitle in an H2 immediately below

### Doc Pages
- Each has an H1 from the MDX title — Good
- Heading hierarchy appears logical (H1 → H2 → H3)

---

## 10. Image Optimization

**Current state:** Almost no images on public pages. The homepage is entirely CSS/text-based.

**For future pages (templates, tools, blog):**
1. Use WebP format
2. Add descriptive alt text to all images
3. Use Next.js `<Image>` component for automatic optimization
4. Lazy load below-fold images
5. Use descriptive filenames (not UUIDs)
