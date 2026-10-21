import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { LEARN_CATEGORIES } from "@/lib/constants";
import { parseJson } from "@/lib/utils";
import { saveArticleAction } from "@/actions/admin";
import { AdminHeading, Flash, Panel, input, labelCls } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Article" };

export default async function ArticleEditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("content");
  const { id } = await params;
  const sp = await searchParams;
  const a = id === "new" ? null : await db.article.findUnique({ where: { id } });
  if (id !== "new" && !a) notFound();

  return (
    <>
      <Link href="/admin/articles" className="text-sm font-medium text-muted hover:text-ink">← Articles</Link>
      <AdminHeading title={a ? a.title : "New article"} />
      <Flash ok={sp.ok} error={sp.error} />
      <Panel>
        <form action={saveArticleAction.bind(null, id)} className="grid gap-4">
          <label className={labelCls}>Title<input name="title" defaultValue={a?.title} required className={input} /></label>
          {!a && <label className={labelCls}>URL slug (optional)<input name="slug" className={input} placeholder="generated from the title" /></label>}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}>Category<select name="category" defaultValue={a?.category ?? LEARN_CATEGORIES[0].slug} className={input}>{LEARN_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
            <label className={labelCls}>Status<select name="status" defaultValue={a?.status ?? "DRAFT"} className={input}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
          </div>
          <label className={labelCls}>Summary / introduction<textarea name="summary" defaultValue={a?.summary} rows={2} className={`${input} resize-y`} /></label>
          <label className={labelCls}>Body (markdown)<textarea name="body" defaultValue={a?.body} rows={18} className={`${input} resize-y font-mono !text-[13px]`} /></label>
          <label className={labelCls}>Related article slugs (comma separated)<input name="related" defaultValue={parseJson<string[]>(a?.related, []).join(", ")} className={input} /></label>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Save article</Button>
            {a?.status === "PUBLISHED" && <Button href={`/learn/${a.slug}`} variant="light" size="sm" external>View live</Button>}
          </div>
        </form>
      </Panel>
    </>
  );
}
