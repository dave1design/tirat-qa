import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { parseJson } from "@/lib/utils";
import { SEVERITIES } from "@/lib/constants";
import { formatKeywordGroups, isValidBug } from "@/lib/keywords";
import { deleteBugAction, newVersionAction, saveBugAction, updateWebsiteAction } from "@/actions/admin";
import { AdminHeading, Flash, Panel, Tag, input, labelCls } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Practice website" };

function BugForm({ siteId, bug }: { siteId: string; bug?: { id: string; code: string; title: string; description: string; category: string; learningTopic: string; severity: string; points: number; expectedBehavior: string; keywordGroups: string; active: boolean } }) {
  const groups = bug ? parseJson<string[][]>(bug.keywordGroups, []) : [];
  return (
    <form action={saveBugAction.bind(null, siteId, bug?.id ?? "new")} className="grid gap-3 sm:grid-cols-2">
      <label className={labelCls}>Code<input name="code" defaultValue={bug?.code} className={input} placeholder="BUG-07" readOnly={!!bug} /></label>
      <label className={labelCls}>Title (internal)<input name="title" defaultValue={bug?.title} required className={input} /></label>
      <label className={`${labelCls} sm:col-span-2`}>Internal description<textarea name="description" defaultValue={bug?.description} rows={2} className={`${input} resize-y`} /></label>
      <label className={labelCls}>Category<input name="category" defaultValue={bug?.category} className={input} /></label>
      <label className={labelCls}>Learning topic (shown to learners if missed)<input name="learningTopic" defaultValue={bug?.learningTopic} required className={input} /></label>
      <label className={labelCls}>Severity<select name="severity" defaultValue={bug?.severity ?? "MEDIUM"} className={input}>{SEVERITIES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}</select></label>
      <label className={labelCls}>Points<input name="points" type="number" min={1} defaultValue={bug?.points ?? 10} className={input} /></label>
      <label className={`${labelCls} sm:col-span-2`}>Expected behavior<input name="expectedBehavior" defaultValue={bug?.expectedBehavior} className={input} /></label>
      <label className={`${labelCls} sm:col-span-2`}>
        Matching rules — one group per line, alternative terms separated by “|” (a report matches a bug when most groups are present)
        <textarea name="keywords" defaultValue={formatKeywordGroups(groups)} rows={5} className={`${input} resize-y font-mono !text-[13px]`} />
      </label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={bug?.active ?? true} className="size-4 accent-ink" /> Active</label>
      <div className="flex justify-end sm:col-span-2"><Button type="submit" size="sm">{bug ? "Save bug" : "Add bug"}</Button></div>
    </form>
  );
}

