/**
 * Build a Google Fonts CSS2 URL from font specifications.
 *
 * Accepts formats like:
 * - "Inter"
 * - "Inter:wght@400;600"
 * - "Roboto Mono:wght@400"
 */
export function buildGoogleFontsUrl(fonts: string[]): string {
  if (fonts.length === 0) return "";

  const families = fonts.map((font) => {
    // URL-encode the font specification
    // Replace spaces with + for the URL
    return `family=${encodeURIComponent(font).replace(/%20/g, "+")}`;
  });

  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

/**
 * Generate the HTML head injection for Google Fonts.
 */
export function getGoogleFontsHeadInjection(fonts: string[]): string {
  if (fonts.length === 0) return "";

  const cssUrl = buildGoogleFontsUrl(fonts);

  return `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${cssUrl}">`;
}

/**
 * Inject Google Fonts links into HTML.
 * Inserts before </head> or at the start of the document.
 */
export function injectGoogleFonts(html: string, fonts: string[]): string {
  if (fonts.length === 0) return html;

  const injection = getGoogleFontsHeadInjection(fonts);

  // Try to inject before </head>
  const headCloseIndex = html.toLowerCase().indexOf("</head>");
  if (headCloseIndex !== -1) {
    return html.slice(0, headCloseIndex) + injection + "\n" + html.slice(headCloseIndex);
  }

  // Try to inject after <head>
  const headOpenMatch = html.match(/<head[^>]*>/i);
  if (headOpenMatch && headOpenMatch.index !== undefined) {
    const insertPos = headOpenMatch.index + headOpenMatch[0].length;
    return html.slice(0, insertPos) + "\n" + injection + html.slice(insertPos);
  }

  // Fallback: prepend to document
  return injection + "\n" + html;
}
