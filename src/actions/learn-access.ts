"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { track } from "@/lib/audit";
import { fieldErrors, paymentRequestSchema } from "@/lib/validation";
import { advancedPriceEtb, ADVANCED_PRODUCT, hasAdvancedAccess, pendingAdvancedPayment } from "@/lib/learn-access";
import type { FormState } from "@/components/ui/form";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

/** The learner submits the receipt reference for the one-time advanced payment; staff confirm it in Admin > Payments. */
export async function requestAdvancedAccessAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser("/learn/levels/5");
  const parsed = paymentRequestSchema.safeParse({ reference: str(fd, "reference"), note: str(fd, "note") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: { reference: str(fd, "reference") } };

  if (await hasAdvancedAccess(user)) return { ok: true, message: "You already have access to Levels 5 to 8." };
  if (await pendingAdvancedPayment(user.id)) return { ok: true, message: "Your payment is already pending confirmation. We'll unlock Levels 5 to 8 as soon as it's verified." };

  await db.payment.create({
    data: { userId: user.id, product: ADVANCED_PRODUCT, amountEtb: advancedPriceEtb(), reference: parsed.data.reference, note: parsed.data.note || null },
  });
  await track("payment_started", user.id, { product: ADVANCED_PRODUCT });
  return { ok: true, message: "Thanks — your payment reference was received. Levels 5 to 8 unlock once our team confirms the payment." };
}