export default async function WebsiteAdminPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("content");
  const { id } = await params;
  const sp = await searchParams;
  const site = await db.practiceWebsite.findUnique({
    where: { id },
    include: { level: { select: { number: true, name: true } }, bugs: { where: {}, orderBy: [{ version: "desc" }, { code: "asc" }] }, _count: { select: { attempts: true } } },
  });
  if (!site) notFound();
  const current = site.bugs.filter((b) => b.version === site.version);

  return (
    <>
      <Link href="/admin/content" className="text-sm font-medium text-muted hover:text-ink">← Practice Lab</Link>
      <AdminHeading title={site.name}>
        <span className="flex gap-1.5"><Tag tone={site.status === "PUBLISHED" ? "green" : "gray"}>{site.status.toLowerCase()}</Tag><Tag>version {site.version}</Tag><Tag>{site._count.attempts} attempts</Tag></span>
      </AdminHeading>
      <Flash ok={sp.ok} error={sp.error} />

      <div className="grid gap-6">
        <Panel title="Challenge details">
          <form action={updateWebsiteAction.bind(null, site.id)} className="grid gap-3 sm:grid-cols-2">
            <label className={labelCls}>Name<input name="name" defaultValue={site.name} required className={input} /></label>
            <label className={labelCls}>Application URL / path<input name="appUrl" defaultValue={site.appUrl} required className={input} /></label>
            <label className={`${labelCls} sm:col-span-2`}>Short description<input name="description" defaultValue={site.description} className={input} /></label>
            <label className={`${labelCls} sm:col-span-2`}>Skills (comma separated)<input name="skills" defaultValue={parseJson<string[]>(site.skills, []).join(", ")} className={input} /></label>
            <label className={`${labelCls} sm:col-span-2`}>Objective<input name="objective" defaultValue={site.objective} className={input} /></label>
            <label className={`${labelCls} sm:col-span-2`}>Instructions, scope and permitted tools (markdown)<textarea name="instructions" defaultValue={site.instructions} rows={7} className={`${input} resize-y`} /></label>
            <label className={labelCls}>Estimated minutes<input name="estimatedMinutes" type="number" min={1} defaultValue={site.estimatedMinutes} className={input} /></label>
            <label className={labelCls}>Max attempts per learner<input name="maxAttempts" type="number" min={1} defaultValue={site.maxAttempts} className={input} /></label>
            <label className={labelCls}>Access<select name="accessRule" defaultValue={site.accessRule} className={input}><option value="FREE">Free</option><option value="PAID">Paid</option></select></label>
            <label className={labelCls}>Price (ETB)<input name="priceEtb" type="number" min={0} defaultValue={site.priceEtb} className={input} /></label>
            <label className={labelCls}>Status<select name="status" defaultValue={site.status} className={input}>{["DRAFT", "REVIEW", "PUBLISHED", "PAUSED", "RETIRED"].map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}</select></label>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm"><input type="checkbox" name="requireSeverity" defaultChecked={site.requireSeverity} className="size-4 accent-ink" /> Learners must choose a severity</label>
            <div className="sm:col-span-2"><Button type="submit" size="sm">Save challenge</Button></div>
          </form>
        </Panel>

        <Panel title={`Bug registry — version ${site.version}`}>
          <p className="mb-4 text-sm text-muted">
            This is the private answer key. It is never sent to learners. Editing changes the current version; once learners have attempts, create a new version so past attempts keep the key they were scored against.
          </p>
          <div className="grid gap-3">
            {current.map((b) => {
              const ok = isValidBug({ ...b, keywordGroups: parseJson<string[][]>(b.keywordGroups, []) });
              return (
                <details key={b.id} className="rounded-2xl border border-line p-4">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
                    <span className="font-medium"><span className="font-mono text-sm text-muted">{b.code}</span> {b.title}</span>
                    <span className="flex gap-1.5"><Tag>{b.severity.toLowerCase()}</Tag><Tag>{b.points} pts</Tag>{!b.active && <Tag tone="amber">inactive</Tag>}{!ok && <Tag tone="red">incomplete</Tag>}</span>
                  </summary>
                  <div className="mt-4"><BugForm siteId={site.id} bug={b} /></div>
                  <form action={deleteBugAction.bind(null, site.id, b.id)} className="mt-3 flex justify-end">
                    <ConfirmButton message={`Delete ${b.code}? If learner reports reference it, it will be deactivated instead.`}>Delete bug</ConfirmButton>
                  </form>
                </details>
              );
            })}
            {current.length === 0 && <p className="text-muted">No bugs in this version yet.</p>}
          </div>
          <details className="mt-5 rounded-2xl bg-card p-4">
            <summary className="cursor-pointer font-medium">Add a bug</summary>
            <div className="mt-4"><BugForm siteId={site.id} /></div>
          </details>
          <form action={newVersionAction.bind(null, site.id)} className="mt-5 flex justify-end">
            <ConfirmButton message="Create a new registry version? New attempts will use it; existing attempts keep the current one.">Create new version</ConfirmButton>
          </form>
        </Panel>
      </div>
    </>
  );
}
