export interface BuildRenderHtmlOptions {
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
  const families = fonts.map((font) => {
    // Split on first ":" to separate font name from variant spec (e.g. ":wght@400;700")
    // Only the font name needs URL encoding; variant syntax (:, @, ;) must stay literal
    const colonIdx = font.indexOf(":");
    if (colonIdx === -1) {
      return `family=${encodeURIComponent(font).replace(/%20/g, "+")}`;
    }
    const name = font.slice(0, colonIdx);
    const variant = font.slice(colonIdx);
    return `family=${encodeURIComponent(name).replace(/%20/g, "+")}${variant}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=block`;
}

function injectGoogleFonts(html: string, fonts: string[]): string {
  if (fonts.length === 0) return html;

  const cssUrl = buildGoogleFontsUrl(fonts);
  const injection = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${cssUrl}">
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

  // Inject Tailwind CDN so preview iframes can render Tailwind utility classes
  result = injectBeforeHeadClose(result, `<script src="https://cdn.tailwindcss.com"></script>`);

  if (options.background !== "transparent") {
    result = injectBeforeHeadClose(result, `<style>html, body { margin: 0; padding: 0; background-color: white; }</style>`);
  }

  if (options.googleFonts && options.googleFonts.length > 0) {
    result = injectGoogleFonts(result, options.googleFonts);
  }

  return result;
}
