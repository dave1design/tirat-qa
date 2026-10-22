import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { signInWithProfile, socialProviders, takeNext, toApp, toLogin } from "@/lib/social";

export const dynamic = "force-dynamic";

/**
 * Telegram Login Widget callback. Telegram signs the profile with an HMAC keyed by the SHA-256 of the bot token, so the
 * data is trusted only if that signature matches and the sign-in is recent.
 */
export async function GET(req: NextRequest) {
  const providers = socialProviders();
  if (!providers.telegram) return toLogin("unavailable");

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const hash = params.hash ?? "";
  delete params.hash;
  if (!hash || !params.id || !params.auth_date) return toLogin("failed");

  const dataCheck = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("\n");
  const secret = createHash("sha256").update(process.env.TELEGRAM_BOT_TOKEN!).digest();
  const expected = createHmac("sha256", secret).update(dataCheck).digest("hex");
  if (expected.length !== hash.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(hash))) return toLogin("failed");
  if (Date.now() / 1000 - Number(params.auth_date) > 86400) return toLogin("failed");

  const name = [params.first_name, params.last_name].filter(Boolean).join(" ") || params.username || "Telegram user";
  // Telegram shares no email address, so the account gets a placeholder address that is never used for mail.
  const user = await signInWithProfile({ provider: "telegram", providerId: params.id, name, email: `telegram-${params.id}@users.tirat.invalid` });
  if (!user) return toLogin("suspended");
  return toApp(await takeNext());
}
