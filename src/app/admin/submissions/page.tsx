import Link from "next/link";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { REPORT_STATUS_LABEL } from "@/lib/scoring/service";
import { AdminHeading, Flash, Panel, Tag, input } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Submissions" };

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ status?: string; site?: string; ok?: string; error?: string }> }) {
  await requireCapability("review");
  const sp = await searchParams;
  const status = sp.status ?? "NEEDS_REVIEW";
  const [sites, reports] = await Promise.all([
    db.practiceWebsite.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.bugReport.findMany({
      where: {
        attempt: { finishedAt: { not: null }, ...(sp.site ? { websiteId: sp.site } : {}) },
        ...(status !== "ALL" ? { status } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: { attempt: { select: { user: { select: { name: true, email: true } }, website: { select: { name: true } }, attemptNumber: true } } },
    }),
  ]);

  return (
    <>
      <AdminHeading title="Submissions" />
      <Flash ok={sp.ok} error={sp.error} />
      <form className="mb-6 flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm font-medium">
          Status
          <select name="status" defaultValue={status} className={input}>
            <option value="NEEDS_REVIEW">Needs review</option>
            <option value="UNSUPPORTED">Not matched</option>
            <option value="MATCHED">Valid</option>
            <option value="DUPLICATE">Duplicate</option>
            <option value="ALL">All</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Website
          <select name="site" defaultValue={sp.site ?? ""} className={input}>
            <option value="">All websites</option>
            {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <Button type="submit" variant="light" size="sm">Filter</Button>
      </form>
      <Panel>
        {reports.length === 0 ? (
          <p className="py-6 text-center text-muted">Nothing here. The review queue is clear.</p>
        ) : (
          <ul className="divide-y divide-line">
            {reports.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/submissions/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-card/60 sm:px-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.title}</p>
                    <p className="text-sm text-muted">
                      {r.attempt.user.name} · {r.attempt.website.name} · attempt {r.attempt.attemptNumber} · {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                  <Tag tone={r.status === "NEEDS_REVIEW" ? "blue" : r.status === "MATCHED" ? "green" : r.status === "UNSUPPORTED" ? "red" : "amber"}>
                    {REPORT_STATUS_LABEL[r.status] ?? r.status}
                  </Tag>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
