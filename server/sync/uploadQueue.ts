import { getConvexClient } from "./convexClient";
import { api } from "../../convex/_generated/api";
import { logger } from "../lib/logger";

const UPLOAD_CONCURRENCY = parseInt(process.env.UPLOAD_CONCURRENCY || "2", 10);
const UPLOAD_RETRY_MAX = parseInt(process.env.UPLOAD_RETRY_MAX || "5", 10);
const UPLOAD_RETRY_BASE_MS = parseInt(process.env.UPLOAD_RETRY_BASE_MS || "500", 10);
const UPLOAD_RETRY_MAX_MS = parseInt(process.env.UPLOAD_RETRY_MAX_MS || "60000", 10);
const LINK_RETRY_MAX = parseInt(process.env.LINK_RETRY_MAX || String(UPLOAD_RETRY_MAX), 10);
const LINK_RETRY_BASE_MS = parseInt(
  process.env.LINK_RETRY_BASE_MS || String(UPLOAD_RETRY_BASE_MS),
  10
);
const LINK_RETRY_MAX_MS = parseInt(
  process.env.LINK_RETRY_MAX_MS || String(UPLOAD_RETRY_MAX_MS),
  10
);

interface UploadTask {
  renderId: string;
  contentType: string;
  buffer: Uint8Array;
  imageKey: string;
  attempts: number;
}

const queue: UploadTask[] = [];
let activeUploads = 0;

export function queueImageUpload(task: Omit<UploadTask, "attempts">): void {
  queue.push({ ...task, attempts: 0 });
  processQueue();
}

function processQueue(): void {
  while (activeUploads < UPLOAD_CONCURRENCY && queue.length > 0) {
    const next = queue.shift();
    if (!next) return;
    void runUpload(next);
  }
}

async function runUpload(task: UploadTask): Promise<void> {
  activeUploads++;
  try {
    const client = getConvexClient();
    const base64Data = Buffer.from(task.buffer).toString("base64");
    const result = await client.action(api.images.uploadImage, {
      renderId: task.renderId,
      contentType: task.contentType,
      base64Data,
      imageKey: task.imageKey,
    });

    logger.debug("upload.success", { renderId: task.renderId });

    if (!result.linked) {
      scheduleLinkRetry(task.renderId, task.imageKey, 0);
    }
  } catch (error) {
    scheduleUploadRetry(task, error);
  } finally {
    activeUploads--;
    processQueue();
  }
}

function scheduleUploadRetry(task: UploadTask, error: unknown): void {
  if (task.attempts >= UPLOAD_RETRY_MAX) {
    logger.error("upload.failed_permanently", { renderId: task.renderId, attempts: task.attempts, error });
    return;
  }

  const delay = Math.min(UPLOAD_RETRY_BASE_MS * 2 ** task.attempts, UPLOAD_RETRY_MAX_MS);
  const nextAttempt = task.attempts + 1;
  logger.warn("upload.retry", { renderId: task.renderId, attempt: nextAttempt, delayMs: delay, error });

  const nextTask = { ...task, attempts: nextAttempt };

  setTimeout(() => {
    queue.push(nextTask);
    processQueue();
  }, delay);
}

function scheduleLinkRetry(renderId: string, imageKey: string, attempt: number): void {
  if (attempt >= LINK_RETRY_MAX) {
    logger.error("link.failed_permanently", { renderId, attempts: attempt });
    return;
  }
  const delay = Math.min(LINK_RETRY_BASE_MS * 2 ** attempt, LINK_RETRY_MAX_MS);
  if (attempt > 0) {
    logger.warn("link.retry", { renderId, attempt: attempt + 1, delayMs: delay });
  }
  setTimeout(() => {
    void runLink(renderId, imageKey, attempt);
  }, delay);
}

async function runLink(renderId: string, imageKey: string, attempt: number): Promise<void> {
  try {
    const client = getConvexClient();
    const linked = await client.action(api.images.linkImageToRender, { renderId, imageKey });
    if (!linked) {
      scheduleLinkRetry(renderId, imageKey, attempt + 1);
    }
  } catch (error) {
    logger.error("link.error", { renderId, attempt, error });
    scheduleLinkRetry(renderId, imageKey, attempt + 1);
  }
}

export function getUploadQueueStats(): { queued: number; active: number } {
  return { queued: queue.length, active: activeUploads };
}
