# Phase 5: Paid Amplification (Month 7+) — $500-2,000/mo

Only spend money once you know what works organically. Paid ads amplify winners; they don't create them.

---

## Prerequisites Before Spending

Before a single dollar goes to ads:

- [ ] Free tools converting at 2%+ signup rate
- [ ] At least 3 high-converting landing pages identified (via organic traffic data)
- [ ] Clear understanding of LTV: CAC ratio (even rough)
- [ ] Conversion tracking set up properly (signup → API key → first render → paid plan)
- [ ] Enough organic traffic data to know which keywords convert

**Psychology — Barbell Strategy:** 80% of budget on proven channels (organic, partnerships). Only 20% on paid experiments. Never go all-in on ads without proof.

---

## 1. Google Ads (Month 7) — $300-1,000/mo

### Why Google Ads First

- High-intent: people searching "html to image api" want a solution NOW
- Easy to test: small budgets, quick feedback
- Complements SEO: capture keywords you're not ranking for yet

### Campaign Structure

**Campaign 1: Brand Terms ($50/mo)**
- Keywords: "htmlpix", "html pix"
- Protect brand from competitor bidding
- Should cost pennies per click

**Campaign 2: High-Intent API Keywords ($100-300/mo)**
- Keywords: "html to image api", "html to png api", "screenshot api", "html css to image api"
- These are buyers searching for exactly what you sell
- Expected CPC: $2-5

**Campaign 3: Competitor Keywords ($50-200/mo)**
- Keywords: "htmlcsstoimage alternative", "puppeteer alternative for screenshots", "bannerbear alternative"
- People actively looking to switch
- Expected CPC: $1-3

**Campaign 4: Free Tool Keywords ($100-300/mo)**
- Keywords: "html to image converter", "og image generator free"
- Drive traffic to free tools (top of funnel)
- Lower intent but cheaper clicks ($0.50-2)
- Expected CPC: $0.50-2

### Ad Copy Principles

**Psychology:**
- **Loss Aversion:** "Stop maintaining Puppeteer" (pain of current state)
- **Anchoring:** "From $0/month" (anchor at free)
- **Scarcity:** "50 free renders — no credit card needed" (limited but generous)
- **Present Bias:** "Generate your first image in 30 seconds" (immediate gratification)

**Example Ads:**

```
HTML to Image API — From $0/mo
Stop maintaining Puppeteer. One POST = one image.
PNG, JPG, WebP. <200ms. Start free today.
htmlpix.com

---

Replace Self-Hosted Chromium
HTMLPix API: Send HTML, get screenshots.
50 free renders/month. No credit card.
htmlpix.com/tools/html-to-image

---

OG Image Generator — Free Tool
Create Open Graph images instantly.
1200x630 for Twitter, Facebook, LinkedIn.
htmlpix.com/tools/og-image-generator
```

### Optimization Cadence

- **Week 1-2:** Launch all campaigns. Don't optimize. Collect data.
- **Week 3-4:** Pause keywords with CPC > $5 and no conversions. Double budget on winners.
- **Monthly:** Review search terms report. Add negative keywords. Adjust bids.

---

## 2. Retargeting Ads (Month 8) — $100-300/mo

### Why Retargeting

96% of visitors leave without converting. Retargeting brings the warm ones back.

