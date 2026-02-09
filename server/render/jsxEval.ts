interface VNode {
  type: string;
  props: Record<string, unknown>;
}

interface ResolveResult {
  props: Record<string, string>;
  missing: string[];
}

interface TemplateVariableDefinition {
  name: string;
  defaultValue?: string;
}

function __h(type: string | Function, props: Record<string, unknown> | null, ...children: unknown[]): VNode {
  const flatChildren = children.flat(Infinity).filter((c) => c != null && c !== true && c !== false);
  const normalizedChildren = flatChildren.map((c) => (typeof c === "number" ? String(c) : c));
  const merged = { ...(props || {}) };

  if (normalizedChildren.length === 1) {
    merged.children = normalizedChildren[0];
  } else if (normalizedChildren.length > 1) {
    merged.children = normalizedChildren;
  }

  if (typeof type === "function") {
    return type(merged) as VNode;
  }

  return { type, props: merged };
}

function __Fragment(props: { children?: unknown }): unknown {
  return props.children;
}

const transpiler = new Bun.Transpiler({
  loader: "tsx",
  tsconfig: JSON.stringify({
    compilerOptions: {
      jsx: "react",
      jsxFactory: "__h",
      jsxFragmentFactory: "__Fragment",
    },
  }),
});

export function evalJsx(jsxBody: string, props: Record<string, string>): VNode {
  const transpiled = transpiler.transformSync(jsxBody);

  const fn = new Function("__h", "__Fragment", "props", transpiled);
  const result = fn(__h, __Fragment, props);

  if (!result || typeof result !== "object" || !("type" in result)) {
    throw new Error("JSX template must return a valid element");
  }

  return result as VNode;
}

export function resolveProps(
  variables: TemplateVariableDefinition[],
  provided: Record<string, string>
): ResolveResult {
  const props: Record<string, string> = {};
  const missing: string[] = [];

  for (const v of variables) {
    const val = provided[v.name] ?? v.defaultValue;
    if (val === undefined) {
      missing.push(v.name);
      continue;
    }
    props[v.name] = String(val);
  }

  return { props, missing };
}
