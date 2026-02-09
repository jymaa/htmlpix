# Phase 3: Community & Launches (Month 3-5) — $0 Budget

Content brings traffic. Community builds a brand.

---

## 1. Product Hunt Launch (Month 3)

### Why Product Hunt

- DA 90+ backlink (massive SEO value)
- 5,000-20,000 potential visitors in 24 hours
- Developer-heavy audience = your exact ICP
- Social proof for months/years ("Featured on Product Hunt" badge)
- Forces you to refine messaging and positioning

### Launch Preparation (2 weeks before)

**Week -2:**
- [ ] Create Product Hunt maker profile
- [ ] Prepare assets: logo (240x240), gallery images (1270x760), video/GIF demo
- [ ] Write tagline (60 chars max): "HTML in, image out. Screenshot API for developers."
- [ ] Write description (260 chars): "Send HTML/CSS to our API, get back pixel-perfect PNG/JPG/WebP. Replace self-hosted Puppeteer with one POST request. 50 free renders/month."
- [ ] Prepare first comment (your story — why you built it, what problem it solves)
- [ ] Create a special landing page or offer for PH visitors (e.g., 200 free renders for PH users)

**Week -1:**
- [ ] Line up 10-15 people to upvote and leave genuine comments on launch day
- [ ] Pre-schedule social posts for launch day
- [ ] Prepare responses for common questions
- [ ] Choose launch day: Tuesday or Wednesday (highest traffic on PH)
- [ ] Schedule launch for 12:01 AM PT (get full 24 hours)

**Launch Day:**
- [ ] Post at 12:01 AM PT
- [ ] Share immediately on Twitter, LinkedIn, developer communities
- [ ] Respond to every comment within 15 minutes
- [ ] Share live metrics ("We just crossed 100 upvotes!")
- [ ] Post an evening update with thank you

**Psychology:**
- **Bandwagon Effect:** Upvote momentum attracts more upvotes. Early velocity matters.
- **Scarcity:** "200 free renders for Product Hunt users — today only" creates urgency
- **Unity Principle:** "We built this because we were tired of maintaining Puppeteer" — shared developer pain = instant tribe
- **Reciprocity:** Generous free tier + PH bonus = goodwill = comments + upvotes

### Expected Outcome

- 200-500 upvotes (top 10 of day)
- 2,000-5,000 site visitors
- 100-300 signups
- 1 high-DA backlink
- "Featured on Product Hunt" badge forever

---

## 2. Hacker News: Show HN (Month 3-4)

### Strategy

HN is about technical substance, not marketing polish. Two approaches:

**Approach A — Show HN: HTMLPix**
Post when you have something genuinely interesting to show. Lead with the technical angle:
- "Show HN: I built an HTML-to-image API to replace self-hosted Puppeteer"
- Link to the product, but lead with the story and technical details
- Be in the comments immediately, answering questions honestly

**Approach B — Technical Blog Post**
Write a deep technical post that happens to mention HTMLPix:
- "The Hidden Costs of Self-Hosting Puppeteer for Screenshots"
- "How We Render 10,000 HTML Pages to Images Per Hour"
- Technical depth earns HN respect (and traffic)

### HN Rules

- Never ask for upvotes
- Be in comments immediately and for hours
- Be honest about limitations
- Don't be salesy — be a developer talking to developers
- If you hit front page: 5,000-30,000 visitors

**Psychology:**
- **Authority Bias:** Technical depth builds credibility on HN
- **Pratfall Effect:** Admitting challenges ("we tried X and it failed, so we built Y") makes you relatable
- **Liking/Similarity:** "I'm a developer who had this problem" = instant rapport

---

## 3. Developer Community Participation (Ongoing)

### Reddit Strategy

**Target subreddits:**
- r/webdev (~2.3M) — web development
- r/javascript (~2.2M) — JS ecosystem
- r/nextjs (~150K) — Next.js specific
- r/Python (~1.5M) — Python developers
- r/SaaS (~100K) — SaaS builders
- r/Entrepreneur (~1M) — indie makers
- r/selfhosted (~400K) — for "vs self-hosted Puppeteer" angle

**Rules:**
1. **80/20 rule:** 80% helpful comments, 20% mentions of HTMLPix (only when relevant)
2. Never post "check out my product" — instant ban/downvote
3. Answer questions genuinely: "How do I convert HTML to image in Python?" → detailed answer → "I also built an API for this if you want to skip the setup: htmlpix.com"
4. Share blog posts, not product links
5. Build karma over weeks before mentioning your product

**Psychology:**
- **Reciprocity:** Help first, ask never. Developers remember who helped them.
- **Mere Exposure:** Your username + flair become familiar over time
- **Authority Bias:** Thoughtful, technical answers build expert reputation

### Dev.to / Hashnode Strategy

Republish blog posts (with canonical URL pointing to htmlpix.com/blog/...) on:
- Dev.to — large developer audience, good for tutorials
- Hashnode — good community, often syndicates to Google News

**Post ideas:**
- "5 Ways to Convert HTML to Image (Compared)"
- "How I Automated OG Image Generation for 10,000 Blog Posts"
- "The Real Cost of Self-Hosting Puppeteer in 2026"
- "Building an HTML-to-Image API: Architecture Deep Dive"

