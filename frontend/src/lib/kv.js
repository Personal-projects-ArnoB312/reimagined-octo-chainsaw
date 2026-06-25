import { createClient } from "redis";

let clientPromise = null;

/**
 * Lazily creates and connects the Redis client, reusing the same
 * connection across invocations within the same serverless instance.
 */
function getClient() {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("Redis is not configured: set REDIS_URL (Vercel Redis integration)");
  }

  if (!clientPromise) {
    const client = createClient({ url });
    client.on("error", (err) => console.error("[redis] Client error", err));
    clientPromise = client.connect().then(() => client);
  }

  return clientPromise;
}

export async function kvGet(key) {
  const client = await getClient();
  const raw = await client.get(key);
  return raw ? JSON.parse(raw) : null;
}

export async function kvSet(key, value) {
  const client = await getClient();
  await client.set(key, JSON.stringify(value));
}
