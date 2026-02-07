import { open, type RootDatabase, type Database } from "lmdb";
import path from "node:path";
import type { Id } from "../../convex/_generated/dataModel";

export interface CachedApiKey {
  _id: Id<"apiKeys">;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  active: boolean;
  createdAt: number;
}

export interface CachedQuota {
  _id: Id<"quotas">;
  userId: string;
  plan: "free" | "starter" | "pro" | "scale";
  monthlyLimit: number;
  currentUsage: number;
  stripeSubscriptionStatus?: string;
  currentPeriodEnd?: number;
}

interface CacheMeta {
  lastUpdate: number;
  keysCount: number;
  quotasCount: number;
}

const DEFAULT_CACHE_PATH = path.resolve(import.meta.dir, "..", "cache", "lmdb");
const CACHE_PATH = process.env.CACHE_PATH || DEFAULT_CACHE_PATH;

let rootDb: RootDatabase | null = null;
let apiKeysDb: Database<CachedApiKey> | null = null;
let quotasDb: Database<CachedQuota> | null = null;
let metaDb: Database<CacheMeta> | null = null;

function ensureInit(): void {
  if (!rootDb || !apiKeysDb || !quotasDb || !metaDb) {
    throw new Error("LMDB cache not initialized. Call initCache() first.");
  }
}

export function initCache(): void {
  if (rootDb) return;

  rootDb = open({
    path: CACHE_PATH,
    maxDbs: 8,
    compression: true,
  });

  apiKeysDb = rootDb.openDB<CachedApiKey>({ name: "apiKeys", encoding: "json" });
  quotasDb = rootDb.openDB<CachedQuota>({ name: "quotas", encoding: "json" });
  metaDb = rootDb.openDB<CacheMeta>({ name: "meta", encoding: "json" });
}

export function closeCache(): void {
  if (!rootDb) return;
  rootDb.close();
  rootDb = null;
  apiKeysDb = null;
  quotasDb = null;
  metaDb = null;
}

function clearDb<T>(db: Database<T>): void {
  const anyDb = db as unknown as { clearSync?: () => void };
  if (typeof anyDb.clearSync === "function") {
    anyDb.clearSync();
    return;
  }

  for (const key of db.getKeys()) {
    db.remove(key as string);
  }
}

export function clearApiKeys(): void {
  ensureInit();
  clearDb(apiKeysDb!);
}

export function clearQuotas(): void {
  ensureInit();
  clearDb(quotasDb!);
}

export function putApiKey(keyHash: string, apiKey: CachedApiKey): void {
  ensureInit();
  apiKeysDb!.put(keyHash, apiKey);
}

export function getApiKey(keyHash: string): CachedApiKey | undefined {
  ensureInit();
  return apiKeysDb!.get(keyHash);
}

export function deleteApiKey(keyHash: string): void {
  ensureInit();
  apiKeysDb!.remove(keyHash);
}

export function putQuota(userId: string, quota: CachedQuota): void {
  ensureInit();
  quotasDb!.put(userId, quota);
}

export function getQuota(userId: string): CachedQuota | undefined {
  ensureInit();
  return quotasDb!.get(userId);
}

export function deleteQuota(userId: string): void {
  ensureInit();
  quotasDb!.remove(userId);
}

export function setMeta(meta: CacheMeta): void {
  ensureInit();
  metaDb!.put("cache", meta);
}

export function getMeta(): CacheMeta {
  ensureInit();
  return (
    metaDb!.get("cache") || {
      lastUpdate: 0,
      keysCount: 0,
      quotasCount: 0,
    }
  );
}

export function setLastUpdate(lastUpdate: number, keysCount: number, quotasCount: number): void {
  setMeta({ lastUpdate, keysCount, quotasCount });
}

export function getCacheStats(): { keys: number; quotas: number; lastUpdate: number } {
  const meta = getMeta();
  return {
    keys: meta.keysCount,
    quotas: meta.quotasCount,
    lastUpdate: meta.lastUpdate,
  };
}
