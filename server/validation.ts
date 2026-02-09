export interface RenderRequest {
  html?: string;
  googleFonts?: string[];
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  background?: "transparent" | "white";
}

export interface ImageUrlMintRequest {
  templateId: string;
  width?: number;
  height?: number;
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  tv?: string;
  variables?: Record<string, string | number>;
}

export interface TemplatePreviewVariable {
  name: string;
  type: "string" | "number" | "url";
  defaultValue?: string;
}

export interface TemplatePreviewRenderRequest {
  html: string;
  css?: string;
  variables: TemplatePreviewVariable[];
  variableValues?: Record<string, string | number>;
  width: number;
  height: number;
  format: "png" | "jpeg" | "webp";
  quality?: number;
}

export interface SignedImageQueryParams {
  templateId: string;
  uid: string;
  exp: number;
  sig: string;
  width: number;
  height: number;
  format: "png" | "jpeg" | "webp";
  quality?: number;
  tv?: string;
  variables: Record<string, string>;
}

export interface ValidationError {
  code: string;
  message: string;
}

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;
const DEFAULT_FORMAT: "png" | "jpeg" | "webp" = "png";
const MAX_DIMENSION = 4096;
const IMAGE_FORMATS = new Set(["png", "jpeg", "webp"]);

function parseInteger(
  value: unknown,
  field: string,
  opts: { min: number; max: number; fallback?: number }
): number | ValidationError {
  if (value === undefined || value === null || value === "") {
    if (opts.fallback !== undefined) return opts.fallback;
    return { code: `MISSING_${field.toUpperCase()}`, message: `${field} is required` };
  }

  const numeric = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (!Number.isInteger(numeric) || numeric < opts.min || numeric > opts.max) {
    return {
      code: `INVALID_${field.toUpperCase()}`,
      message: `${field} must be an integer between ${opts.min} and ${opts.max}`,
    };
  }
  return numeric;
}

function parseFormat(value: unknown, fallback = DEFAULT_FORMAT): "png" | "jpeg" | "webp" | ValidationError {
  if (value === undefined || value === null || value === "") return fallback;
  const format = String(value).toLowerCase();
  if (!IMAGE_FORMATS.has(format)) {
    return { code: "INVALID_FORMAT", message: "format must be one of: png, jpeg, webp" };
  }
  return format as "png" | "jpeg" | "webp";
}

function parseQuality(value: unknown): number | undefined | ValidationError {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
    return { code: "INVALID_QUALITY", message: "quality must be an integer between 0 and 100" };
  }
  return parsed;
}

function parseRequiredFormat(value: unknown): "png" | "jpeg" | "webp" | ValidationError {
  if (value === undefined || value === null || value === "") {
    return { code: "MISSING_FORMAT", message: "format is required" };
  }
  return parseFormat(value);
}

export function validateImageUrlMintRequest(body: unknown): ImageUrlMintRequest | ValidationError {
  if (!body || typeof body !== "object") {
    return { code: "INVALID_BODY", message: "Request body must be a JSON object" };
  }

  const req = body as Record<string, unknown>;
  if (typeof req.templateId !== "string" || req.templateId.length === 0) {
    return { code: "MISSING_TEMPLATE_ID", message: "templateId is required" };
  }

  const width = parseInteger(req.width, "width", {
    min: 1,
    max: MAX_DIMENSION,
    fallback: DEFAULT_WIDTH,
  });
  if (isValidationError(width)) return width;

  const height = parseInteger(req.height, "height", {
    min: 1,
    max: MAX_DIMENSION,
    fallback: DEFAULT_HEIGHT,
  });
  if (isValidationError(height)) return height;

  const format = parseFormat(req.format);
  if (isValidationError(format)) return format;

  const quality = parseQuality(req.quality);
  if (isValidationError(quality)) return quality;

  if (req.variables !== undefined && (typeof req.variables !== "object" || req.variables === null || Array.isArray(req.variables))) {
    return { code: "INVALID_VARIABLES", message: "variables must be an object" };
  }

  if (req.tv !== undefined && typeof req.tv !== "string") {
    return { code: "INVALID_TV", message: "tv must be a string" };
  }

  return {
    templateId: req.templateId,
    width,
    height,
    format,
    quality,
    tv: req.tv as string | undefined,
    variables: req.variables as Record<string, string | number> | undefined,
  };
}

