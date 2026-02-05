interface StoredImage {
  buffer: Uint8Array;
  contentType: string;
  createdAt: number;
}

const IMAGE_TTL_MS = parseInt(process.env.IMAGE_TTL_MS || "86400000", 10); // 24 hours default
const MAX_STORED_IMAGES = parseInt(process.env.MAX_STORED_IMAGES || "1000", 10);

class ImageStore {
  private images = new Map<string, StoredImage>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Cleanup expired images every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  generateId(): string {
    return crypto.randomUUID();
  }

  store(id: string, buffer: Uint8Array, contentType: string): void {
    // Evict oldest if at capacity
    if (this.images.size >= MAX_STORED_IMAGES) {
      const oldestKey = this.images.keys().next().value;
      if (oldestKey) this.images.delete(oldestKey);
    }

    this.images.set(id, {
      buffer,
      contentType,
      createdAt: Date.now(),
    });
  }

  get(id: string): StoredImage | undefined {
    const image = this.images.get(id);
    if (!image) return undefined;

    // Check if expired
    if (Date.now() - image.createdAt > IMAGE_TTL_MS) {
      this.images.delete(id);
      return undefined;
    }

    return image;
  }

  delete(id: string): boolean {
    return this.images.delete(id);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, image] of this.images) {
      if (now - image.createdAt > IMAGE_TTL_MS) {
        this.images.delete(id);
      }
    }
  }

  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.images.clear();
  }

  get size(): number {
    return this.images.size;
  }
}

export const imageStore = new ImageStore();
