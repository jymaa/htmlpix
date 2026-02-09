# Psychology Playbook — HTMLPix Marketing

How to apply behavioral science to every touchpoint in the HTMLPix customer journey.

---

## The Developer Buyer Journey

```
Unaware → Problem Aware → Solution Aware → Product Aware → Customer → Advocate
```

Each stage requires different psychological triggers.

---

## Stage 1: Unaware → Problem Aware

**Goal:** Make developers realize their current approach (self-hosted Puppeteer, manual screenshots, @vercel/og limitations) is costing them time and pain.

### Models to Use

**Loss Aversion**
Frame the status quo as a loss. Developers don't feel the cost of maintaining Puppeteer until you quantify it.

*Copy example:*
> "Your team spends 15 hours/month babysitting Chromium. That's $3,000/month in engineering time for a problem that should cost $15."

**Contrast Effect**
Show the "before" state vividly:
```
// Before: 47 lines of config
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', ...],
  headless: 'new',
  ...
});
// handle crashes, manage memory, scale instances, update Chrome...

// After: 1 line
const image = await fetch('api.htmlpix.com/render', { body: html });
```

**Availability Heuristic**
Surface horror stories that are easy to remember:
- "Puppeteer OOMKilled our production server at 3am"
- "Chrome 120 broke all our screenshots"
- "We spent 2 weeks debugging font rendering in headless Chrome"

### Where to Apply

- Blog posts: "The Hidden Costs of Self-Hosting Puppeteer"
- Reddit answers about Puppeteer problems
- Twitter threads about browser automation pain
- Comparison pages (`/compare/self-hosted-vs-api`)

---

## Stage 2: Problem Aware → Solution Aware

**Goal:** Show that "HTML to image API" is a category of solution that exists.

### Models to Use

**Jobs to Be Done**
Don't sell an API. Sell the job done:
- "Automatically generate an OG image for every blog post"
- "Send invoices that look perfect in every email client"
- "Create 10,000 personalized certificates in minutes"

**Framing Effect**
Same product, different frames for different audiences:

| Audience | Frame |
|----------|-------|
| Solo developer | "Skip the Puppeteer setup. Ship faster." |
| Startup CTO | "Stop paying engineers to maintain Chrome. Use an API." |
| No-code builder | "Generate images from your data. No code required." |
| Enterprise | "99.9% uptime. SOC 2 pipeline. Predictable costs." |

**Authority Bias**
Establish category expertise through content:
- "5 Ways to Convert HTML to Image (Compared)"
- "OG Image Best Practices for 2026"
- "The Complete Guide to Dynamic Image Generation"

### Where to Apply

- Blog content (top-of-funnel tutorials)
- Free tools (demonstrate the solution category)
- Use case pages (show specific jobs the solution does)

---

## Stage 3: Solution Aware → Product Aware

**Goal:** Position HTMLPix as the best option in the category.

### Models to Use

**Social Proof / Bandwagon Effect**
Numbers build confidence:
- "10,000+ images rendered this week"
- "Join 500+ developers using HTMLPix"
- Customer logos when available
- GitHub stars on SDK repos

Display these on:
- Homepage hero section
- Pricing page
- Free tool pages
- Email footers

**Pratfall Effect**
Be honest about limitations to build trust:
> "HTMLPix is for converting HTML to images. If you need full browser automation (clicking, typing, navigating), use Puppeteer. If you need clean screenshots from HTML, we're faster and easier."

This honesty makes every other claim more believable.

**Anchoring Effect**
On the pricing page and comparison pages:

1. Show competitor prices first: "Bannerbear: $49/mo. Placid: $19/mo."
2. Then reveal: "HTMLPix: $8/mo for 1,000 renders."
3. The contrast makes $8 feel like a steal.

Also anchor with the cost of alternatives:
> "A t3.medium EC2 instance for Puppeteer: $30/mo + your engineering time. HTMLPix: $8/mo, fully managed."

**Decoy Effect**
The pricing tiers already use this:
```
Free: 50 renders — $0    (entry point)
Starter: 1,000 — $8      (good value)
Pro: 3,000 — $15          ← target tier (best per-render price)
Scale: 10,000 — $35       (makes Pro look reasonable)
```

The Pro tier is the target. Starter exists as a foot-in-the-door. Scale exists to make Pro feel affordable.

### Where to Apply

- Comparison pages (honest, data-driven)
- Homepage social proof section
- Pricing section
- Product Hunt launch page

---

## Stage 4: Product Aware → Customer

**Goal:** Remove friction and convert.

### Models to Use

**Zero-Price Effect**
"Free" is psychologically different from "cheap." The word "free" removes ALL risk perception.

*Apply everywhere:*
- "50 free renders/month"
- "No credit card required"
- "Free forever tier — not a trial"

**Activation Energy Reduction**
Make the first step trivially easy:

