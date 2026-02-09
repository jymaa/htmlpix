# 90-Day Marketing Action Plan — Week by Week

Concrete tasks. No fluff.

---

## Week 1: Technical Foundation

- [ ] Set up Google Search Console, submit sitemap
- [ ] Set up Google Analytics 4, configure conversion events (signup, API key created, first render, plan upgrade)
- [ ] Set up Bing Webmaster Tools
- [ ] Create `robots.txt` (block protected routes)
- [ ] Fix sitemap (remove `/pricing`, add `lastModified`, `changeFrequency`)
- [ ] Add canonical tags to all pages
- [ ] Add `noindex` meta to protected layout
- [ ] Add JSON-LD: Organization (root layout), BreadcrumbList (all pages)
- [ ] Add JSON-LD: FAQPage to `/docs/faq`, HowTo to `/docs/quickstart`
- [ ] Add meta title + description to `/login`
- [ ] Generate OG images using HTMLPix API for all public pages
- [ ] Claim social handles: Twitter @htmlpix, GitHub org, LinkedIn company page

**Time:** ~15-20 hours

---

## Week 2: First Free Tool

- [ ] Build `/tools/html-to-image` (HTML/CSS input → PNG/JPG/WebP output)
  - Interactive tool powered by HTMLPix API (rate-limited, no auth)
  - Pre-filled with impressive HTML example
  - Format selector, width/height inputs
  - Preview + download
  - Show render time in UI
- [ ] Add FAQ section with FAQPage schema (6-8 questions)
- [ ] Add CTA banner: "Need this at scale? Try the HTMLPix API"
- [ ] Add to sitemap
- [ ] Internal links: homepage → tool, tool → docs, tool → use cases
- [ ] Test on mobile

**Time:** ~20-25 hours

---

## Week 3: Second Free Tool + Directory Listings

- [ ] Build `/tools/og-image-generator`
  - 5-6 pre-built OG image templates
  - Variable editor (title, subtitle, author, colors)
  - Live preview at 1200x630
  - Download PNG
  - Platform specs section (Twitter, Facebook, LinkedIn)
- [ ] Add FAQ + structured data
- [ ] Build format-variant tools (low effort, share most code):
  - [ ] `/tools/html-to-png`
  - [ ] `/tools/html-to-jpg`
  - [ ] `/tools/html-to-webp`
- [ ] Directory listings:
  - [ ] AlternativeTo (list as alternative to htmlcsstoimage, Puppeteer)
  - [ ] SaaSHub
  - [ ] BetaList
  - [ ] GitHub public-apis repo (submit PR)

**Time:** ~20-25 hours

---

## Week 4: Internal Linking + First Blog Post

- [ ] Add breadcrumbs component to all public pages
- [ ] Add "Related docs" section to bottom of each doc page
- [ ] Add "Next →" navigation between sequential docs
- [ ] Expand footer links (add tools, use cases section links)
- [ ] Add contextual links within doc content (quickstart → authentication → endpoints → examples)
- [ ] Write blog post #1: "How to Convert HTML to Image — 5 Methods Compared (2026)"
  - Target: "how to convert html to image"
  - 2,000-3,000 words
  - Compare: DevTools, Puppeteer, node-html-to-image, @vercel/og, HTMLPix
  - Working code examples for each
  - FAQ section
- [ ] Set up `/blog` route + layout

**Time:** ~20-25 hours

---

## Week 5-6: Comparison Pages

- [ ] Build comparison page template (reusable layout)
- [ ] `/compare/htmlpix-vs-puppeteer`
  - Feature table, code comparison, pricing comparison
  - "When to use" sections for both (honest)
  - Migration guide
  - FAQ
- [ ] `/compare/htmlpix-vs-htmlcsstoimage`
  - Feature comparison, pricing ($8 vs $14 for 1K), speed
  - Acknowledge their domain name advantage
  - Show where HTMLPix wins (price, templates, format options)
- [ ] `/compare/htmlpix-vs-vercel-og`
  - @vercel/og limitations (no full CSS, limited fonts, Vercel-only)
  - HTMLPix advantages (any HTML/CSS, any platform)
  - Side-by-side code examples
- [ ] `/compare/self-hosted-vs-api`
  - TCO analysis (server costs + engineering time vs API cost)
  - When self-hosting makes sense vs when API is better
- [ ] `/compare/htmlpix-vs-bannerbear`
  - Price comparison ($8 vs $49)

**Time:** ~25-30 hours

---

## Week 7-8: Template Gallery Foundation

- [ ] Design template page components (category page + individual template page)
- [ ] Create 20-30 OG image templates in Convex (starter templates)
  - Minimal, bold, gradient, dark, light, blog, podcast, product, event, announcement styles
