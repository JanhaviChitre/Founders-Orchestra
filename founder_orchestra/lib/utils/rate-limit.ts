/**
 * Simple in-memory token bucket rate limiter.
 * In a serverless environment (like Vercel), this state resets on cold starts.
 * For production, consider using Redis (e.g. Upstash) for distributed rate limiting.
 */

type TokenBucket = {
  tokens: number;
  lastRefill: number;
};

const store = new Map<string, TokenBucket>();

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function rateLimit(identifier: string, options: RateLimitOptions = { limit: 5, windowMs: 60000 }) {
  const now = Date.now();
  const bucket = store.get(identifier);

  if (!bucket) {
    store.set(identifier, { tokens: options.limit - 1, lastRefill: now });
    return { success: true, remaining: options.limit - 1 };
  }

  // Refill tokens based on elapsed time
  const timePassed = now - bucket.lastRefill;
  const refillAmount = Math.floor(timePassed / options.windowMs) * options.limit;

  if (refillAmount > 0) {
    bucket.tokens = Math.min(options.limit, bucket.tokens + refillAmount);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return { success: true, remaining: bucket.tokens };
  }

  return { success: false, remaining: 0 };
}
