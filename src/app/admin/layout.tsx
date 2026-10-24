import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { hasCapability, requireStaff } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/actions/auth";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Tirat Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  const [review, payments, messages] = await Promise.all([
    hasCapability(user.role, "review") ? db.bugReport.count({ where: { status: "NEEDS_REVIEW", attempt: { finishedAt: { not: null } } } }) : 0,
    hasCapability(user.role, "payments") ? db.payment.count({ where: { status: "PENDING" } }) : 0,
    hasCapability(user.role, "messages") ? db.contactMessage.count({ where: { status: "NEW" } }) : 0,
  ]);

  const items = [
    { href: "/admin", label: "Overview" },
    ...(hasCapability(user.role, "review") ? [{ href: "/admin/submissions", label: "Submissions", badge: review }] : []),
    ...(hasCapability(user.role, "content") ? [{ href: "/admin/content", label: "Practice Lab" }, { href: "/admin/articles", label: "Articles" }] : []),
    ...(hasCapability(user.role, "payments") ? [{ href: "/admin/payments", label: "Payments", badge: payments }] : []),
    ...(hasCapability(user.role, "users") ? [{ href: "/admin/users", label: "Users" }] : []),
    ...(hasCapability(user.role, "messages") ? [{ href: "/admin/messages", label: "Messages", badge: messages }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-4">
            <Logo className="[&>span:last-child]:text-lg [&>span:first-child]:!size-9" />
            <span className="rounded-lg bg-chip px-2.5 py-1 text-xs font-medium uppercase tracking-wider">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted sm:inline">
              {user.name} · {user.role.replace("_", " ").toLowerCase()}
            </span>
            <Link href="/" className="rounded-full px-3 py-2 text-sm font-medium text-muted hover:bg-chip">
              View site
            </Link>
            <form action={logoutAction}>
              <Button type="submit" size="sm">
                Log Out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-5 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <AdminNav items={items} />
        </aside>
        <main id="main" className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
