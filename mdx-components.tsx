import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createHeading(level: 1 | 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  const sizes = {
    1: "text-4xl font-bold mb-6",
    2: "text-2xl font-semibold mb-4 mt-10",
    3: "text-lg font-medium mb-3 mt-6",
    4: "text-base font-medium mb-2 mt-4",
  };

  return function Heading({ children }: { children?: React.ReactNode }) {
    const text = typeof children === "string" ? children : "";
    const id = slugify(text);
    return (
      <Tag id={id} className={`${sizes[level]} scroll-mt-20 group`}>
        {children}
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground"
          aria-label={`Link to ${text}`}
        >
          #
        </a>
      </Tag>
    );
  };
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    p: ({ children }) => (
      <p className="text-muted-foreground mb-4 leading-7">{children}</p>
    ),
    a: ({ href, children }) => (
      <Link href={href || "#"} className="text-primary hover:underline">
        {children}
      </Link>
    ),
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    ),
    pre: async ({ children }) => {
      const codeElement = children as React.ReactElement<{
        children?: string;
        className?: string;
      }>;
      const code = codeElement?.props?.children?.trim() || "";
      const className = codeElement?.props?.className || "";
      const language = className.replace("language-", "") || "text";
      return <CodeBlock code={code} language={language} />;
    },
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6 rounded-lg border" {...props}>
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-muted/50" {...props}>{children}</thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y" {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="border-b last:border-0" {...props}>{children}</tr>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-3 text-left font-medium" {...props}>{children}</th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-muted-foreground" {...props}>{children}</td>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted-foreground" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
        {children}
      </blockquote>
    ),
    // Expose UI components for use in MDX
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    CodeBlock,
    ...components,
  };
}