### Twitter/X Strategy

**Content pillars (3-4 posts/week):**
1. **Tips:** "Quick tip: OG images should be 1200x630. Here's a free generator: [link]"
2. **Behind the scenes:** "Just optimized render latency from 400ms to 180ms. Here's how..."
3. **Use cases:** "Thread: 7 things developers automate with HTML-to-image APIs 🧵"
4. **Social proof:** "HTMLPix just hit 1,000 renders today" (milestone sharing)

**Follow and engage with:**
- Indie hackers building in public
- Developer advocates at Vercel, Supabase, Convex
- People tweeting about Puppeteer problems
- People tweeting about OG images

**Psychology:**
- **Mimetic Desire:** Seeing others use and talk about HTMLPix creates desire
- **Bandwagon Effect:** Sharing milestones signals momentum
- **Commitment & Consistency:** Building in public creates accountability + audience

---

## 4. Open Source as Marketing (Month 3-4)

### SDK Repositories

Create official SDK packages that link back to htmlpix.com:

| Repository | Package | Homepage Link |
|-----------|---------|---------------|
| `htmlpix/htmlpix-node` | npm: `htmlpix` | htmlpix.com |
| `htmlpix/htmlpix-python` | PyPI: `htmlpix` | htmlpix.com |
| `htmlpix/htmlpix-go` | Go module | htmlpix.com |

Each SDK:
- Provides a thin wrapper around the API
- Has a comprehensive README with examples
- Links to docs.htmlpix.com
- GitHub star count = social proof

### Open Source Templates

Create a public repo: `htmlpix/templates`
- 50+ HTML/CSS templates (OG images, invoices, certificates, etc.)
- Anyone can use them (with or without HTMLPix)
- README links to htmlpix.com template gallery
- Community contributions welcome (PR-driven)

**Psychology:**
- **Reciprocity:** Free, useful code creates massive goodwill
- **Mere Exposure:** npm install, pip install, GitHub stars = brand impressions
- **Network Effects:** More SDKs → easier integration → more developers → more SDKs
- **Authority Bias:** Open source maintainer = trusted community member

### Expected Backlinks from Open Source

| Source | DA | Type |
|--------|-----|------|
| GitHub repos (homepage field) | 95+ | Direct |
| npm package page | 95+ | Direct |
| PyPI package page | 90+ | Direct |
| README links | 95+ | Contextual |
| GitHub topic pages | 95+ | Indirect |

---

## 5. Strategic Q&A Participation (Ongoing)

### Stack Overflow

Search for questions about:
- "html to image conversion"
- "puppeteer screenshot problems"
- "og image generation"
- "html to png node js"
- "headless chrome alternatives"

Answer genuinely with code examples. Include HTMLPix as one option among several when relevant. Never spam. One helpful answer with a natural mention is worth more than 50 spammy ones.

### GitHub Issues / Discussions

Monitor issues on:
- `puppeteer/puppeteer` — people struggling with browser automation
- `vercel/satori` — people hitting @vercel/og limitations
- `frinyvonnick/node-html-to-image` — library users hitting limitations
- `wkhtmltopdf/wkhtmltopdf` — people migrating off deprecated tool

Comment helpfully. Offer HTMLPix as an alternative when someone is clearly struggling.

---

## 6. Email List Building (Month 3)

### What to Offer

- **Free tool users:** "Get render tips + template drops in your inbox" (after they use a free tool)
- **Blog readers:** "Weekly developer image tip — no spam" (sidebar/bottom CTA)
- **Template gallery:** "New templates every week — subscribe"

### Email Content (Weekly-ish)

1. New template drop (with preview)
2. Developer tip (OG image best practices, API tricks)
3. New blog post summary
4. Product update (new feature, performance improvement)
5. Use case spotlight (how someone is using HTMLPix)

### Psychology

- **Commitment & Consistency:** Email subscribers have made a micro-commitment. They're more likely to convert.
- **Mere Exposure:** Weekly emails keep HTMLPix top-of-mind
- **Reciprocity:** Genuinely useful emails create goodwill
- **Zeigarnik Effect:** "Part 1 of our OG Image Guide..." creates open loops

---

## Phase 3 Expected Outcomes

| Metric | Target |
|--------|--------|
| Indexed pages | 120+ |
| Backlinks (domains) | 25-40 (PH, directories, GitHub, npm, cross-posts) |
| Organic traffic (monthly) | 2,000-5,000 |
| Referral traffic (monthly) | 1,000-3,000 (PH, HN, Reddit, Dev.to) |
| Keywords ranking (top 100) | 60-100 |
| Email subscribers | 100-300 |
| Signups | 50-150/month |
| Paid conversions | 8-20/month |
| MRR | $100-300 |

## Key Insight

Community marketing is slow to start but creates something ads never can: **trust**. A developer who found you through a helpful Reddit answer, used your free tool, read your technical blog post, and saw you on Product Hunt has 4+ touchpoints. They don't need convincing — they already trust you. This is the **Rule of 7** in action.
