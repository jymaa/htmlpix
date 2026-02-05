interface CacheEntry<T> {
  value: T;
  size: number;
  expiresAt: number;
}

export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private totalBytes = 0;

  constructor(
    private maxEntries: number,
    private maxBytes: number,
    private ttlMs: number
  ) {}

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, size: number): void {
    // Remove existing entry if present
    if (this.cache.has(key)) {
      this.delete(key);
    }

    // Evict entries until we have room
    while (
      (this.cache.size >= this.maxEntries || this.totalBytes + size > this.maxBytes) &&
      this.cache.size > 0
    ) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.delete(oldestKey);
    }

    // Don't cache if single entry exceeds max
    if (size > this.maxBytes) return;

    this.cache.set(key, {
      value,
      size,
      expiresAt: Date.now() + this.ttlMs,
    });
    this.totalBytes += size;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    this.totalBytes -= entry.size;
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.totalBytes = 0;
  }

  get size(): number {
    return this.cache.size;
  }

  get bytes(): number {
    return this.totalBytes;
  }
}