```
Step 1: Sign in with Google (1 click)
Step 2: Copy your API key
Step 3: Paste this curl command
→ Your first image in 30 seconds
```

Remove every possible friction point:
- No credit card for free tier
- Google OAuth (no password to create)
- Pre-filled code examples (copy-paste-run)
- Free tools don't even require signup

**Regret Aversion**
Address the fear of making a wrong choice:
- "Change plans anytime" (no lock-in)
- "Free tier never expires" (no pressure)
- "Cancel in one click" (no friction to leave)
- "All plans include all features" (no gotchas)

**Present Bias / Hyperbolic Discounting**
Emphasize immediate results over long-term value:
- BAD: "Reduce your infrastructure costs over the next quarter"
- GOOD: "Get your first image in 30 seconds"

**Commitment & Consistency (Foot-in-the-Door)**
The conversion ladder:
1. Use free tool (no signup) → micro-commitment
2. Sign up for free API tier (email only) → small commitment
3. Create API key → investment
4. Make first render → success experience
5. Build it into their workflow → dependency
6. Hit free tier limit → natural upgrade moment
7. Choose paid plan → customer

Each step is small and natural. No big asks.

### Where to Apply

- Signup flow (minimize steps)
- Onboarding emails (guide through the ladder)
- Dashboard UI (celebrate first render)
- Pricing page (remove risk language)

---

## Stage 5: Customer → Advocate

**Goal:** Turn customers into promoters.

### Models to Use

**Peak-End Rule**
People remember the peak (best moment) and end of experiences. Design both:

*Peaks:*
- First successful render → celebration UI ("Your first image!")
- Hitting 1,000 renders → milestone email
- Showing someone their image for the first time

*Ends:*
- If someone cancels: graceful exit, keep free tier, thank them genuinely
- End of month: usage summary email with highlights

**Endowment Effect**
Once customers have templates, API integrations, and workflow dependencies, they "own" their HTMLPix setup. This naturally prevents churn.

Strengthen this by:
- Encouraging custom template creation
- Providing usage analytics they want to see grow
- Making it easy to build (hard to replace) integrations

**Reciprocity**
Over-deliver, especially early:
- Unexpected extra renders ("We gave you 100 bonus renders this month")
- Feature early access for active users
- Personal response to feedback emails
- Genuine thank you messages (from founder, not automated)

**Mimetic Desire**
Make success visible:
- "What our users build with HTMLPix" gallery
- Customer spotlight in newsletters
- Retweet/share when customers mention HTMLPix
- "Powered by HTMLPix" badges they can optionally add

### Where to Apply

- In-product experience (milestones, celebrations)
- Email sequences (post-signup, post-first-render, monthly)
- Social media (amplify customer wins)
- Referral program (reward advocacy)

---

## Quick-Reference: Psychology by Page

| Page | Primary Psychology | Implementation |
|------|-------------------|----------------|
| **Homepage** | Contrast Effect, Social Proof, Present Bias | Before/after code, customer count, "30 seconds to first image" |
| **Free tools** | Reciprocity, Zero-Price Effect, Foot-in-the-Door | Give value freely, no signup wall, soft CTA to API |
| **Pricing** | Anchoring, Decoy Effect, Regret Aversion | Competitor price anchors, Pro tier as target, "no commitment" |
| **Comparison pages** | Contrast, Pratfall, Authority | Honest comparison, acknowledge competitor strengths, data-driven |
| **Blog posts** | Reciprocity, Authority, Mere Exposure | Teach genuinely, demonstrate expertise, brand impressions |
| **Use cases** | Jobs to Be Done, Loss Aversion, Present Bias | Focus on outcome, quantify cost of status quo, immediate benefits |
| **Templates** | IKEA Effect, Endowment, Switching Costs | Customize, preview with own data, "use with API" button |
| **Docs** | Activation Energy, Goal-Gradient, Commitment | Easy first steps, progress indicators, celebrate completion |
| **Signup flow** | Zero-Price, Activation Energy, Commitment | Free, minimal steps, progressive disclosure |
| **Emails** | Zeigarnik, Reciprocity, Peak-End | Open loops, give value, strong endings |

---

## Anti-Patterns to Avoid

1. **Fake scarcity.** "Only 3 spots left" when there's unlimited capacity. Developers see through this instantly. Destroys trust.

2. **Fake social proof.** "Join 50,000 developers" when you have 50. Discovery = permanent trust damage.

3. **Manipulative urgency.** Countdown timers on an always-available product. Feels sleazy.

4. **Dark patterns.** Making it hard to cancel, hiding the free tier, pre-checked upgrade boxes. Generates churn + bad reviews.

5. **Over-promising.** "10x faster than Puppeteer" when it's 3x. Developers will benchmark. Be precise.

**Rule:** Every psychological principle here should make the customer experience BETTER. If it only benefits you and frustrates the customer, don't do it.
