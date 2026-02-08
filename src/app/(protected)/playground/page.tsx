"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { BlueprintSpinner } from "@/components/ui/blueprint-spinner";
import { buildRenderHtml } from "@/lib/build-render-html";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.htmlpix.com";

const EXAMPLES: Record<string, { html: string; css: string; label: string; width?: number; height?: number; googleFonts?: string[] }> = {
  og: {
    label: "OG Image",
    width: 1200,
    height: 630,
    googleFonts: ["Bebas Neue", "Space Mono:wght@400;700"],
    html: `<div class="og">
  <div class="grid"></div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  <div class="content">
    <div class="badge">HTML&rarr;IMAGE API</div>
    <h1 class="title">Generate images<br>from HTML &amp; CSS</h1>
    <p class="sub">One API call. Pixel-perfect screenshots.<br>OG images, social cards, PDFs &mdash; at any scale.</p>
    <div class="cta">
      <span class="btn">Start for free</span>
      <span class="btn-ghost">Read docs &rarr;</span>
    </div>
  </div>
  <div class="footer">
    <span class="logo">HTMLPix</span>
    <span class="url">htmlpix.com</span>
  </div>
</div>`,
    css: `.og {
  width: 1200px; height: 630px; position: relative; overflow: hidden;
  background: #f5f0e8; color: #1a1a1a;
  display: flex; flex-direction: column; justify-content: center;
  padding: 72px 80px;
}
.grid {
  position: absolute; inset: 0; opacity: 0.06;
  background-image:
    linear-gradient(#1a1a1a 1px, transparent 1px),
    linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
  background-size: 60px 60px;
}
.corner { position: absolute; width: 28px; height: 28px; }
.corner::before, .corner::after {
  content: ''; position: absolute; background: #ff4d00;
}
.tl { top: 24px; left: 24px; }
.tl::before { width: 28px; height: 2px; top: 0; left: 0; }
.tl::after { width: 2px; height: 28px; top: 0; left: 0; }
.tr { top: 24px; right: 24px; }
.tr::before { width: 28px; height: 2px; top: 0; right: 0; }
.tr::after { width: 2px; height: 28px; top: 0; right: 0; }
.bl { bottom: 24px; left: 24px; }
.bl::before { width: 28px; height: 2px; bottom: 0; left: 0; }
.bl::after { width: 2px; height: 28px; bottom: 0; left: 0; }
.br { bottom: 24px; right: 24px; }
.br::before { width: 28px; height: 2px; bottom: 0; right: 0; }
.br::after { width: 2px; height: 28px; bottom: 0; right: 0; }
.content { position: relative; z-index: 1; }
.badge {
  font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700;
  letter-spacing: 3px; color: #ff4d00; margin-bottom: 20px;
}
.title {
  font-family: 'Bebas Neue', sans-serif; font-size: 82px; line-height: 0.95;
  margin: 0 0 24px 0; letter-spacing: -1px;
}
.sub {
  font-family: 'Space Mono', monospace; font-size: 18px; line-height: 1.6;
  color: rgba(26,26,26,0.55); margin: 0 0 36px 0;
}
.cta { display: flex; align-items: center; gap: 20px; }
.btn {
  font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700;
  background: #ff4d00; color: #f5f0e8; padding: 12px 28px;
  letter-spacing: 0.5px;
}
.btn-ghost {
  font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700;
  color: #1a1a1a; letter-spacing: 0.5px;
}
.footer {
  position: absolute; bottom: 36px; left: 80px; right: 80px;
  display: flex; justify-content: space-between; align-items: center;
  z-index: 1;
}
.logo {
  font-family: 'Bebas Neue', sans-serif; font-size: 28px;
  letter-spacing: 2px; color: #1a1a1a;
}
.url {
  font-family: 'Space Mono', monospace; font-size: 13px;
  color: rgba(26,26,26,0.4); letter-spacing: 1px;
}`,
  },
  logo: {
    label: "Logo Card",
    width: 800,
    height: 800,
    googleFonts: ["Bebas Neue", "Space Mono:wght@400;700"],
    html: `<div class="card">
  <div class="grid"></div>
  <div class="ring"></div>
  <div class="center">
    <div class="mark">&lt;/&gt;</div>
    <div class="wordmark">HTMLPix</div>
    <div class="tagline">HTML &rarr; Image API</div>
  </div>
  <div class="ann ann-tl">FIG. 01</div>
  <div class="ann ann-br">SCALE 1:1</div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
</div>`,
    css: `.card {
  width: 800px; height: 800px; position: relative; overflow: hidden;
  background: #1a1a1a; display: flex; align-items: center; justify-content: center;
}
.grid {
  position: absolute; inset: 0; opacity: 0.07;
  background-image:
    linear-gradient(rgba(245,240,232,1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,240,232,1) 1px, transparent 1px);
  background-size: 80px 80px;
}
.ring {
  position: absolute; width: 420px; height: 420px; border-radius: 50%;
  border: 2px solid rgba(255,77,0,0.15);
  top: 50%; left: 50%; transform: translate(-50%, -50%);
}
.center { position: relative; z-index: 1; text-align: center; }
.mark {
  font-family: 'Space Mono', monospace; font-size: 72px; font-weight: 700;
  color: #ff4d00; margin-bottom: 20px; letter-spacing: -2px;
}
.wordmark {
  font-family: 'Bebas Neue', sans-serif; font-size: 96px;
  color: #f5f0e8; letter-spacing: 8px; line-height: 1;
}
.tagline {
  font-family: 'Space Mono', monospace; font-size: 15px;
  color: rgba(245,240,232,0.35); letter-spacing: 4px; margin-top: 16px;
}
.ann {
  position: absolute; font-family: 'Space Mono', monospace;
  font-size: 10px; color: rgba(245,240,232,0.2); letter-spacing: 2px;
}
.ann-tl { top: 40px; left: 40px; }
.ann-br { bottom: 40px; right: 40px; }
.corner { position: absolute; width: 20px; height: 20px; }
.corner::before, .corner::after {
  content: ''; position: absolute; background: #ff4d00;
}
.tl { top: 20px; left: 20px; }
.tl::before { width: 20px; height: 2px; } .tl::after { width: 2px; height: 20px; }
.tr { top: 20px; right: 20px; }
.tr::before { width: 20px; height: 2px; right: 0; } .tr::after { width: 2px; height: 20px; right: 0; }
.bl { bottom: 20px; left: 20px; }
.bl::before { width: 20px; height: 2px; bottom: 0; } .bl::after { width: 2px; height: 20px; bottom: 0; }
.br { bottom: 20px; right: 20px; }
.br::before { width: 20px; height: 2px; bottom: 0; right: 0; }
.br::after { width: 2px; height: 20px; bottom: 0; right: 0; }`,
  },
  api: {
    label: "API Card",
    width: 800,
    height: 450,
    googleFonts: ["Bebas Neue", "Space Mono:wght@400;700"],
    html: `<div class="card">
  <div class="grid"></div>
  <div class="left">
    <div class="pill">POST /render</div>
    <h2 class="title">One call.<br>Any image.</h2>
    <p class="desc">Send HTML + CSS, get a pixel-perfect screenshot back as PNG, JPEG, or WebP.</p>
    <div class="stats">
      <div class="stat"><span class="val">&lt;50ms</span><span class="lbl">AVG LATENCY</span></div>
      <div class="stat"><span class="val">99.9%</span><span class="lbl">UPTIME</span></div>
      <div class="stat"><span class="val">4K</span><span class="lbl">MAX RES</span></div>
    </div>
  </div>
  <div class="right">
    <div class="terminal">
      <div class="dots"><span class="d r"></span><span class="d y"></span><span class="d g"></span></div>
      <div class="code">
<span class="cm">// render an OG image</span>
<span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(
  <span class="str">"https://api.htmlpix.com/render"</span>,
  {
    method: <span class="str">"POST"</span>,
    headers: {
      Authorization: <span class="str">\`Bearer \${key}\`</span>,
    },
    body: <span class="fn">JSON.stringify</span>({
      html: <span class="str">"&lt;h1&gt;Hello&lt;/h1&gt;"</span>,
      width: <span class="num">1200</span>,
      height: <span class="num">630</span>,
    }),
  }
);
      </div>
    </div>
  </div>
</div>`,
    css: `.card {
  width: 800px; height: 450px; position: relative; overflow: hidden;
  background: #f5f0e8; display: flex;
}
.grid {
  position: absolute; inset: 0; opacity: 0.05;
  background-image:
    linear-gradient(#1a1a1a 1px, transparent 1px),
    linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
  background-size: 50px 50px;
}
.left {
  flex: 1; padding: 48px 40px; display: flex; flex-direction: column;
  justify-content: center; position: relative; z-index: 1;
}
.pill {
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
  color: #ff4d00; background: rgba(255,77,0,0.08);
  padding: 5px 12px; display: inline-block; width: fit-content;
  letter-spacing: 1px; margin-bottom: 16px; border: 1px solid rgba(255,77,0,0.15);
}
.title {
  font-family: 'Bebas Neue', sans-serif; font-size: 48px; line-height: 0.95;
  color: #1a1a1a; margin: 0 0 14px 0;
}
.desc {
  font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.7;
  color: rgba(26,26,26,0.5); margin: 0 0 24px 0; max-width: 300px;
}
.stats { display: flex; gap: 24px; }
.stat { display: flex; flex-direction: column; gap: 3px; }
.val {
  font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: #1a1a1a;
}
.lbl {
  font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700;
  color: rgba(26,26,26,0.3); letter-spacing: 2px;
}
.right {
  width: 380px; padding: 32px 32px 32px 0;
  display: flex; align-items: center; position: relative; z-index: 1;
}
.terminal {
  width: 100%; background: #1a1a1a; padding: 20px; border: 2px solid #1a1a1a;
  box-shadow: 4px 4px 0 0 rgba(26,26,26,0.15);
}
.dots { display: flex; gap: 6px; margin-bottom: 16px; }
.d { width: 10px; height: 10px; border-radius: 50%; }
.r { background: #ff5f57; } .y { background: #febc2e; } .g { background: #28c840; }
.code {
  font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.7;
  color: #f5f0e8; white-space: pre;
}
.cm { color: rgba(245,240,232,0.3); }
.kw { color: #ff4d00; }
.fn { color: #f5f0e8; }
.str { color: #28c840; }
.num { color: #febc2e; }`,
  },
  pricing: {
    label: "Pricing Card",
    width: 440,
    height: 560,
    googleFonts: ["Bebas Neue", "Space Mono:wght@400;700"],
    html: `<div class="card">
  <div class="grid"></div>
  <div class="popular">MOST POPULAR</div>
  <div class="content">
    <div class="plan">Pro</div>
    <div class="price">
      <span class="dollar">$</span><span class="amount">29</span><span class="period">/mo</span>
    </div>
    <div class="divider"></div>
    <ul class="features">
      <li><span class="check">&#10003;</span> 50,000 renders / month</li>
      <li><span class="check">&#10003;</span> Up to 4K resolution</li>
      <li><span class="check">&#10003;</span> PNG, JPEG, WebP formats</li>
      <li><span class="check">&#10003;</span> Custom fonts &amp; assets</li>
      <li><span class="check">&#10003;</span> Priority support</li>
      <li><span class="check">&#10003;</span> 99.9% uptime SLA</li>
    </ul>
    <div class="cta">Get started</div>
  </div>
  <div class="ann">htmlpix.com/pricing</div>
</div>`,
    css: `.card {
  width: 440px; height: 560px; position: relative; overflow: hidden;
  background: #f5f0e8; border: 2px solid #1a1a1a;
  display: flex; flex-direction: column;
  box-shadow: 6px 6px 0 0 #1a1a1a;
}
.grid {
  position: absolute; inset: 0; opacity: 0.04;
  background-image:
    linear-gradient(#1a1a1a 1px, transparent 1px),
    linear-gradient(90deg, #1a1a1a 1px, transparent 1px);
  background-size: 40px 40px;
}
.popular {
  font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
  letter-spacing: 3px; color: #f5f0e8; background: #ff4d00;
  text-align: center; padding: 10px; position: relative; z-index: 1;
}
.content {
  flex: 1; padding: 36px 40px; display: flex; flex-direction: column;
  position: relative; z-index: 1;
}
.plan {
  font-family: 'Bebas Neue', sans-serif; font-size: 42px;
  color: #1a1a1a; letter-spacing: 2px; line-height: 1;
}
.price { display: flex; align-items: baseline; margin-top: 4px; }
.dollar {
  font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700;
  color: #1a1a1a; margin-right: 2px; align-self: flex-start; margin-top: 8px;
}
.amount {
  font-family: 'Bebas Neue', sans-serif; font-size: 72px;
  color: #1a1a1a; line-height: 1;
}
.period {
  font-family: 'Space Mono', monospace; font-size: 14px;
  color: rgba(26,26,26,0.4); margin-left: 4px;
}
.divider {
  height: 2px; background: #1a1a1a; opacity: 0.08; margin: 20px 0;
}
.features {
  list-style: none; padding: 0; margin: 0; display: flex;
  flex-direction: column; gap: 12px; flex: 1;
}
.features li {
  font-family: 'Space Mono', monospace; font-size: 12px;
  color: rgba(26,26,26,0.65); display: flex; align-items: center; gap: 10px;
}
.check { color: #ff4d00; font-weight: 700; font-size: 14px; }
.cta {
  font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700;
  background: #1a1a1a; color: #f5f0e8; text-align: center;
  padding: 14px; letter-spacing: 1px; margin-top: 8px;
  border: 2px solid #1a1a1a; cursor: pointer;
}
.ann {
  position: absolute; bottom: 16px; right: 20px;
  font-family: 'Space Mono', monospace; font-size: 9px;
  color: rgba(26,26,26,0.15); letter-spacing: 1px; z-index: 1;
}`,
  },
};

