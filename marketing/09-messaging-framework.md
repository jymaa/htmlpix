# Messaging Framework — HTMLPix

Positioning, headlines, objection handling, and copy guidelines.

---

## Core Positioning

### One-Liner
**HTML to image API. Send HTML, get screenshots. Replace Puppeteer in one line.**

### Elevator Pitch (30 seconds)
> "HTMLPix is an API that converts HTML and CSS into pixel-perfect PNG, JPG, or WebP images. Instead of maintaining headless Chrome and Puppeteer, developers send a POST request with their HTML and get back an image in under 200ms. Free tier with 50 renders/month, paid plans from $8."

### Positioning Statement
> "For developers who need to generate images from HTML at scale, HTMLPix is the HTML-to-image API that eliminates browser infrastructure headaches. Unlike self-hosted Puppeteer or limited tools like @vercel/og, HTMLPix renders any HTML/CSS to any image format with one API call, starting free."

---

## Value Propositions (Ordered by Importance)

### 1. Simplicity
> "One POST request. One API key. No infrastructure."

Replace 47 lines of Puppeteer config with 1 API call. No browser pools, no memory management, no Chrome updates.

### 2. Speed
> "<200ms average. Faster than your Puppeteer setup."

Dedicated render cluster optimized for throughput. No cold starts.

### 3. Price
> "From $0/month. All features on every plan."

50 free renders forever. Paid from $8/mo (cheaper than a t3.micro EC2 instance). No feature gates.

### 4. Reliability
> "99.9% uptime. We babysit Chrome so you don't have to."

Managed infrastructure, automatic scaling, no more 3am OOMKilled alerts.

### 5. Flexibility
> "PNG, JPG, WebP. Tailwind, Google Fonts, custom CSS. It all works."

Full browser rendering — if it renders in Chrome, it renders in HTMLPix.

---

## Headlines by Context

### Homepage
- **Hero:** "HTML IN. IMAGE OUT." (current — strong)
- **Alt:** "Send HTML. Get Images. Skip the Infrastructure."
- **Alt:** "The API That Replaces Your Puppeteer Server"

### Free Tools
- "HTML to Image Converter — Free Online Tool"
- "OG Image Generator — Free, No Signup Required"
- "Convert HTML to PNG — Free Online"

### Use Cases
- "Automate OG Image Generation with One API Call"
- "Generate Invoices as Images — Skip the PDF Complexity"
- "Create Certificates at Scale — No Design Tool Required"

### Comparison Pages
- "HTMLPix vs Puppeteer: Which Should You Use in 2026?"
- "HTMLPix vs htmlcsstoimage: Pricing, Features, and Speed Compared"
- "Self-Hosted Puppeteer vs Screenshot API: The True Cost"

### Blog Posts
- "How to Convert HTML to Image — 5 Methods Compared (2026)"
- "The Hidden Costs of Self-Hosting Puppeteer"
- "OG Image Best Practices: Sizes, Formats, and Common Mistakes"

### CTAs
- **Primary (signup):** "Get Your API Key — Free" / "Start Free — 50 Renders/Month"
- **Secondary (docs):** "Read the Docs" / "See the Quickstart"
- **Soft (from content):** "Need this at scale? Try the HTMLPix API →"
- **Upgrade:** "Hit your limit? Upgrade from $8/mo →"
- **Tools to API:** "Like this tool? The API does 10,000+ renders/month."

---

## Audience-Specific Messaging

### Solo Developer / Indie Hacker
**Pain:** "I just need OG images for my blog. I don't want to set up Puppeteer."
**Message:** "Skip the setup. HTMLPix generates images from your HTML with one API call. 50 free renders/month — more than enough for your blog."

### Startup Engineer
**Pain:** "Our Puppeteer setup keeps crashing. I spend 5 hours/month maintaining it."
**Message:** "Replace your Puppeteer server with one POST request. HTMLPix handles browser management, scaling, and Chrome updates. You ship features."

### SaaS Team
**Pain:** "We need to generate 5,000 invoices/certificates/reports as images per month."
**Message:** "HTMLPix renders HTML to images at scale. Template system with variables, batch-friendly API, 10,000 renders for $35/mo. All formats, all CSS."

### No-Code Builder
**Pain:** "I need to generate images from my Zapier/Make workflows."
**Message:** "Connect HTMLPix to Zapier or Make. Send your data in, get images out. No code required."

---

## Objection Handling

### "I can just use Puppeteer"
> You can. But you'll spend hours on setup, manage Chrome updates, handle memory leaks, scale your server, and debug rendering inconsistencies. HTMLPix does all of that for $8/mo. Your engineering time is worth more than $8.

### "Why not @vercel/og?"
> @vercel/og uses Satori, which supports a subset of CSS (no `position: absolute`, limited fonts, no gradients). It only works on Vercel. HTMLPix renders full HTML/CSS anywhere — any framework, any hosting platform.

### "$8/month is expensive for 1,000 renders"
> A t3.micro EC2 instance to run Puppeteer costs $8.35/month — and that's before you factor in your time to set up, maintain, and debug it. With HTMLPix, you pay $8 and spend zero time on infrastructure.

### "What about vendor lock-in?"
> Your HTML templates work anywhere. If you leave HTMLPix, you take your templates and switch to Puppeteer or any other service. We don't lock in your content. Plans change anytime, cancel in one click.

### "Is it fast enough?"
> Average render time is under 200ms. That's faster than most self-hosted Puppeteer setups which typically take 500ms-2s. We keep dedicated browser pools warm and optimized.

### "Can I trust a new service?"
> Fair question. Start with the free tier (no credit card) — test reliability yourself. We publish uptime at status.htmlpix.com. Our rendering infrastructure is built on proven technology (Puppeteer + Chromium), just managed for you.

### "I don't need 1,000 renders. 50 is enough."
> Great — the free tier is yours forever. No catch, no trial period. If you grow past 50, plans start at $8.

---

## Copy Tone Guidelines

### Do
- Be direct. Developers hate fluff.
- Use code examples. Show, don't tell.
- Be specific. "<200ms" beats "blazing fast."
- Acknowledge tradeoffs. "If you need full browser automation, use Puppeteer."
- Use the developer's language. POST, API key, endpoint, render.

### Don't
- Use hyperbole. "Revolutionary" = instant credibility loss with developers.
- Use corporate speak. "Leverage our solution" = cringe.
- Over-use emojis. One or two is fine. A wall of them is not.
- Promise without proof. Every claim should be verifiable.
- Hide the price. Developers respect transparency.

### Voice Examples

**Good:**
> "Send a POST request with your HTML. Get back a PNG. That's it."

**Bad:**
> "HTMLPix's revolutionary platform empowers developers to leverage cutting-edge image generation capabilities."

**Good:**
> "1,000 renders for $8/month. All features included. Change plans anytime."

**Bad:**
> "Our flexible pricing plans are designed to scale with your growing business needs."

---

## Key Proof Points

Use these in copy wherever credibility is needed:

| Proof Point | Where to Use |
|------------|-------------|
| "<200ms average latency" | Homepage, comparison pages, ads |
| "99.9% uptime SLA" | Homepage, enterprise objections |
| "PNG, JPG, WebP — all formats" | Feature sections, comparison tables |
| "Tailwind + Google Fonts supported" | Developer-focused pages |
| "50 free renders/month — forever" | Pricing, CTAs, ads |
| "No credit card required" | Signup flow, CTAs |
| "All features on every plan" | Pricing page |
| "One POST request" | Homepage, quickstart |
| "Replace Puppeteer in 5 minutes" | Comparison pages, ads |
