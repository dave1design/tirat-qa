import "server-only";
import { db } from "./db";

/** One payment unlocks every advanced learning level (5 to 8) for good. */
export const ADVANCED_PRODUCT = "learn-advanced";
export const ADVANCED_FIRST_LEVEL = 5;
export const isPaidLevel = (levelN: number) => levelN >= ADVANCED_FIRST_LEVEL;

/** The single price in ETB. Set LEARN_ADVANCED_PRICE_ETB to change it. */
export const advancedPriceEtb = () => {
  const n = Number(process.env.LEARN_ADVANCED_PRICE_ETB);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 1500;
};

/** Staff always have access; a learner needs an active, unexpired entitlement for the advanced levels. */
export async function hasAdvancedAccess(user: { id: string; role: string } | null): Promise<boolean> {
  if (!user) return false;
  if (user.role !== "LEARNER") return true;
  const hit = await db.entitlement.findFirst({
    where: { userId: user.id, product: ADVANCED_PRODUCT, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: { id: true },
  });
  return !!hit;
}

/** True when the learner may open this level's content (levels below 5 are free). */
export async function canOpenLevel(user: { id: string; role: string } | null, levelN: number) {
  return !isPaidLevel(levelN) || (await hasAdvancedAccess(user));
}

export async function pendingAdvancedPayment(userId: string) {
  return db.payment.findFirst({ where: { userId, product: ADVANCED_PRODUCT, status: "PENDING" }, orderBy: { createdAt: "desc" } });
}
