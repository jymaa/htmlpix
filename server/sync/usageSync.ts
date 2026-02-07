import { getConvexClient } from "./convexClient";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface PendingRender {
  externalId: string;
  apiKeyId: Id<"apiKeys">;
  userId: string;
  status: "success" | "error";
  htmlHash: string;
  contentHash?: string;
  format: string;
  renderMs: number;
  imageKey?: string;
  createdAt: number;
}

const BATCH_INTERVAL_MS = 5000;
const MAX_BATCH_SIZE = 100;

let pendingRenders: PendingRender[] = [];
let flushTimer: Timer | null = null;

export function queueRenderReport(render: PendingRender): void {
  pendingRenders.push(render);

  if (pendingRenders.length >= MAX_BATCH_SIZE) {
    flushRenders();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushRenders, BATCH_INTERVAL_MS);
  }
}

async function flushRenders(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (pendingRenders.length === 0) return;

  const batch = pendingRenders.splice(0, MAX_BATCH_SIZE);

  try {
    const client = getConvexClient();
    await client.mutation(api.sync.ingestRenders, { renders: batch });
    console.log(`Reported ${batch.length} renders to Convex`);
  } catch (error) {
    console.error("Failed to report renders to Convex:", error);
    pendingRenders.unshift(...batch);

    if (!flushTimer) {
      flushTimer = setTimeout(flushRenders, BATCH_INTERVAL_MS * 2);
    }
  }
}

export async function flushPendingRenders(): Promise<void> {
  while (pendingRenders.length > 0) {
    await flushRenders();
  }
}

export function getPendingCount(): number {
  return pendingRenders.length;
}
