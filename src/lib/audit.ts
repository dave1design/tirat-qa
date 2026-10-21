import "server-only";
import { db } from "./db";

export async function audit(actorId: string | null, action: string, entity: string, entityId?: string | null, meta: Record<string, unknown> = {}) {
  await db.auditLog.create({ data: { actorId, action, entity, entityId: entityId ?? null, meta: JSON.stringify(meta) } });
}

/** Privacy-conscious product analytics: event name + optional user + small metadata, no PII. */
export async function track(name: string, userId?: string | null, meta: Record<string, unknown> = {}) {
  try {
    await db.analyticsEvent.create({ data: { name, userId: userId ?? null, meta: JSON.stringify(meta) } });
  } catch {
    /* analytics must never break a user flow */
  }
}