**Psychology:**
- **Mere Exposure Effect:** Seeing HTMLPix again after visiting builds familiarity
- **Zeigarnik Effect:** Unfinished actions (visited but didn't sign up) create mental tension
- **Rule of 7:** Retargeting provides additional touchpoints toward the 7 needed

### Retargeting Segments

| Segment | Ad Message | CTA |
|---------|-----------|-----|
| Visited homepage, didn't sign up | "Your HTML is waiting for pixels" | "Get your free API key" |
| Used free tool, didn't sign up | "Liked the free converter? The API does 10,000/mo" | "Upgrade to API" |
| Visited pricing, didn't sign up | "50 free renders. No credit card. No commitment." | "Start free" |
| Signed up but didn't create API key | "Your account is ready. Grab your API key." | "Go to dashboard" |
| Has API key but 0 renders | "Send your first HTML → get your first image" | "See quickstart" |

### Platforms for Retargeting

- **Google Display Network** — cheapest, broadest reach
- **Twitter/X** — developer-heavy, good for reaching ICP
- **LinkedIn** — expensive but B2B-relevant for enterprise leads later

### Budget Allocation

```
Google Display retargeting: $50-150/mo
Twitter retargeting: $50-100/mo
LinkedIn: Only when targeting enterprise (month 10+)
```

---

## 3. Twitter/X Ads (Month 8-9) — $100-300/mo

### Why Twitter for Developer Tools

- High developer concentration
- Promotes content (threads, blog posts) not just products
- Followers convert over time (build audience that compounds)

### Campaign Types

**Promoted Tweets ($50-100/mo)**
Boost your best-performing organic tweets:
- Technical tips that got high engagement
- Blog posts that drove traffic
- Product milestones

**Follower Campaign ($50-100/mo)**
Target followers of:
- @veraborisova (Puppeteer maintainer)
- @veraborisova's puppeteer pain threads
- @supabase, @convaborisova — developer tool builders
- @iHatePuppeteer-type accounts (niche)

**Website Traffic ($50-100/mo)**
Drive to free tools and blog posts (not the homepage — give value first).

### Creative Approach

Developer ads that look like tweets, not ads:

```
We replaced 200 lines of Puppeteer config with one API call.

POST api.htmlpix.com/render
→ { "html": "<h1>Hello</h1>" }
← image.png (143ms)

Try it free → htmlpix.com
```

**Psychology:**
- **Liking/Similarity:** Ad feels like a developer tweet, not corporate marketing
- **Contrast Effect:** "200 lines → 1 API call" makes the improvement vivid
- **Present Bias:** "143ms" emphasizes instant results

---

## 4. Sponsorships & Paid Content (Month 9+) — $200-500/mo

### YouTube Developer Channels

Target mid-tier channels (10K-100K subscribers) that make:
- Web development tutorials
- "Build with me" content
- Tool review videos
- API/SaaS reviews

**Format:** Sponsored integration — they build something real with HTMLPix in their video.

**Cost:** $200-500 per video for mid-tier channels.

**Expected:** 2,000-10,000 views, 50-200 clicks, 10-40 signups per video.

**Psychology:**
- **Authority Bias:** Trusted creator recommends your product
- **Mimetic Desire:** Viewers want to build what the creator is building
- **Social Proof:** "Even [Creator] uses HTMLPix"

### Podcast Sponsorships

Developer podcasts with ad reads:
- Syntax.fm — web development
- Changelog — developer tools
- PodRocket — frontend focused
- Software Engineering Daily — broad developer audience

**Cost:** $100-500 per episode.

These are long-term brand plays. Track with unique URLs (`htmlpix.com/podcast`).

---

## 5. LinkedIn Ads (Month 10+) — Enterprise Play

Only when you're ready to target enterprise / B2B:

- Target: Engineering managers, CTOs, VP Engineering
- Message: "Your team spends 20 hours/month maintaining Puppeteer. HTMLPix replaces it for $35/mo."
- Format: Single image + text ads
- Budget: $300-500/mo minimum (LinkedIn is expensive)

**Psychology:**
- **Loss Aversion:** Frame around engineering time being wasted
- **Mental Accounting:** "$35/mo" vs "20 engineering hours/month" — different mental accounts, obvious ROI
- **Authority Bias:** Case studies and logos from recognizable companies

---

## Budget Breakdown (Monthly)

### Conservative ($500/mo)

| Channel | Budget | Purpose |
|---------|--------|---------|
| Google Ads (high intent) | $200 | Capture searchers |
| Google Retargeting | $100 | Bring back visitors |
| Twitter promoted | $100 | Content amplification |
| Newsletter sponsorship | $100 | Developer audience |

### Growth ($1,000/mo)

| Channel | Budget | Purpose |
|---------|--------|---------|
| Google Ads | $400 | Capture + brand protection |
| Retargeting (Google + Twitter) | $200 | Warm audience conversion |
| Twitter ads | $150 | Content + follower growth |
| Newsletter sponsorships | $150 | Developer newsletters |
| YouTube sponsorship | $100 (amortized) | Creator content |

### Scale ($2,000/mo)

| Channel | Budget | Purpose |
|---------|--------|---------|
| Google Ads | $700 | Full keyword coverage |
| Retargeting (multi-platform) | $300 | All warm segments |
| Twitter ads | $200 | Content + followers + traffic |
| Newsletter sponsorships | $300 | 2-3 newsletters/month |
| YouTube sponsorships | $300 (amortized) | 1 video/month |
| LinkedIn (if B2B) | $200 | Enterprise targeting |

---

## ROI Framework

### Unit Economics

```
Average signup → paid conversion rate: ~5%
Average starting plan: Starter ($8/mo)
Average LTV (assuming 6-month retention): $48
Max allowable CAC: $15-20 (LTV:CAC of ~3:1)
```

### Channel ROI Expectations

| Channel | Expected CAC | LTV:CAC |
|---------|-------------|---------|
| Organic (SEO) | $0-2 | 25:1+ |
| Product Hunt | $0.50-2 | 25:1 |
| Referral/affiliate | $5-10 | 5:1 |
| Google Ads (high intent) | $8-15 | 3-6:1 |
| Twitter ads | $10-20 | 2-5:1 |
| Newsletter sponsorship | $10-25 | 2-5:1 |
| YouTube sponsorship | $5-15 | 3-10:1 |
| LinkedIn | $25-50 | 1-2:1 |

### Decision Rules

- **Keep running:** LTV:CAC > 3:1
- **Optimize:** LTV:CAC 2-3:1
- **Pause and rethink:** LTV:CAC < 2:1

---

## Phase 5 Expected Outcomes (Month 12)

| Metric | Target |
|--------|--------|
| Organic traffic (monthly) | 8,000-15,000 |
| Paid traffic (monthly) | 2,000-5,000 |
| Total traffic (monthly) | 10,000-20,000 |
| Signups | 300-600/month |
| Paid conversions | 40-80/month |
| MRR | $1,000-3,000 |
| Active customers | 100-300 |

## Key Insight

Paid ads should be the accelerant, not the engine. If organic and community are working (Phase 1-4), paid amplifies what's already proven. If they're not working, ads won't save you — fix the fundamentals first.

**Theory of Constraints applies here:** Don't throw paid money at awareness if the bottleneck is conversion. Don't spend on conversion if the bottleneck is activation. Identify the constraint, fix it, then amplify.
