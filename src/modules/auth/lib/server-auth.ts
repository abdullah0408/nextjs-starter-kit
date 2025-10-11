"use server";

import { headers } from "next/headers";
import { auth as betterAuth } from "./auth";

export async function auth() {
  try {
    // During static generation, headers() might not be available
    // so we return unauthenticated state to allow static rendering
    let requestHeaders;
    try {
      requestHeaders = await headers();
    } catch (error) {
      // If headers() fails during static generation, return unauthenticated state
      const err = error as Error & { digest?: string };
      if (
        err?.message?.includes("Dynamic server usage") ||
        err?.digest === "DYNAMIC_SERVER_USAGE"
      ) {
        return {
          session: null,
          user: null,
          isAuthenticated: false,
        };
      }
      throw error;
    }

    const session = await betterAuth.api.getSession({
      headers: requestHeaders,
    });

    return {
      session: session?.session || null,
      user: session?.user || null,
      isAuthenticated: !!session?.user,
    };
  } catch (error) {
    console.error("Error getting server session:", error);
    return {
      session: null,
      user: null,
      isAuthenticated: false,
    };
  }
}

export type AuthData = Awaited<ReturnType<typeof auth>>;
