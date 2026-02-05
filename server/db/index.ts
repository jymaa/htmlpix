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

// API keys are now managed through Convex - local SQLite is only for render history fallback

export function initDb(): Database {
  if (db) return db;

  db = new Database(DB_PATH, { create: true });
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  runMigrations(db);

  console.log(`Database initialized at ${DB_PATH}`);
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
