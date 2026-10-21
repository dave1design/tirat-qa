import Link from "next/link";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { parseJson } from "@/lib/utils";
import { createLevelAction, createWebsiteAction, updateLevelAction } from "@/actions/admin";
import { AdminHeading, Flash, Panel, Tag, input, labelCls } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Practice Lab" };

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("content");
  const sp = await searchParams;
  const levels = await db.level.findMany({
    orderBy: { number: "asc" },
    include: { websites: { orderBy: { order: "asc" }, include: { _count: { select: { bugs: true, attempts: true } } } } },
  });

  return (
    <>
      <AdminHeading title="Practice Lab" />
      <Flash ok={sp.ok} error={sp.error} />
      <p className="mb-6 max-w-[680px] text-sm text-muted">
        Hierarchy: Practice Lab → Level → Practice Website → bug registry. Only published levels and websites appear to learners, and a website can&apos;t be published without a valid bug registry.
      </p>

      <div className="grid gap-6">
        {levels.map((l) => (
          <Panel key={l.id}>
            <details>
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-[-0.02em]">Level {l.number} — {l.name}</span>
                <span className="flex gap-1.5">
                  <Tag tone={l.status === "PUBLISHED" ? "green" : "gray"}>{l.status.toLowerCase()}</Tag>
                  <Tag>{l.accessRule === "FREE" ? "free" : `${l.priceEtb} ETB`}</Tag>
                  <Tag>{l.websites.length} websites</Tag>
                  <span className="text-sm text-brand">Edit level</span>
                </span>
              </summary>
              <form action={updateLevelAction.bind(null, l.id)} className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className={labelCls}>Name<input name="name" defaultValue={l.name} className={input} required /></label>
                <label className={labelCls}>Difficulty<input name="difficulty" defaultValue={l.difficulty} className={input} required /></label>
                <label className={`${labelCls} sm:col-span-2`}>Description<textarea name="description" defaultValue={l.description} rows={2} className={`${input} resize-y`} /></label>
                <label className={`${labelCls} sm:col-span-2`}>Skills (comma separated)<input name="skills" defaultValue={parseJson<string[]>(l.skills, []).join(", ")} className={input} /></label>
                <label className={labelCls}>Access<select name="accessRule" defaultValue={l.accessRule} className={input}><option value="FREE">Free</option><option value="PAID">Paid</option></select></label>
                <label className={labelCls}>Price (ETB)<input name="priceEtb" type="number" min={0} defaultValue={l.priceEtb} className={input} /></label>
                <label className={labelCls}>Status<select name="status" defaultValue={l.status} className={input}>{["DRAFT", "PUBLISHED", "PAUSED", "RETIRED"].map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}</select></label>
                <div className="flex items-end"><Button type="submit" size="sm">Save level</Button></div>
              </form>
            </details>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {l.websites.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <Link href={`/admin/content/${w.id}`} className="font-medium hover:underline">{w.name}</Link>
                  <span className="flex flex-wrap gap-1.5">
                    <Tag tone={w.status === "PUBLISHED" ? "green" : w.status === "DRAFT" ? "gray" : "amber"}>{w.status.toLowerCase()}</Tag>
                    <Tag>{w.accessRule === "FREE" ? "free" : `${w.priceEtb} ETB`}</Tag>
                    <Tag>v{w.version} · {w._count.bugs} registry rows</Tag>
                    <Tag>{w._count.attempts} attempts</Tag>
                  </span>
                </li>
              ))}
              {l.websites.length === 0 && <li className="py-3 text-muted">No websites in this level yet.</li>}
            </ul>
          </Panel>
        ))}

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Add a practice website">
            <form action={createWebsiteAction} className="grid gap-3">
              <label className={labelCls}>Level<select name="levelId" required className={input}>{levels.map((l) => <option key={l.id} value={l.id}>Level {l.number} — {l.name}</option>)}</select></label>
              <label className={labelCls}>Name<input name="name" required className={input} /></label>
              <label className={labelCls}>Short description<input name="description" className={input} /></label>
              <label className={labelCls}>Application URL or path<input name="appUrl" className={input} placeholder="/sandbox/your-app or https://…" /></label>
              <div><Button type="submit" size="sm">Create draft</Button></div>
            </form>
          </Panel>
          <Panel title="Add a level">
            <form action={createLevelAction} className="grid gap-3">
              <label className={labelCls}>Name<input name="name" required className={input} placeholder="Intermediate" /></label>
              <label className={labelCls}>Number<input name="number" type="number" min={1} required className={input} /></label>
              <label className={labelCls}>Access<select name="accessRule" className={input}><option value="FREE">Free</option><option value="PAID">Paid</option></select></label>
              <label className={labelCls}>Price (ETB)<input name="priceEtb" type="number" min={0} defaultValue={0} className={input} /></label>
              <div><Button type="submit" size="sm">Create draft</Button></div>
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
