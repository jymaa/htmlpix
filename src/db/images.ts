import { getDb } from "./index";

const IMAGE_TTL_MS = parseInt(process.env.IMAGE_TTL_MS || "3600000", 10); // 1 hour default

export interface StoredImage {
  id: string;
  buffer: Uint8Array;
  contentType: string;
  sizeBytes: number;
  expiresAt: number;
  createdAt: number;
}

export function storeImage(id: string, buffer: Uint8Array, contentType: string): void {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + Math.floor(IMAGE_TTL_MS / 1000);

  db.query(`
    INSERT INTO images (id, buffer, content_type, size_bytes, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      buffer = excluded.buffer,
      content_type = excluded.content_type,
      size_bytes = excluded.size_bytes,
      expires_at = excluded.expires_at
  `).run(id, buffer, contentType, buffer.byteLength, expiresAt, now);
}

export function getImage(id: string): { buffer: Uint8Array; contentType: string } | null {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);

  const row = db.query<{ buffer: Uint8Array; content_type: string; expires_at: number }, [string]>(
    "SELECT buffer, content_type, expires_at FROM images WHERE id = ?"
  ).get(id);

  if (!row) return null;

  // Check if expired
  if (row.expires_at < now) {
    deleteImage(id);
    return null;
  }

  return {
    buffer: row.buffer,
    contentType: row.content_type,
  };
}

export function deleteImage(id: string): boolean {
  const db = getDb();
  const result = db.query("DELETE FROM images WHERE id = ?").run(id);
  return result.changes > 0;
}

export function cleanupExpiredImages(): number {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  const result = db.query("DELETE FROM images WHERE expires_at < ?").run(now);
  return result.changes;
}

export function generateImageId(): string {
  return crypto.randomUUID();
}

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startImageCleanup(): void {
  if (cleanupInterval) return;
  // Cleanup every minute
  cleanupInterval = setInterval(() => {
    const deleted = cleanupExpiredImages();
    if (deleted > 0) {
      console.log(`Cleaned up ${deleted} expired images`);
    }
  }, 60000);
}

export function stopImageCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
