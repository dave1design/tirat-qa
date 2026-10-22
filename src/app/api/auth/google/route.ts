import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { rememberNext, SITE, socialProviders, STATE_COOKIE, toLogin } from "@/lib/social";

export const dynamic = "force-dynamic";

/** Step 1: send the browser to Google's consent screen, with a random state to check on the way back. */
export async function GET(req: NextRequest) {
  if (!socialProviders().google) return toLogin("unavailable");
  const state = randomBytes(24).toString("hex");
  (await cookies()).set(STATE_COOKIE, state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  await rememberNext(req.nextUrl.searchParams.get("next"));

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${SITE()}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  }).toString();
  return NextResponse.redirect(url);
}
