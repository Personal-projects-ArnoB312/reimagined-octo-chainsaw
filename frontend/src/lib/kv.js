import { Redis } from "@upstash/redis";

let client = null;

/**
 * Lazily creates the Redis client so a missing env var only fails the
 * request that actually needs storage, not the build itself.
 */
export function getKv() {
  if (client) return client;

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Redis is not configured: set KV_REST_API_URL/KV_REST_API_TOKEN (Vercel Redis marketplace integration)"
    );
  }

  client = new Redis({ url, token });
  return client;
}
