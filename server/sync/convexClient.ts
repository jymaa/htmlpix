import { ConvexClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  throw new Error("CONVEX_URL environment variable is required");
}

const client = new ConvexClient(CONVEX_URL);

interface CachedApiKey {
  _id: Id<"apiKeys">;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  active: boolean;
  createdAt: number;
}

interface CachedQuota {
  _id: Id<"quotas">;
  userId: string;
  plan: "free" | "pro" | "enterprise";
  monthlyLimit: number;
  currentUsage: number;
}

interface AuthCache {
  keys: Map<string, CachedApiKey>;
  quotas: Map<string, CachedQuota>;
  lastUpdate: number;
}

let authCache: AuthCache = {
  keys: new Map(),
  quotas: new Map(),
  lastUpdate: 0,
};

let subscribed = false;

export function initConvexSync(): void {
  if (subscribed) return;

  client.onUpdate(api.sync.getAuthData, {}, (data) => {
    authCache.keys.clear();
    authCache.quotas.clear();

    for (const key of data.keys) {
      authCache.keys.set(key.keyHash, key as CachedApiKey);
    }

    for (const quota of data.quotas) {
      authCache.quotas.set(quota.userId, quota as CachedQuota);
    }

    authCache.lastUpdate = Date.now();
    console.log(
      `Synced auth data: ${authCache.keys.size} keys, ${authCache.quotas.size} quotas`
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
  if (authCache.lastUpdate === 0) {
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

  const apiKey = authCache.keys.get(keyHash);
  if (!apiKey) {
    return { valid: false, code: "INVALID_KEY", message: "Invalid API key" };
  }

  if (!apiKey.active) {
    return { valid: false, code: "KEY_INACTIVE", message: "API key is inactive" };
  }

  const quota = authCache.quotas.get(apiKey.userId);
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
  return {
    keys: authCache.keys.size,
    quotas: authCache.quotas.size,
    lastUpdate: authCache.lastUpdate,
  };
}

export async function closeConvexClient(): Promise<void> {
  await client.close();
}
