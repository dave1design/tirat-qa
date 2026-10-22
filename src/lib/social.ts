import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";
import { hashPassword } from "./password";
import { createSession } from "./session";
import { track } from "./audit";
import { safeNext } from "./utils";

export const SITE = () => (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Which outside sign-in methods are set up in the environment. The buttons are shown only for these. */
export function socialProviders() {
  return {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    telegram: process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_USERNAME ? process.env.TELEGRAM_BOT_USERNAME : null,
  };
}

export type SocialProfile = { provider: "google" | "telegram"; providerId: string; name: string; email: string };

/**
 * Signs the person in: an existing link wins, then a user with the same (provider-verified) email is linked, otherwise a
 * new learner account is created. Social accounts get a random password nobody knows; "Forgot password?" can set one.
 */
export async function signInWithProfile(p: SocialProfile) {
  const linked = await db.socialAccount.findUnique({ where: { provider_providerId: { provider: p.provider, providerId: p.providerId } }, include: { user: true } });
  let user = linked?.user ?? null;

  if (!user) {
    const byEmail = await db.user.findUnique({ where: { email: p.email } });
    user =
      byEmail ??
      (await db.user.create({
        data: { name: p.name || p.email.split("@")[0], email: p.email, passwordHash: await hashPassword(randomBytes(32).toString("hex")), termsAcceptedAt: new Date() },
      }));
    await db.socialAccount.create({ data: { userId: user.id, provider: p.provider, providerId: p.providerId } });
    if (!byEmail) await track("signup_completed", user.id, { provider: p.provider });
  }
  if (user.status !== "ACTIVE") return null;
  await createSession(user.id, true);
  await track("login_social", user.id, { provider: p.provider });
  return user;
}

const NEXT_COOKIE = "tirat_oauth_next";
export const STATE_COOKIE = "tirat_oauth_state";

/** Remembers a safe return path across the redirect to the provider. */
export async function rememberNext(next: string | null) {
  const jar = await cookies();
  jar.set(NEXT_COOKIE, safeNext(next, ""), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
}

export async function takeNext() {
  const jar = await cookies();
  const v = jar.get(NEXT_COOKIE)?.value ?? "";
  jar.delete(NEXT_COOKIE);
  return safeNext(v, "");
}

export const toLogin = (error: string) => NextResponse.redirect(`${SITE()}/login?social=${error}`);
export const toApp = (next: string) => NextResponse.redirect(`${SITE()}${next || "/dashboard"}`);
