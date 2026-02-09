# Play 2: Chart & Data Visualization OG Images

SaaS dashboards, analytics pages, and data reports need OG images with actual charts. Chart.js and D3 require JavaScript + Canvas. Layout engines can't render them. Only a real browser can.

---

## Why This Works

Every SaaS with a public-facing dashboard or data page shares links that look generic in social feeds. The OG image is either a static logo or a plain title card. The actual data — the interesting part — is invisible until you click.

With HTMLPix, the OG image IS the chart. A preview of the actual data, rendered live.

**Competitive moat:** Chart.js uses `<canvas>`. D3 uses `<svg>` with JS-computed layouts. Both require JavaScript execution. Takumi/Satori cannot execute JS. This is architecturally impossible for layout engines.

---

## Target Audience

- SaaS companies with public dashboards (analytics, monitoring, finance)
- Open-source projects with stats pages (npm downloads, GitHub stars over time)
- Newsletter authors embedding weekly metrics
- Data journalism / blog posts about trends
- Next.js devs building any app that surfaces data

**Target keywords:**
- "chart og image"
- "dynamic chart social preview"
- "chartjs to png api"
- "d3 chart to image"
- "dashboard og image nextjs"
- "data visualization og image"

---

## Deliverables

### 1. Blog Post

**Title:** "Generate OG Images With Live Charts in Next.js"

**Platform:** Dev.to + Hashnode

**Structure:**
1. Hook — "Your analytics dashboard generates millions in ARR. Its social preview is a grey rectangle with your logo."
2. The problem — Chart.js/D3 run in a browser. OG image generators don't have browsers. You can't put a `<canvas>` in Satori.
3. The solution — HTMLPix runs a real browser. Render Chart.js, get a PNG.
4. Three examples — Bar chart (weekly metrics), line chart (growth over time), donut chart (distribution).
5. Advanced — Pull live data from your API, render chart with current numbers, cache for 1 hour.
6. CTA — "50 free renders/month."

### 2. GitHub Repo: `htmlpix/chart-og-templates`

3 ready-to-use templates:

| Template | Chart Type | Library | Use Case |
|----------|-----------|---------|----------|
| Metrics Bar | Grouped bar chart | Chart.js | Weekly/monthly performance |
| Growth Line | Line chart with gradient fill | Chart.js | User growth, revenue, traffic |
| Distribution Donut | Donut/ring chart | Chart.js | Market share, usage breakdown |

Each template:
- Accepts data as JSON query params (`?data=[120,190,300]&labels=["Mon","Tue","Wed"]`)
- Loads Chart.js from CDN
- Dark theme (looks good on social feeds)
- 1200x630 output with branding area (logo + title above chart)
- Caching configured

### 3. Use Case Page on htmlpix.com

Expand the existing "Charts & Reports" use case page with a Next.js-specific section. Show the OG image angle, not just "charts in Slack."

---

## Technical Implementation

```typescript
// app/api/og/chart/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Weekly Performance";
  const data = searchParams.get("data") ?? "[120,190,300,250,420]";
  const labels = searchParams.get("labels") ?? '["Mon","Tue","Wed","Thu","Fri"]';

  const html = `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 630px; background: #0f0f0f; font-family: 'Inter', sans-serif;
           display: flex; flex-direction: column; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .title { color: #fff; font-size: 32px; font-weight: 700; }
    .badge { background: rgba(255,77,0,0.15); color: #ff4d00; padding: 6px 16px;
             border-radius: 20px; font-size: 14px; font-weight: 600; }
    .chart-container { flex: 1; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${title}</div>
    <div class="badge">Live Data</div>
  </div>
  <div class="chart-container">
    <canvas id="chart"></canvas>
  </div>
  <script>
    new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: ${labels},
        datasets: [{
          data: ${data},
          backgroundColor: '#ff4d00',
          borderRadius: 6,
          barThickness: 48,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#666', font: { size: 16 } }, grid: { display: false } },
          y: { ticks: { color: '#666', font: { size: 14 } }, grid: { color: '#1a1a1a' } }
        }
      }
    });
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
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
```

This loads Chart.js from CDN, executes it, renders a `<canvas>` element, and returns a PNG. Impossible in any layout engine.

---

## Advanced: Live Data OG Images

The real power play: pull live data from your database and render it in the OG image.

```typescript
// app/api/og/dashboard/route.ts
export async function GET() {
  // Pull live metrics from your DB
  const metrics = await db.query("SELECT day, renders FROM daily_stats ORDER BY day DESC LIMIT 7");

  const data = JSON.stringify(metrics.map(m => m.renders));
  const labels = JSON.stringify(metrics.map(m => m.day));

  // ... render chart with live data via HTMLPix
}
```

When someone shares your dashboard link on Twitter, the OG image shows THIS WEEK's actual data. Updated every hour via cache headers. No other OG solution can do this because it requires both data fetching AND JavaScript chart rendering.

---

## Distribution

| Channel | Action | Timing |
|---------|--------|--------|
| Dev.to | Publish article | Week 1 |
| Hashnode | Cross-post | Week 1 |
| Reddit r/nextjs | "I made my dashboard OG images show live charts" | Week 1 |
| Reddit r/SaaS | "How we generate social previews with live data" | Week 1 |
| Twitter/X | Video showing: share link -> OG image has actual chart | Week 1 |
| Indie Hackers | Post in "Share your work" | Week 2 |
| GitHub | Publish template repo | Week 1 |

---

## Success Metrics

- GitHub repo stars (target: 75 in first month)
- Article views (target: 3k across platforms)
- Free tier signups (target: 30)
- Shares/bookmarks on social (high save rate expected — devs bookmark this for later)

---

## Why SaaS Companies Will Pay

SaaS companies share dashboard links constantly — in investor updates, customer reports, social posts, changelogs. Every share is a branding opportunity. A chart OG image is dramatically more engaging than a text card.

At 3,000 renders/month ($15 Pro plan), a SaaS with 50 public pages cached daily uses ~1,500 renders. Well within paid tier range. The ROI is obvious: one click-through from a better OG image pays for the monthly plan.
