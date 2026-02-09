# Phase 2: Content Engine (Month 2-3) — $0 Budget

Build the content moat that compounds for years.

---

## Strategy: The Content Flywheel

```
Free tools → organic traffic → email captures → API signups
     ↑                                               |
     |                                               ↓
Templates ← use cases ← blog posts ← case studies ← customers
```

Every piece of content links to others, creating a self-reinforcing system. This is the **Flywheel Effect** — hard to start, easy to maintain once spinning.

---

## 1. Template Gallery (Week 5-8) — 50-100 Pages

### Why Templates Are a Marketing Goldmine

**Psychology at play:**
- **IKEA Effect:** Users customize templates → value them more → more likely to use the API to render them
- **Endowment Effect:** Once a developer finds "their" template, they feel ownership
- **Switching Costs:** Templates built on HTMLPix create lock-in (ethically)
- **Reciprocity:** Free, high-quality templates = massive goodwill

### Template Categories (by priority)

| Category | # Templates | Target Keyword | Monthly Volume |
|----------|------------|----------------|----------------|
| OG Image | 20-30 | "og image template" | High |
| Social Card | 15-20 | "social card template" | Medium |
| Invoice | 10-15 | "invoice template html" | High |
| Certificate | 10-15 | "certificate template" | Medium |
| Email Banner | 8-12 | "email banner template" | Medium |
| Receipt | 5-8 | "receipt template html" | Low |
| Event Badge | 5-8 | "event badge template" | Low |
| Business Card | 5-8 | "business card template html" | Low |

### Page Architecture

**Category page** (`/templates/og-image`):
```
H1: OG Image Templates — Ready to Use with HTMLPix API
Grid of 20-30 template cards with live previews
Filter by style (minimal, bold, gradient, dark, light)
CTA: "Use any template with one API call"
```

**Individual template page** (`/templates/og-image/minimal-dark`):
```
Breadcrumb: Templates > OG Image > Minimal Dark
H1: Minimal Dark — OG Image Template
Live preview image (rendered by HTMLPix)
Variable editor (title, subtitle, author, colors)
HTML/CSS source code (visible, copyable)
"Use with API" code snippet (ready to copy)
Related templates from same category
```

### SEO Impact

Each template page is a unique, indexable URL targeting long-tail keywords:
- "minimal dark og image template"
- "gradient blog og image template"
- "modern invoice template html css"

100 template pages = 100 new indexed URLs = 100 long-tail keyword opportunities.

### Internal Linking Strategy

- Homepage use-case cards → template category pages
- Template pages → related use case page
- Template pages → docs/quickstart
- Template pages → free tools
- Blog posts → specific template pages

---

## 2. Comparison & Alternative Pages (Week 5-7) — 8-10 Pages

### Why Comparisons Work

Developers searching "[competitor] alternative" or "[tool] vs [tool]" are **high-intent buyers**. They've already decided they need a solution — they're choosing which one.

**Psychology:**
- **Contrast Effect:** Side-by-side comparison makes your advantages vivid
- **Anchoring:** Show competitor pricing first to anchor expectations high
- **Pratfall Effect:** Honestly acknowledge where competitors are stronger — this builds massive trust
- **Confirmation Bias:** Developers already frustrated with their current tool will find evidence confirming the switch is smart

### Priority Pages

| Page | Target Keyword | Why High Priority |
|------|---------------|-------------------|
| `/compare/htmlpix-vs-puppeteer` | "puppeteer alternative" | HUGE pain point. Every dev hates maintaining Chromium. |
| `/compare/htmlpix-vs-htmlcsstoimage` | "htmlcsstoimage alternative" | Direct competitor, they have no comparison pages (undefended) |
| `/compare/htmlpix-vs-vercel-og` | "vercel og alternative" | @vercel/og has strict limitations (no CSS, limited fonts) |
| `/compare/self-hosted-vs-api` | "self host puppeteer problems" | Addresses the "build vs buy" objection head-on |
| `/compare/htmlpix-vs-bannerbear` | "bannerbear alternative" | Bannerbear is $49/mo — massive price advantage |

### Comparison Page Template

```
H1: HTMLPix vs Puppeteer: Which Should You Use in 2026?

[Quick Verdict — 2-3 sentences, honest]
"If you need full browser automation, use Puppeteer. If you need to convert HTML to images reliably at scale, HTMLPix saves you weeks of infrastructure work."

[Comparison Table]
| Feature | HTMLPix | Puppeteer |
| Setup time | 30 seconds | Hours-days |
| Infrastructure | None (API) | You manage Chrome/Chromium |
| Cost at 1K renders | $8/mo | $20-100/mo (server costs) |
| Scaling | Automatic | Manual |
...

[When to Use HTMLPix — 3-4 scenarios]
[When to Use Puppeteer — honest, 2-3 scenarios]
[Migration Guide — code examples]
[FAQ]
[CTA: "Try HTMLPix Free — 50 renders/month, no credit card"]
```

### The Honesty Edge

Most comparison pages are biased garbage. **Be genuinely honest:**
- Puppeteer IS more flexible for full browser automation
- htmlcsstoimage HAS a better domain name for SEO
- @vercel/og IS free if you're on Vercel

