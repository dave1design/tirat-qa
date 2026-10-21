import "server-only";
import { db } from "./db";

/** Fixed-window limiter backed by the database. Returns true when the call is allowed. */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const now = new Date();
  const row = await db.rateLimit.findUnique({ where: { key } });
  if (!row || row.resetAt <= now) {
    await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, resetAt: new Date(now.getTime() + windowSeconds * 1000) },
      update: { count: 1, resetAt: new Date(now.getTime() + windowSeconds * 1000) },
    });
    return true;
  }
  if (row.count >= limit) return false;
  await db.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  return true;
}
