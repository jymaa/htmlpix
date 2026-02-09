export interface TemplateVariableDefinition {
  name: string;
  defaultValue?: string;
}

export interface InterpolatableTemplate {
  html: string;
  css?: string;
  variables: TemplateVariableDefinition[];
}

export function injectStyleIntoHtml(html: string, css: string): string {
  const trimmed = css.trim();
  if (!trimmed) return html;
  const styleTag = `<style>${trimmed}</style>`;
  const headCloseIndex = html.toLowerCase().indexOf("</head>");
  if (headCloseIndex !== -1) {
    return html.slice(0, headCloseIndex) + styleTag + "\n" + html.slice(headCloseIndex);
  }
  return `${styleTag}\n${html}`;
}

export function resolveTemplateVariables(
  template: InterpolatableTemplate,
  provided: Record<string, string>
): { values: Record<string, string>; missing: string[] } {
  const values: Record<string, string> = {};
  const missing: string[] = [];

  for (const tmplVar of template.variables) {
    const val = provided[tmplVar.name] ?? tmplVar.defaultValue;
    if (val === undefined) {
      missing.push(tmplVar.name);
      continue;
    }
    values[tmplVar.name] = String(val);
  }

  return { values, missing };
}

export function interpolateTemplate(template: InterpolatableTemplate, values: Record<string, string>): string {
  let html = template.html;
  let css = template.css || "";

  for (const [name, value] of Object.entries(values)) {
    const placeholder = `{{${name}}}`;
    html = html.split(placeholder).join(value);
    css = css.split(placeholder).join(value);
  }

  return injectStyleIntoHtml(html, css);
}
