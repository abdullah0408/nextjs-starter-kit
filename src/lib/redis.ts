import { env } from "@/lib/env";
import type { RedisHealthCheckResult } from "@/types";
import Redis from "ioredis";

const globalForRedis = global as unknown as {
  redis: Redis | undefined;
};

/**
 * **Redis client instance**
 *
 * To check Redis connection:
 * - In code: Use `checkRedisConnection()` function
 * - Externally: GET /api/health/redis
 */
const redis =
  globalForRedis.redis ||
  new Redis(env.REDIS_URL, {
    // Auto-enable TLS for secure URLs (rediss://)
    tls: env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
    maxRetriesPerRequest: 3,
    reconnectOnError: (err) => {
      const targetErrors = ["READONLY", "ETIMEDOUT", "ECONNRESET"];
      return targetErrors.some((msg) => err.message.includes(msg));
    },
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

/**
 * Check Redis connection health
 *
 * @returns {Promise<RedisHealthCheckResult>} Connection status
 *
 * @example
 * ```typescript
 * const health = await checkRedisConnection();
 * if (health.status === "connected") {
 *   console.log("Redis is healthy");
 * }
 * ```
 */
export async function checkRedisConnection(): Promise<RedisHealthCheckResult> {
  try {
    const pong = await redis.ping();

    return {
      status: "connected",
      message: "Redis connection is healthy",
      pong,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      status: "error",
      message: "Redis connection failed",
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}

export default redis;
