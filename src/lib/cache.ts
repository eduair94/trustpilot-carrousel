// ============================================
// ENHANCED CACHE IMPLEMENTATION WITH MEMORY MANAGEMENT
// ============================================

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // Estimated size in bytes
}

class SimpleCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private cleanupInterval: NodeJS.Timeout;
  private maxItems: number;
  private maxMemoryMB: number;
  private currentMemoryUsage: number = 0;

  constructor(
    private defaultTtl: number = 1800, // 30 minutes default
    maxItems: number = 1000, // Maximum number of items
    maxMemoryMB: number = 50 // Maximum 50MB of cache memory
  ) {
    this.maxItems = maxItems;
    this.maxMemoryMB = maxMemoryMB;

    // Clean expired items every 2 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 120000); // 2 minutes
  }

  /**
   * Estimate the size of data in bytes
   */
  private estimateSize(data: unknown): number {
    try {
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
    } catch {
      // Fallback estimation
      return JSON.stringify(data).length * 2; // Rough estimate
    }
  }

  /**
   * Remove least recently used items to free memory
   */
  private evictLRU(): void {
    const entries = Array.from(this.cache.entries());

    // Sort by lastAccessed (oldest first)
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    // Remove 25% of oldest entries or until under memory limit
    const targetRemove = Math.max(1, Math.floor(entries.length * 0.25));
    let removedCount = 0;

    for (const [key, item] of entries) {
      if (removedCount >= targetRemove && this.isUnderMemoryLimit()) {
        break;
      }

      this.cache.delete(key);
      this.currentMemoryUsage -= item.size;
      removedCount++;
    }

    console.log(
      `Cache LRU eviction: Removed ${removedCount} items, ${this.cache.size} remaining`
    );
  }

  /**
   * Check if we're under memory limit
   */
  private isUnderMemoryLimit(): boolean {
    return this.currentMemoryUsage < this.maxMemoryMB * 1024 * 1024 * 0.8; // 80% of limit
  }

  /**
   * Set a cache item
   */
  async set(key: string, data: T, ttl?: number): Promise<void> {
    const size = this.estimateSize(data);
    const now = Date.now();

    // Check if we need to evict items first
    if (this.cache.size >= this.maxItems || !this.isUnderMemoryLimit()) {
      this.evictLRU();
    }

    // Remove existing item if updating
    const existingItem = this.cache.get(key);
    if (existingItem) {
      this.currentMemoryUsage -= existingItem.size;
    }

    const item: CacheItem<T> = {
      data,
      timestamp: now,
      ttl: Math.min(ttl || this.defaultTtl, 1800), // Max 30 minutes
      accessCount: 0,
      lastAccessed: now,
      size,
    };

    this.cache.set(key, item);
    this.currentMemoryUsage += size;
  }

  /**
   * Get a cache item
   */
  async get<U = T>(key: string): Promise<U | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - item.timestamp > item.ttl * 1000) {
      this.cache.delete(key);
      this.currentMemoryUsage -= item.size;
      return null;
    }

    // Update access stats
    item.accessCount++;
    item.lastAccessed = now;

    return item.data as unknown as U;
  }

  /**
   * Delete a cache item
   */
  async delete(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (item) {
      this.currentMemoryUsage -= item.size;
    }
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.currentMemoryUsage = 0;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get memory usage in MB
   */
  getMemoryUsageMB(): number {
    return this.currentMemoryUsage / (1024 * 1024);
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    items: number;
    memoryUsageMB: number;
    maxMemoryMB: number;
    hitRate: number;
  } {
    let totalAccesses = 0;
    let totalHits = 0;

    for (const item of this.cache.values()) {
      totalAccesses += item.accessCount;
      if (item.accessCount > 0) totalHits++;
    }

    return {
      items: this.cache.size,
      memoryUsageMB: this.getMemoryUsageMB(),
      maxMemoryMB: this.maxMemoryMB,
      hitRate: totalAccesses > 0 ? totalHits / totalAccesses : 0,
    };
  }

  /**
   * Check if key exists (and not expired)
   */
  async has(key: string): Promise<boolean> {
    const item = await this.get(key);
    return item !== null;
  }

  /**
   * Clean expired items and manage memory
   */
  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl * 1000) {
        this.cache.delete(key);
        this.currentMemoryUsage -= item.size;
        removedCount++;
      }
    }

    // If still over memory limit after cleanup, do LRU eviction
    if (!this.isUnderMemoryLimit()) {
      this.evictLRU();
    }

    const stats = this.getStats();
    console.log(
      `[Cache] Cleanup complete: ${removedCount} expired items removed, ` +
        `${stats.items} items remaining, ${stats.memoryUsageMB.toFixed(2)}MB used`
    );
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// ============================================
// REDIS CACHE IMPLEMENTATION (OPTIONAL)
// ============================================

class RedisCache<T> {
  private client: unknown; // Redis client type - would be RedisClientType if implemented

  constructor(private defaultTtl: number = 300) {
    // Initialize Redis client if available
    // This would require redis package and connection
    console.log('Redis cache not implemented yet, using memory cache');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set(_key: string, _data: T, _ttl?: number): Promise<void> {
    // Redis implementation would go here
    throw new Error('Redis cache not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get<U = T>(_key: string): Promise<U | null> {
    // Redis implementation would go here
    throw new Error('Redis cache not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_key: string): Promise<boolean> {
    // Redis implementation would go here
    throw new Error('Redis cache not implemented');
  }

  async clear(): Promise<void> {
    // Redis implementation would go here
    throw new Error('Redis cache not implemented');
  }
}

// ============================================
// CACHE FACTORY
// ============================================

function createCache<T>(
  type: 'memory' | 'redis' = 'memory',
  ttl: number = 1800, // 30 minutes
  maxItems: number = 1000,
  maxMemoryMB: number = 50
) {
  switch (type) {
    case 'redis':
      return new RedisCache<T>(ttl);
    case 'memory':
    default:
      return new SimpleCache<T>(ttl, maxItems, maxMemoryMB);
  }
}

// ============================================
// DEFAULT EXPORT
// ============================================

// Use environment variables to configure cache
const cacheType = (process.env.CACHE_TYPE as 'memory' | 'redis') || 'memory';
const cacheTtl = Math.min(
  parseInt(process.env.CACHE_TTL_SECONDS || '1800'),
  1800
); // Max 30 minutes
const maxCacheItems = parseInt(process.env.CACHE_MAX_ITEMS || '1000');
const maxCacheMemoryMB = parseInt(process.env.CACHE_MAX_MEMORY_MB || '50');

export const cache = createCache<unknown>(
  cacheType,
  cacheTtl,
  maxCacheItems,
  maxCacheMemoryMB
);

// Export classes for custom usage
export { SimpleCache, RedisCache, createCache };
