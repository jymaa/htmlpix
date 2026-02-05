import { getDb, hashApiKey } from "./index";

export interface ApiKey {
  id: number;
  key: string;
  name: string | null;
  monthlyLimit: number;
  active: boolean;
  createdAt: number;
}

export interface ApiKeyValidation {
  valid: true;
  apiKey: ApiKey;
  usageThisMonth: number;
}

export interface ApiKeyError {
  valid: false;
  code: "MISSING_KEY" | "INVALID_KEY" | "KEY_INACTIVE" | "QUOTA_EXCEEDED";
  message: string;
}

export type ApiKeyResult = ApiKeyValidation | ApiKeyError;

function getMonthStart(): number {
  const now = new Date();
  return Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
}

export function validateApiKey(authHeader: string | null): ApiKeyResult {
  if (!authHeader) {
    return { valid: false, code: "MISSING_KEY", message: "Authorization header required" };
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { valid: false, code: "MISSING_KEY", message: "Invalid Authorization header format. Use: Bearer <key>" };
  }

  const rawKey = match[1]!;
  const hashedKey = hashApiKey(rawKey);

  const db = getDb();
  const row = db.query<
    { id: number; key: string; name: string | null; monthly_limit: number; active: number; created_at: number },
    [string]
  >("SELECT id, key, name, monthly_limit, active, created_at FROM api_keys WHERE key = ?").get(hashedKey);

  if (!row) {
    return { valid: false, code: "INVALID_KEY", message: "Invalid API key" };
  }

  if (!row.active) {
    return { valid: false, code: "KEY_INACTIVE", message: "API key is inactive" };
  }

  const apiKey: ApiKey = {
    id: row.id,
    key: row.key,
    name: row.name,
    monthlyLimit: row.monthly_limit,
    active: row.active === 1,
    createdAt: row.created_at,
  };

  // Check monthly usage
  const monthStart = getMonthStart();
  const usageRow = db.query<{ count: number }, [number, number]>(
    "SELECT COUNT(*) as count FROM renders WHERE api_key_id = ? AND created_at >= ?"
  ).get(apiKey.id, monthStart);

  const usageThisMonth = usageRow?.count || 0;

  if (usageThisMonth >= apiKey.monthlyLimit) {
    return { valid: false, code: "QUOTA_EXCEEDED", message: `Monthly quota of ${apiKey.monthlyLimit} renders exceeded` };
  }

  return { valid: true, apiKey, usageThisMonth };
}

export function getApiKeyById(id: number): ApiKey | null {
  const db = getDb();
  const row = db.query<
    { id: number; key: string; name: string | null; monthly_limit: number; active: number; created_at: number },
    [number]
  >("SELECT id, key, name, monthly_limit, active, created_at FROM api_keys WHERE id = ?").get(id);

  if (!row) return null;

  return {
    id: row.id,
    key: row.key,
    name: row.name,
    monthlyLimit: row.monthly_limit,
    active: row.active === 1,
    createdAt: row.created_at,
  };
}
