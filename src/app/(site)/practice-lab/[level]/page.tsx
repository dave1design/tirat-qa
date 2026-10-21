import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { loadLab, SITE_CTA } from "@/lib/lab";
import { PageTop } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Pill, StatusBadge } from "@/components/ui/StatusBadge";
import { Reveal } from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  return { title: `Practice Level ${(await params).level.replace("level-", "")}` };
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  const user = await getCurrentUser();
  const level = (await loadLab(user)).find((l) => l.slug === slug);
  if (!level) notFound();

  return (
    <PageTop className="pb-24">
      <div className="container-x">
        <Link href="/practice-lab" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> Practice Lab
        </Link>
        <Reveal className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h1 className="h-section text-balance">
              Level {String(level.number).padStart(2, "0")} — {level.name}
            </h1>
            <p className="lead mt-5 max-w-[560px]">{level.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Skills you&apos;ll practice</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {level.skillList.map((s) => (
                <li key={s} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px]">{s}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <h2 className="mt-16 text-2xl font-semibold tracking-[-0.03em]">Practice Websites</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {level.sites.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <article className="flex h-full flex-col rounded-[32px] bg-card p-7">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={s.status} />
                  <Pill>{s.accessRule === "FREE" ? "Free" : `${s.priceEtb} ETB`}</Pill>
                </div>
                <h3 className="mt-6 text-2xl font-medium leading-tight tracking-[-0.035em]">{s.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {s.skillList.map((k) => (
                    <li key={k} className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-muted">{k}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted">About {s.estimatedMinutes} minutes</p>
                <div className="mt-auto pt-6">
                  <Button
                    href={s.status === "COMPLETED" && s.latestAttemptId ? `/practice-lab/results/${s.latestAttemptId}` : `/practice-lab/${level.slug}/${s.slug}`}
                    variant={s.status === "LOCKED" ? "light" : "dark"}
                    arrow
                  >
                    {SITE_CTA[s.status]}
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </PageTop>
  );
}
