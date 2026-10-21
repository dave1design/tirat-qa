import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { formatDateTime, parseJson } from "@/lib/utils";
import { reviewReportAction } from "@/actions/admin";
import { REPORT_STATUS_LABEL } from "@/lib/scoring/service";
import { reportPoints } from "@/lib/scoring/score";
import { AdminHeading, Flash, Panel, Tag, input, labelCls } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Review report" };

const Block = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
    <p className="mt-1 whitespace-pre-wrap text-[15px]">{children || "—"}</p>
  </div>
);

export default async function ReviewPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("review");
  const { id } = await params;
  const sp = await searchParams;
  const report = await db.bugReport.findUnique({
    where: { id },
    include: { matchedBug: true, attempt: { include: { user: { select: { name: true, email: true } }, website: { select: { id: true, name: true, requireSeverity: true } } } } },
  });
  if (!report) notFound();

  const [registry, trail] = await Promise.all([
    db.bugRegistryItem.findMany({ where: { websiteId: report.attempt.websiteId, version: report.attempt.websiteVersion }, orderBy: { code: "asc" } }),
    db.auditLog.findMany({ where: { entity: "BugReport", entityId: id }, orderBy: { createdAt: "desc" } }),
  ]);
  const action = reviewReportAction.bind(null, id);

  return (
    <>
      <Link href="/admin/submissions" className="text-sm font-medium text-muted hover:text-ink">← Submissions</Link>
      <AdminHeading title={report.title}>
        <Tag tone={report.status === "MATCHED" ? "green" : report.status === "NEEDS_REVIEW" ? "blue" : "amber"}>{REPORT_STATUS_LABEL[report.status] ?? report.status}</Tag>
      </AdminHeading>
      <Flash ok={sp.ok} error={sp.error} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-6">
          <Panel title="Learner report">
            <div className="grid gap-4">
              <p className="text-sm text-muted">
                {report.attempt.user.name} ({report.attempt.user.email}) · {report.attempt.website.name} · attempt {report.attempt.attemptNumber} · {formatDateTime(report.createdAt)} ·{" "}
                <span className="font-mono">TQ-{report.id.slice(-6).toUpperCase()}</span>
              </p>
              <Block label="Steps to reproduce">{report.steps}</Block>
              <Block label="Expected result">{report.expected}</Block>
              <Block label="Actual result">{report.actual}</Block>
              <Block label="Description">{report.description}</Block>
              <div className="flex flex-wrap gap-6">
                <Block label="Severity chosen">{report.severity?.toLowerCase()}</Block>
                <Block label="Environment">{report.environment}</Block>
              </div>
              {report.evidencePath && (
                <a href={`/api/evidence/${report.id}`} target="_blank" rel="noreferrer" className="w-fit text-sm font-medium text-brand underline underline-offset-4">
                  Open screenshot
                </a>
              )}
            </div>
          </Panel>

          <Panel title="Automatic scoring">
            <p className="text-sm text-muted">
              Confidence {Math.round(report.confidence * 100)}% · {report.matchedBug ? `closest bug ${report.matchedBug.code} — ${report.matchedBug.title}` : "no close registry match"} · {reportPoints(report)} points
              {report.pointsOverride != null && " (reviewer override)"}
            </p>
            <p className="mt-2 text-[15px]">{report.feedback}</p>
            {report.reviewNote && <p className="mt-3 rounded-2xl bg-card px-4 py-3 text-sm"><strong className="font-medium">Last review note:</strong> {report.reviewNote}</p>}
          </Panel>

          {trail.length > 0 && (
            <Panel title="Audit trail">
              <ul className="grid gap-2 text-sm">
                {trail.map((t) => {
                  const m = parseJson<Record<string, string>>(t.meta, {});
                  return (
                    <li key={t.id} className="rounded-2xl bg-card px-4 py-3">
                      <span className="font-medium">{m.decision ?? t.action}</span> · {formatDateTime(t.createdAt)} — {m.reason}
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}
        </div>

        <Panel title="Review decision" className="h-fit">
          <form action={action} className="grid gap-4">
            <label className={labelCls}>
              Decision
              <select name="decision" className={input} defaultValue="CONFIRM" required>
                <option value="CONFIRM">Confirm as valid finding (match to bug)</option>
                <option value="DUPLICATE">Mark as duplicate</option>
                <option value="UNSUPPORTED">Reject — not a known issue</option>
                <option value="ADJUST">Adjust points manually</option>
              </select>
            </label>
            <label className={labelCls}>
              Registry bug (for “confirm”)
              <select name="bugId" className={input} defaultValue={report.matchedBugId ?? ""}>
                <option value="">Select…</option>
                {registry.map((b) => (
                  <option key={b.id} value={b.id}>{b.code} — {b.title} ({b.points} pts)</option>
                ))}
              </select>
            </label>
            <label className={labelCls}>
              Points (for “adjust”)
              <input name="points" type="number" min={0} className={input} placeholder="Total points for this report" />
            </label>
            <label className={labelCls}>
              Reason (required, kept in the audit trail)
              <textarea name="reason" required minLength={5} rows={3} className={`${input} resize-y`} />
            </label>
            <Button type="submit">Save decision</Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
