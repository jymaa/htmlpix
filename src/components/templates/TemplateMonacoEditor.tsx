"use client";

import { Editor, type BeforeMount } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";

interface TemplateMonacoEditorProps {
  value: string;
  language: string;
  readOnly: boolean;
  onChange: (nextValue: string) => void;
}

function createHighlighter() {
  return createHighlighterCore({
    themes: [import("shiki/themes/dark-plus.mjs")],
    langs: [import("shiki/langs/tsx.mjs")],
    engine: createOnigurumaEngine(import("shiki/wasm")),
    langAlias: {
      typescript: "tsx",
      typescriptreact: "tsx",
    },
  });
}

type GlobalThisWithShiki = typeof globalThis & {
  templateEditorShikiInstanceV2: ReturnType<typeof createHighlighter>;
};

(globalThis as GlobalThisWithShiki).templateEditorShikiInstanceV2 ??= createHighlighter();

const highlighter = (globalThis as GlobalThisWithShiki).templateEditorShikiInstanceV2;

const handleBeforeMount: BeforeMount = (monaco) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    jsx: monaco.languages.typescript.JsxEmit.React,
    jsxFactory: "__h",
    allowJs: true,
    allowNonTsExtensions: true,
    noEmit: true,
    strict: false,
    skipLibCheck: true,
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });

  void highlighter.then((shiki) => {
    shikiToMonaco(shiki, monaco);
    monaco.editor.setTheme("dark-plus");
  });
};

export default function TemplateMonacoEditor({
  value,
  language,
  readOnly,
  onChange,
}: TemplateMonacoEditorProps) {
  return (
    <Editor
      defaultLanguage="typescriptreact"
      width="100%"
      height="100%"
      language={language}
      theme="dark-plus"
      value={value}
      path="template.tsx"
      beforeMount={handleBeforeMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        readOnly,
        "semanticHighlighting.enabled": false,
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
