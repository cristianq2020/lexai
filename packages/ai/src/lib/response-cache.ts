import { createHash } from 'node:crypto';
import type { LegalResponse } from '@lexai/shared';
import type { LegalAreaId } from '@lexai/shared';

interface CacheEntry {
  response: LegalResponse;
  cachedAt: number;
  hits: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500;

const memoryCache = new Map<string, CacheEntry>();

function cacheKey(query: string, areaId: LegalAreaId): string {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ');
  return createHash('sha256').update(`${areaId}:${normalized}`).digest('hex');
}

export function getCachedResponse(
  query: string,
  areaId: LegalAreaId,
): LegalResponse | null {
  const key = cacheKey(query, areaId);
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }

  entry.hits += 1;
  return entry.response;
}

export function setCachedResponse(
  query: string,
  areaId: LegalAreaId,
  response: LegalResponse,
): void {
  if (memoryCache.size >= MAX_ENTRIES) {
    const oldest = [...memoryCache.entries()].sort((a, b) => a[1].cachedAt - b[1].cachedAt)[0];
    if (oldest) memoryCache.delete(oldest[0]);
  }

  memoryCache.set(cacheKey(query, areaId), {
    response,
    cachedAt: Date.now(),
    hits: 0,
  });
}

export function clearResponseCache(): void {
  memoryCache.clear();
}

export function getCacheStats(): { size: number; maxEntries: number } {
  return { size: memoryCache.size, maxEntries: MAX_ENTRIES };
}