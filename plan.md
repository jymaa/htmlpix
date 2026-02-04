Bun HTML+CSS → Image API (VPS + Google Fonts)

Goals





Chrome-accurate rendering of HTML/CSS to PNG/JPEG/WebP.



Low p95 latency and good handling of multiple requests via warm Chromium + pooling.



Untrusted HTML input with remote asset loads allowed, with practical hardening.



Deploy on a single VPS (Hetzner/OVH), with clear sizing/tuning guidance.

Tech choices





Runtime: Bun + TypeScript (HTTP server, request validation, concurrency control).



Renderer: Headless Chromium via Puppeteer.





Rationale: best alignment with “Chrome CSS support” and supports WebP screenshots (type: 'webp').



Note: Bun compatibility is workable; avoid bun build --compile for Puppeteer apps; run via bun run in production.

VPS sizing recommendation (based on your answers)

Target: ≤2 renders/sec peak, typical ~1920×1080.





Recommended: 4 vCPU / 8 GB RAM / NVMe





Set RENDER_CONCURRENCY=3 (or 4 if stable).



Keep 1 browser instance warm; use incognito contexts per request.



More headroom (smoother p95 / bursts): 8 vCPU / 16 GB RAM





RENDER_CONCURRENCY=6–8, optionally BROWSER_INSTANCES=2.



Practical note: Chromium memory is spiky with images/fonts/full-page; prefer RAM margin over “just enough”.

API contract

POST /render





JSON body (core):





html: string



css?: string



googleFonts?: string[] (new)



width?: number (default 1200 or request-defined)



height?: number (optional; otherwise use fullPage or auto sizing strategy)



deviceScaleFactor?: number (default 1–2)



format?: 'png'|'jpeg'|'webp' (default png)



quality?: number (jpeg/webp only)



fullPage?: boolean



timeoutMs?: number (default 5000)



background?: 'transparent'|'white' (png transparency handling)



Response: image bytes with correct Content-Type.



Error responses: structured JSON with a stable code and message.

Google Fonts support (googleFonts: string[])

Input format





Accept items like:





"Inter"



"Inter:wght@400;600"



"Roboto Mono:wght@400"



Implementation will URL-encode families and build a single Google Fonts CSS2 URL:





https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Roboto+Mono:wght@400&display=swap

Injection & load





Inject into <head>:





<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>



<link rel="stylesheet" href="<css2-url>">



After setting content, wait for:





document.fonts.ready and a small stabilization delay (configurable) before screenshot.

Caching strategy (critical for latency)





In-process LRU cache for:





Google Fonts CSS responses (fonts.googleapis.com)



Optionally cache font binary responses (fonts.gstatic.com) up to a size cap



Ensure cache has:





TTL, max entries, and max total bytes



Benefit: repeated renders using the same fonts stop paying the network penalty.

Rendering pipeline (fast)





Create one or few long-lived Chromium instances:





BROWSER_INSTANCES=1 initially.



Per request:





Acquire semaphore slot (concurrency limiter)



Create incognito context + page



Configure viewport / deviceScaleFactor



Enable request interception rules (below)



page.setContent(compiledHtml, { waitUntil: 'load' })



Wait document.fonts.ready



page.screenshot({ type, quality, fullPage, omitBackground })



Dispose page/context

Hardening for untrusted input (with remote loads allowed)





Request interception allowlist by resource type:





Allow: document, stylesheet, font, image (optionally media)



Block by default: script, xhr, fetch, websocket, eventsource, manifest, other



Domain allowlist:





Always allow Google Fonts hosts when googleFonts is provided: fonts.googleapis.com, fonts.gstatic.com



Optional config to allow additional domains (comma-separated env)



Limits:





Max HTML/CSS length



Max total downloaded bytes per render



Per-request timeout



Process isolation:





Prefer running Chromium with its sandbox enabled (best on VPS).

Concurrency model





Use an in-process semaphore to cap active renders.



Queue requests; optionally return 429 if queue exceeds max length.

Observability & ops





Endpoints:





GET /healthz (process alive)



GET /readyz (browser can render a tiny page)



Structured logs per render:





queue wait ms, render ms, screenshot ms, bytes downloaded, blocked requests count, browser restarts

Project layout (files)





[package.json](package.json), [tsconfig.json](tsconfig.json)



[src/server.ts](src/server.ts) routes + response



[src/render/browserPool.ts](src/render/browserPool.ts) launch/restart/pool



[src/render/render.ts](src/render/render.ts) render job implementation



[src/render/requestPolicy.ts](src/render/requestPolicy.ts) allowlist/limits



[src/render/googleFonts.ts](src/render/googleFonts.ts) build css2 URL + injection helpers



[src/cache/lru.ts](src/cache/lru.ts) simple byte-aware LRU



[src/validation.ts](src/validation.ts) schema validation



[Dockerfile](Dockerfile) (even on VPS, Docker simplifies deps)



[README.md](README.md) usage + examples

VPS deployment approach





Use Docker on the VPS (recommended):





Install system deps once; pin a known-good Chromium/Puppeteer setup.



Include fonts (e.g. Noto families) for consistent renders.



Runtime env vars:





PORT, RENDER_CONCURRENCY, BROWSER_INSTANCES, DEFAULT_TIMEOUT_MS, MAX_ASSET_BYTES, ALLOWED_HOSTS, CACHE_MAX_BYTES



System tuning:





Ensure enough shared memory; configure container /dev/shm sizing (important for Chromium).

Example request





googleFonts: ["Inter:wght@400;600", "Roboto Mono:wght@400"]

Test plan (when implementing)





Render baseline HTML/CSS without remote assets.



Render with Google Fonts and verify font actually applied (visual + computed style).



Concurrency soak at configured limit; verify no browser leaks and stable memory.

