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
  api_key_id INTEGER NOT NULL,
  html_hash TEXT,
  options_json TEXT,
  status TEXT,
  error_message TEXT,
  queue_wait_ms INTEGER,
  render_ms INTEGER,
  screenshot_ms INTEGER,
  bytes_downloaded INTEGER,
  blocked_requests INTEGER,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
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

-- Usage tracking index
CREATE INDEX IF NOT EXISTS idx_renders_api_key_month ON renders(api_key_id, created_at);

-- Image cleanup index
CREATE INDEX IF NOT EXISTS idx_images_expires_at ON images(expires_at);
`;

export function runMigrations(db: Database): void {
  db.exec(SCHEMA);
}
