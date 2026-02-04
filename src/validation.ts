export interface RenderRequest {
  html: string;
  css?: string;
  googleFonts?: string[];
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  fullPage?: boolean;
  timeoutMs?: number;
  background?: "transparent" | "white";
}

export interface ValidationError {
  code: string;
  message: string;
}

const MAX_HTML_LENGTH = parseInt(process.env.MAX_HTML_LENGTH || "500000", 10);
const MAX_CSS_LENGTH = parseInt(process.env.MAX_CSS_LENGTH || "200000", 10);
const MAX_GOOGLE_FONTS = 20;

export function validateRenderRequest(body: unknown): RenderRequest | ValidationError {
  if (!body || typeof body !== "object") {
    return { code: "INVALID_BODY", message: "Request body must be a JSON object" };
  }

  const req = body as Record<string, unknown>;

  // html - required
  if (typeof req.html !== "string" || req.html.length === 0) {
    return { code: "MISSING_HTML", message: "html field is required and must be a non-empty string" };
  }
  if (req.html.length > MAX_HTML_LENGTH) {
    return { code: "HTML_TOO_LARGE", message: `html exceeds max length of ${MAX_HTML_LENGTH}` };
  }

  // css - optional
  if (req.css !== undefined && typeof req.css !== "string") {
    return { code: "INVALID_CSS", message: "css must be a string" };
  }
  if (typeof req.css === "string" && req.css.length > MAX_CSS_LENGTH) {
    return { code: "CSS_TOO_LARGE", message: `css exceeds max length of ${MAX_CSS_LENGTH}` };
  }

  // googleFonts - optional array of strings
  if (req.googleFonts !== undefined) {
    if (!Array.isArray(req.googleFonts)) {
      return { code: "INVALID_GOOGLE_FONTS", message: "googleFonts must be an array" };
    }
    if (req.googleFonts.length > MAX_GOOGLE_FONTS) {
      return { code: "TOO_MANY_FONTS", message: `googleFonts exceeds max of ${MAX_GOOGLE_FONTS}` };
    }
    for (const font of req.googleFonts) {
      if (typeof font !== "string" || font.length === 0) {
        return { code: "INVALID_FONT", message: "Each googleFonts entry must be a non-empty string" };
      }
    }
  }

  // width - optional positive integer
  if (req.width !== undefined) {
    if (typeof req.width !== "number" || !Number.isInteger(req.width) || req.width < 1 || req.width > 4096) {
      return { code: "INVALID_WIDTH", message: "width must be an integer between 1 and 4096" };
    }
  }

  // height - optional positive integer
  if (req.height !== undefined) {
    if (typeof req.height !== "number" || !Number.isInteger(req.height) || req.height < 1 || req.height > 4096) {
      return { code: "INVALID_HEIGHT", message: "height must be an integer between 1 and 4096" };
    }
  }

  // deviceScaleFactor - optional 0.5-4
  if (req.deviceScaleFactor !== undefined) {
    if (typeof req.deviceScaleFactor !== "number" || req.deviceScaleFactor < 0.5 || req.deviceScaleFactor > 4) {
      return { code: "INVALID_SCALE", message: "deviceScaleFactor must be between 0.5 and 4" };
    }
  }

  // format
  if (req.format !== undefined) {
    if (!["png", "jpeg", "webp"].includes(req.format as string)) {
      return { code: "INVALID_FORMAT", message: "format must be png, jpeg, or webp" };
    }
  }

  // quality - only for jpeg/webp
  if (req.quality !== undefined) {
    if (typeof req.quality !== "number" || req.quality < 0 || req.quality > 100) {
      return { code: "INVALID_QUALITY", message: "quality must be between 0 and 100" };
    }
  }

  // fullPage
  if (req.fullPage !== undefined && typeof req.fullPage !== "boolean") {
    return { code: "INVALID_FULLPAGE", message: "fullPage must be a boolean" };
  }

  // timeoutMs
  if (req.timeoutMs !== undefined) {
    if (typeof req.timeoutMs !== "number" || req.timeoutMs < 100 || req.timeoutMs > 60000) {
      return { code: "INVALID_TIMEOUT", message: "timeoutMs must be between 100 and 60000" };
    }
  }

  // background
  if (req.background !== undefined) {
    if (!["transparent", "white"].includes(req.background as string)) {
      return { code: "INVALID_BACKGROUND", message: "background must be transparent or white" };
    }
  }

  return {
    html: req.html as string,
    css: req.css as string | undefined,
    googleFonts: req.googleFonts as string[] | undefined,
    width: req.width as number | undefined,
    height: req.height as number | undefined,
    deviceScaleFactor: req.deviceScaleFactor as number | undefined,
    format: req.format as "png" | "jpeg" | "webp" | undefined,
    quality: req.quality as number | undefined,
    fullPage: req.fullPage as boolean | undefined,
    timeoutMs: req.timeoutMs as number | undefined,
    background: req.background as "transparent" | "white" | undefined,
  };
}

export function isValidationError(result: RenderRequest | ValidationError): result is ValidationError {
  return "code" in result && "message" in result && !("html" in result);
}
