"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validation";
import type { FormState } from "@/components/ui/form";

export async function contactAction(_: FormState, fd: FormData): Promise<FormState> {
  const g = (k: string) => (typeof fd.get(k) === "string" ? (fd.get(k) as string) : "");
  const values = { name: g("name"), email: g("email"), subject: g("subject"), message: g("message") };
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const ip = ((await headers()).get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (!(await rateLimit(`contact:${ip}`, 5, 3600))) {
    return { message: "We couldn't send your message. Please check your details and try again.", values };
  }

  const user = await getCurrentUser();
  await db.contactMessage.create({ data: { ...parsed.data, userId: user?.id ?? null } });
  return { ok: true };
}
