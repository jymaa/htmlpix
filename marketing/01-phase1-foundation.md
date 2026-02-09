# Phase 1: Foundation (Month 1) — $0 Budget

Get the house in order before inviting guests.

---

## 1. Technical SEO Fixes (Week 1)

Already detailed in `/seo/01-technical-audit.md`. Summary:

- [ ] `robots.txt` — block protected routes, reference sitemap
- [ ] Fix sitemap — remove dead `/pricing`, add `lastModified`, `changeFrequency`
- [ ] Canonical tags on all pages
- [ ] `noindex` on protected routes (`/dashboard`, `/api-keys`, etc.)
- [ ] Meta tags on `/login`
- [ ] OG images — use your own API to generate branded images for every page
- [ ] JSON-LD: Organization (root layout), FAQPage (`/docs/faq`), HowTo (`/docs/quickstart`), BreadcrumbList (all pages)

**Psychology:** *Activation Energy* — these fixes reduce friction for Google to index and rank you. Zero effort from users, massive payoff.

---

## 2. Free Tool #1: HTML to Image Converter (Week 1-2)

**URL:** `/tools/html-to-image`
**Target keyword:** "html to image converter online" (Very High volume, Medium competition)

This is the #1 traffic opportunity. No competitor except Pictify has free tools.

### Why This Works (Psychology)

- **Reciprocity:** Give a genuinely useful tool for free. Users feel indebted.
- **Endowment Effect:** Once they've used your tool and seen results, they "own" the experience.
- **Foot-in-the-Door:** Free tool → signed up for API key → paying customer. Each micro-commitment builds on the last.
- **Zero-Price Effect:** "Free" isn't just cheap — it's psychologically different. Removes all risk perception.

### Page Structure

```
H1: HTML to Image Converter — Free Online Tool
Subheading: Convert HTML/CSS to PNG, JPG, or WebP instantly. No signup required.

[Interactive tool]
- HTML textarea (pre-filled with compelling example)
- CSS textarea
- Format dropdown (PNG / JPG / WebP)
- Width / Height inputs
- "Convert" button (prominent, orange)
- Preview + download area

[How It Works — 3 steps]
[FAQ section — 6-8 questions with FAQPage schema]
[CTA banner: "Need this at scale? The HTMLPix API does 10,000+ renders/month →"]
[Related tools grid]
```

### CTA Psychology

- **Anchoring:** Show what the API can do (batches, templates, webhooks) vs the free tool
- **Door-in-the-Face:** The API feels affordable after seeing Enterprise pricing first
- **Loss Aversion:** "Your free tool renders expire in 1 hour. API renders are stored for 24h."

### Implementation Notes

- Tool hits your own API on the backend (rate-limited: ~10/hour per IP)
- No login required — remove ALL friction
- Pre-fill with an impressive HTML example (gradient OG image card)
- Show render time in the UI ("Rendered in 143ms") — proof of speed

---

## 3. Free Tool #2: OG Image Generator (Week 2)

**URL:** `/tools/og-image-generator`
**Target keyword:** "og image generator" (High volume, Medium competition)

### Why OG Images Specifically

- Every website needs them — universal need
- Developers google "og image generator" when they need one NOW
- Natural bridge to API ("automate this for every page")
- Visual output = shareable = organic amplification

### Page Structure

```
H1: Free OG Image Generator
Subheading: Create Open Graph images for Twitter, Facebook, LinkedIn. 1200x630.

[Template selector — 5-6 pre-built OG image layouts]
[Variable editor — title, subtitle, author, logo URL, colors]
[Live preview at exact 1200x630]
[Download PNG button]

[How OG Images Work — educational section]
[Platform-specific specs (Twitter, Facebook, LinkedIn, Discord)]
[FAQ with FAQPage schema]
[CTA: "Generating OG images for every blog post manually? Automate it with the HTMLPix API →"]
```

### Psychology

- **IKEA Effect:** Users customize the template with their own content. They value the result more because they built it.
- **Commitment & Consistency:** After creating one OG image, they'll want to create them for all pages. That's when the API pitch lands.
- **Present Bias:** Show immediate results ("your OG image is ready") rather than future benefits.

---

## 4. Directory & Platform Listings (Week 2-3)

Free backlinks + brand presence + discoverability. These compound.

### Tier 1: Do Immediately (High Impact, Easy)

| Platform | Action | Expected Backlink |
|----------|--------|-------------------|
| Google Search Console | Verify site, submit sitemap | — (essential) |
| Bing Webmaster Tools | Verify site, submit sitemap | — (essential) |
| Product Hunt | Prepare launch (see Phase 3) | DA 90+ |
| AlternativeTo | List as alternative to htmlcsstoimage, Puppeteer, urlbox | DA 70+ |
| SaaSHub | Create product listing | DA 60+ |
| GitHub | Create htmlpix org, SDK repos with homepage links | DA 95+ |

### Tier 2: Do Next (Medium Impact)

| Platform | Action | Expected Backlink |
|----------|--------|-------------------|
| npm / PyPI | Publish SDK packages with homepage URL | DA 90+ |
| Dev.to | Create organization profile | DA 80+ |
| Hashnode | Create blog | DA 70+ |
| RapidAPI | List API on marketplace | DA 70+ |
| Peerlist | Developer community listing | DA 50+ |
| BetaList | Submit for listing | DA 60+ |
| public-apis (GitHub) | Submit PR to add HTMLPix | DA 95+ |

### Tier 3: Complete Over Time

| Platform | Action |
|----------|--------|
| G2 | Create product listing |
| Capterra | Create product listing |
| StackShare | Create tool listing |
| Indie Hackers | Create product page |
| Microconf Connect | List product |
| API list directories | apilist.fun, apis.guru, etc. |

**Psychology:** *Mere Exposure Effect* — every listing is another touchpoint. When developers see "HTMLPix" in search results, on AlternativeTo, on GitHub, on Dev.to... familiarity builds trust unconsciously.

---

## 5. Google Search Console & Analytics Setup (Day 1)

- [ ] Set up Google Search Console — verify ownership, submit sitemap
- [ ] Set up Google Analytics 4 — track key events: signup, API key creation, first render
- [ ] Set up Bing Webmaster Tools
- [ ] Define conversion goals: Free signup → API key created → First render → Upgrade

---

## 6. Social Profiles (Week 1)

Claim handles even if you don't post yet:

- [ ] Twitter/X: @htmlpix — Developer-focused updates, tips, product announcements
- [ ] GitHub: github.com/htmlpix — SDK repos, open source contributions
- [ ] LinkedIn: Company page — for B2B credibility
- [ ] Reddit: u/htmlpix — for community participation (not promotion)

---

## Phase 1 Expected Outcomes

| Metric | Target |
|--------|--------|
| Indexed pages | 15-20 (current 12 + tools + fixed pages) |
| Backlinks (domains) | 5-10 from directory listings |
| Organic traffic (monthly) | 50-200 (tools pages starting to index) |
| Free tool usage | 100-300/month |
| Signups | 5-15 |

## Key Insight

Phase 1 is about planting seeds. SEO takes 2-4 months to show results. The free tools are your fastest path to organic traffic because they target high-volume keywords with genuine utility. Every tool user is a potential API customer.
