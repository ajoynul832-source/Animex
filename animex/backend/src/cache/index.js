/**
 * Simple in-memory LRU-style cache with TTL.
 * Reduces hammering the external aniwatch API and speeds up all responses.
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 500;

class Cache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttl = DEFAULT_TTL) {
    // Evict oldest if at capacity
    if (this.store.size >= MAX_ENTRIES) {
      const firstKey = this.store.keys().next().value;
      this.store.delete(firstKey);
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  size() {
    return this.store.size;
  }

  stats() {
    let active = 0;
    const now = Date.now();
    for (const [, entry] of this.store) {
      if (now <= entry.expiresAt) active++;
    }
    return { total: this.store.size, active };
  }
}

// Singleton
const cache = new Cache();

/**
 * TTL constants (ms) for different data types
 */
const TTL = {
  HOME:       3 * 60 * 1000,   // 3 min  - changes frequently
  SCHEDULE:   10 * 60 * 1000,  // 10 min
  ANIME_INFO: 30 * 60 * 1000,  // 30 min - stable
  EPISODES:   15 * 60 * 1000,  // 15 min
  SOURCES:    2 * 60 * 1000,   // 2 min  - stream URLs expire
  BROWSE:     5 * 60 * 1000,   // 5 min
  SEARCH:     2 * 60 * 1000,   // 2 min
  SUGGEST:    60 * 1000,        // 1 min
};

/**
 * Middleware factory: wraps a fetch function with caching.
 * Usage: cachedFetch(cacheKey, ttl, async () => data)
 */
async function cachedFetch(key, ttl, fetchFn) {
  const cached = cache.get(key);
  if (cached !== null) return cached;
  const data = await fetchFn();
  cache.set(key, data, ttl);
  return data;
}

module.exports = { cache, TTL, cachedFetch };
