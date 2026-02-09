"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TemplateMonacoEditor = dynamic(() => import("./TemplateMonacoEditor"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">Loading editor...</div>
  ),
});

interface TemplateCodeEditorProps {
  html: string;
  css: string;
  activeTab: "html" | "css";
  readOnly: boolean;
  onActiveTabChange: (tab: "html" | "css") => void;
  onHtmlChange: (next: string) => void;
  onCssChange: (next: string) => void;
}

export function TemplateCodeEditor({
  html,
  css,
  activeTab,
  readOnly,
  onActiveTabChange,
  onHtmlChange,
  onCssChange,
}: TemplateCodeEditorProps) {
  return (
    <div className="bg-background flex h-full min-h-0 flex-col border border-[var(--border)]">
      <div className="flex h-10 items-center justify-between border-b border-[var(--border)] px-3">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onActiveTabChange(value as "html" | "css")}
          className="h-full"
        >
          <TabsList className="h-8">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="text-muted-foreground text-xs">Monaco</span>
      </div>
      <div className="min-h-0 flex-1">
        {activeTab === "html" ? (
          <TemplateMonacoEditor value={html} language="html" readOnly={readOnly} onChange={onHtmlChange} />
        ) : (
          <TemplateMonacoEditor value={css} language="css" readOnly={readOnly} onChange={onCssChange} />
        )}
      </div>
    </div>
  );
}
