import { Database } from "bun:sqlite";

export const SCHEMA = `
-- API keys seeded from env
CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT,
  monthly_limit INTEGER DEFAULT 1000,
  active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Render history + stats
CREATE TABLE IF NOT EXISTS renders (
  id TEXT PRIMARY KEY,
  api_key_id TEXT NOT NULL,
  html_hash TEXT,
  options_json TEXT,
  status TEXT,
  error_message TEXT,
  queue_wait_ms INTEGER,
  render_ms INTEGER,
  screenshot_ms INTEGER,
  bytes_downloaded INTEGER,
  blocked_requests INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Image blobs
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  buffer BLOB NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER,
  expires_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Usage tracking index (local fallback)
CREATE INDEX IF NOT EXISTS idx_renders_created_at ON renders(created_at);

-- Image cleanup index
CREATE INDEX IF NOT EXISTS idx_images_expires_at ON images(expires_at);
`;

export function runMigrations(db: Database): void {
  db.exec(SCHEMA);

  // Migration: Convert renders.api_key_id from INTEGER to TEXT (for Convex IDs)
  // Check if api_key_id is INTEGER type and migrate if needed
  const tableInfo = db.query<{ name: string; type: string }, []>(
    "PRAGMA table_info(renders)"
  ).all();

  const apiKeyCol = tableInfo.find((col) => col.name === "api_key_id");
  if (apiKeyCol && apiKeyCol.type === "INTEGER") {
    console.log("Migrating renders table: api_key_id INTEGER -> TEXT...");
    db.exec(`
      -- Create new table with TEXT api_key_id and no FK
      CREATE TABLE renders_new (
        id TEXT PRIMARY KEY,
        api_key_id TEXT NOT NULL,
        html_hash TEXT,
        options_json TEXT,
        status TEXT,
        error_message TEXT,
        queue_wait_ms INTEGER,
        render_ms INTEGER,
        screenshot_ms INTEGER,
        bytes_downloaded INTEGER,
        blocked_requests INTEGER,
        created_at INTEGER DEFAULT (unixepoch())
      );

      -- Copy data (converting INTEGER to TEXT)
      INSERT INTO renders_new SELECT
        id, CAST(api_key_id AS TEXT), html_hash, options_json, status, error_message,
        queue_wait_ms, render_ms, screenshot_ms, bytes_downloaded, blocked_requests, created_at
      FROM renders;

      -- Swap tables
      DROP TABLE renders;
      ALTER TABLE renders_new RENAME TO renders;

      -- Recreate index
      CREATE INDEX IF NOT EXISTS idx_renders_created_at ON renders(created_at);
    `);
    console.log("Migration complete.");
  }
}