interface RenderResponse {
  id?: string;
  url?: string;
  imageKey?: string;
  base64?: string;
  mimeType?: string;
  cached?: boolean;
  code?: string;
  message?: string;
}

// --- Sidebar section component ---
function SidebarSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)]">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-[var(--muted-foreground)] transition-transform duration-150 ${open ? "" : "-rotate-90"}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

export default function PlaygroundPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const apiKeys = useQuery(api.apiKeys.listUserKeys, userId ? {} : "skip");
  const activeKey = apiKeys?.find((k) => k.active);

  const [html, setHtml] = useState(EXAMPLES.og.html);
  const [css, setCss] = useState(EXAMPLES.og.css);
  const [googleFonts, setGoogleFonts] = useState<string[]>(EXAMPLES.og.googleFonts || []);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(90);
  const [deviceScaleFactor, setDeviceScaleFactor] = useState(1);

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [rendering, setRendering] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [response, setResponse] = useState<RenderResponse | null>(null);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [snippetTab, setSnippetTab] = useState<"curl" | "typescript" | "python">("curl");
  const [viewMode, setViewMode] = useState<"preview" | "rendered">("preview");
  const [copiedUrl, setCopiedUrl] = useState(false);

  const htmlRef = useRef<HTMLTextAreaElement>(null);
  const cssRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectExample = (key: string) => {
    const example = EXAMPLES[key];
    if (example) {
      setHtml(example.html);
      setCss(example.css);
      setGoogleFonts(example.googleFonts || []);
      if (example.width) setWidth(example.width);
      if (example.height) setHeight(example.height);
    }
  };

  const handleRender = useCallback(async () => {
    if (!apiKeyInput.trim()) {
      setError("Paste your API key in the sidebar to render");
      return;
    }
    setRendering(true);
    setError(null);
    setResponse(null);
    setImageUrl(null);

    const start = performance.now();

    try {
      const body: Record<string, unknown> = {
        html,
        css,
        width,
        height,
        format,
      };
      if (googleFonts.length > 0) body.googleFonts = googleFonts;
      if (format !== "png") body.quality = quality;
      if (deviceScaleFactor !== 1) body.deviceScaleFactor = deviceScaleFactor;

      const res = await fetch(`${API_BASE_URL}/render`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKeyInput.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const elapsed = Math.round(performance.now() - start);
      setRenderTime(elapsed);

      const data = await res.json();
      setResponse(data);

      if (!res.ok) {
        setError(data.message || `Error ${res.status}`);
      } else if (data.url) {
        setImageUrl(data.url);
        setViewMode("rendered");
      } else if (data.base64) {
        setImageUrl(`data:${data.mimeType};base64,${data.base64}`);
        setViewMode("rendered");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setRenderTime(Math.round(performance.now() - start));
    } finally {
      setRendering(false);
    }
  }, [apiKeyInput, html, css, googleFonts, width, height, format, quality, deviceScaleFactor]);

  // Cmd+Enter to render
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRender();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRender]);

  const buildRequestBody = useCallback(() => {
    const body: Record<string, unknown> = { html, css, width, height, format };
    if (googleFonts.length > 0) body.googleFonts = googleFonts;
    if (format !== "png") body.quality = quality;
    if (deviceScaleFactor !== 1) body.deviceScaleFactor = deviceScaleFactor;
    return body;
  }, [html, css, googleFonts, width, height, format, quality, deviceScaleFactor]);

  const generateCurl = useCallback(() => {
    const body = buildRequestBody();
    return `curl -X POST ${API_BASE_URL}/render \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body, null, 2)}'`;
  }, [buildRequestBody]);

  const generateTypeScript = useCallback(() => {
    const body = buildRequestBody();
    return `const response = await fetch("${API_BASE_URL}/render", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.HTMLPIX_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${JSON.stringify(body, null, 4)}),
});

const data = await response.json();
console.log(data.url);`;
  }, [buildRequestBody]);

  const generatePython = useCallback(() => {
    const body = buildRequestBody();
    const pyBody = JSON.stringify(body, null, 8);
    return `import requests
import os

response = requests.post(
    "${API_BASE_URL}/render",
    headers={
        "Authorization": f"Bearer {os.environ['HTMLPIX_KEY']}",
        "Content-Type": "application/json",
    },
    json=${pyBody},
)

data = response.json()
print(data["url"])`;
  }, [buildRequestBody]);

  const handleCopy = async (type: string) => {
    const generators: Record<string, () => string> = {
      curl: generateCurl,
      typescript: generateTypeScript,
      python: generatePython,
    };
    const text = generators[type]?.();
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Handle tab key in textareas for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      if (activeTab === "html") setHtml(newValue);
      else setCss(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  // Build live iframe preview
  const previewHtml = useMemo(() => {
    return buildRenderHtml(html, { css, googleFonts, background: "white" });
  }, [html, css, googleFonts]);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 600, h: 340 });

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const previewScale = useMemo(() => {
    const maxW = containerSize.w - 48;
    const maxH = containerSize.h - 32;
    const scaleW = maxW / width;
    const scaleH = maxH / height;
    return Math.min(scaleW, scaleH, 1);
  }, [containerSize, width, height]);

  const snippetGenerators: Record<string, () => string> = {
    curl: generateCurl,
    typescript: generateTypeScript,
    python: generatePython,
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="-m-4 flex h-[calc(100vh-57px)] flex-col overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-3">
          {/* Left: title + examples */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--foreground)]">Playground</span>
            <div className="h-4 w-px bg-[var(--border)]" />
            <Select onValueChange={handleSelectExample}>
              <SelectTrigger className="h-7 w-[160px] border-[var(--border)] text-xs">
                <SelectValue placeholder="Load example" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EXAMPLES).map(([key, ex]) => (
                  <SelectItem key={key} value={key}>
                    {ex.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden font-mono text-[10px] sm:inline-flex"
            >
              {width}&times;{height}
            </Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`flex h-7 w-7 items-center justify-center transition-colors ${
                    sidebarOpen
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              </TooltipContent>
            </Tooltip>

            <Button
              onClick={handleRender}
              disabled={rendering}
              size="sm"
              className="h-7 px-3 text-xs font-medium"
            >
              {rendering ? (
                <span className="flex items-center gap-1.5">
                  <BlueprintSpinner size="sm" />
                  Rendering
                </span>
              ) : (
                "Render"
              )}
            </Button>
          </div>
        </div>

        {/* ── Main workspace ── */}
        <div className="flex min-h-0 flex-1">
          {/* ── Center: Preview + Editor ── */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Preview area */}
            <div
              ref={previewContainerRef}
              className="relative flex shrink-0 flex-col overflow-hidden border-b border-[var(--border)]"
              style={{
                height: "45%",
                minHeight: 200,
              }}
            >
              {/* Mode bar */}
              <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-3">
                <div className="flex items-center rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-0.5">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                      viewMode === "preview"
                        ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
                  </button>
                  <button
                    onClick={() => imageUrl && setViewMode("rendered")}
                    className={`relative flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                      !imageUrl
                        ? "cursor-default text-[var(--muted-foreground)]/30"
                        : viewMode === "rendered"
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    Image
                    {imageUrl && viewMode !== "rendered" && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--primary)]" />
                    )}
                  </button>
                </div>
                {/* Actions when viewing rendered image */}
                {viewMode === "rendered" && imageUrl && (
                  <div className="flex items-center gap-1.5">
                    {renderTime !== null && (
                      <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                        {renderTime}ms{response?.cached ? " (cached)" : ""}
                      </span>
                    )}
                    {response?.url && (
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(response.url!);
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2000);
                        }}
                        className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                      >
                        {copiedUrl ? "Copied" : "Copy URL"}
                      </button>
                    )}
                    <a
                      href={imageUrl}
                      download={`render.${format}`}
                      className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      Download
                    </a>
                  </div>
                )}
              </div>

              {/* Preview content */}
              <div
                className="relative flex flex-1 items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: `radial-gradient(circle, var(--border) 0.5px, transparent 0.5px)`,
                  backgroundSize: "16px 16px",
                }}
              >
                {rendering ? (
                  <BlueprintSpinner size="md" label="Rendering" />
                ) : error ? (
                  <div className="px-6 py-8 text-center">
                    <Badge variant="destructive" className="mb-2">Error</Badge>
                    <p className="text-sm text-[var(--muted-foreground)]">{error}</p>
                  </div>
                ) : viewMode === "rendered" && imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Rendered output"
                    className="max-h-full max-w-full object-contain p-4"
                  />
                ) : (
                  /* Live iframe preview */
                  <div
                    className="relative overflow-hidden bg-white shadow-sm"
                    style={{
                      width: width * previewScale,
                      height: height * previewScale,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <iframe
                      srcDoc={previewHtml}
                      title="Live preview"
                      sandbox="allow-same-origin"
                      className="pointer-events-none origin-top-left"
                      style={{
                        width,
                        height,
                        transform: `scale(${previewScale})`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                )}

                {/* Bottom-right label */}
                {!rendering && !error && (
                  <div className="absolute bottom-2 right-3 rounded bg-[var(--foreground)]/80 px-1.5 py-0.5 font-mono text-[10px] text-[var(--background)]">
                    {viewMode === "rendered" && imageUrl
                      ? <>{width}&times;{height} &middot; {format.toUpperCase()}</>
                      : `${Math.round(previewScale * 100)}%`}
                  </div>
                )}
              </div>
            </div>

            {/* Editor area */}
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Editor tabs */}
              <div className="flex h-9 shrink-0 items-end border-b border-[var(--border)] bg-[var(--background)]">
                <button
                  onClick={() => setActiveTab("html")}
                  className={`relative flex h-full items-center px-4 font-mono text-xs transition-colors ${
                    activeTab === "html"
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  HTML
                  {activeTab === "html" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("css")}
                  className={`relative flex h-full items-center px-4 font-mono text-xs transition-colors ${
                    activeTab === "css"
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  CSS
                  {activeTab === "css" && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)]" />
                  )}
                </button>
              </div>

              {/* Textarea editor */}
              <div className="relative min-h-0 flex-1">
                <textarea
                  ref={htmlRef}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className={`absolute inset-0 resize-none bg-[var(--background)] p-4 font-mono text-[13px] leading-[1.6] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none ${
                    activeTab === "html" ? "" : "hidden"
                  }`}
                  placeholder="<div>Your HTML here</div>"
                />
                <textarea
                  ref={cssRef}
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className={`absolute inset-0 resize-none bg-[var(--background)] p-4 font-mono text-[13px] leading-[1.6] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none ${
                    activeTab === "css" ? "" : "hidden"
                  }`}
                  placeholder="body { padding: 40px; font-family: system-ui; }"
                />
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div
            className={`shrink-0 overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] transition-all duration-200 ${
              sidebarOpen ? "w-[300px]" : "w-0 overflow-hidden border-l-0"
            }`}
          >
            <div className="w-[300px]">
              {/* API Key */}
              <SidebarSection title="API Key">
                <div className="space-y-2">
                  <Input
                    type="text"
                    autoComplete="off"
                    data-1p-ignore
                    data-lpignore="true"
                    placeholder={activeKey ? `${activeKey.keyPrefix}...` : "hpx_..."}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="h-7 font-mono text-xs"
                  />
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    Find your key on the{" "}
                    <Link href="/api-keys" className="underline transition-colors hover:text-[var(--foreground)]">
                      API Keys
                    </Link>{" "}
                    page.
                  </p>
                </div>
              </SidebarSection>

              {/* Render Options */}
              <SidebarSection title="Render Options">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                        Width
                      </label>
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min={1}
                        max={4096}
                        className="h-7 font-mono text-xs"
                      />
                    </div>
                    <span className="mt-4 text-xs text-[var(--muted-foreground)]">&times;</span>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                        Height
                      </label>
                      <Input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min={1}
                        max={4096}
                        className="h-7 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                        Format
                      </label>
                      <Select value={format} onValueChange={(v) => setFormat(v as "png" | "jpeg" | "webp")}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                        Scale
                      </label>
                      <Select
                        value={String(deviceScaleFactor)}
                        onValueChange={(v) => setDeviceScaleFactor(Number(v))}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {format !== "png" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                          Quality
                        </label>
                        <span className="font-mono text-[10px] text-[var(--muted-foreground)]">{quality}</span>
                      </div>
                      <Slider
                        value={[quality]}
                        onValueChange={([v]) => setQuality(v)}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>
                  )}
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: "OG Image", w: 1200, h: 630 },
                      { label: "Square", w: 1080, h: 1080 },
                      { label: "Twitter", w: 1200, h: 675 },
                      { label: "Story", w: 1080, h: 1920 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => { setWidth(preset.w); setHeight(preset.h); }}
                        className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                          width === preset.w && height === preset.h
                            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]/20 hover:text-[var(--foreground)]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </SidebarSection>

              {/* Response */}
              {response && (
                <SidebarSection title="Response" defaultOpen={false}>
                  <pre className="max-h-[180px] overflow-auto rounded border border-[var(--border)] bg-[var(--muted)]/40 p-3 font-mono text-[10px] leading-relaxed text-[var(--foreground)]">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </SidebarSection>
              )}

              {/* Code Snippets */}
              <SidebarSection title="Code Snippets" defaultOpen={false}>
                <div className="space-y-2">
                  {/* Snippet tabs */}
                  <div className="flex gap-1">
                    {(["curl", "typescript", "python"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSnippetTab(tab)}
                        className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                          snippetTab === tab
                            ? "border-[var(--foreground)]/20 bg-[var(--muted)] text-[var(--foreground)]"
                            : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {tab === "curl" ? "cURL" : tab === "typescript" ? "TypeScript" : "Python"}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <pre className="max-h-[200px] overflow-auto rounded border border-[var(--border)] bg-[var(--muted)]/40 p-3 font-mono text-[10px] leading-relaxed text-[var(--foreground)]">
                      {snippetGenerators[snippetTab]?.()}
                    </pre>
                    <button
                      onClick={() => handleCopy(snippetTab)}
                      className="absolute top-1.5 right-1.5 rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {copied === snippetTab ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </SidebarSection>

              {/* Keyboard shortcuts hint */}
              <div className="px-4 py-3">
                <div className="space-y-1 text-[10px] text-[var(--muted-foreground)]">
                  <div className="flex items-center justify-between">
                    <span>Render</span>
                    <kbd className="rounded border border-[var(--border)] bg-[var(--muted)] px-1 py-0.5 font-mono text-[9px]">
                      &#8984;&#9166;
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Indent</span>
                    <kbd className="rounded border border-[var(--border)] bg-[var(--muted)] px-1 py-0.5 font-mono text-[9px]">
                      Tab
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
