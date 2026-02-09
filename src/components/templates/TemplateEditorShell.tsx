"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api as _api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateCodeEditor } from "./TemplateCodeEditor";
import { TemplateInspector } from "./TemplateInspector";
import { TemplatePreviewPane } from "./TemplatePreviewPane";
import type { TemplateFormat, TemplateVariable } from "./types";

// TODO: Remove cast after running `convex dev` to regenerate types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = _api as any;

type SplitOrientation = "horizontal" | "vertical";

function useSplitOrientation(): SplitOrientation {
  const [orientation, setOrientation] = useState<SplitOrientation>("horizontal");

  useEffect(() => {
    const update = () => {
      setOrientation(window.innerWidth < 640 ? "vertical" : "horizontal");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return orientation;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface TemplateEditorShellProps {
  templateId: string;
}

export function TemplateEditorShell({ templateId }: TemplateEditorShellProps) {
  const router = useRouter();
  const orientation = useSplitOrientation();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const template = useQuery(api.templates.getTemplate, { templateId });
  const updateTemplate = useMutation(api.templates.updateTemplate);

  const [initialized, setInitialized] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [jsx, setJsx] = useState("");
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({});
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [format, setFormat] = useState<TemplateFormat>("png");
  const [splitRatio, setSplitRatio] = useState(50);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewRenderMs, setPreviewRenderMs] = useState<number | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);

  const persistedSnapshotRef = useRef("");
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const previewRequestIdRef = useRef(0);
  const previewControllerRef = useRef<AbortController | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (template && !initialized) {
      setName(template.name);
      setDescription(template.description || "");
      setJsx(template.jsx);
      setVariables(template.variables || []);
      setGoogleFonts(template.googleFonts || []);
      setWidth(template.width || 1200);
      setHeight(template.height || 630);
      setFormat(template.format || "png");
      persistedSnapshotRef.current = JSON.stringify({
        name: template.name,
        description: template.description || "",
        jsx: template.jsx,
        variables: template.variables || [],
        googleFonts: template.googleFonts || [],
        width: template.width || 1200,
        height: template.height || 630,
        format: template.format || "png",
      });
      setInitialized(true);
    }
  }, [initialized, template]);

  useEffect(() => {
    return () => {
      previewControllerRef.current?.abort();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        jsx,
        variables,
        googleFonts,
        width,
        height,
        format,
      }),
    [description, format, googleFonts, height, jsx, name, variables, width]
  );

  const isOwner = !!template && template.userId === userId;
  const isDirty = isOwner && initialized && currentSnapshot !== persistedSnapshotRef.current;

  const normalizedPreviewValues = useMemo(() => {
    const resolved: Record<string, string | number> = {};
    for (const variable of variables) {
      const variableName = variable.name.trim();
      if (!variableName) continue;
      const previewValue = previewValues[variableName];
      if (previewValue !== undefined && previewValue !== "") {
        resolved[variableName] = previewValue;
        continue;
      }
      if (variable.defaultValue !== undefined && variable.defaultValue !== "") {
        resolved[variableName] = variable.defaultValue;
      }
    }
    return resolved;
  }, [previewValues, variables]);

  const handleSave = useCallback(async () => {
    if (!isOwner) return;
    setSaving(true);
    try {
      await updateTemplate({
        templateId,
        name: name.trim(),
        description: description.trim() || undefined,
        jsx,
        variables,
        googleFonts,
        width,
        height,
        format,
      });
      persistedSnapshotRef.current = currentSnapshot;
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }, [currentSnapshot, description, format, googleFonts, height, isOwner, jsx, name, templateId, updateTemplate, variables, width]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  const renderPreview = useCallback(async () => {
    if (!initialized) return;

    previewControllerRef.current?.abort();
    const controller = new AbortController();
    previewControllerRef.current = controller;
    const requestId = previewRequestIdRef.current + 1;
    previewRequestIdRef.current = requestId;

    setIsRenderingPreview(true);
    setPreviewError(null);

    try {
      const response = await fetch("/api/templates/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          jsx,
          variables,
          variableValues: normalizedPreviewValues,
          googleFonts,
          width,
          height,
          format,
        }),
        signal: controller.signal,
        cache: "no-store",
      });

      if (requestId !== previewRequestIdRef.current) return;

      if (!response.ok) {
        let message = "Preview render failed";
        try {
          const errorPayload = (await response.json()) as { message?: string };
          if (typeof errorPayload.message === "string" && errorPayload.message.length > 0) {
            message = errorPayload.message;
          }
        } catch {
          // keep default message
        }
        setPreviewError(message);
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      if (requestId !== previewRequestIdRef.current) {
        URL.revokeObjectURL(objectUrl);
        return;
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      previewUrlRef.current = objectUrl;
      setPreviewImageUrl(objectUrl);

      const renderMsHeader = response.headers.get("X-Render-Ms");
      const parsedRenderMs = renderMsHeader ? Number(renderMsHeader) : NaN;
      setPreviewRenderMs(Number.isFinite(parsedRenderMs) ? parsedRenderMs : null);
      setPreviewError(null);
    } catch (error) {
      if (requestId !== previewRequestIdRef.current) return;
      if (error instanceof Error && error.name === "AbortError") return;
      setPreviewError(error instanceof Error ? error.message : "Preview request failed");
    } finally {
      if (requestId === previewRequestIdRef.current) {
        setIsRenderingPreview(false);
      }
    }
  }, [format, googleFonts, height, initialized, jsx, normalizedPreviewValues, templateId, variables, width]);

  useEffect(() => {
    if (!initialized) return;
    const timer = setTimeout(() => {
      void renderPreview();
    }, 250);
    return () => clearTimeout(timer);
  }, [initialized, renderPreview]);

  const updateVariable = useCallback((index: number, updates: Partial<TemplateVariable>) => {
    setVariables((current) => current.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  }, []);

  const handleCopySnippet = useCallback(async () => {
    const lines = variables
      .map((variable) => {
        const value = previewValues[variable.name] || variable.defaultValue || "...";
        return `      "${variable.name}": "${value}"`;
      })
      .join(",\n");
    const snippet = `curl -X POST $API_URL/v1/image-url \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "width": ${width},
    "height": ${height},
    "format": "${format}",
    "variables": {
${lines}
    }
  }'`;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [format, height, previewValues, templateId, variables, width]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!draggingRef.current) return;
      const container = splitContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (orientation === "horizontal") {
        const nextRatio = ((event.clientX - rect.left) / rect.width) * 100;
        setSplitRatio(clamp(nextRatio, 20, 80));
      } else {
        const nextRatio = ((event.clientY - rect.top) / rect.height) * 100;
        setSplitRatio(clamp(nextRatio, 25, 75));
      }
    };

    const onUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [orientation]);

  if (template === undefined) {
    return (
      <div className="-m-4 flex h-[calc(100vh-57px)] items-center justify-center">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="mx-auto h-3 w-28" />
        </div>
      </div>
    );
  }

  if (template === null) {
    return (
      <div className="-m-4 flex h-[calc(100vh-57px)] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Template not found</p>
        <Link href="/templates">
          <Button variant="outline" size="sm">
            Back to templates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="-m-4 flex h-[calc(100vh-57px)] flex-col overflow-hidden">
      <div className="bg-background flex h-11 items-center justify-between border-b border-[var(--border)] px-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push("/templates")}>
            <span aria-hidden>←</span>
          </Button>
          <div className="h-4 w-px bg-[var(--border)]" />
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={!isOwner}
            className="max-w-[260px] min-w-0 truncate bg-transparent text-sm font-semibold outline-none disabled:opacity-60"
            placeholder="Template name"
          />
          <span className="text-muted-foreground hidden sm:inline">/</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={!isOwner}
            className="text-muted-foreground hidden min-w-0 flex-1 truncate bg-transparent text-xs outline-none disabled:opacity-60 sm:block"
            placeholder="Add description..."
          />
        </div>

        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600">Saved</span>}
          {isDirty && <span className="text-muted-foreground text-xs">Unsaved</span>}
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setInspectorOpen((open) => !open)}
          >
            {inspectorOpen ? "Hide Inspector" : "Show Inspector"}
          </Button>
          {isOwner && (
            <Button size="sm" className="h-7 px-3 text-xs" disabled={saving || !isDirty} onClick={() => void handleSave()}>
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1 p-3">
          <div
            ref={splitContainerRef}
            className="grid h-full min-h-0 w-full select-none"
            style={
              orientation === "horizontal"
                ? { gridTemplateColumns: `${splitRatio}% 8px ${100 - splitRatio}%` }
                : { gridTemplateRows: `${splitRatio}% 8px ${100 - splitRatio}%` }
            }
          >
            <div className="min-h-0 min-w-0">
              <TemplateCodeEditor
                jsx={jsx}
                readOnly={!isOwner}
                onJsxChange={setJsx}
              />
            </div>

            <div
              role="separator"
              aria-orientation={orientation}
              className={`bg-muted hover:bg-muted-foreground/20 cursor-col-resize ${
                orientation === "horizontal" ? "w-2" : "h-2 cursor-row-resize"
              }`}
              onMouseDown={() => {
                draggingRef.current = true;
              }}
            />

            <div className="min-h-0 min-w-0">
              <TemplatePreviewPane
                imageUrl={previewImageUrl}
                width={width}
                height={height}
                isRendering={isRenderingPreview}
                error={previewError}
                renderMs={previewRenderMs}
              />
            </div>
          </div>
        </div>

        {inspectorOpen && (
          <TemplateInspector
            templateId={templateId}
            variables={variables}
            previewValues={previewValues}
            googleFonts={googleFonts}
            width={width}
            height={height}
            format={format}
            readOnly={!isOwner}
            copied={copied}
            onCopySnippet={() => void handleCopySnippet()}
            onAddVariable={() => setVariables((current) => [...current, { name: "", defaultValue: "" }])}
            onRemoveVariable={(index) => setVariables((current) => current.filter((_, i) => i !== index))}
            onUpdateVariable={updateVariable}
            onUpdatePreviewValue={(variableName, value) =>
              setPreviewValues((current) => ({ ...current, [variableName]: value }))
            }
            onClearPreviewValue={(variableName) =>
              setPreviewValues((current) => {
                const next = { ...current };
                delete next[variableName];
                return next;
              })
            }
            onWidthChange={(next) => setWidth(clamp(Number.isFinite(next) ? next : 0, 1, 4096))}
            onHeightChange={(next) => setHeight(clamp(Number.isFinite(next) ? next : 0, 1, 4096))}
            onFormatChange={setFormat}
            onGoogleFontsChange={setGoogleFonts}
          />
        )}
      </div>
    </div>
  );
}
