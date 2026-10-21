import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isStaff, requireUser } from "@/lib/auth";
import { loadLab, SITE_CTA } from "@/lib/lab";
import { ATTEMPT_STATUS_LABEL } from "@/lib/scoring/service";
import { formatDate } from "@/lib/utils";
import { PageTop } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Pill, StatusBadge } from "@/components/ui/StatusBadge";

export const metadata: Metadata = { title: "My Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  if (!user.onboardedAt && !isStaff(user.role)) redirect("/onboarding");

  const [levels, attempts, payments] = await Promise.all([
    loadLab(user),
    db.attempt.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      include: { website: { select: { name: true, slug: true, level: { select: { slug: true } } } }, _count: { select: { reports: true } } },
    }),
    db.payment.findMany({ where: { userId: user.id, status: "PENDING" } }),
  ]);

  const finished = attempts.filter((a) => a.finishedAt && a.score !== null && a.maxScore);
  const avg = finished.length ? Math.round((finished.reduce((s, a) => s + (a.score! / a.maxScore!) * 100, 0) / finished.length)) : null;
  const active = attempts.find((a) => a.status === "IN_PROGRESS");
  const sites = levels.flatMap((l) => l.sites.map((s) => ({ ...s, levelSlug: l.slug })));
  const next = sites.find((s) => s.unlocked && s.status === "NOT_STARTED");

  return (
    <PageTop className="pb-24">
      <div className="container-x">
        <p className="eyebrow text-muted">My dashboard</p>
        <h1 className="h-section mt-3 text-balance">Welcome back, {user.name.split(" ")[0]}.</h1>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[32px] bg-card p-7">
            <p className="text-sm text-muted">Attempts</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{attempts.length}</p>
          </div>
          <div className="rounded-[32px] bg-card p-7">
            <p className="text-sm text-muted">Completed</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{finished.length}</p>
          </div>
          <div className="rounded-[32px] bg-card p-7">
            <p className="text-sm text-muted">Average score</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{avg === null ? "—" : `${avg}%`}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[36px] bg-[#141414] p-8 text-white sm:p-10">
          {active ? (
            <>
              <p className="eyebrow text-white/60">Continue where you left off</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{active.website.name}</h2>
              <p className="mt-2 text-white/60">{active._count.reports} reports submitted in this attempt.</p>
              <div className="mt-6"><Button href={`/practice-lab/${active.website.level.slug}/${active.website.slug}`} variant="white" arrow>Continue Testing</Button></div>
            </>
          ) : next ? (
            <>
              <p className="eyebrow text-white/60">Up next</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{next.name}</h2>
              <p className="mt-2 max-w-[520px] text-white/60">{next.description}</p>
              <div className="mt-6"><Button href={`/practice-lab/${next.levelSlug}/${next.slug}`} variant="white" arrow>Start Testing</Button></div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">Your Next Challenge Starts Here.</h2>
              <p className="mt-2 text-white/60">Explore the Practice Lab to find your next practice website.</p>
              <div className="mt-6"><Button href="/practice-lab" variant="white" arrow>Explore Practice Lab</Button></div>
            </>
          )}
        </div>

        {payments.length > 0 && (
          <div className="mt-6 rounded-3xl bg-[#e6efff] p-5 text-[15px] text-brand" role="status">
            {payments.length} payment {payments.length === 1 ? "is" : "s are"} pending confirmation. Access is unlocked once it&apos;s verified.
          </div>
        )}

        <h2 className="mt-14 text-2xl font-semibold tracking-[-0.03em]">Practice websites</h2>
        {sites.length === 0 ? (
          <p className="mt-4 rounded-3xl bg-card p-6 text-muted">There are no practice websites available yet. Check back soon for new challenges.</p>
        ) : (
          <ul className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((s) => (
              <li key={s.id} className="flex flex-col rounded-[28px] border border-line bg-white p-6">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={s.status} />
                  <Pill>{s.accessRule === "FREE" ? "Free" : `${s.priceEtb} ETB`}</Pill>
                </div>
                <p className="mt-4 text-lg font-medium tracking-[-0.02em]">{s.name}</p>
                <div className="mt-auto pt-5">
                  <Button
                    href={s.status === "COMPLETED" && s.latestAttemptId ? `/practice-lab/results/${s.latestAttemptId}` : `/practice-lab/${s.levelSlug}/${s.slug}`}
                    variant="light"
                    size="sm"
                    arrow
                  >
                    {SITE_CTA[s.status]}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-14 text-2xl font-semibold tracking-[-0.03em]">Recent attempts</h2>
        {attempts.length === 0 ? (
          <div className="mt-5 rounded-3xl bg-card p-8 text-center">
            <p className="text-2xl font-semibold tracking-[-0.03em]">No Results Yet.</p>
            <p className="mt-2 text-muted">Complete a practice challenge to see your results and feedback here.</p>
            <div className="mt-5 flex justify-center"><Button href="/practice-lab" arrow>Explore Practice Lab</Button></div>
          </div>
        ) : (
          <ul className="mt-5 grid gap-2.5">
            {attempts.slice(0, 8).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card px-5 py-4">
                <div>
                  <p className="font-medium">{a.website.name} <span className="text-muted">· Attempt {a.attemptNumber}</span></p>
                  <p className="text-sm text-muted">
                    {formatDate(a.startedAt)} · {a._count.reports} reports · {ATTEMPT_STATUS_LABEL[a.status] ?? a.status}
                    {a.score !== null && a.maxScore ? ` · ${a.score}/${a.maxScore}` : ""}
                  </p>
                </div>
                {a.finishedAt ? (
                  <Link href={`/practice-lab/results/${a.id}`} className="text-sm font-medium underline underline-offset-4">Review Results</Link>
                ) : (
                  <Link href={`/practice-lab/${a.website.level.slug}/${a.website.slug}`} className="text-sm font-medium underline underline-offset-4">Continue</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTop>
  );
}
