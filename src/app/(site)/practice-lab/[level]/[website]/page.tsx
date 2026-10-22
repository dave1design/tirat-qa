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
import { getT } from "@/lib/i18n/server";

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
  const t = await getT();
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
            <h1 className="h-section mt-6 !text-[clamp(2rem,4.5vw,3rem)] text-balance">{t("This Challenge Isn't Available Yet.")}</h1>
            <p className="lead mt-4">{t("You don't currently have access to this practice challenge.")}</p>
            <p className="lead mt-2">{t("Return to the Practice Lab to explore the challenges available to you.")}</p>
            <div className="mt-8 flex justify-center">
              <Button href="/practice-lab" variant="light">{t("Back to Practice Lab")}</Button>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-[620px] rounded-[32px] bg-card p-7 sm:p-9">
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">{t(site.name)}</h2>
            <p className="mt-1 text-muted">{t(site.description)}</p>
            <p className="mt-5 rounded-2xl bg-white p-4 text-[15px]">
              <strong className="font-medium">{site.priceEtb} ETB</strong> — {t("one-time access to this practice website. Pay using the method shared by our team, then submit the payment reference below. Access is unlocked after the payment is confirmed.")}
            </p>
            <div className="mt-6">
              {pending ? (
                <p role="status" className="rounded-2xl bg-[#e6efff] px-4 py-3 text-brand">
                  {t("Your payment is pending confirmation (reference {ref}). We'll unlock access as soon as it's verified.", { ref: pending.reference })}
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
          <ChevronLeft className="size-4" aria-hidden /> {t("Level")} {String(site.level.number).padStart(2, "0")} — {t(site.level.name)}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>{site.accessRule === "FREE" ? t("Free") : `${site.priceEtb} ETB`}</Pill>
              <Pill>{t("About {n} minutes", { n: site.estimatedMinutes })}</Pill>
              <Pill>
                {t("Attempt {n} of {max}", { n: active ? active.attemptNumber : Math.min(used + 1, site.maxAttempts), max: site.maxAttempts })}
              </Pill>
            </div>
            <h1 className="h-section mt-5 text-balance">{t(site.name)}</h1>
            <p className="lead mt-4">
              {t("Explore this website as a QA tester. Investigate its features, test its behavior, and document any issues you discover.")}
            </p>

            <h2 className="mt-9 text-lg font-semibold tracking-[-0.02em]">{t("Instructions")}</h2>
            <ol className="mt-3 grid gap-2.5">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-3 text-[15px]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chip text-xs font-medium">{i + 1}</span>
                  <span className="pt-0.5">{t(s)}</span>
                </li>
              ))}
            </ol>

            <details id="instructions" className="group mt-8 rounded-3xl bg-card p-5" open={!active}>
              <summary className="cursor-pointer list-none font-medium">
                <span className="underline-offset-4 group-open:underline">{t("Testing instructions for this challenge")}</span>
              </summary>
              <p className="mt-3 font-medium">{t("Objective")}</p>
              <p className="text-[15px] text-muted">{site.objective}</p>
              <div className="prose-tirat mt-4 [&_p]:!text-[15px] [&_p]:!leading-relaxed">
                <ReactMarkdown>{site.instructions}</ReactMarkdown>
              </div>
            </details>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {active ? (
                <>
                  <Button href={site.appUrl} external arrow>
                    {t("Open Practice Website")}
                  </Button>
                  <Button href="#instructions" variant="light">
                    {t("View Testing Instructions")}
                  </Button>
                </>
              ) : canRetry ? (
                <form action={startAttemptAction.bind(null, site.id, path)}>
                  <Button type="submit" arrow>
                    {used === 0 ? t("Start Testing") : t("Practice Again")}
                  </Button>
                </form>
              ) : (
                <p className="rounded-2xl bg-card px-4 py-3 text-sm text-muted">
                  {t("You've used all {n} attempts for this website. Review your results below or try another website.", { n: site.maxAttempts })}
                </p>
              )}
            </div>
          </div>

          <div>
            {active ? (
              <div className="rounded-[32px] border border-line bg-white p-6 shadow-soft sm:p-8">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{t("Report a Bug")}</h2>
                <p className="mt-1 text-sm text-muted">{t("One report per issue. Your draft is saved on this device as you type.")}</p>
                <div className="mt-6">
                  <ReportForm attemptId={active.id} requireSeverity={site.requireSeverity} />
                </div>

                <div className="mt-10 border-t border-line pt-6">
                  <h3 className="font-medium">{t("Your reports in this attempt ({n})", { n: reports.length })}</h3>
                  {reports.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">{t("No reports yet. Reports are scored when you finish testing.")}</p>
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
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">{used === 0 ? t("Ready when you are") : t("Your attempts")}</h2>
                {used === 0 ? (
                  <p className="mt-2 text-muted">
                    {t("Start testing to open the practice website and unlock the bug report form. You'll see your results when you finish.")}
                  </p>
                ) : (
                  <ul className="mt-4 grid gap-2.5">
                    {attempts.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4">
                        <div>
                          <p className="font-medium">{t("Attempt {n}", { n: a.attemptNumber })}</p>
                          <p className="text-sm text-muted">
                            {formatDateTime(a.startedAt)} · {t("{n} reports", { n: a._count.reports })} · {t(ATTEMPT_STATUS_LABEL[a.status] ?? a.status)}
                          </p>
                        </div>
                        {a.finishedAt && (
                          <Button href={`/practice-lab/results/${a.id}`} variant="light" size="sm" arrow>
                            {t("Review Results")}
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
                {t("The practice website opens in a new tab. Keep this tab open to submit your reports.")}
              </p>
            )}
          </div>
        </div>
      </div>
    </PageTop>
  );
}
