"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api as _api } from "../../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

// TODO: Remove cast after running `convex dev` to regenerate types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = _api as any;
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { buildRenderHtml } from "@/lib/build-render-html";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Variable = {
  name: string;
  type: "string" | "number" | "url";
  defaultValue?: string;
};

// --- Sidebar section component ---
function SidebarSection({
  title,
  children,
  defaultOpen = true,
  action,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
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
        <div className="flex items-center gap-1.5">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
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
      </div>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

export default function TemplateEditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as Id<"templates">;

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const template = useQuery(api.templates.getTemplate, { templateId });
  const updateTemplate = useMutation(api.templates.updateTemplate);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const htmlRef = useRef<HTMLTextAreaElement>(null);
  const cssRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isOwnerRef = useRef(false);
  const [containerSize, setContainerSize] = useState({ w: 600, h: 340 });

  // Populate form from loaded template
  useEffect(() => {
    if (template && !initialized) {
      setName(template.name);
      setDescription(template.description || "");
      setHtml(template.html);
      setCss(template.css || "");
      setVariables(template.variables);
      setWidth(template.width || 1200);
      setHeight(template.height || 630);
      setFormat(template.format || "png");
      setInitialized(true);
    }
  }, [template, initialized]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateTemplate({
        templateId,
        name: name.trim(),
        description: description.trim() || undefined,
        html,
        css: css || undefined,
        variables,
        width,
        height,
        format,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [templateId, name, description, html, css, variables, width, height, format, updateTemplate]);

  // Cmd+S / Ctrl+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isOwnerRef.current) handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  // Track preview container size for proper scaling
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

  const addVariable = () => {
    setVariables((prev) => [...prev, { name: "", type: "string", defaultValue: "" }]);
  };

  const updateVariable = (index: number, updates: Partial<Variable>) => {
    setVariables((prev) => prev.map((v, i) => (i === index ? { ...v, ...updates } : v)));
  };

  const removeVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  // Build preview HTML with variables interpolated using defaults
  const previewHtml = useMemo(() => {
    let previewH = html;
    let previewC = css;
    for (const v of variables) {
      const value = v.defaultValue ?? "";
      const placeholder = `{{${v.name}}}`;
      previewH = previewH.split(placeholder).join(value);
      previewC = previewC.split(placeholder).join(value);
    }
    return buildRenderHtml(previewH, { css: previewC, background: "white" });
  }, [html, css, variables]);

  const handleCopySnippet = async () => {
    const snippet = `curl -X POST $API_URL/render \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "variables": {
${variables.map((v) => `      "${v.name}": "${v.defaultValue || "..."}"`).join(",\n")}
    }
  }'`;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate preview scale to fit container
  const previewScale = useMemo(() => {
    const maxW = containerSize.w - 48;
    const maxH = containerSize.h - 32;
    const scaleW = maxW / width;
    const scaleH = maxH / height;
    return Math.min(scaleW, scaleH, 1);
  }, [containerSize, width, height]);

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
      // Restore cursor position after React re-render
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  if (template === undefined) {
    return (
      <div className="-m-4 flex h-[calc(100vh-57px)] items-center justify-center">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="mx-auto h-3 w-32" />
        </div>
      </div>
    );
  }

  if (template === null) {
    return (
      <div className="-m-4 flex h-[calc(100vh-57px)] flex-col items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-lg font-bold">Template not found</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            It may have been deleted or you don&apos;t have access.
          </p>
        </div>
        <Link href="/templates">
          <Button variant="outline" size="sm">Back to Templates</Button>
        </Link>
      </div>
    );
  }

  if (template.userId !== userId && !template.isPublic) {
    return (
      <div className="-m-4 flex h-[calc(100vh-57px)] flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold">Access Denied</p>
        <Link href="/templates">
          <Button variant="outline" size="sm">Back to Templates</Button>
        </Link>
      </div>
    );
  }

  const isOwner = template.userId === userId;
  isOwnerRef.current = isOwner;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="-m-4 flex h-[calc(100vh-57px)] flex-col overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-3">
          {/* Left: back + name */}
          <div className="flex min-w-0 items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/templates")}
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Back to templates</TooltipContent>
            </Tooltip>

            <div className="h-4 w-px bg-[var(--border)]" />

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwner}
              className="min-w-0 max-w-[280px] truncate bg-transparent text-sm font-semibold text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none disabled:opacity-60"
              placeholder="Template name"
            />

            <span className="hidden text-[var(--muted-foreground)] sm:inline">/</span>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isOwner}
              className="hidden min-w-0 flex-1 truncate bg-transparent text-xs text-[var(--muted-foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:outline-none disabled:opacity-60 sm:block"
              placeholder="Add description..."
            />
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-medium text-green-600 animate-in fade-in duration-200">
                Saved
              </span>
            )}

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

            {isOwner && (
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="h-7 px-3 text-xs font-medium"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>

        {/* ── Main workspace ── */}
        <div className="flex min-h-0 flex-1">
          {/* ── Center: Preview + Editor ── */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Preview area */}
            <div
              ref={previewContainerRef}
              className="relative flex shrink-0 items-center justify-center overflow-hidden border-b border-[var(--border)]"
              style={{
                height: "45%",
                minHeight: 200,
                // Subtle canvas pattern
                backgroundImage: `
                  radial-gradient(circle, var(--border) 0.5px, transparent 0.5px)
                `,
                backgroundSize: "16px 16px",
              }}
            >
              {/* Scaled iframe preview */}
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
                  title="Template preview"
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

              {/* Dimension label */}
              <div className="absolute bottom-2 right-3 rounded bg-[var(--foreground)]/80 px-1.5 py-0.5 font-mono text-[10px] text-[var(--background)]">
                {Math.round(previewScale * 100)}%
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
                  disabled={!isOwner}
                  spellCheck={false}
                  className={`absolute inset-0 resize-none bg-[var(--background)] p-4 font-mono text-[13px] leading-[1.6] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none disabled:opacity-50 ${
                    activeTab === "html" ? "" : "hidden"
                  }`}
                  placeholder="<div>Your HTML here. Use {{variableName}} for placeholders.</div>"
                />
                <textarea
                  ref={cssRef}
                  value={css}
                  onChange={(e) => setCss(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!isOwner}
                  spellCheck={false}
                  className={`absolute inset-0 resize-none bg-[var(--background)] p-4 font-mono text-[13px] leading-[1.6] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none disabled:opacity-50 ${
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
              {/* Variables */}
              <SidebarSection
                title="Variables"
                action={
                  isOwner ? (
                    <button
                      onClick={addVariable}
                      className="flex h-5 w-5 items-center justify-center text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                      title="Add variable"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  ) : undefined
                }
              >
                {variables.length === 0 ? (
                  <p className="py-2 text-xs text-[var(--muted-foreground)]">
                    No variables yet. Use{" "}
                    <code className="rounded bg-[var(--muted)] px-1 py-0.5 font-mono text-[10px]">
                      {"{{name}}"}
                    </code>{" "}
                    syntax in your HTML/CSS.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {variables.map((v, i) => (
                      <div key={i} className="group relative rounded border border-[var(--border)] bg-[var(--muted)]/30 p-2.5">
                        {isOwner && (
                          <button
                            onClick={() => removeVariable(i)}
                            className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center text-[var(--muted-foreground)] opacity-0 transition-opacity hover:text-[var(--destructive)] group-hover:opacity-100"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                        <div className="mb-1.5 flex items-center gap-2">
                          <input
                            value={v.name}
                            onChange={(e) => updateVariable(i, { name: e.target.value })}
                            disabled={!isOwner}
                            placeholder="name"
                            className="min-w-0 flex-1 bg-transparent font-mono text-xs font-medium text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/50 focus:outline-none disabled:opacity-50"
                          />
                          <Select
                            value={v.type}
                            onValueChange={(val) =>
                              updateVariable(i, { type: val as "string" | "number" | "url" })
                            }
                            disabled={!isOwner}
                          >
                            <SelectTrigger className="h-5 w-[68px] border-0 bg-transparent px-1 text-[10px] shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <input
                          value={v.defaultValue || ""}
                          onChange={(e) => updateVariable(i, { defaultValue: e.target.value })}
                          disabled={!isOwner}
                          placeholder="Default value..."
                          className="w-full bg-transparent text-xs text-[var(--muted-foreground)] placeholder:text-[var(--muted-foreground)]/40 focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
                        disabled={!isOwner}
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
                        disabled={!isOwner}
                        min={1}
                        max={4096}
                        className="h-7 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      Format
                    </label>
                    <Select
                      value={format}
                      onValueChange={(v) => setFormat(v as "png" | "jpeg" | "webp")}
                      disabled={!isOwner}
                    >
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
                  {/* Common presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: "OG Image", w: 1200, h: 630 },
                      { label: "Square", w: 1080, h: 1080 },
                      { label: "Twitter", w: 1200, h: 675 },
                      { label: "Story", w: 1080, h: 1920 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          if (!isOwner) return;
                          setWidth(preset.w);
                          setHeight(preset.h);
                        }}
                        disabled={!isOwner}
                        className={`rounded border px-2 py-0.5 font-mono text-[10px] transition-colors disabled:opacity-40 ${
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

              {/* API Usage */}
              <SidebarSection title="API Usage" defaultOpen={false}>
                <div className="relative">
                  <pre className="max-h-[200px] overflow-auto rounded border border-[var(--border)] bg-[var(--muted)]/40 p-3 font-mono text-[10px] leading-relaxed text-[var(--foreground)]">
                    {`curl -X POST $API_URL/render \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "variables": {
${variables.map((v) => `      "${v.name}": "${v.defaultValue || "..."}"`).join(",\n")}
    }
  }'`}
                  </pre>
                  <button
                    onClick={handleCopySnippet}
                    className="absolute top-1.5 right-1.5 rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </SidebarSection>

              {/* Keyboard shortcuts hint */}
              <div className="px-4 py-3">
                <div className="space-y-1 text-[10px] text-[var(--muted-foreground)]">
                  <div className="flex items-center justify-between">
                    <span>Save</span>
                    <kbd className="rounded border border-[var(--border)] bg-[var(--muted)] px-1 py-0.5 font-mono text-[9px]">
                      &#8984;S
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
