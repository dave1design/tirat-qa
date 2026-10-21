import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "./db";
import { readSession } from "./session";
import { ADMIN_ROLES, CAPABILITIES, type Capability, type Role } from "./constants";

export const getCurrentUser = cache(async () => {
  const id = await readSession();
  if (!id) return null;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true, onboardedAt: true, experienceLevel: true, learningGoal: true },
  });
  if (!user || user.status !== "ACTIVE") return null;
  return user;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function requireUser(next?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

export function hasCapability(role: string, cap: Capability) {
  return (CAPABILITIES[cap] as readonly string[]).includes(role);
}

export function isStaff(role: string) {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}

/** Guard for admin pages and actions. Redirects non-staff; throws for staff lacking the capability. */
export async function requireCapability(cap: Capability): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (!isStaff(user.role)) redirect("/dashboard");
  if (!hasCapability(user.role, cap)) redirect("/admin");
  return user;
}

export async function requireStaff(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (!isStaff(user.role as Role)) redirect("/dashboard");
  return user;
}
