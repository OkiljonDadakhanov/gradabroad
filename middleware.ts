import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_PATHS = ["/programs", "/dashboard/applications"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for access token in cookies (middleware can't read localStorage)
  // The token is stored in localStorage on the client, so middleware checks
  // if the user has visited before via a cookie marker
  const accessToken = request.cookies.get("accessToken")?.value;

  // For the root page, let it through (it handles its own redirect)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Protected routes: if no session marker, redirect to root
  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
