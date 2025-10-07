interface RedisHealthCheckBase {
  message: string;
  timestamp: string;
}

export type RedisHealthCheckResult = RedisHealthCheckBase &
  (
    | {
        status: "connected";
        pong: string;
      }
    | {
        status: "error";
        error: string;
      }
  );
