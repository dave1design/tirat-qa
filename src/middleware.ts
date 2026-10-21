import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

/**
 * Fast edge redirect for pages that always need a session. This only checks that a session cookie exists;
 * every page and server action still verifies the signed token and the user's role on the server.
 */
export function middleware(req: NextRequest) {
  if (req.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard", "/onboarding", "/admin/:path*", "/practice-lab/results/:path*", "/practice-lab/:level/:website"],
};
