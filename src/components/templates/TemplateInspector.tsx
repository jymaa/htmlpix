"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TemplateFormat, TemplateVariable } from "./types";

interface TemplateInspectorProps {
  templateId: string;
  variables: TemplateVariable[];
  previewValues: Record<string, string>;
  width: number;
  height: number;
  format: TemplateFormat;
  readOnly: boolean;
  copied: boolean;
  onCopySnippet: () => void;
  onAddVariable: () => void;
  onRemoveVariable: (index: number) => void;
  onUpdateVariable: (index: number, updates: Partial<TemplateVariable>) => void;
  onUpdatePreviewValue: (variableName: string, value: string) => void;
  onClearPreviewValue: (variableName: string) => void;
  onWidthChange: (next: number) => void;
  onHeightChange: (next: number) => void;
  onFormatChange: (next: TemplateFormat) => void;
}

function Section({
  title,
  children,
  defaultOpen = true,
  right,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  right?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)]">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((current) => !current);
          }
        }}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.08em] uppercase">{title}</span>
        <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
          {right}
          <span className="text-muted-foreground text-xs">{open ? "−" : "+"}</span>
        </div>
      </div>
      {open && <div className="space-y-3 px-3 pb-3">{children}</div>}
    </div>
  );
}

export function TemplateInspector({
  templateId,
  variables,
  previewValues,
  width,
  height,
  format,
  readOnly,
  copied,
  onCopySnippet,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
  onUpdatePreviewValue,
  onClearPreviewValue,
  onWidthChange,
  onHeightChange,
  onFormatChange,
}: TemplateInspectorProps) {
  const snippet = useMemo(() => {
    const variableLines = variables
      .map((v) => {
        const previewValue = previewValues[v.name];
        const value = previewValue || v.defaultValue || "...";
        return `      "${v.name}": "${value}"`;
      })
      .join(",\n");
    return `curl -X POST $API_URL/v1/image-url \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "templateId": "${templateId}",
    "width": ${width},
    "height": ${height},
    "format": "${format}",
    "variables": {
${variableLines}
    }
  }'`;
  }, [format, height, previewValues, templateId, variables, width]);

  return (
    <div className="bg-background flex h-full w-[320px] shrink-0 flex-col border-l border-[var(--border)]">
      <div className="flex h-10 items-center border-b border-[var(--border)] px-3 text-sm">Inspector</div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section
          title="Variables"
          right={
            !readOnly ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onAddVariable();
                }}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Add
              </button>
            ) : undefined
          }
        >
          {variables.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              No variables yet. Use <code>{"{{name}}"}</code> placeholders in HTML/CSS.
            </p>
          ) : (
            <div className="space-y-3">
              {variables.map((variable, index) => (
                <div key={`${variable.name}-${index}`} className="space-y-2 rounded border border-[var(--border)] p-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={variable.name}
                      onChange={(event) => onUpdateVariable(index, { name: event.target.value })}
                      disabled={readOnly}
                      className="h-7 text-xs"
                      placeholder="name"
                    />
                    <Select
                      value={variable.type}
                      onValueChange={(value) =>
                        onUpdateVariable(index, { type: value as "string" | "number" | "url" })
                      }
                      disabled={readOnly}
                    >
                      <SelectTrigger className="h-7 w-[92px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                      </SelectContent>
                    </Select>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => onRemoveVariable(index)}
                        className="text-muted-foreground hover:text-destructive text-xs"
                      >
                        Del
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-muted-foreground block text-[10px] tracking-wide uppercase">Default value</label>
                    <Input
                      value={variable.defaultValue ?? ""}
                      onChange={(event) => onUpdateVariable(index, { defaultValue: event.target.value })}
                      disabled={readOnly}
                      className="h-7 text-xs"
                      placeholder="Persisted default"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-muted-foreground block text-[10px] tracking-wide uppercase">Preview value</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={previewValues[variable.name] ?? ""}
                        onChange={(event) => onUpdatePreviewValue(variable.name, event.target.value)}
                        className="h-7 text-xs"
                        placeholder="Temporary preview override"
                      />
                      {(previewValues[variable.name] ?? "").length > 0 && (
                        <button
                          type="button"
                          onClick={() => onClearPreviewValue(variable.name)}
                          className="text-muted-foreground hover:text-foreground text-xs"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Render Options">
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <label className="text-muted-foreground block text-[10px] tracking-wide uppercase">Width</label>
              <Input
                type="number"
                min={1}
                max={4096}
                value={width}
                onChange={(event) => onWidthChange(Number(event.target.value))}
                disabled={readOnly}
                className="h-7 text-xs"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-muted-foreground block text-[10px] tracking-wide uppercase">Height</label>
              <Input
                type="number"
                min={1}
                max={4096}
                value={height}
                onChange={(event) => onHeightChange(Number(event.target.value))}
                disabled={readOnly}
                className="h-7 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-muted-foreground block text-[10px] tracking-wide uppercase">Format</label>
            <Select value={format} onValueChange={(value) => onFormatChange(value as TemplateFormat)} disabled={readOnly}>
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
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "OG", width: 1200, height: 630 },
              { label: "Square", width: 1080, height: 1080 },
              { label: "Twitter", width: 1200, height: 675 },
              { label: "Story", width: 1080, height: 1920 },
            ].map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                disabled={readOnly}
                className="h-6 px-2 text-[10px]"
                onClick={() => {
                  onWidthChange(preset.width);
                  onHeightChange(preset.height);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="API Usage" defaultOpen={false}>
          <div className="space-y-2">
            <pre className="max-h-[220px] overflow-auto rounded border border-[var(--border)] bg-[var(--muted)]/40 p-3 font-mono text-[10px] leading-relaxed">
              {snippet}
            </pre>
            <Button size="sm" variant="outline" className="h-7 w-full text-xs" onClick={onCopySnippet}>
              {copied ? "Copied" : "Copy snippet"}
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}
