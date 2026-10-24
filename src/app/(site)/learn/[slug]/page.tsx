import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { parseJson } from "@/lib/utils";
import { LEARN_CATEGORIES } from "@/lib/constants";
import { PageTop } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  return db.article.findFirst({ where: { slug, status: "PUBLISHED" } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await load((await params).slug);
  return a ? { title: a.title, description: a.summary } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await load((await params).slug);
  if (!article) notFound();

  const category = LEARN_CATEGORIES.find((c) => c.slug === article.category);
  const relatedSlugs = parseJson<string[]>(article.related, []);
  const related = relatedSlugs.length
    ? await db.article.findMany({ where: { slug: { in: relatedSlugs }, status: "PUBLISHED" }, select: { slug: true, title: true, summary: true } })
    : [];

  return (
    <PageTop className="pb-16">
      <article className="container-x">
        <div className="mx-auto max-w-[760px]">
          <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
            <ChevronLeft className="size-4" aria-hidden /> Learn
          </Link>
          <p className="mt-8">
            <span className="inline-flex h-[30px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">
              {category?.name ?? "Learn"}
            </span>
          </p>
          <h1 className="h-section mt-5 text-balance">{article.title}</h1>
          <p className="lead mt-5">{article.summary}</p>
          <div className="mt-10 border-t border-line pt-10">
            <div className="prose-tirat">
              <ReactMarkdown>{article.body}</ReactMarkdown>
            </div>
          </div>

          {related.length > 0 && (
            <aside className="mt-14" aria-labelledby="related-title">
              <h2 id="related-title" className="text-xl font-semibold tracking-[-0.03em]">
                Related Content
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/learn/${r.slug}`} className="block h-full rounded-2xl bg-card p-5 transition-colors hover:bg-chip">
                      <p className="font-medium tracking-[-0.02em]">{r.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{r.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="mt-14 flex flex-col items-start gap-4 rounded-[32px] bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[380px] text-lg font-medium leading-snug tracking-[-0.025em]">Put this into practice on a real website.</p>
            <Button href="/practice-lab" arrow>
              Practice Writing Bug Reports
            </Button>
          </div>
        </div>
      </article>
    </PageTop>
  );
}
