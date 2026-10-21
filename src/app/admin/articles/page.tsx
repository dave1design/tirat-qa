import Link from "next/link";
import { db } from "@/lib/db";
import { requireCapability } from "@/lib/auth";
import { LEARN_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { AdminHeading, Flash, Panel, Tag } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Articles" };

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireCapability("content");
  const sp = await searchParams;
  const articles = await db.article.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return (
    <>
      <AdminHeading title="Articles"><Button href="/admin/articles/new" size="sm">New article</Button></AdminHeading>
      <Flash ok={sp.ok} error={sp.error} />
      <Panel>
        <ul className="divide-y divide-line">
          {articles.map((a) => (
            <li key={a.id}>
              <Link href={`/admin/articles/${a.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:bg-card/60 sm:px-2">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted">/learn/{a.slug} · {LEARN_CATEGORIES.find((c) => c.slug === a.category)?.name} · updated {formatDate(a.updatedAt)}</p>
                </div>
                <Tag tone={a.status === "PUBLISHED" ? "green" : "gray"}>{a.status.toLowerCase()}</Tag>
              </Link>
            </li>
          ))}
          {articles.length === 0 && <li className="py-4 text-muted">No articles yet.</li>}
        </ul>
      </Panel>
    </>
  );
}
