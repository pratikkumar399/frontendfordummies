/**
 * Client-side rate limiting for code execution
 * Prevents abuse by limiting the number of executions per time window
 */

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds until next allowed execution
  remaining?: number; // remaining executions in current window
}

interface RateLimitEntry {
  count: number;
  resetTime: number; // timestamp when the window resets
}

const EXECUTIONS_PER_MINUTE = 10;
const WINDOW_DURATION_MS = 60 * 1000; // 1 minute

/**
 * Gets the storage key for a specific page
 */
function getStorageKey(page: 'practice' | 'playground' | 'snippet-practice'): string {
  return `rate_limit_${page}`;
}

/**
 * Checks if code execution is allowed for the given page
 * @param page - The page identifier
 * @returns Rate limit result with allowed status and optional retry time
 */
export function checkRateLimit(page: 'practice' | 'playground' | 'snippet-practice'): RateLimitResult {
  if (typeof window === 'undefined') {
    // Server-side: always allow (rate limiting is client-side only)
    return { allowed: true };
  }

  const storageKey = getStorageKey(page);
  const now = Date.now();

  try {
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      // First execution: create new entry
      const entry: RateLimitEntry = {
        count: 1,
        resetTime: now + WINDOW_DURATION_MS,
      };
      localStorage.setItem(storageKey, JSON.stringify(entry));
      return {
        allowed: true,
        remaining: EXECUTIONS_PER_MINUTE - 1,
      };
    }

    const entry: RateLimitEntry = JSON.parse(stored);

    // Check if window has expired
    if (now >= entry.resetTime) {
      // Reset the window
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + WINDOW_DURATION_MS,
      };
      localStorage.setItem(storageKey, JSON.stringify(newEntry));
      return {
        allowed: true,
        remaining: EXECUTIONS_PER_MINUTE - 1,
      };
    }

    // Window is still active
    if (entry.count >= EXECUTIONS_PER_MINUTE) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        allowed: false,
        retryAfter,
      };
    }

    // Increment count
    entry.count += 1;
    localStorage.setItem(storageKey, JSON.stringify(entry));
    
    return {
      allowed: true,
      remaining: EXECUTIONS_PER_MINUTE - entry.count,
    };
  } catch (error) {
    // If localStorage fails (e.g., in private browsing), allow execution
    // This is a graceful degradation
    console.warn('Rate limiter: localStorage access failed', error);
    return { allowed: true };
  }
}

/**
 * Resets the rate limit for a specific page (useful for testing or manual reset)
 * @param page - The page identifier
 */
export function resetRateLimit(page: 'practice' | 'playground' | 'snippet-practice'): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storageKey = getStorageKey(page);
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.warn('Rate limiter: Failed to reset', error);
  }
}

/**
 * Gets the remaining executions for a specific page
 * @param page - The page identifier
 * @returns Number of remaining executions, or null if not available
 */
export function getRemainingExecutions(page: 'practice' | 'playground' | 'snippet-practice'): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageKey = getStorageKey(page);
  const now = Date.now();

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return EXECUTIONS_PER_MINUTE;
    }

    const entry: RateLimitEntry = JSON.parse(stored);

    // Check if window has expired
    if (now >= entry.resetTime) {
      return EXECUTIONS_PER_MINUTE;
    }

    return Math.max(0, EXECUTIONS_PER_MINUTE - entry.count);
  } catch (error) {
    return null;
  }
}

