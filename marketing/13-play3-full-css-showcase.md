# Play 3: Full-CSS OG Template Gallery

A gallery of stunning OG image templates using CSS features that layout engines (Satori, Takumi) cannot render. Each template is both marketing content and a functional product.

---

## Why This Works

Developers browse Twitter/Dribbble and see beautiful OG images. They try to recreate them in `next/og` and hit CSS walls immediately. CSS Grid? Nope. Glassmorphism? Nope. Complex shadows? Broken.

The template gallery catches them at the moment of frustration. Every template is a visual proof that HTMLPix renders what others can't. And each one is copy-pasteable — not a mockup, but working code.

**Psychology:** IKEA effect — devs who customize a template feel ownership. Foot-in-the-door — using a free template leads to API signup.

---

## Target Audience

- Next.js devs who tried Satori and hit CSS limitations
- Devs searching for "og image template" or "social card generator"
- Design-conscious developers who care about social presence
- Indie hackers who want polished branding without hiring a designer

**Target keywords:**
- "og image template"
- "social card template nextjs"
- "beautiful og image generator"
- "open graph image template free"
- "satori css grid not working" (capture frustrated devs)

---

## The Templates

10 templates, each showcasing a CSS feature impossible in Satori/Takumi:

### 1. Bento Grid (CSS Grid)
- 4-panel bento layout — hero image, title, stats, author
- Uses `display: grid` with `grid-template-areas`
- Trend: bento grids are everywhere in 2025-2026 design
- **Impossible in:** Satori (flexbox only), Takumi (Taffy = flexbox only)

### 2. Glassmorphism (backdrop-filter)
- Frosted glass card over a gradient background
- `backdrop-filter: blur(20px)` + semi-transparent background
- **Impossible in:** Satori, Takumi (no filter support)

### 3. Neon Glow (text-shadow + box-shadow)
- Dark background with glowing text and neon border
- Multiple `text-shadow` layers for glow effect
- `box-shadow` with large spread for outer glow
- **Broken in:** Satori (limited shadow support), Takumi (no text-shadow)

### 4. Gradient Mesh (complex gradients + blend modes)
- Multiple overlapping radial gradients
- `mix-blend-mode: overlay` for color interactions
- **Impossible in:** Satori, Takumi (no blend mode support)

### 5. Magazine Layout (CSS Grid + columns)
- Editorial-style layout with pull quote, image, and body text
- Multi-column text flow
- `column-count`, `column-gap`
- **Impossible in:** Satori (no grid, no columns), Takumi (no grid)

### 6. Retro Terminal (CSS animations captured)
- Green-on-black terminal with blinking cursor
- Scanline effect via repeating linear gradients
- CRT screen curvature via `border-radius` on overflow container
- **Requires:** Full CSS + font rendering (Satori approximates, HTMLPix is exact)

### 7. Clip-Path Hero (clip-path)
- Diagonal split layout — image on one side, text on other
- `clip-path: polygon()` for the diagonal cut
- **Impossible in:** Satori, Takumi (no clip-path support)

### 8. Stacked Cards (3D transforms)
- Multiple cards stacked with `transform: perspective() rotateY()`
- Depth effect via layered transforms and shadows
- **Impossible in:** Satori, Takumi (no 3D transforms)

### 9. Code + Preview Split (JS execution)
- Left side: syntax-highlighted code (Shiki)
- Right side: live rendered output of that code
- Shows "what you write" vs "what you get"
- **Impossible in:** Any layout engine (requires JS)

### 10. Data Dashboard (Chart.js + CSS Grid)
- 4-widget dashboard layout: line chart, bar chart, stat cards, donut chart
- CSS Grid for layout, Chart.js for charts
- **Impossible in:** Any layout engine (requires JS + CSS Grid)

---

## Deliverables

### 1. Template Gallery Page on htmlpix.com

**URL:** `/templates` or `/gallery`

