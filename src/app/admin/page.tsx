import Link from "next/link";
import { db } from "@/lib/db";
import { hasCapability, requireStaff } from "@/lib/auth";
import { parseJson } from "@/lib/utils";
import { isValidBug } from "@/lib/keywords";
import { AdminHeading, Panel, Stat, Tag } from "@/components/admin/ui";

export default async function AdminOverview() {
  const user = await requireStaff();
  const since = new Date(Date.now() - 30 * 86400000);

  const [learners, attempts, finished, reports, review, pendingPay, newMsgs, events, sites] = await Promise.all([
    db.user.count({ where: { role: "LEARNER" } }),
    db.attempt.count(),
    db.attempt.count({ where: { finishedAt: { not: null } } }),
    db.bugReport.count(),
    db.bugReport.count({ where: { status: "NEEDS_REVIEW", attempt: { finishedAt: { not: null } } } }),
    db.payment.count({ where: { status: "PENDING" } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.analyticsEvent.groupBy({ by: ["name"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    db.practiceWebsite.findMany({ include: { level: { select: { number: true } }, bugs: true, _count: { select: { attempts: true } } }, orderBy: [{ levelId: "asc" }, { order: "asc" }] }),
  ]);
  const ev = Object.fromEntries(events.map((e) => [e.name, e._count._all]));
  const funnel: [string, string][] = [
    ["signup_completed", "Sign-ups"],
    ["onboarding_completed", "Onboarding completed"],
    ["attempt_started", "Attempts started"],
    ["bug_report_submitted", "Bug reports submitted"],
    ["attempt_finished", "Attempts finished"],
    ["result_viewed", "Results viewed"],
    ["payment_started", "Payments started"],
  ];
  const max = Math.max(1, ...funnel.map(([k]) => ev[k] ?? 0));

  return (
    <>
      <AdminHeading title={`Hello, ${user.name.split(" ")[0]}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Learners" value={learners} />
        <Stat label="Attempts" value={attempts} hint={`${finished} finished`} />
        <Stat label="Bug reports" value={reports} />
        <Stat label="Awaiting review" value={review} hint={hasCapability(user.role, "review") ? undefined : "Reviewer access required"} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Stat label="Pending payments" value={pendingPay} />
        <Stat label="New messages" value={newMsgs} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Learner funnel — last 30 days">
          <ul className="grid gap-3">
            {funnel.map(([k, label]) => (
              <li key={k}>
                <div className="flex justify-between text-sm"><span>{label}</span><span className="font-medium">{ev[k] ?? 0}</span></div>
                <div className="mt-1 h-2 rounded-full bg-chip"><div className="h-2 rounded-full bg-brand" style={{ width: `${((ev[k] ?? 0) / max) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Content health">
          <ul className="divide-y divide-line">
            {sites.map((s) => {
              const current = s.bugs.filter((b) => b.version === s.version && b.active);
              const valid = current.length > 0 && current.every((b) => isValidBug({ ...b, keywordGroups: parseJson<string[][]>(b.keywordGroups, []) }));
              return (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-[15px]">
                  <Link href={`/admin/content/${s.id}`} className="font-medium hover:underline">{s.name}</Link>
                  <span className="flex gap-1.5">
                    <Tag tone={s.status === "PUBLISHED" ? "green" : "gray"}>{s.status.toLowerCase()}</Tag>
                    <Tag tone={valid ? "green" : "red"}>{current.length} bugs{valid ? "" : " · incomplete"}</Tag>
                    <Tag>{s._count.attempts} attempts</Tag>
                  </span>
                </li>
              );
            })}
            {sites.length === 0 && <li className="py-3 text-muted">No practice websites yet.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}
