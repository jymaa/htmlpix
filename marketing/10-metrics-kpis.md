# Metrics & KPIs — HTMLPix Marketing

What to measure, what to target, and what to ignore.

---

## North Star Metric

**Monthly API renders (paid accounts)**

This single metric captures:
- Acquisition (more customers = more renders)
- Activation (customers who render = actually using the product)
- Retention (continuing to render = not churned)
- Revenue (renders drive plan upgrades)

---

## Funnel Metrics

### Awareness → Traffic

| Metric | Tool | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|------|---------|---------|---------|----------|
| Organic sessions | GA4 / Search Console | 50 | 1,000 | 5,000 | 12,000 |
| Referral sessions | GA4 | 100 | 500 | 1,500 | 3,000 |
| Direct sessions | GA4 | 50 | 200 | 500 | 1,500 |
| Paid sessions | GA4 | 0 | 0 | 500 | 2,000 |
| **Total monthly sessions** | GA4 | **200** | **1,700** | **7,500** | **18,500** |

### Traffic → Signup

| Metric | Tool | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|------|---------|---------|---------|----------|
| Signups | Convex / GA4 | 10 | 50 | 200 | 500 |
| Signup rate | Calculated | 5% | 3% | 2.5% | 2.7% |
| Free tool conversions | GA4 | 5 | 20 | 80 | 200 |
| Blog → signup | GA4 | 2 | 10 | 40 | 100 |
| Comparison page → signup | GA4 | 0 | 10 | 40 | 80 |
| Template → signup | GA4 | 0 | 5 | 30 | 80 |

### Signup → Activation

| Metric | Definition | Target |
|--------|-----------|--------|
| API key created | Signup → created key | 70%+ |
| First render | Created key → made first API call | 50%+ |
| 10+ renders | First render → sustained usage | 30%+ |
| **Activation rate** | Signup → 10+ renders | **15-20%** |

### Activation → Revenue

| Metric | Tool | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|------|---------|---------|---------|----------|
| Paid conversions (new) | Stripe | 1 | 8 | 30 | 60 |
| Free → paid conversion rate | Calculated | 10% | 15% | 15% | 12% |
| Average starting plan | Stripe | $8 | $10 | $12 | $12 |
| MRR | Stripe | $8 | $150 | $600 | $2,000 |
| Active paid customers | Stripe | 1 | 15 | 50 | 150 |
| Monthly churn rate | Stripe | — | 5% | 4% | 3% |

---

## SEO Metrics

| Metric | Tool | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|------|---------|---------|---------|----------|
| Indexed pages | Search Console | 15 | 80 | 150 | 250+ |
| Impressions (monthly) | Search Console | 500 | 10,000 | 50,000 | 150,000 |
| Clicks (monthly) | Search Console | 20 | 500 | 3,000 | 10,000 |
| Average CTR | Search Console | 4% | 5% | 6% | 6.5% |
| Keywords in top 100 | Search Console / Ahrefs | 10 | 50 | 150 | 300+ |
| Keywords in top 10 | Search Console / Ahrefs | 0 | 5 | 25 | 60+ |
| Referring domains | Ahrefs / Search Console | 3 | 15 | 40 | 75+ |
| Domain Rating | Ahrefs | 0 | 10 | 20 | 30+ |

---

## Content Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Pages published/month | 10-20 (including templates) | Manual count |
| Blog posts/month | 2-3 | Manual count |
| Avg time on page (tools) | >2 min | GA4 |
| Avg time on page (blog) | >3 min | GA4 |
| Tool completion rate | >30% of visitors use tool | GA4 events |
| Template views/month | Growing month-over-month | GA4 |

---

## Community & Brand Metrics

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Twitter/X followers | 20 | 100 | 400 | 1,000 |
| GitHub stars (total across repos) | 5 | 30 | 100 | 300 |
| npm/PyPI weekly downloads | 0 | 20 | 100 | 500 |
| Email subscribers | 0 | 100 | 400 | 1,000 |
| Product Hunt upvotes | — | 200+ | — | — |
| Dev.to followers | 0 | 50 | 150 | 400 |
| Brand searches ("htmlpix") | 5/mo | 30/mo | 100/mo | 300/mo |

---

## Paid Channel Metrics (Phase 5+)

| Metric | Target |
|--------|--------|
| CAC (customer acquisition cost) | <$15 |
| LTV:CAC ratio | >3:1 |
| ROAS (Google Ads) | >3x |
| CPC (high-intent keywords) | <$5 |
| CPC (free tool keywords) | <$2 |
| Click-through rate (ads) | >3% |
| Conversion rate (landing page) | >5% signup |
| Retargeting conversion rate | >2% |

---

## Financial Targets

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| MRR | $150 | $600 | $2,000 |
| ARR | $1,800 | $7,200 | $24,000 |
| Total paid customers | 15 | 50 | 150 |
| ARPU (average revenue per user) | $10 | $12 | $13 |
| Marketing spend | $0 | $0-200 | $500-1,000 |
| Revenue : marketing spend | ∞ | 3:1+ | 2:1+ |

---

## What NOT to Measure (Vanity Metrics)

- **Page views** without context (high views, zero signups = useless)
- **Social media impressions** (meaningless without engagement)
- **Email open rates** alone (opens don't equal revenue)
- **Total registered users** without activation (dead accounts don't matter)
- **Keyword count** without quality (ranking #99 for 500 keywords = useless)

---

## Tracking Setup Checklist

### Day 1

- [ ] Google Search Console → verify, submit sitemap
- [ ] Google Analytics 4 → install, configure events
- [ ] Bing Webmaster Tools → verify

### Week 1

- [ ] GA4 conversion events:
  - `sign_up` — new account created
  - `api_key_created` — first API key generated
  - `first_render` — first successful API render
  - `plan_upgrade` — free → paid conversion
  - `tool_used` — free tool render completed
- [ ] UTM parameter convention:
  - `utm_source`: platform (google, twitter, devto, producthunt)
  - `utm_medium`: channel (organic, social, email, paid, referral)
  - `utm_campaign`: specific campaign (ph-launch, blog-htmltoimage, newsletter-bytes)

### Month 1

- [ ] Set up monthly reporting dashboard (Google Looker Studio or simple spreadsheet)
- [ ] Baseline all metrics
- [ ] Set up Search Console email alerts for indexing issues

### Quarterly

- [ ] Full funnel review: where's the bottleneck?
- [ ] Content audit: which pages drive signups vs which drive only traffic?
- [ ] Keyword gap analysis: new opportunities?
- [ ] Competitive check: what are competitors doing differently?

---

## Decision Framework

### When to double down on a channel
- Positive CAC trend (getting cheaper over time)
- Conversion rate above baseline
- Growing organic momentum (not dependent on continuous spending)

### When to cut a channel
- 3 months of consistent investment with no measurable signup attribution
- CAC trending above $20 with no signs of improvement
- Time investment displacing higher-ROI activities

### When to increase paid spend
- Organic channels are running (flywheel is spinning)
- Unit economics are proven (LTV:CAC > 3:1 on at least one paid channel)
- You have identified at least 3 keyword groups with positive ROAS
