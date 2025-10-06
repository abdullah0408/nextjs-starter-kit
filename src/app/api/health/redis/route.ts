import { checkRedisConnection } from "@/lib/redis";
import type { RedisHealthCheckResult } from "@/types";
import { NextResponse } from "next/server";

/**
 * GET /api/health/redis
 *
 * Health check endpoint for Redis connection
 */
export async function GET(): Promise<NextResponse<RedisHealthCheckResult>> {
  try {
    const healthCheck = await checkRedisConnection();
    const statusCode = healthCheck.status === "connected" ? 200 : 503;

    return NextResponse.json(healthCheck, { status: statusCode });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";

    const errorResponse: RedisHealthCheckResult = {
      status: "error",
      message: "Health check failed",
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
