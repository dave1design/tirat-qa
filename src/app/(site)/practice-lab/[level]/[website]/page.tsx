import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ChevronLeft, ExternalLink, Lock } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canAccessWebsite } from "@/lib/access";
import { formatDateTime } from "@/lib/utils";
import { PageTop } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/StatusBadge";
import { ReportForm } from "@/components/practice/ReportForm";
import { FinishAttempt } from "@/components/practice/FinishAttempt";
import { RequestAccessForm } from "@/components/practice/RequestAccessForm";
import { startAttemptAction } from "@/actions/practice";
import { ATTEMPT_STATUS_LABEL } from "@/lib/scoring/service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Practice Website" };

const STEPS = [
  "Explore the website and understand its main purpose.",
  "Test its available features and user flows.",
  "Look for unexpected behavior.",
  "Submit a clear bug report for each issue you identify.",
  "Review your findings when the challenge is complete.",
];

export default async function WebsitePage({ params }: { params: Promise<{ level: string; website: string }> }) {
  const { level: levelSlug, website: siteSlug } = await params;
  const path = `/practice-lab/${levelSlug}/${siteSlug}`;
  const user = await requireUser(path);

  const site = await db.practiceWebsite.findFirst({
    where: { slug: siteSlug, status: "PUBLISHED", level: { slug: levelSlug, status: "PUBLISHED" } },
    include: { level: { select: { id: true, slug: true, number: true, name: true, accessRule: true } } },
  });
  if (!site) notFound();

  const allowed = await canAccessWebsite(user.id, user.role, site);

  if (!allowed) {
    const pending = await db.payment.findFirst({ where: { userId: user.id, status: "PENDING", OR: [{ websiteId: site.id }, { levelId: site.levelId }] } });
    return (
      <PageTop className="pb-24">
        <div className="container-x">
          <div className="mx-auto max-w-[620px] text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-chip"><Lock className="size-6" aria-hidden /></span>
            <h1 className="h-section mt-6 !text-[clamp(2rem,4.5vw,3rem)] text-balance">This Challenge Isn&apos;t Available Yet.</h1>
            <p className="lead mt-4">You don&apos;t currently have access to this practice challenge.</p>
            <p className="lead mt-2">Return to the Practice Lab to explore the challenges available to you.</p>
            <div className="mt-8 flex justify-center">
              <Button href="/practice-lab" variant="light">Back to Practice Lab</Button>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-[620px] rounded-[32px] bg-card p-7 sm:p-9">
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">{site.name}</h2>
            <p className="mt-1 text-muted">{site.description}</p>
            <p className="mt-5 rounded-2xl bg-white p-4 text-[15px]">
              <strong className="font-medium">{site.priceEtb} ETB</strong> — one-time access to this practice website. Pay using the method shared by our team, then submit
              the payment reference below. Access is unlocked after the payment is confirmed.
            </p>
            <div className="mt-6">
              {pending ? (
                <p role="status" className="rounded-2xl bg-[#e6efff] px-4 py-3 text-brand">
                  Your payment is pending confirmation (reference {pending.reference}). We&apos;ll unlock access as soon as it&apos;s verified.
                </p>
              ) : (
                <RequestAccessForm websiteId={site.id} levelId={site.levelId} />
              )}
            </div>
          </div>
        </div>
      </PageTop>
    );
  }

  const attempts = await db.attempt.findMany({
    where: { userId: user.id, websiteId: site.id },
    orderBy: { startedAt: "desc" },
    include: { _count: { select: { reports: true } } },
  });
  const active = attempts.find((a) => a.status === "IN_PROGRESS") ?? null;
  const used = attempts.length;
  const canRetry = user.role !== "LEARNER" || used < site.maxAttempts;

  const reports = active
    ? await db.bugReport.findMany({
        where: { attemptId: active.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
      })
    : [];

  return (
    <PageTop className="pb-24">
      <div className="container-x">
        <Link href={`/practice-lab/${site.level.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> Level {String(site.level.number).padStart(2, "0")} — {site.level.name}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>{site.accessRule === "FREE" ? "Free" : `${site.priceEtb} ETB`}</Pill>
              <Pill>About {site.estimatedMinutes} minutes</Pill>
              <Pill>
                Attempt {active ? active.attemptNumber : Math.min(used + 1, site.maxAttempts)} of {site.maxAttempts}
              </Pill>
            </div>
            <h1 className="h-section mt-5 text-balance">{site.name}</h1>
            <p className="lead mt-4">
              Explore this website as a QA tester. Investigate its features, test its behavior, and document any issues you discover.
            </p>

            <h2 className="mt-9 text-lg font-semibold tracking-[-0.02em]">Instructions</h2>
            <ol className="mt-3 grid gap-2.5">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-3 text-[15px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chip text-xs font-medium">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>

            <details id="instructions" className="group mt-8 rounded-3xl bg-card p-5" open={!active}>
              <summary className="cursor-pointer list-none font-medium">
                <span className="underline-offset-4 group-open:underline">Testing instructions for this challenge</span>
              </summary>
              <p className="mt-3 font-medium">Objective</p>
              <p className="text-[15px] text-muted">{site.objective}</p>
              <div className="prose-tirat mt-4 [&_p]:!text-[15px] [&_p]:!leading-relaxed">
                <ReactMarkdown>{site.instructions}</ReactMarkdown>
              </div>
            </details>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {active ? (
                <>
                  <Button href={site.appUrl} external arrow>
                    Open Practice Website
                  </Button>
                  <Button href="#instructions" variant="light">
                    View Testing Instructions
                  </Button>
                </>
              ) : canRetry ? (
                <form action={startAttemptAction.bind(null, site.id, path)}>
                  <Button type="submit" arrow>
                    {used === 0 ? "Start Testing" : "Practice Again"}
                  </Button>
                </form>
              ) : (
                <p className="rounded-2xl bg-card px-4 py-3 text-sm text-muted">
                  You&apos;ve used all {site.maxAttempts} attempts for this website. Review your results below or try another website.
                </p>
              )}
            </div>
          </div>

          <div>
            {active ? (
              <div className="rounded-[32px] border border-line bg-white p-6 shadow-soft sm:p-8">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Report a Bug</h2>
                <p className="mt-1 text-sm text-muted">One report per issue. Your draft is saved on this device as you type.</p>
                <div className="mt-6">
                  <ReportForm attemptId={active.id} requireSeverity={site.requireSeverity} />
                </div>

                <div className="mt-10 border-t border-line pt-6">
                  <h3 className="font-medium">Your reports in this attempt ({reports.length})</h3>
                  {reports.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">No reports yet. Reports are scored when you finish testing.</p>
                  ) : (
                    <ul className="mt-3 grid gap-2">
                      {reports.map((r) => (
                        <li key={r.id} className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 text-sm">
                          <span className="font-medium">{r.title}</span>
                          <span className="shrink-0 font-mono text-xs text-muted">TQ-{r.id.slice(-6).toUpperCase()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-6">
                    <FinishAttempt attemptId={active.id} reportCount={reports.length} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[32px] bg-card p-7 sm:p-9">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{used === 0 ? "Ready when you are" : "Your attempts"}</h2>
                {used === 0 ? (
                  <p className="mt-2 text-muted">
                    Start testing to open the practice website and unlock the bug report form. You&apos;ll see your results when you finish.
                  </p>
                ) : (
                  <ul className="mt-4 grid gap-2.5">
                    {attempts.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4">
                        <div>
                          <p className="font-medium">Attempt {a.attemptNumber}</p>
                          <p className="text-sm text-muted">
                            {formatDateTime(a.startedAt)} · {a._count.reports} reports · {ATTEMPT_STATUS_LABEL[a.status] ?? a.status}
                          </p>
                        </div>
                        {a.finishedAt && (
                          <Button href={`/practice-lab/results/${a.id}`} variant="light" size="sm" arrow>
                            Review Results
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {active && (
              <p className="mt-4 flex items-start gap-2 text-sm text-muted">
                <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden />
                The practice website opens in a new tab. Keep this tab open to submit your reports.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageTop>
  );
}
