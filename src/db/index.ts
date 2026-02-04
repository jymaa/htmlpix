import { Database } from "bun:sqlite";
import { runMigrations } from "./schema";

const DB_PATH = process.env.DB_PATH || "./data.db";

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return db;
}

export function hashApiKey(key: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(key);
  return hasher.digest("hex");
}

function seedApiKeys(db: Database): void {
  const apiKeysEnv = process.env.API_KEYS;
  if (!apiKeysEnv) {
    console.log("No API_KEYS env set, skipping seed");
    return;
  }

  // Format: key:name:monthly_limit,key2:name2:monthly_limit2
  const entries = apiKeysEnv.split(",").filter((e) => e.trim());

  const upsertStmt = db.prepare(`
    INSERT INTO api_keys (key, name, monthly_limit, active)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET
      name = excluded.name,
      monthly_limit = excluded.monthly_limit,
      active = 1
  `);

  for (const entry of entries) {
    const parts = entry.trim().split(":");
    if (parts.length < 1) continue;

    const rawKey = parts[0]!;
    const name = parts[1] || null;
    const monthlyLimit = parts[2] ? parseInt(parts[2], 10) : 1000;

    const hashedKey = hashApiKey(rawKey);
    upsertStmt.run(hashedKey, name, monthlyLimit);
    console.log(`Seeded API key: ${name || "(unnamed)"}`);
  }
}

export function initDb(): Database {
  if (db) return db;

  db = new Database(DB_PATH, { create: true });
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  runMigrations(db);
  seedApiKeys(db);

  console.log(`Database initialized at ${DB_PATH}`);
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
