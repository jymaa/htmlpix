import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import {
  initCache,
  closeCache,
  clearApiKeys,
  clearQuotas,
  putApiKey,
  putQuota,
  getApiKey,
  getQuota,
  getCacheStats as getAuthCacheStats,
  setLastUpdate,
  type CachedApiKey,
  type CachedQuota,
} from "../cache/lmdb";

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  throw new Error("CONVEX_URL environment variable is required");
}

const client = new ConvexClient(CONVEX_URL);

let subscribed = false;

export function initConvexSync(): void {
  if (subscribed) return;

  initCache();

  client.onUpdate(api.sync.getAuthData, {}, (data) => {
    clearApiKeys();
    clearQuotas();

    for (const key of data.keys) {
      putApiKey(key.keyHash, key);
    }

    for (const quota of data.quotas) {
      putQuota(quota.userId, quota);
    }

    setLastUpdate(Date.now(), data.keys.length, data.quotas.length);
    console.log(
      `Synced auth data: ${data.keys.length} keys, ${data.quotas.length} quotas`
    );
  });

  subscribed = true;
  console.log("Convex sync initialized");
}

export interface AuthSuccess {
  valid: true;
  apiKey: CachedApiKey;
  quota: CachedQuota;
  usageThisMonth: number;
}

export interface AuthError {
  valid: false;
  code: "MISSING_KEY" | "INVALID_KEY" | "KEY_INACTIVE" | "QUOTA_EXCEEDED" | "NOT_READY";
  message: string;
}

export type AuthResult = AuthSuccess | AuthError;

function hashApiKey(key: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(key);
  return hasher.digest("hex");
}

export function validateApiKey(authHeader: string | null): AuthResult {
  const cacheStats = getCacheStats();
  if (cacheStats.lastUpdate === 0) {
    return { valid: false, code: "NOT_READY", message: "Auth system not ready yet" };
  }

  if (!authHeader) {
    return { valid: false, code: "MISSING_KEY", message: "Authorization header required" };
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return {
      valid: false,
      code: "MISSING_KEY",
      message: "Invalid Authorization header format. Use: Bearer <key>",
    };
  }

  const rawKey = match[1]!;
  const keyHash = hashApiKey(rawKey);

  const apiKey = getApiKey(keyHash);
  if (!apiKey) {
    return { valid: false, code: "INVALID_KEY", message: "Invalid API key" };
  }

  if (!apiKey.active) {
    return { valid: false, code: "KEY_INACTIVE", message: "API key is inactive" };
  }

  const quota = getQuota(apiKey.userId);
  if (!quota) {
    return { valid: false, code: "INVALID_KEY", message: "No quota found for user" };
  }

  if (quota.currentUsage >= quota.monthlyLimit) {
    return {
      valid: false,
      code: "QUOTA_EXCEEDED",
      message: `Monthly quota of ${quota.monthlyLimit} renders exceeded`,
    };
  }

  return {
    valid: true,
    apiKey,
    quota,
    usageThisMonth: quota.currentUsage,
  };
}

export function getConvexClient(): ConvexClient {
  return client;
}

export function getCacheStats(): { keys: number; quotas: number; lastUpdate: number } {
  return getAuthCacheStats();
}

export async function closeConvexClient(): Promise<void> {
  await client.close();
  closeCache();
}
