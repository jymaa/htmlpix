export interface BuildRenderHtmlOptions {
  css?: string;
  googleFonts?: string[];
  background?: "transparent" | "white";
}

function injectBeforeHeadClose(html: string, injection: string): string {
  const headCloseIndex = html.toLowerCase().indexOf("</head>");
  if (headCloseIndex !== -1) {
    return html.slice(0, headCloseIndex) + injection + "\n" + html.slice(headCloseIndex);
  }
  return injection + "\n" + html;
}

function buildGoogleFontsUrl(fonts: string[]): string {
  if (fonts.length === 0) return "";
  const families = fonts.map((font) => `family=${encodeURIComponent(font).replace(/%20/g, "+")}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

function injectGoogleFonts(html: string, fonts: string[]): string {
  if (fonts.length === 0) return html;

  const cssUrl = buildGoogleFontsUrl(fonts);
  const injection = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${cssUrl}">`;

  const headCloseIndex = html.toLowerCase().indexOf("</head>");
  if (headCloseIndex !== -1) {
    return html.slice(0, headCloseIndex) + injection + "\n" + html.slice(headCloseIndex);
  }

  const headOpenMatch = html.match(/<head[^>]*>/i);
  if (headOpenMatch && headOpenMatch.index !== undefined) {
    const insertPos = headOpenMatch.index + headOpenMatch[0].length;
    return html.slice(0, insertPos) + "\n" + injection + html.slice(insertPos);
  }

  return injection + "\n" + html;
}

export function buildRenderHtml(html: string, options: BuildRenderHtmlOptions = {}): string {
  let result = html;

  if (options.background !== "transparent") {
    result = injectBeforeHeadClose(result, `<style>html, body { margin: 0; padding: 0; background-color: white; }</style>`);
  }

  if (options.css) {
    result = injectBeforeHeadClose(result, `<style>${options.css}</style>`);
  }

  if (options.googleFonts && options.googleFonts.length > 0) {
    result = injectGoogleFonts(result, options.googleFonts);
  }

  return result;
}