Then show where HTMLPix wins: price, simplicity, speed, format options, template system.

This honesty triggers the **Pratfall Effect** — admitting small weaknesses makes your strengths more believable.

---

## 3. Blog Content (Week 6-10) — 5-8 Articles

### Content Strategy: Developer-First, SEO-Optimized

Write for developers who are searching for solutions, not for your product.

**Psychology:**
- **Reciprocity:** Genuinely helpful tutorials create goodwill
- **Authority Bias:** In-depth technical content positions HTMLPix as the expert
- **Mere Exposure Effect:** Every blog post is another search result with your brand name

### Priority Articles

| Article | Target Keyword | Funnel Stage |
|---------|---------------|--------------|
| How to Convert HTML to Image (5 Methods) | "html to image" | Top of funnel |
| How to Generate OG Images Automatically | "generate og images" | Mid funnel |
| Self-Hosted Puppeteer: The Hidden Costs | "puppeteer costs" | Mid funnel |
| OG Image Best Practices (Sizes, Formats, Tips) | "og image best practices" | Top of funnel |
| HTML to Image in Python: Complete Guide | "html to image python" | Mid funnel |

### Blog Post Template

```
H1: How to Convert HTML to Image — 5 Methods Compared (2026)

[Hook — acknowledge the pain]
[TL;DR table comparing all 5 methods]

[Method 1: Browser DevTools — manual, doesn't scale]
[Method 2: Puppeteer/Playwright — powerful but heavy]
[Method 3: node-html-to-image — simple but limited]
[Method 4: @vercel/og / Satori — free but constrained]
[Method 5: HTMLPix API — the easy way]

[Comparison table: features, cost, effort]
[When to use each method]
[FAQ]
[CTA: soft, relevant]
```

### Writing Rules

1. Lead with value, not product pitch
2. Compare alternatives honestly (including HTMLPix)
3. Code examples must work — test them
4. 1,500-3,000 words (depth wins in SEO)
5. Internal link to 2-3 other pages (tools, templates, docs)
6. Include FAQ section with FAQPage schema

---

## 4. Use Case Page Expansion (Week 7-10) — 5-7 More Pages

Build on the existing 7 use cases with deeper, SEO-optimized content.

### New Use Case Pages

| Page | Target Keyword |
|------|---------------|
| `/use-cases/website-screenshots` | "screenshot api" |
| `/use-cases/ecommerce-product-images` | "dynamic product images" |
| `/use-cases/personalized-marketing` | "personalized image generation" |
| `/use-cases/blog-featured-images` | "automate blog featured images" |
| `/use-cases/pdf-thumbnails` | "generate pdf thumbnail" |

### Enhance Existing Use Cases

Each use case page should include:
- Problem statement (emotional — what's the pain?)
- Solution with HTMLPix (simple — show the code)
- Template examples for this use case (link to template gallery)
- Integration snippet for popular frameworks (tabs: Next.js, Python, Node.js)
- ROI calculation ("Manual: 5 min/image × 1000 images = 83 hours. With API: 0 hours.")
- FAQ with structured data

**Psychology:**
- **Jobs to Be Done:** Each use case frames HTMLPix as hired to do a specific job
- **Loss Aversion:** ROI calculation shows what they're LOSING by doing it manually
- **Present Bias:** "Set up in 5 minutes" emphasizes immediate payoff

---

## 5. More Free Tools (Week 6-8) — 4-5 Pages

| Tool | Target Keyword | Effort |
|------|---------------|--------|
| `/tools/html-to-png` | "html to png converter" | Low (variant of html-to-image) |
| `/tools/html-to-jpg` | "html to jpg converter" | Low |
| `/tools/html-to-webp` | "html to webp converter" | Low |
| `/tools/url-to-screenshot` | "url to screenshot online" | Medium |
| `/tools/social-card-generator` | "social card generator" | Medium |

The format-specific tools are easy wins — same tool with different default format + format-specific educational content (PNG transparency, JPG compression, WebP browser support).

---

## 6. SDK/Integration Pages (Week 8-10) — 6 Pages

Developers search "[language] html to image". Every SDK page captures this traffic.

### Priority SDKs

| Page | Target Keyword |
|------|---------------|
| `/docs/sdk/python` | "html to image python" (High volume) |
| `/docs/sdk/nodejs` | "html to image node js" (High volume) |
| `/docs/integrations/nextjs` | "nextjs og image" (High volume) |
| `/docs/sdk/go` | "html to image golang" |
| `/docs/sdk/php` | "html to image php" |
| `/docs/sdk/curl` | "html to image curl" |

Even if you don't have official SDKs yet, create integration guides showing how to use the API with `fetch`/`requests`/`http.Client` in each language.

---

## Phase 2 Expected Outcomes

| Metric | Target |
|--------|--------|
| Indexed pages | 80-120 |
| Backlinks (domains) | 10-20 |
| Organic traffic (monthly) | 500-2,000 |
| Keywords ranking (top 100) | 30-50 |
| Free tool usage | 500-1,000/month |
| Signups | 20-50/month |
| Paid conversions | 3-8/month |

## Key Insight

This phase is the moat. Competitors can copy features but they can't instantly replicate 100+ content pages with internal links, structured data, and accumulated domain authority. Content compounds. Start now.