**Features:**
- Visual grid of all 10 templates with live preview images
- Click to expand: see the full template, copy the HTML, see the Next.js route handler code
- Each template tagged with the CSS feature it showcases
- Filter by: "CSS Grid", "Filters", "Shadows", "JavaScript", etc.
- "Impossible in Satori" badge on each template — subtle competitive positioning
- "Try it" button that lets you customize title/colors and see live output (uses free HTMLPix renders)

**SEO value:** Targets "og image template" (high volume) and "satori alternative" (high intent).

### 2. GitHub Repo: `htmlpix/og-templates`

All 10 templates as standalone Next.js route handlers.

Structure:
```
og-templates/
  README.md          # Comparison table, install instructions, deploy button
  templates/
    bento-grid/
      route.ts        # Next.js route handler
      preview.png     # Example output
      README.md       # What CSS feature this uses, why layout engines can't render it
    glassmorphism/
      ...
    neon-glow/
      ...
    ... (10 total)
  package.json
  next.config.ts
```

Each template README explicitly states:
- Which CSS features it uses
- Why Satori/Takumi can't render it
- A side-by-side screenshot (Satori broken output vs HTMLPix correct output) when applicable

### 3. Comparison Blog Post

**Title:** "10 OG Image Designs That Break in Satori (and How to Fix Them)"

**Platform:** Dev.to + Hashnode + htmlpix.com/blog

**Structure:**
For each of the 10 templates:
1. Show the design
2. Show what Satori/Takumi outputs (broken, missing features)
3. Show what HTMLPix outputs (pixel-perfect)
4. One-liner explanation of why

This is extremely shareable. Developers will bookmark it, share it when they hit Satori limitations, and reference it in GitHub issues.

---

## Implementation on htmlpix.com

### New page: `/templates`

- Grid layout of template cards (3 columns on desktop, 1 on mobile)
- Each card shows: preview image, template name, CSS features used, "View" button
- Filter bar at top: All | CSS Grid | Filters | Shadows | JavaScript
- Hero section: "OG Image Templates — Full CSS, No Limitations"
- Subtle comparison: "These templates use CSS features that layout engines like Satori and Takumi cannot render."

### Template detail view

- Large preview image
- "Copy HTML" button (the raw HTML template)
- "Copy Next.js Route" button (full route handler code)
- Customization panel (change title, colors, preview live)
- "Powered by HTMLPix API — 50 free renders/month"

---

## Distribution

| Channel | Action | Timing |
|---------|--------|--------|
| htmlpix.com | Launch `/templates` page | Week 1 |
| GitHub | Publish `og-templates` repo | Week 1 |
| Dev.to | Publish comparison article | Week 1 |
| Twitter/X | Thread: "10 OG image designs Satori can't render" with images | Week 1 |
| Reddit r/nextjs | "I built 10 OG image templates with full CSS support" | Week 2 |
| Reddit r/web_design | "Free OG image templates with CSS Grid, glassmorphism, etc." | Week 2 |
| Product Hunt | "OG Image Templates by HTMLPix" (if templates are interactive) | Week 3 |
| Hacker News | "Show HN" if significant community response | Week 3 |

---

## Success Metrics

- Page views on `/templates` (target: 2k/month after 3 months)
- GitHub repo stars (target: 200 in first month — template repos get stars fast)
- Template copies/clicks (track which templates are most popular)
- Free tier signups from `/templates` page (target: 100 in first month)
- Conversion: template user -> paid plan (target: 5% within 60 days)

---

## Maintenance

Templates are evergreen content. Once built, they require minimal updates. New templates can be added quarterly to keep the gallery fresh and target new CSS trends.

Priority additions for future:
- Container queries (when trending)
- Scroll-driven animations (captured at a specific frame)
- View transitions (captured mid-transition)
- New design trends (whatever's popular on Dribbble/Twitter)

---

## Competitive Positioning

This gallery makes HTMLPix's advantage visceral. Instead of arguing "we support more CSS" in text, we SHOW it. Every template is a visual proof point.

The side-by-side comparisons (Satori broken vs HTMLPix correct) are the most powerful marketing asset. They answer the question "why should I pay for HTMLPix when Satori/Takumi are free?" with a single image.

Positioning: "Layout engines are fast approximations. HTMLPix is the real thing. Here's the proof."
