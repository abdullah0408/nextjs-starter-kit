import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/modules/auth/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const publicRoutes = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  try {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (isPublicRoute && pathname.startsWith("/auth/") && session?.user) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
      const redirectUrl =
        callbackUrl && callbackUrl.startsWith("/")
          ? new URL(callbackUrl, request.url)
          : new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (!isPublicRoute && !session?.user) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (!isPublicRoute && session?.user && !session.user.emailVerified) {
      const emailVerificationUrl = new URL(
        "/auth/email-verification",
        request.url
      );
      emailVerificationUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(emailVerificationUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);

    if (!isPublicRoute) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
