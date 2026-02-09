import { promises as fs } from "fs";
import path from "path";
import { logger } from "../lib/logger";

const IMAGE_DIR = process.env.IMAGE_DIR || path.resolve(import.meta.dir, "../cache/images");
const IMAGE_TTL_MS = parseInt(process.env.IMAGE_TTL_MS || "0", 10); // 0 = no expiry

const EXTENSIONS = ["png", "jpeg", "jpg", "webp"] as const;

function normalizeExt(ext: string): string {
  const lower = ext.toLowerCase();
  if (lower === "jpg") return "jpeg";
  return lower;
}

function contentTypeForExt(ext: string): string {
  switch (normalizeExt(ext)) {
    case "png":
      return "image/png";
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

class DiskImageStore {
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.cleanupInterval = setInterval(() => {
      void this.cleanup();
    }, 60000);
  }

  private async ensureDir(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = fs
        .mkdir(IMAGE_DIR, { recursive: true })
        .then(() => undefined)
        .catch((error) => {
          this.initPromise = null;
          throw error;
        });
    }
    await this.initPromise;
  }

  async save(id: string, ext: string, buffer: Uint8Array): Promise<void> {
    await this.ensureDir();
    const normalized = normalizeExt(ext);
    const filePath = path.join(IMAGE_DIR, `${id}.${normalized}`);
    await fs.writeFile(filePath, buffer);
  }

  async get(
    id: string,
    ext?: string
  ): Promise<{ path: string; contentType: string } | undefined> {
    await this.ensureDir();
    const candidates = ext
      ? [normalizeExt(ext)]
      : Array.from(new Set(EXTENSIONS.map((e) => normalizeExt(e))));
    const now = Date.now();

    for (const candidate of candidates) {
      const filePath = path.join(IMAGE_DIR, `${id}.${candidate}`);
      try {
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;
        if (IMAGE_TTL_MS > 0 && now - stat.mtimeMs > IMAGE_TTL_MS) {
          await fs.unlink(filePath).catch(() => undefined);
          continue;
        }
        return { path: filePath, contentType: contentTypeForExt(candidate) };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          logger.error("DiskImageStore: failed to read image", { error: String(error) });
        }
      }
    }

    return undefined;
  }

  async cleanup(): Promise<void> {
    if (IMAGE_TTL_MS <= 0) return;

    try {
      await this.ensureDir();
    } catch {
      return;
    }
    let entries: string[] = [];
    try {
      entries = await fs.readdir(IMAGE_DIR);
    } catch {
      return;
    }

    const now = Date.now();
    await Promise.all(
      entries.map(async (entry) => {
        const filePath = path.join(IMAGE_DIR, entry);
        try {
          const stat = await fs.stat(filePath);
          if (!stat.isFile()) return;
          if (now - stat.mtimeMs > IMAGE_TTL_MS) {
            await fs.unlink(filePath);
          }
        } catch {
          // Ignore cleanup errors
        }
      })
    );
  }

  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

export const diskImageStore = new DiskImageStore();
export { IMAGE_DIR, IMAGE_TTL_MS };
