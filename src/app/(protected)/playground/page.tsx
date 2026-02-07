"use client";

import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { BlueprintSpinner } from "@/components/ui/blueprint-spinner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.htmlpix.com";

const EXAMPLES: Record<string, { html: string; css: string; label: string }> = {
  og: {
    label: "OG Card",
    html: `<div class="og-card">
  <div class="og-badge">BLOG POST</div>
  <h1 class="og-title">How to Build a Blazing Fast API</h1>
  <p class="og-author">By Jane Smith &middot; 5 min read</p>
  <div class="og-footer">
    <span class="og-logo">ACME</span>
    <span class="og-date">Jan 2026</span>
  </div>
</div>`,
    css: `.og-card {
  width: 1200px; height: 630px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc; padding: 80px;
  display: flex; flex-direction: column; justify-content: center;
  font-family: system-ui, sans-serif;
}
.og-badge {
  font-size: 14px; font-weight: 700; letter-spacing: 2px;
  color: #f97316; margin-bottom: 24px;
}
.og-title {
  font-size: 56px; font-weight: 800; line-height: 1.1;
  margin: 0 0 24px 0;
}
.og-author { font-size: 20px; color: #94a3b8; margin: 0; }
.og-footer {
  margin-top: auto; display: flex; justify-content: space-between;
  align-items: center; font-size: 16px; color: #64748b;
}
.og-logo { font-weight: 800; font-size: 20px; color: #f8fafc; }
.og-date { font-size: 16px; }`,
  },
  social: {
    label: "Social Card",
    html: `<div class="social-card">
  <div class="avatar">JS</div>
  <div class="content">
    <div class="name">Jane Smith</div>
    <div class="handle">@janesmith</div>
    <p class="text">Just shipped a new feature using HTMLPix — generating OG images dynamically is so much easier now. One API call and done. 🚀</p>
    <div class="meta">
      <span>❤️ 142</span>
      <span>🔁 38</span>
      <span>💬 12</span>
    </div>
  </div>
</div>`,
    css: `.social-card {
  width: 600px; padding: 32px;
  background: #ffffff; border-radius: 16px;
  display: flex; gap: 16px;
  font-family: system-ui, sans-serif;
  border: 1px solid #e2e8f0;
}
.avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: #3b82f6; color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 18px; flex-shrink: 0;
}
.content { flex: 1; }
.name { font-weight: 700; font-size: 16px; color: #0f172a; }
.handle { font-size: 14px; color: #64748b; margin-bottom: 12px; }
.text { font-size: 15px; line-height: 1.5; color: #334155; margin: 0 0 16px 0; }
.meta { display: flex; gap: 24px; font-size: 14px; color: #64748b; }`,
  },
  receipt: {
    label: "Receipt",
    html: `<div class="receipt">
  <div class="receipt-header">
    <div class="store-name">COFFEE HOUSE</div>
    <div class="store-detail">123 Main St, Portland OR</div>
    <div class="store-detail">Order #4821</div>
  </div>
  <div class="divider"></div>
  <div class="items">
    <div class="item"><span>Oat Latte (L)</span><span>$5.50</span></div>
    <div class="item"><span>Croissant</span><span>$3.75</span></div>
    <div class="item"><span>Tip</span><span>$1.85</span></div>
  </div>
  <div class="divider"></div>
  <div class="total"><span>TOTAL</span><span>$11.10</span></div>
  <div class="footer">Thank you for your order!</div>
</div>`,
    css: `.receipt {
  width: 380px; padding: 40px 32px;
  background: #fffdf7; font-family: 'Courier New', monospace;
  border: 1px dashed #d4c5a9;
}
.receipt-header { text-align: center; margin-bottom: 20px; }
.store-name { font-size: 22px; font-weight: 700; letter-spacing: 4px; color: #1a1a1a; }
.store-detail { font-size: 12px; color: #78716c; margin-top: 4px; }
.divider { border-top: 1px dashed #d4c5a9; margin: 16px 0; }
.items { display: flex; flex-direction: column; gap: 10px; }
.item { display: flex; justify-content: space-between; font-size: 14px; color: #44403c; }
.total {
  display: flex; justify-content: space-between;
  font-size: 18px; font-weight: 700; color: #1a1a1a;
}
.footer { text-align: center; margin-top: 24px; font-size: 12px; color: #a8a29e; }`,
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

export default function PlaygroundPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const apiKeys = useQuery(
    api.apiKeys.listUserKeys,
    userId ? { userId } : "skip"
  );
  const activeKey = apiKeys?.find((k) => k.active);

  const [html, setHtml] = useState(EXAMPLES.og.html);
  const [css, setCss] = useState(EXAMPLES.og.css);
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

  const handleSelectExample = (key: string) => {
    const example = EXAMPLES[key];
    if (example) {
      setHtml(example.html);
      setCss(example.css);
    }
  };

  const handleRender = useCallback(async () => {
    if (!apiKeyInput.trim()) {
      setError("Paste your API key above to render");
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
      if (format !== "png") body.quality = quality;
      if (deviceScaleFactor !== 1)
        body.deviceScaleFactor = deviceScaleFactor;

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
      } else if (data.base64) {
        setImageUrl(`data:${data.mimeType};base64,${data.base64}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setRenderTime(Math.round(performance.now() - start));
    } finally {
      setRendering(false);
    }
  }, [apiKeyInput, html, css, width, height, format, quality, deviceScaleFactor]);

  const buildRequestBody = () => {
    const body: Record<string, unknown> = { html, css, width, height, format };
    if (format !== "png") body.quality = quality;
    if (deviceScaleFactor !== 1) body.deviceScaleFactor = deviceScaleFactor;
    return body;
  };

  const generateCurl = () => {
    const body = buildRequestBody();
    return `curl -X POST ${API_BASE_URL}/render \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body, null, 2)}'`;
  };

  const generateTypeScript = () => {
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
  };

  const generatePython = () => {
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
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Playground</h1>
          <p className="text-muted-foreground">
            Test the HTMLPix API interactively
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select onValueChange={handleSelectExample}>
            <SelectTrigger className="w-[160px]">
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
          <Button
            onClick={handleRender}
            disabled={rendering}
            className="min-w-[100px]"
          >
            {rendering ? (
              <span className="flex items-center gap-2">
                <BlueprintSpinner size="sm" />
                Rendering
              </span>
            ) : (
              "Render"
            )}
          </Button>
        </div>
      </div>

      {/* API Key Input */}
      <div className="flex items-center gap-3">
        <Label className="shrink-0 text-sm text-muted-foreground">API Key</Label>
        <Input
          type="text"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          placeholder={activeKey ? `${activeKey.keyPrefix}... (paste full key)` : "hpx_..."}
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          className="max-w-sm font-mono text-sm"
        />
        <span className="text-xs text-muted-foreground">
          Find your key on the{" "}
          <Link href="/api-keys" className="underline hover:text-foreground">
            API Keys
          </Link>{" "}
          page
        </span>
      </div>

      {/* Main split pane */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Editor */}
        <div className="space-y-4">
          <Card>
            <Tabs defaultValue="html">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="html" className="mt-0">
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    spellCheck={false}
                    className="h-[320px] w-full resize-none rounded-md border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </TabsContent>
                <TabsContent value="css" className="mt-0">
                  <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    spellCheck={false}
                    className="h-[320px] w-full resize-none rounded-md border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Render Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={1}
                    max={4096}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={1}
                    max={4096}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Format</Label>
                  <Select
                    value={format}
                    onValueChange={(v) =>
                      setFormat(v as "png" | "jpeg" | "webp")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Scale</Label>
                  <Select
                    value={String(deviceScaleFactor)}
                    onValueChange={(v) => setDeviceScaleFactor(Number(v))}
                  >
                    <SelectTrigger>
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
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Quality</Label>
                    <span className="font-mono text-xs text-muted-foreground">
                      {quality}
                    </span>
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
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview + Response */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Preview</CardTitle>
                {renderTime !== null && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {renderTime}ms
                    </Badge>
                    {response?.cached && (
                      <Badge variant="secondary" className="text-xs">
                        cached
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-md border bg-muted/30">
                {rendering ? (
                  <BlueprintSpinner size="md" label="Rendering" />
                ) : error ? (
                  <div className="px-6 py-8 text-center">
                    <Badge variant="destructive" className="mb-2">
                      Error
                    </Badge>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Rendered output"
                    className="max-h-[400px] max-w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click &ldquo;Render&rdquo; to see the output
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Response JSON */}
          {response && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="max-h-[200px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Code snippets */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Code Snippets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="curl" className="relative mt-4">
                  <pre className="max-h-[200px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                    {generateCurl()}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-6 right-2"
                    onClick={() => handleCopy("curl")}
                  >
                    {copied === "curl" ? "Copied!" : "Copy"}
                  </Button>
                </TabsContent>
                <TabsContent value="typescript" className="relative mt-4">
                  <pre className="max-h-[200px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                    {generateTypeScript()}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-6 right-2"
                    onClick={() => handleCopy("typescript")}
                  >
                    {copied === "typescript" ? "Copied!" : "Copy"}
                  </Button>
                </TabsContent>
                <TabsContent value="python" className="relative mt-4">
                  <pre className="max-h-[200px] overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                    {generatePython()}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-6 right-2"
                    onClick={() => handleCopy("python")}
                  >
                    {copied === "python" ? "Copied!" : "Copy"}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
