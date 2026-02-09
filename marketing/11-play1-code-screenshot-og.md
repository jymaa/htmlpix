# Play 1: Code Screenshot OG Images

The "only possible with HTMLPix" use case. Layout engines (Satori, Takumi) cannot execute JavaScript. Syntax highlighting requires JS (Shiki, Prism). Only a real browser can render it.

---

## Why This Works

Next.js devs writing technical blogs want OG images showing actual code. Today they either:
- Design manually in Figma (doesn't scale)
- Use plain text in Satori (no syntax highlighting, ugly)
- Skip it entirely (generic OG image, lower CTR)

HTMLPix renders real Shiki/Prism output in a real browser. Pixel-perfect syntax highlighting with any VS Code theme.

**Competitive moat:** Takumi/Satori literally cannot do this. Not "hard to do" — impossible. No JS execution = no tokenization = no syntax colors.

---

## Target Audience

- Next.js devs with technical blogs
- Developer tool companies (Vercel, Supabase, Planetscale-style blog OGs)
- Documentation sites generating OG images per page
- Dev.to / Hashnode authors who want standout social previews

**Target keywords:**
- "code screenshot og image"
- "syntax highlight og image nextjs"
- "og image code snippet"
- "developer blog og image generator"

---

## Deliverables

### 1. Blog Post

**Title:** "OG Images With Syntax-Highlighted Code in Next.js"

**Platform:** Dev.to + Hashnode (cross-post for SEO reach)

**Structure:**
1. Hook — "Your blog post about React hooks deserves an OG image that shows the actual code, not just a title on a gradient."
2. The problem — Satori/Takumi can't run JS, so syntax highlighting is impossible. Show broken output.
3. The solution — HTMLPix renders real Shiki output. Show the beautiful result.
4. Step-by-step — Full Next.js route handler code with HTMLPix.
5. Templates — 4 themes (dark, light, terminal, VS Code Monokai).
6. CTA — "50 free renders/month. Try it now."

**Estimated SEO value:** Low-competition long-tail keywords with high purchase intent. Devs searching for this have a specific problem HTMLPix solves.

### 2. GitHub Repo: `htmlpix/code-og-templates`

4 ready-to-use Next.js route handlers:

| Template | Theme | Font | Background |
|----------|-------|------|------------|
| Dark Modern | VS Code Dark+ | Fira Code | #1e1e1e gradient |
| Light Clean | GitHub Light | JetBrains Mono | white with subtle grid |
| Terminal | Green-on-black | Source Code Pro | #0d1117 scanlines |
| Monokai Pro | Monokai colors | Cascadia Code | #2d2a2e |

Each template:
- Accepts `code`, `language`, `title`, `author` as query params
- Includes full Shiki setup inline (CDN script tag)
- Renders 1200x630 OG image
- Has caching headers configured
- One-click Vercel deploy button in README

### 3. Template Gallery Entry on htmlpix.com

Add a "Code Screenshot" section to the template gallery (when built). Interactive preview where user pastes code, picks theme, sees live output.

---

## Technical Implementation

```typescript
// app/api/og/code/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") ?? "const x = 1;";
  const lang = searchParams.get("lang") ?? "typescript";
  const title = searchParams.get("title") ?? "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/shiki@1.0.0/dist/index.unpkg.iife.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; display: grid; place-items: center;
           background: linear-gradient(135deg, #0f0f0f, #1a1a2e); font-family: system-ui; }
    .card { background: #1e1e1e; border-radius: 12px; padding: 32px; width: 1080px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
    .title { color: #e0e0e0; font-size: 28px; margin-bottom: 16px; font-weight: 600; }
    .shiki { font-family: 'Fira Code', monospace; font-size: 18px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    ${title ? `<div class="title">${title}</div>` : ""}
    <div id="code"></div>
  </div>
  <script>
    (async () => {
      const highlighter = await shiki.createHighlighter({
        themes: ['vitesse-dark'],
        langs: ['${lang}']
      });
      document.getElementById('code').innerHTML = highlighter.codeToHtml(
        decodeURIComponent('${encodeURIComponent(code)}'),
        { lang: '${lang}', theme: 'vitesse-dark' }
      );
    })();
  </script>
</body>
</html>`;

  const res = await fetch("https://api.htmlpix.com/render", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HTMLPIX_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html, width: 1200, height: 630 }),
  });

  return new Response(await res.arrayBuffer(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
```

Key: This uses CSS Grid (`display: grid`), `box-shadow`, and inline `<script>` — three things layout engines cannot render.

---

## Distribution

| Channel | Action | Timing |
|---------|--------|--------|
| Dev.to | Publish article | Week 1 |
| Hashnode | Cross-post | Week 1 |
| Reddit r/nextjs | "I built code screenshot OG images for my blog" | Week 1 |
| Twitter/X | Thread with before/after visuals (Satori vs HTMLPix) | Week 1 |
| GitHub | Publish template repo | Week 1 |
| Hacker News | "Show HN: Code screenshot OG images for Next.js blogs" | Week 2 |
| StackOverflow | Answer "og image code snippet" questions, link to article | Ongoing |

---

## Success Metrics

- GitHub repo stars (target: 100 in first month)
- Article views (target: 5k across platforms)
- Free tier signups attributed to article UTM (target: 50)
- Template repo clones/forks (target: 30)

---

## Competitive Defense

If Takumi eventually adds JS execution (unlikely — architectural change from layout engine to browser), the templates still work with HTMLPix. Our advantage is zero dependency (no Rust binary, no WASM, just HTTP) and any-language support.
