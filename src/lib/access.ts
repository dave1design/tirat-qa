import "server-only";
import { db } from "./db";

export interface AccessTarget {
  id: string;
  accessRule: string;
  levelId: string;
  level: { accessRule: string; id: string };
}

/**
 * Access is an entitlement attached to the account — never to a client-side flag.
 * A website is open when it (and its level) are FREE, or the learner holds an active
 * entitlement for the website or its level. Staff can open everything for QA of the content.
 */
export async function canAccessWebsite(userId: string, role: string, site: AccessTarget): Promise<boolean> {
  if (role !== "LEARNER") return true;
  if (site.accessRule === "FREE" && site.level.accessRule === "FREE") return true;
  const now = new Date();
  const hit = await db.entitlement.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [{ websiteId: site.id }, { levelId: site.levelId }],
      AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }],
    },
    select: { id: true },
  });
  return !!hit;
}

export async function entitlementIndex(userId: string | null) {
  if (!userId) return { websiteIds: new Set<string>(), levelIds: new Set<string>() };
  const rows = await db.entitlement.findMany({
    where: { userId, status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: { websiteId: true, levelId: true },
  });
  return {
    websiteIds: new Set(rows.flatMap((r) => (r.websiteId ? [r.websiteId] : []))),
    levelIds: new Set(rows.flatMap((r) => (r.levelId ? [r.levelId] : []))),
  };
}

export function isUnlocked(
  site: { id: string; accessRule: string; levelId: string },
  level: { accessRule: string },
  idx: { websiteIds: Set<string>; levelIds: Set<string> },
  role?: string,
) {
  if (role && role !== "LEARNER") return true;
  if (site.accessRule === "FREE" && level.accessRule === "FREE") return true;
  return idx.websiteIds.has(site.id) || idx.levelIds.has(site.levelId);
}
