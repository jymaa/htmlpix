# SEO Action Plan — HTMLPix.com

## Phase 0: Quick Wins (Day 1-3)

These require minimal effort and should be done before anything else.

- [ ] **Create `robots.txt`** — Block protected routes, reference sitemap
- [ ] **Fix sitemap** — Remove deleted `/pricing` page, add `/support`, add `lastModified` and `changeFrequency` to all entries
- [ ] **Add canonical tags** — `alternates.canonical` to root layout and per-page where needed
- [ ] **Add meta to `/login`** — Title: "Sign In — HTMLPix", Description: "Sign in to access your HTMLPix dashboard, API keys, and renders."
- [ ] **Generate OG image** — Use HTMLPix API to create a branded og-image.png, add to metadata
- [ ] **Add noindex to protected layout** — Prevent dashboard pages from being indexed
- [ ] **Add JSON-LD Organization schema** to root layout
- [ ] **Add JSON-LD FAQPage schema** to `/docs/faq`
- [ ] **Add JSON-LD BreadcrumbList** to all pages
- [ ] **List on directories** — AlternativeTo, Product Hunt, SaaSHub, RapidAPI, public-apis

---

## Phase 1: First Traffic Pages (Week 1-2)

### Free Tools (build 2-3)
- [ ] Build `/tools/html-to-image` — Interactive HTML to image converter
  - HTML/CSS input, format selector, width/height, preview/download
  - FAQ section with FAQPage schema
  - CTA to API signup
  - Powered by HTMLPix API (rate-limited, no auth required)
- [ ] Build `/tools/og-image-generator` — OG image builder with templates
  - Template selector, variable editor, live preview
  - Dimension presets (1200x630 for OG, etc.)
- [ ] Build `/tools/url-to-screenshot` — URL input, screenshot output

### Homepage SEO Improvements
- [ ] Add keyword-rich H1 or SR-only H1 ("HTML to Image API")
- [ ] Add SoftwareApplication JSON-LD with pricing offers
- [ ] Add HowTo JSON-LD to "How It Works" section
- [ ] Expand footer with more internal links

### Internal Linking
- [ ] Add "Related docs" sections to bottom of each doc page
- [ ] Add "Next: →" navigation between sequential docs
- [ ] Add breadcrumbs component to all pages

---

## Phase 2: Template Gallery + Use Cases (Week 3-6)

### Template Gallery
- [ ] Create 20-30 public OG image templates in Convex
- [ ] Build public template gallery route `/templates/{category}`
- [ ] Build individual template pages `/templates/{category}/{name}`
- [ ] Generate preview images for each template
- [ ] Add to sitemap dynamically

### Use Case Pages (build top 5)
- [ ] `/use-cases/og-image-generation`
- [ ] `/use-cases/social-media-images`
- [ ] `/use-cases/invoice-generation`
- [ ] `/use-cases/certificate-generation`
- [ ] `/use-cases/website-screenshots`

### More Free Tools
- [ ] `/tools/html-to-png`
- [ ] `/tools/html-to-jpg`
- [ ] `/tools/html-to-webp`
- [ ] `/tools/social-card-generator`

---

## Phase 3: Comparisons + Integrations (Month 2)

### Comparison Pages (build top 5)
- [ ] `/compare/htmlpix-vs-puppeteer` — Highest value
- [ ] `/compare/htmlpix-vs-htmlcsstoimage`
- [ ] `/compare/htmlpix-vs-vercel-og`
- [ ] `/compare/htmlpix-vs-bannerbear`
- [ ] `/compare/self-hosted-vs-api`

### Alternative Pages (build top 3)
- [ ] `/alternative/htmlcsstoimage`
- [ ] `/alternative/puppeteer`
- [ ] `/alternative/wkhtmltoimage`

### Integration Pages (build top 4)
- [ ] `/docs/integrations/nextjs`
- [ ] `/docs/sdk/python`
- [ ] `/docs/sdk/nodejs`
- [ ] `/docs/sdk/go`

### First Blog Articles (3)
- [ ] `/blog/how-to-convert-html-to-image`
- [ ] `/blog/how-to-generate-og-images-for-blog`
- [ ] `/blog/puppeteer-vs-screenshot-api`

---

## Phase 4: Scale Content (Month 3+)

### Expand Templates
- [ ] Social card templates (15-20)
- [ ] Invoice templates (10-15)
- [ ] Certificate templates (10-15)
- [ ] Email banner templates (8-12)
- [ ] Receipt, badge, business card templates

### More Integrations
- [ ] PHP, Ruby, C#, Java SDKs
- [ ] Nuxt, Astro, SvelteKit, Rails, Django, Laravel integration guides
- [ ] Zapier, Make, n8n no-code integrations

### More Comparisons
- [ ] Remaining competitor comparison pages
- [ ] Alternative pages for all competitors

### Blog Cadence (2-3/month)
- [ ] How-to tutorials targeting long-tail keywords
- [ ] Use case deep-dives
- [ ] Technical guides (self-hosted Puppeteer costs, performance benchmarks)
- [ ] Customer stories (when available)

### Remaining Use Cases
- [ ] Email banners, event badges, charts, e-commerce, personalized marketing
- [ ] PDF thumbnails, blog featured images

### Additional Free Tools
- [ ] Certificate generator
- [ ] Invoice generator
- [ ] OG image preview/tester

---

## Ongoing SEO Tasks

### Monthly
- [ ] Check Search Console for indexation issues
- [ ] Review keyword rankings
- [ ] Update sitemap with new pages
- [ ] Monitor Core Web Vitals
- [ ] Check for crawl errors

### Quarterly
- [ ] Content refresh — update outdated pages
- [ ] Competitor monitoring — check for new content/features
- [ ] Keyword gap analysis — find new opportunities
- [ ] Internal link audit — ensure no orphan pages
- [ ] Backlink outreach — developer communities, API directories

---

## KPIs to Track

| Metric | Baseline | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|----------|----------------|----------------|-----------------|
| Indexed pages | 12 | 50 | 120 | 250+ |
| Organic traffic (monthly) | 0 | 500 | 3,000 | 10,000 |
| Keywords ranking (top 100) | 0 | 30 | 100 | 300+ |
| Keywords ranking (top 10) | 0 | 5 | 20 | 50+ |
| Backlinks (domains) | 0 | 10 | 30 | 75+ |
| Free tool usage (monthly) | 0 | 500 | 2,000 | 5,000 |
| Signups from organic | 0 | 20 | 100 | 500+ |

---

## Budget Estimates

| Item | Cost | Notes |
|------|------|-------|
| Search Console | Free | Essential, set up day 1 |
| Google Analytics 4 | Free | Set up day 1 |
| Domain/hosting | Already exists | — |
| Content writing (if outsourced) | $200-500/article | For blog posts |
| Screaming Frog (optional) | $259/year | For technical audits at scale |
| Ahrefs/Semrush (optional) | $99-199/month | For keyword research + tracking |
| Product Hunt launch | Free | High-impact backlink opportunity |
| Directory listings | Free | 10+ directories to list on |
