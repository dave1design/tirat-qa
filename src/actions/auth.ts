"use server";

import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/password";
import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { audit, track } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/mailer";
import { fieldErrors, forgotSchema, loginSchema, onboardingSchema, resetSchema, signUpSchema } from "@/lib/validation";
import { safeNext } from "@/lib/utils";
import type { FormState } from "@/components/ui/form";


const str = (fd: FormData, k: string) => (typeof fd.get(k) === "string" ? (fd.get(k) as string) : "");
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function clientKey() {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
}

export async function signUpAction(_: FormState, fd: FormData): Promise<FormState> {
  const raw = { name: str(fd, "name"), email: str(fd, "email"), password: str(fd, "password"), confirmPassword: str(fd, "confirmPassword"), terms: str(fd, "terms") };
  const values = { name: raw.name, email: raw.email, terms: raw.terms };
  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  if (!(await rateLimit(`signup:${await clientKey()}`, 10, 3600))) {
    return { message: "Too many sign-up attempts. Please try again later.", values };
  }

  const { name, email, password } = parsed.data;
  const exists = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) return { errors: { email: "An account with this email may already exist. Try logging in." }, values };

  const user = await db.user.create({
    data: { name, email, passwordHash: await hashPassword(password), termsAcceptedAt: new Date() },
    select: { id: true },
  });
  await createSession(user.id, false);
  await track("signup_completed", user.id);
  return { ok: true };
}

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const raw = { email: str(fd, "email"), password: str(fd, "password"), remember: str(fd, "remember") || undefined };
  const next = str(fd, "next");
  const values = { email: raw.email };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { email, password, remember } = parsed.data;
  if (!(await rateLimit(`login:${email}:${await clientKey()}`, 8, 900))) {
    return { message: "Too many attempts. Please wait a few minutes and try again.", values };
  }

  const user = await db.user.findUnique({ where: { email } });
  const check = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !check.ok || user.status !== "ACTIVE") {
    return { message: "The email or password you entered is incorrect.", values };
  }
  if (check.needsRehash) await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } });

  await createSession(user.id, !!remember);
  await track("login", user.id);
  if (next) redirect(safeNext(next));
  if (isStaff(user.role)) redirect("/admin");
  redirect(user.onboardedAt ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function forgotPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = forgotSchema.safeParse({ email: str(fd, "email") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: { email: str(fd, "email") } };

  if (await rateLimit(`forgot:${await clientKey()}`, 5, 3600)) {
    const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true, email: true } });
    if (user) {
      const token = randomBytes(32).toString("hex");
      await db.passwordResetToken.create({
        data: { userId: user.id, tokenHash: sha256(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      });
      const base = process.env.SITE_URL ?? "http://localhost:3000";
      await sendEmail(user.email, "Reset your Tirat password", `Use this link within one hour:\n${base}/reset-password?token=${token}`);
      await audit(user.id, "password_reset_requested", "User", user.id);
    }
  }
  // Same response whether or not the account exists.
  return { ok: true };
}

export async function resetPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse({ token: str(fd, "token"), password: str(fd, "password"), confirmPassword: str(fd, "confirmPassword") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const row = await db.passwordResetToken.findUnique({ where: { tokenHash: sha256(parsed.data.token) } });
  if (!row || row.usedAt || row.expiresAt < new Date()) {
    return { message: "This reset link is invalid or has expired. Request a new one." };
  }
  await db.$transaction([
    db.user.update({ where: { id: row.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }),
    db.passwordResetToken.update({ where: { id: row.id }, data: { usedAt: new Date() } }),
  ]);
  await audit(row.userId, "password_reset_completed", "User", row.userId);
  return { ok: true };
}

export async function onboardingAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const parsed = onboardingSchema.safeParse({
    experienceLevel: str(fd, "experienceLevel") || undefined,
    learningGoal: str(fd, "learningGoal") || undefined,
  });
  await db.user.update({
    where: { id: user.id },
    data: { onboardedAt: new Date(), ...(parsed.success ? parsed.data : {}) },
  });
  await track("onboarding_completed", user.id);
  return { ok: true };
}