export function validateTemplatePreviewRenderRequest(body: unknown): TemplatePreviewRenderRequest | ValidationError {
  if (!body || typeof body !== "object") {
    return { code: "INVALID_BODY", message: "Request body must be a JSON object" };
  }

  const req = body as Record<string, unknown>;
  if (typeof req.html !== "string" || req.html.trim().length === 0) {
    return { code: "MISSING_HTML", message: "html is required" };
  }
  if (req.css !== undefined && typeof req.css !== "string") {
    return { code: "INVALID_CSS", message: "css must be a string" };
  }
  if (!Array.isArray(req.variables)) {
    return { code: "INVALID_VARIABLES", message: "variables must be an array" };
  }

  const parsedVariables: TemplatePreviewVariable[] = [];
  for (let idx = 0; idx < req.variables.length; idx += 1) {
    const variable = req.variables[idx];
    if (!variable || typeof variable !== "object" || Array.isArray(variable)) {
      return {
        code: "INVALID_VARIABLES",
        message: `variables[${idx}] must be an object`,
      };
    }
    const v = variable as Record<string, unknown>;
    if (typeof v.name !== "string" || v.name.trim().length === 0) {
      return {
        code: "INVALID_VARIABLES",
        message: `variables[${idx}].name must be a non-empty string`,
      };
    }
    if (v.type !== "string" && v.type !== "number" && v.type !== "url") {
      return {
        code: "INVALID_VARIABLES",
        message: `variables[${idx}].type must be string, number, or url`,
      };
    }
    if (v.defaultValue !== undefined && typeof v.defaultValue !== "string") {
      return {
        code: "INVALID_VARIABLES",
        message: `variables[${idx}].defaultValue must be a string`,
      };
    }
    parsedVariables.push({
      name: v.name,
      type: v.type,
      defaultValue: v.defaultValue as string | undefined,
    });
  }

  const width = parseInteger(req.width, "width", {
    min: 1,
    max: MAX_DIMENSION,
  });
  if (isValidationError(width)) return width;

  const height = parseInteger(req.height, "height", {
    min: 1,
    max: MAX_DIMENSION,
  });
  if (isValidationError(height)) return height;

  const format = parseRequiredFormat(req.format);
  if (isValidationError(format)) return format;

  const quality = parseQuality(req.quality);
  if (isValidationError(quality)) return quality;

  if (
    req.variableValues !== undefined &&
    (typeof req.variableValues !== "object" || req.variableValues === null || Array.isArray(req.variableValues))
  ) {
    return { code: "INVALID_VARIABLE_VALUES", message: "variableValues must be an object" };
  }

  const variableValues: Record<string, string | number> = {};
  for (const [key, value] of Object.entries((req.variableValues as Record<string, unknown>) || {})) {
    if (typeof value !== "string" && typeof value !== "number") {
      return {
        code: "INVALID_VARIABLE_VALUES",
        message: `variableValues.${key} must be a string or number`,
      };
    }
    variableValues[key] = value;
  }

  return {
    html: req.html,
    css: req.css as string | undefined,
    variables: parsedVariables,
    variableValues: Object.keys(variableValues).length > 0 ? variableValues : undefined,
    width,
    height,
    format,
    quality,
  };
}

export function parseSignedImageQuery(query: URLSearchParams): SignedImageQueryParams | ValidationError {
  const templateId = query.get("templateId");
  const uid = query.get("uid");
  const expRaw = query.get("exp");
  const sig = query.get("sig");

  if (!templateId) return { code: "MISSING_TEMPLATE_ID", message: "templateId is required" };
  if (!uid) return { code: "MISSING_UID", message: "uid is required" };
  if (!expRaw) return { code: "MISSING_EXP", message: "exp is required" };
  if (!sig) return { code: "MISSING_SIG", message: "sig is required" };

  const exp = Number.parseInt(expRaw, 10);
  if (!Number.isFinite(exp) || exp <= 0) {
    return { code: "INVALID_EXP", message: "exp must be a unix timestamp in milliseconds" };
  }

  const width = parseInteger(query.get("width"), "width", {
    min: 1,
    max: MAX_DIMENSION,
    fallback: DEFAULT_WIDTH,
  });
  if (isValidationError(width)) return width;

  const height = parseInteger(query.get("height"), "height", {
    min: 1,
    max: MAX_DIMENSION,
    fallback: DEFAULT_HEIGHT,
  });
  if (isValidationError(height)) return height;

  const format = parseFormat(query.get("format"));
  if (isValidationError(format)) return format;

  const quality = parseQuality(query.get("quality"));
  if (isValidationError(quality)) return quality;

  const variables: Record<string, string> = {};
  for (const [key, value] of query.entries()) {
    if (!key.startsWith("v_")) continue;
    const variableName = key.slice(2);
    if (!variableName) continue;
    variables[variableName] = value;
  }

  return {
    templateId,
    uid,
    exp,
    sig,
    width,
    height,
    format,
    quality,
    tv: query.get("tv") || undefined,
    variables,
  };
}

export function isValidationError(
  result:
    | ValidationError
    | ImageUrlMintRequest
    | TemplatePreviewRenderRequest
    | SignedImageQueryParams
    | number
    | string
    | undefined
): result is ValidationError {
  return !!result && typeof result === "object" && "code" in result && "message" in result;
}
