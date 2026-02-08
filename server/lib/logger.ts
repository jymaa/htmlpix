import { Axiom } from "@axiomhq/js";

const AXIOM_TOKEN = process.env.AXIOM_TOKEN;
const AXIOM_DATASET = process.env.AXIOM_DATASET;
const IS_PROD = process.env.NODE_ENV === "production";

const axiom =
  IS_PROD && AXIOM_TOKEN && AXIOM_DATASET ? new Axiom({ token: AXIOM_TOKEN }) : null;

type Fields = Record<string, unknown>;

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
    };
  }
  return { errorMessage: String(error) };
}

function resolveFields(fields?: Fields): Fields | undefined {
  if (!fields) return undefined;
  if ("error" in fields && fields.error != null) {
    const { error, ...rest } = fields;
    return { ...rest, ...serializeError(error) };
  }
  return fields;
}

function ingest(level: "info" | "warn" | "error", msg: string, fields?: Fields): void {
  if (!axiom || !AXIOM_DATASET) return;
  axiom.ingest(AXIOM_DATASET, { level, msg, ...fields, _time: new Date().toISOString() });
}

export interface Logger {
  debug(msg: string, fields?: Fields): void;
  info(msg: string, fields?: Fields): void;
  warn(msg: string, fields?: Fields): void;
  error(msg: string, fields?: Fields): void;
  flush(): Promise<void>;
  child(baseFields: Fields): Logger;
}

function createLogger(baseFields?: Fields): Logger {
  function merge(fields?: Fields): Fields | undefined {
    const resolved = resolveFields(fields);
    if (!baseFields && !resolved) return undefined;
    if (!baseFields) return resolved;
    if (!resolved) return baseFields;
    return { ...baseFields, ...resolved };
  }

  return {
    debug(msg: string, fields?: Fields): void {
      const merged = merge(fields);
      console.debug(msg, merged ? JSON.stringify(merged) : "");
      // debug is console-only, skip Axiom (high volume)
    },
    info(msg: string, fields?: Fields): void {
      const merged = merge(fields);
      console.log(msg, merged ? JSON.stringify(merged) : "");
      ingest("info", msg, merged);
    },
    warn(msg: string, fields?: Fields): void {
      const merged = merge(fields);
      console.warn(msg, merged ? JSON.stringify(merged) : "");
      ingest("warn", msg, merged);
    },
    error(msg: string, fields?: Fields): void {
      const merged = merge(fields);
      console.error(msg, merged ? JSON.stringify(merged) : "");
      ingest("error", msg, merged);
    },
    async flush(): Promise<void> {
      if (!axiom) return;
      await axiom.flush();
    },
    child(childFields: Fields): Logger {
      const combined = baseFields ? { ...baseFields, ...childFields } : childFields;
      return createLogger(combined);
    },
  };
}

export const logger: Logger = createLogger();
