"use client";

import dynamic from "next/dynamic";

const TemplateMonacoEditor = dynamic(() => import("./TemplateMonacoEditor"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">Loading editor...</div>
  ),
});

interface TemplateCodeEditorProps {
  jsx: string;
  readOnly: boolean;
  onJsxChange: (next: string) => void;
}

export function TemplateCodeEditor({
  jsx,
  readOnly,
  onJsxChange,
}: TemplateCodeEditorProps) {
  return (
    <div className="bg-background flex h-full min-h-0 flex-col border border-[var(--border)]">
      <div className="flex h-10 items-center justify-between border-b border-[var(--border)] px-3">
        <span className="text-sm font-medium">JSX Template</span>
        <span className="text-muted-foreground text-xs">TSX</span>
      </div>
      <div className="min-h-0 flex-1">
        <TemplateMonacoEditor value={jsx} language="typescriptreact" readOnly={readOnly} onChange={onJsxChange} />
      </div>
    </div>
  );
}
