import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SITE, signInWithProfile, socialProviders, STATE_COOKIE, takeNext, toApp, toLogin } from "@/lib/social";

export const dynamic = "force-dynamic";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Step 2: Google sends the person back with a one-time code that we exchange for their verified profile. */
export async function GET(req: NextRequest) {
  if (!socialProviders().google) return toLogin("unavailable");
  const jar = await cookies();
  const expected = jar.get(STATE_COOKIE)?.value ?? "";
  jar.delete(STATE_COOKIE);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  if (req.nextUrl.searchParams.get("error") || !code) return toLogin("cancelled");
  if (!expected || !same(expected, state)) return toLogin("failed");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${SITE()}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return toLogin("failed");
    const { access_token } = (await tokenRes.json()) as { access_token?: string };
    if (!access_token) return toLogin("failed");

    const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${access_token}` } });
    if (!infoRes.ok) return toLogin("failed");
    const info = (await infoRes.json()) as { sub?: string; email?: string; email_verified?: boolean; name?: string };
    if (!info.sub || !info.email || !info.email_verified) return toLogin("email");

    const user = await signInWithProfile({ provider: "google", providerId: info.sub, name: info.name ?? "", email: info.email.toLowerCase() });
    if (!user) return toLogin("suspended");
    return toApp(await takeNext());
  } catch {
    return toLogin("failed");
  }
}
