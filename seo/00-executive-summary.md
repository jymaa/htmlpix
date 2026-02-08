# HTMLPix.com SEO Strategy — Executive Summary

## Site Status

Fresh site, no production traffic yet. Domain: htmlpix.com

## Current State

| Area | Status | Grade |
|------|--------|-------|
| Meta tags (title, description, OG, Twitter) | Present on root + docs | B |
| XML Sitemap | Present (12 URLs) | C+ |
| robots.txt | Missing | F |
| Structured data (JSON-LD) | Missing entirely | F |
| Canonical tags | Missing | F |
| Internal linking | Weak — few cross-links | D |
| Content depth | Thin — only docs + homepage | D |
| Page count (indexable) | ~12 pages | F |
| Alt text on images | No images with alt text | D |
| URL structure | Clean, logical | A |
| Mobile responsive | Yes | A |
| HTTPS | Yes | A |

## Top 5 Priority Actions

1. **Add robots.txt + improve sitemap** — unblock crawling, add changefreq/lastmod to all entries
2. **Add JSON-LD structured data** — SoftwareApplication on homepage, FAQPage on FAQ, HowTo on quickstart, pricing table markup
3. **Build 10 free tool pages** — `/tools/html-to-image`, `/tools/og-image-generator`, etc. — these are the #1 traffic opportunity
4. **Build template gallery** — 50-100+ individual template pages at `/templates/{category}/{name}`
5. **Create comparison + alternative pages** — vs Puppeteer, vs htmlcsstoimage, vs @vercel/og, etc.

## Traffic Potential (12-Month Estimate)

| Phase | Pages Added | Est. Monthly Organic Traffic |
|-------|-------------|------------------------------|
| Current (12 pages) | 0 | ~0 |
| Phase 1: Technical fixes + tools | +15 | 500-2,000 |
| Phase 2: Templates + use cases | +75 | 2,000-8,000 |
| Phase 3: Blog + comparisons + integrations | +50 | 5,000-15,000 |
| Phase 4: Scale templates + long tail | +200 | 10,000-30,000 |

## Keyword Strategy Overview

| Cluster | Primary Keywords | Intent | Priority |
|---------|-----------------|--------|----------|
| Core product | "html to image api", "html to png api" | Commercial | P0 |
| Free tools | "html to image converter", "og image generator" | Transactional | P0 |
| Use cases | "generate og images automatically", "automate certificate generation" | Informational/Commercial | P1 |
| Frameworks | "nextjs og image", "html to image python" | Informational | P1 |
| Comparisons | "puppeteer vs screenshot api", "htmlcsstoimage alternative" | Commercial | P1 |
| Templates | "og image template", "invoice template html" | Transactional | P2 |
| How-to | "how to convert html to image", "how to generate og images" | Informational | P2 |

## Top Competitors

| Competitor | Pages | Content Strategy | Weakness |
|-----------|-------|-----------------|----------|
| htmlcsstoimage.com | ~60 | Docs + examples, no blog | No blog, no comparisons, relies on domain name |
| screenshotone.com | ~100+ | 43+ use case pages, blog | Screenshot-focused, not HTML-to-image |
| urlbox.com | ~200+ | 150+ blog articles, comparisons | Expensive, URL-focused |
| pictify.io | ~25 | 6 free tools, blog | Small, newer |
| apiflash.com | ~10 | Minimal content | Almost no SEO investment |

## Quick Wins (< 1 week effort)

1. Add `robots.txt` with sitemap reference
2. Add JSON-LD to homepage (SoftwareApplication schema)
3. Add FAQPage schema to `/docs/faq`
4. Add canonical tags to all pages
5. Add OG images (use your own API to generate them)
6. Fix sitemap: remove `/pricing` (deleted page), add changefreq to all entries
7. Add per-page meta descriptions to `/login` and any pages missing them
