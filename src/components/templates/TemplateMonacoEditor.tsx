"use client";

import { Editor } from "@monaco-editor/react";

interface TemplateMonacoEditorProps {
  value: string;
  language: "html" | "css";
  readOnly: boolean;
  onChange: (nextValue: string) => void;
}

export default function TemplateMonacoEditor({
  value,
  language,
  readOnly,
  onChange,
}: TemplateMonacoEditorProps) {
  return (
    <Editor
      width="100%"
      height="100%"
      language={language}
      theme="vs-dark"
      value={value}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        readOnly,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
      }}
      onChange={(next) => onChange(next ?? "")}
    />
  );
}