- [ ] Build `/templates` index page
- [ ] Build `/templates/og-image` category page (grid of template cards)
- [ ] Build `/templates/og-image/[name]` individual pages
  - Live preview, variable editor, HTML/CSS source, "Use with API" code
- [ ] Generate preview images for each template
- [ ] Add all template pages to sitemap (dynamic generation)
- [ ] Internal links: homepage → templates, use cases → templates, tools → templates
- [ ] Create 10-15 social card templates (`/templates/social-card`)
- [ ] Create 10 invoice templates (`/templates/invoice`)

**Time:** ~30-40 hours

---

## Week 9-10: Blog + SDK Pages

- [ ] Blog post #2: "How to Generate OG Images Automatically for Your Blog"
  - Target: "generate og images automatically"
  - Next.js, Astro, and Hugo examples
  - Template examples from gallery
- [ ] Blog post #3: "Self-Hosted Puppeteer: The True Cost in 2026"
  - Target: "puppeteer costs", "self host puppeteer"
  - TCO breakdown: EC2 + maintenance + scaling + debugging
  - Compare with API approach
- [ ] Blog post #4: "OG Image Best Practices: Sizes, Formats, and Tips"
  - Target: "og image best practices"
  - Platform-specific guidance
  - Common mistakes
- [ ] `/docs/sdk/python` — HTML to image in Python (requests library example)
- [ ] `/docs/sdk/nodejs` — HTML to image in Node.js (fetch/axios examples)
- [ ] `/docs/integrations/nextjs` — OG images in Next.js with HTMLPix
  - App Router + Pages Router examples
  - Edge function approach
  - Comparison with @vercel/og

**Time:** ~25-30 hours

---

## Week 11-12: More Use Cases + Community Launch

- [ ] New use case pages:
  - [ ] `/use-cases/website-screenshots` — targeting "screenshot api"
  - [ ] `/use-cases/ecommerce-product-images` — targeting "dynamic product images"
  - [ ] `/use-cases/blog-featured-images` — targeting "automate blog featured images"
- [ ] Enhance existing 7 use case pages:
  - Add framework-specific code snippets (tabs)
  - Add ROI calculator
  - Add FAQ sections with schema
  - Add template links
- [ ] More free tools:
  - [ ] `/tools/url-to-screenshot` (Medium effort, new functionality)
  - [ ] `/tools/social-card-generator` (Medium effort, template-based)
- [ ] Publish first Dev.to article (cross-post blog #1 with canonical)
- [ ] Prepare Product Hunt launch assets
- [ ] Start Reddit participation (answer HTML-to-image questions in r/webdev, r/javascript)

**Time:** ~25-30 hours

---

## Week 13 (Bonus): Product Hunt Launch

- [ ] Final asset prep (logo, gallery, video/GIF demo)
- [ ] Write PH description + first comment
- [ ] Line up 10-15 supporters for launch day
- [ ] Launch Tuesday or Wednesday at 12:01 AM PT
- [ ] Be in comments all day
- [ ] Share on all social channels
- [ ] Send email to list (if any subscribers)

**Time:** ~10-15 hours (including launch day)

---

## Running Totals

| Week | Cumulative Pages | Cumulative Backlinks | Est. Monthly Traffic |
|------|-----------------|---------------------|---------------------|
| 1 | 12 (fixed) | 0 | 0 |
| 2 | 13 | 0 | 0 |
| 3 | 18 | 3-5 | 10-50 |
| 4 | 20 | 5-7 | 50-100 |
| 6 | 25 | 7-10 | 100-300 |
| 8 | 70-80 | 10-15 | 300-800 |
| 10 | 85-95 | 15-20 | 500-1,500 |
| 12 | 100-110 | 20-30 | 1,000-3,000 |
| 13+ | 100-110 + PH | 30-40 | 2,000-5,000 (PH spike) |

---

## Weekly Time Commitment

**Average: 15-25 hours/week** across all marketing activities.

| Activity | Hours/Week |
|----------|-----------|
| Building pages/tools | 10-15 |
| Writing content | 5-8 |
| Community participation | 2-3 |
| Analytics review | 1 |
| Directory listings / outreach | 1-2 |

---

## Monthly Check-In Questions

**End of Month 1:**
- Are technical SEO fixes live and verified in Search Console?
- Are free tools live and functional?
- Are pages being indexed?
- First directory listings done?

**End of Month 2:**
- How many pages indexed? Target: 50+
- Any keywords showing in top 100?
- Template gallery live?
- Comparison pages live?
- Blog posts published and cross-posted?

**End of Month 3:**
- Organic traffic trend? Target: 500-2,000/mo
- Free tool usage? Target: 300-1,000/mo
- First signups from organic? Target: 10-30
- Product Hunt launched? Results?
- Any paid conversions from organic? Target: 3-8
