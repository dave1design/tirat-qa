import "server-only";
import { db } from "./db";
import type { SiteStatus } from "./lab-labels";
export { SITE_STATUS_LABEL, type SiteStatus } from "./lab-labels";
import { entitlementIndex, isUnlocked } from "./access";
import { parseJson } from "./utils";

export const SITE_CTA: Record<SiteStatus, string> = {
  NOT_STARTED: "Start Testing",
  IN_PROGRESS: "Continue Testing",
  COMPLETED: "Review Results",
  LOCKED: "View Details",
};

/** Published levels with only the websites that actually exist, annotated with this learner's status. */
export async function loadLab(user: { id: string; role: string } | null) {
  const levels = await db.level.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: {
      websites: {
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
        select: { id: true, slug: true, name: true, description: true, skills: true, accessRule: true, levelId: true, priceEtb: true, estimatedMinutes: true },
      },
    },
  });
  const idx = await entitlementIndex(user?.id ?? null);
  const attempts = user
    ? await db.attempt.findMany({
        where: { userId: user.id },
        select: { id: true, websiteId: true, status: true, finishedAt: true },
        orderBy: { startedAt: "desc" },
      })
    : [];

  return levels
    .filter((l) => l.websites.length > 0)
    .map((l) => ({
      ...l,
      skillList: parseJson<string[]>(l.skills, []),
      sites: l.websites.map((w) => {
        const unlocked = isUnlocked(w, l, idx, user?.role);
        const mine = attempts.filter((a) => a.websiteId === w.id);
        let status: SiteStatus = "NOT_STARTED";
        if (!unlocked) status = "LOCKED";
        else if (mine.some((a) => a.status === "IN_PROGRESS")) status = "IN_PROGRESS";
        else if (mine.length > 0) status = "COMPLETED";
        return { ...w, skillList: parseJson<string[]>(w.skills, []), unlocked, status, latestAttemptId: mine.find((a) => a.finishedAt)?.id ?? null };
      }),
    }));
}

export function levelAccessLabel(sites: { unlocked: boolean; accessRule: string }[]) {
  if (sites.every((s) => s.accessRule === "FREE")) return "Free";
  if (sites.some((s) => s.accessRule === "FREE")) return "Free + Paid";
  return "Paid";
}
