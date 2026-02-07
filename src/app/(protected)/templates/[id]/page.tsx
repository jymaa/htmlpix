"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api as _api } from "../../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

// TODO: Remove cast after running `convex dev` to regenerate types
const api = _api as any;
import { useParams, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Id } from "../../../../../convex/_generated/dataModel";

type Variable = {
  name: string;
  type: "string" | "number" | "url";
  defaultValue?: string;
};

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

  const addVariable = () => {
    setVariables((prev) => [
      ...prev,
      { name: "", type: "string", defaultValue: "" },
    ]);
  };

  const updateVariable = (index: number, updates: Partial<Variable>) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...updates } : v))
    );
  };

  const removeVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  };

  // Build preview HTML with variables interpolated using defaults
  const getPreviewHtml = () => {
    let previewHtml = html;
    let previewCss = css;
    for (const v of variables) {
      const value = v.defaultValue || v.name;
      const placeholder = `{{${v.name}}}`;
      previewHtml = previewHtml.split(placeholder).join(value);
      previewCss = previewCss.split(placeholder).join(value);
    }
    return `<!DOCTYPE html><html><head><style>${previewCss}</style></head><body>${previewHtml}</body></html>`;
  };

  if (template === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (template === null) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Template Not Found</h1>
        <p className="text-muted-foreground">
          This template doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link href="/templates">
          <Button variant="outline">Back to Templates</Button>
        </Link>
      </div>
    );
  }

  // Access check
  if (template.userId !== userId && !template.isPublic) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <Link href="/templates">
          <Button variant="outline">Back to Templates</Button>
        </Link>
      </div>
    );
  }

  const isOwner = template.userId === userId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isOwner}
              className="bg-transparent text-2xl font-bold focus:outline-none"
              placeholder="Template name"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isOwner}
              className="block w-full bg-transparent text-sm text-muted-foreground focus:outline-none"
              placeholder="Add a description..."
            />
          </div>
        </div>
        {isOwner && (
          <Button onClick={handleSave} disabled={saving} className="min-w-[100px]">
            {saving ? "Saving..." : saved ? "Saved!" : "Save"}
          </Button>
        )}
      </div>

      {/* Main editor layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Code editor */}
        <div className="space-y-4">
          <Card>
            <Tabs defaultValue="html">
              <CardHeader className="pb-0">
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <TabsContent value="html" className="mt-0">
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    disabled={!isOwner}
                    spellCheck={false}
                    className="h-[320px] w-full resize-none rounded-md border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="<div>Your HTML here. Use {{variableName}} for placeholders.</div>"
                  />
                </TabsContent>
                <TabsContent value="css" className="mt-0">
                  <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    disabled={!isOwner}
                    spellCheck={false}
                    className="h-[320px] w-full resize-none rounded-md border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="div { padding: 40px; }"
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Render options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Default Render Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    disabled={!isOwner}
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
                    disabled={!isOwner}
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
                    disabled={!isOwner}
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Variables + API snippet */}
        <div className="space-y-4">
          {/* Variables */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Variables
                </CardTitle>
                {isOwner && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addVariable}
                    className="font-mono text-xs"
                  >
                    + Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {variables.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No variables defined. Use{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {"{{name}}"}
                  </code>{" "}
                  in your HTML/CSS and add them here.
                </p>
              ) : (
                <div className="space-y-3">
                  {variables.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-end gap-2 border-b border-dashed pb-3 last:border-0"
                    >
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Name
                        </Label>
                        <Input
                          value={v.name}
                          onChange={(e) =>
                            updateVariable(i, { name: e.target.value })
                          }
                          disabled={!isOwner}
                          placeholder="variableName"
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="w-24 space-y-1">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Type
                        </Label>
                        <Select
                          value={v.type}
                          onValueChange={(val) =>
                            updateVariable(i, {
                              type: val as "string" | "number" | "url",
                            })
                          }
                          disabled={!isOwner}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="url">URL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Default
                        </Label>
                        <Input
                          value={v.defaultValue || ""}
                          onChange={(e) =>
                            updateVariable(i, {
                              defaultValue: e.target.value,
                            })
                          }
                          disabled={!isOwner}
                          placeholder="default value"
                          className="text-sm"
                        />
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => removeVariable(i)}
                          className="shrink-0 p-2 text-muted-foreground hover:text-destructive"
                          title="Remove variable"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Usage snippet */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                API Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-md bg-muted p-4 font-mono text-xs leading-relaxed">
                {`curl -X POST $API_URL/render \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "variables": {
${variables
  .map(
    (v) =>
      `      "${v.name}": "${v.defaultValue || "..."}"`
  )
  .join(",\n")}
    }
  }'`}
              </pre>
            </CardContent>
          </Card>

          {/* Live preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Preview
                </CardTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {width}x{height}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border bg-white">
                <iframe
                  srcDoc={getPreviewHtml()}
                  title="Template preview"
                  className="h-[200px] w-full"
                  sandbox="allow-same-origin"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
