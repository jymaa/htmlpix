import { getDb } from "./index";
import type { RenderRequest } from "../validation";

export interface RenderRecord {
  id: string;
  apiKeyId: string;
  htmlHash: string;
  optionsJson: string;
  status: "success" | "error";
  errorMessage: string | null;
  queueWaitMs: number;
  renderMs: number;
  screenshotMs: number;
  bytesDownloaded: number;
  blockedRequests: number;
  createdAt: number;
}

export interface InsertRenderParams {
  id: string;
  apiKeyId: string;
  html: string;
  options: Omit<RenderRequest, "html">;
  status: "success" | "error";
  errorMessage?: string;
  stats: {
    queueWaitMs: number;
    renderMs: number;
    screenshotMs: number;
    bytesDownloaded: number;
    blockedRequests: number;
  };
}

function hashHtml(html: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(html);
  return hasher.digest("hex");
}

export function insertRender(params: InsertRenderParams): void {
  const db = getDb();
  const htmlHash = hashHtml(params.html);
  const optionsJson = JSON.stringify(params.options);

  db.query(`
    INSERT INTO renders (
      id, api_key_id, html_hash, options_json, status, error_message,
      queue_wait_ms, render_ms, screenshot_ms, bytes_downloaded, blocked_requests
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.id,
    params.apiKeyId,
    htmlHash,
    optionsJson,
    params.status,
    params.errorMessage || null,
    params.stats.queueWaitMs,
    params.stats.renderMs,
    params.stats.screenshotMs,
    params.stats.bytesDownloaded,
    params.stats.blockedRequests
  );
}

export function getRenderById(id: string): RenderRecord | null {
  const db = getDb();
  const row = db.query<
    {
      id: string;
      api_key_id: string;
      html_hash: string;
      options_json: string;
      status: string;
      error_message: string | null;
      queue_wait_ms: number;
      render_ms: number;
      screenshot_ms: number;
      bytes_downloaded: number;
      blocked_requests: number;
      created_at: number;
    },
    [string]
  >(`SELECT * FROM renders WHERE id = ?`).get(id);

  if (!row) return null;

  return {
    id: row.id,
    apiKeyId: row.api_key_id,
    htmlHash: row.html_hash,
    optionsJson: row.options_json,
    status: row.status as "success" | "error",
    errorMessage: row.error_message,
    queueWaitMs: row.queue_wait_ms,
    renderMs: row.render_ms,
    screenshotMs: row.screenshot_ms,
    bytesDownloaded: row.bytes_downloaded,
    blockedRequests: row.blocked_requests,
    createdAt: row.created_at,
  };
}
