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
    themes: [import("shiki/themes/github-dark-default.mjs")],
    langs: [import("shiki/langs/tsx.mjs")],
    engine: createOnigurumaEngine(import("shiki/wasm")),
    langAlias: {
      typescript: "tsx",
    },
  });
}

type GlobalThis = typeof globalThis & {
  shikiInstance: ReturnType<typeof createHighlighter>;
};

(globalThis as GlobalThis).shikiInstance ??= createHighlighter();

const highlighter = await (globalThis as GlobalThis).shikiInstance;

const tailwindTypings = `
declare namespace React {
  interface HTMLAttributes<T> {
    tw?: string;
  }
}
`;

const handleBeforeMount: BeforeMount = (monaco) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    reactNamespace: "React",
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    typeRoots: ["node_modules/@types"],
  });

  monaco.languages.typescript.typescriptDefaults.setExtraLibs([
    {
      content: tailwindTypings,
      filePath: "file:///tw.d.ts",
    },
  ]);

  shikiToMonaco(highlighter, monaco);
};

export default function TemplateMonacoEditor({
  value,
  language,
  readOnly,
  onChange,
}: TemplateMonacoEditorProps) {
  return (
    <Editor
      defaultLanguage="typescript"
      width="100%"
      height="100%"
      language={language}
      theme="github-dark-default"
      value={value}
      path="template.tsx"
      beforeMount={handleBeforeMount}
      loading="Loading editor..."
      options={{
        wordWrap: "on",
        tabSize: 2,
        minimap: {
          enabled: false,
        },
        stickyScroll: {
          enabled: false,
        },
        scrollbar: {
          useShadows: false,
        },
        fontSize: 12,
        padding: {
          top: 8,
          bottom: 8,
        },
        readOnly,
        scrollBeyondLastLine: false,
      }}
      onChange={(next) => onChange(next ?? "")}
    />
  );
}
