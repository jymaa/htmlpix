import { Axiom } from "@axiomhq/js";

type Fields = Record<string, unknown>;

// Lazy-init Axiom so env vars are read at first use, not module load time.
// This avoids issues with bundlers inlining process.env or .env loading order.
let _axiom: Axiom | null | undefined;
let _dataset: string | undefined;

function getAxiom(): Axiom | null {
  if (_axiom === undefined) {
    const token = process.env.AXIOM_TOKEN;
    _dataset = process.env.AXIOM_DATASET;
    const isProd = process.env.NODE_ENV === "production";
    _axiom = isProd && token && _dataset ? new Axiom({ token }) : null;
    if (_axiom) {
      console.log(`[logger] Axiom initialized (dataset=${_dataset})`);
    }
  }
  return _axiom;
}

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
  const axiom = getAxiom();
  if (!axiom || !_dataset) return;
  axiom.ingest(_dataset, { level, msg, ...fields, _time: new Date().toISOString() });
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
      const axiom = getAxiom();
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
