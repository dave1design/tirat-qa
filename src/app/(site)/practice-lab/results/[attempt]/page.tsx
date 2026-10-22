import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle, Check, Clock, CopyCheck, ImageIcon, X } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { track } from "@/lib/audit";
import { SCORING } from "@/lib/constants";
import { PageTop } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RequestReviewButton } from "@/components/practice/RequestReviewButton";
import { PENALTY_TEXT, REPORT_STATUS_LABEL } from "@/lib/scoring/service";
import { reportPoints } from "@/lib/scoring/score";
import { cn, formatDateTime } from "@/lib/utils";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your Testing Results", robots: { index: false } };

const badge: Record<string, { cls: string; icon: typeof Check }> = {
  MATCHED: { cls: "bg-ok-soft text-ok", icon: Check },
  DUPLICATE: { cls: "bg-[#fff4e5] text-[#b45309]", icon: CopyCheck },
  UNSUPPORTED: { cls: "bg-bad-soft text-bad", icon: X },
  NEEDS_REVIEW: { cls: "bg-[#e6efff] text-brand", icon: Clock },
  SUBMITTED: { cls: "bg-chip text-muted", icon: Clock },
};

export default async function ResultsPage({ params, searchParams }: { params: Promise<{ attempt: string }>; searchParams: Promise<{ done?: string }> }) {
  const t = await getT();
  const { attempt: id } = await params;
  const { done } = await searchParams;
  const user = await requireUser(`/practice-lab/results/${id}`);

  const attempt = await db.attempt.findFirst({
    where: { id, userId: user.id },
    include: {
      website: { select: { id: true, name: true, slug: true, maxAttempts: true, requireSeverity: true, level: { select: { slug: true } } } },
      reports: { orderBy: { createdAt: "asc" }, include: { matchedBug: { select: { category: true } } } },
    },
  });
  if (!attempt) notFound();
  if (!attempt.finishedAt) redirect(`/practice-lab/${attempt.website.level.slug}/${attempt.website.slug}`);

  const registry = await db.bugRegistryItem.findMany({
    where: { websiteId: attempt.websiteId, version: attempt.websiteVersion, active: true },
    select: { id: true, learningTopic: true },
  });
  const foundIds = new Set(attempt.reports.filter((r) => r.status === "MATCHED" && r.matchedBugId).map((r) => r.matchedBugId!));
  const missed = registry.filter((b) => !foundIds.has(b.id));
  const topics = [...new Set(missed.map((b) => b.learningTopic))];

  const pending = attempt.status === "UNDER_REVIEW";
  const total = attempt.reports.length;
  const valid = attempt.reports.filter((r) => r.status === "MATCHED").length;
  const badOnes = attempt.reports.filter((r) => r.status === "DUPLICATE" || r.status === "UNSUPPORTED").length;
  const reviewing = attempt.reports.filter((r) => r.status === "NEEDS_REVIEW").length;

  const score = attempt.score ?? 0;
  const max = attempt.maxScore ?? 0;
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  const earned = attempt.reports.reduce((s, r) => s + reportPoints(r), 0);
  const penalty = attempt.reports.filter((r) => r.status === "UNSUPPORTED" && r.pointsOverride == null).length * SCORING.falsePositivePenalty;

  const bd = attempt.reports.reduce(
    (a, r) => (r.pointsOverride != null || r.status !== "MATCHED" ? a : { bug: a.bug + r.bugPoints, q: a.q + r.qualityPoints, s: a.s + r.severityPoints }),
    { bug: 0, q: 0, s: 0 },
  );
  const adjusted = earned - bd.bug - bd.q - bd.s;

  const attemptsUsed = await db.attempt.count({ where: { userId: user.id, websiteId: attempt.websiteId } });
  const canRetry = user.role !== "LEARNER" || attemptsUsed < attempt.website.maxAttempts;
  const sitePath = `/practice-lab/${attempt.website.level.slug}/${attempt.website.slug}`;

  await track("result_viewed", user.id, { attemptId: id });

  return (
    <PageTop className="pb-24">
      <div className="container-x">
        <div className="mx-auto max-w-[900px]">
          {done === "1" && (
            <Reveal>
              <div className="mb-10 rounded-[36px] bg-[#141414] p-8 text-center text-white sm:p-12" role="status">
                <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">{t("You've Completed This Practice Challenge!")}</h2>
                <p className="mx-auto mt-4 max-w-[520px] text-white/65">
                  {t("You've finished your testing session. Review your results to understand what you identified and where you can improve.")}
                </p>
              </div>
            </Reveal>
          )}

          <p className="eyebrow text-muted">{t(attempt.website.name)} · {t("Attempt {n}", { n: attempt.attemptNumber })}</p>
          <h1 className="h-section mt-3">{t("Your Testing Results")}</h1>
          <p className="lead mt-3">{t("Review your findings and learn from the outcome of your testing session.")}</p>

          {pending && (
            <div className="mt-8 flex items-start gap-3 rounded-3xl bg-[#e6efff] p-5 text-brand" role="status">
              <Clock className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-[15px]">
                <strong className="font-medium">{t("Pending review.")}</strong> {t(reviewing === 1 ? "A reviewer is checking {n} report. The score below is provisional and may change." : "A reviewer is checking {n} reports. The score below is provisional and may change.", { n: reviewing })}
              </p>
            </div>
          )}
          {attempt.status === "CORRECTED" && (
            <div className="mt-8 flex items-start gap-3 rounded-3xl bg-[#fff4e5] p-5 text-[#b45309]" role="status">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-[15px]">
                <strong className="font-medium">{t("Score corrected.")}</strong> {t("A reviewer updated your score after reviewing your reports.")}
              </p>
            </div>
          )}

          <Reveal>
            <section aria-labelledby="overview" className="mt-10 grid gap-4 rounded-[36px] bg-card p-7 sm:grid-cols-[auto_1fr] sm:p-10">
              <div className="flex flex-col items-start justify-center sm:pr-10">
                <p id="overview" className="text-sm font-medium text-muted">{t("Overall score")}</p>
                <p className="mt-1 text-[clamp(3rem,7vw,4.5rem)] font-semibold leading-none tracking-[-0.05em]">
                  {score}
                  <span className="text-[0.4em] text-faint"> / {max}</span>
                </p>
                <p
                  className={cn(
                    "mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                    pending ? "bg-chip text-muted" : attempt.passed ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad",
                  )}
                >
                  {pending ? <Clock className="size-4" aria-hidden /> : attempt.passed ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
                  {pending ? t("Provisional") : attempt.passed ? t("Passed") : t("Not passed yet")} · {pct}%
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-3 self-center">
                {[
                  [t("Bug reports submitted"), total],
                  [t("Valid bug reports"), valid],
                  [t("Incorrect or duplicate"), badOnes],
                  [t("Expected findings not identified"), missed.length],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-2xl bg-white p-4">
                    <dd className="text-3xl font-semibold tracking-[-0.04em]">{v}</dd>
                    <dt className="mt-1 text-[13px] leading-snug text-muted">{k}</dt>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>

          <section className="mt-12" aria-labelledby="feedback-title">
            <h2 id="feedback-title" className="text-2xl font-semibold tracking-[-0.03em]">{t("Report Feedback")}</h2>
            {total === 0 ? (
              <p className="mt-4 rounded-3xl bg-card p-6 text-muted">{t("You didn't submit any bug reports in this attempt.")}</p>
            ) : (
              <ul className="mt-5 grid gap-3">
                {attempt.reports.map((r) => {
                  const b = badge[r.status] ?? badge.SUBMITTED;
                  const Icon = b.icon;
                  return (
                    <li key={r.id} className="rounded-3xl border border-line bg-white p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="text-lg font-medium leading-snug tracking-[-0.02em]">{r.title}</h3>
                        <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", b.cls)}>
                          <Icon className="size-3.5" aria-hidden />
                          {t(REPORT_STATUS_LABEL[r.status] ?? r.status)}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-muted">
                        TQ-{r.id.slice(-6).toUpperCase()} · {formatDateTime(r.createdAt)}
                        {r.evidencePath && (
                          <>
                            {" "}
                            ·{" "}
                            <a href={`/api/evidence/${r.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">
                              <ImageIcon className="size-3" aria-hidden /> {t("screenshot")}
                            </a>
                          </>
                        )}
                      </p>
                      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{r.feedback}</p>
                      {r.reviewNote && (
                        <p className="mt-3 rounded-2xl bg-card px-4 py-3 text-sm text-ink-2">
                          <strong className="font-medium">{t("Reviewer note:")}</strong> {r.reviewNote}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium">
                          {t(reportPoints(r) === 1 ? "{n} point" : "{n} points", { n: reportPoints(r) })}
                        </p>
                        {r.status === "UNSUPPORTED" && <RequestReviewButton reportId={r.id} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="mt-12 grid gap-4 md:grid-cols-2" aria-label={t("Missed findings and scoring")}>
            <div className="rounded-[32px] bg-card p-7">
              <h2 className="text-xl font-semibold tracking-[-0.03em]">{t("Findings to look for next time")}</h2>
              {topics.length === 0 ? (
                <p className="mt-3 text-muted">{t("You identified every expected finding. Nicely done.")}</p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-muted">
                    {t(missed.length === 1 ? "{n} expected finding was not identified" : "{n} expected findings were not identified", { n: missed.length })}{pending ? ` ${t("(may change after review)")}` : ""}. {t("Practice these areas:")}
                  </p>
                  <ul className="mt-4 grid gap-2">
                    {topics.map((topic) => (
                      <li key={topic} className="rounded-2xl bg-white px-4 py-3 text-[15px] font-medium">{t(topic)}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="rounded-[32px] bg-card p-7">
              <h2 className="text-xl font-semibold tracking-[-0.03em]">{t("How your score is calculated")}</h2>
              <dl className="mt-4 grid gap-2 text-[15px]">
                {[
                  [t("Bug discovery"), bd.bug],
                  [t("Report quality"), bd.q],
                  [t("Severity accuracy"), bd.s],
                  ...(adjusted !== 0 ? [[t("Reviewer adjustments"), adjusted]] : []),
                  [t("Unmatched-report penalty"), -penalty],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{(v as number) > 0 ? `+${v}` : String(v)}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-muted">
                {t("Pass mark: {n}% of available points.", { n: Math.round(SCORING.passThreshold * 100) })} {t(PENALTY_TEXT)} {t("This is practice feedback, not a professional certification.")}
              </p>
            </div>
          </section>

          <section className="mt-12 rounded-[36px] bg-[#141414] p-8 text-white sm:p-10" aria-labelledby="next-title">
            <h2 id="next-title" className="text-2xl font-semibold tracking-[-0.03em]">{t("Next Steps")}</h2>
            <p className="mt-2 max-w-[520px] text-white/65">{t("Use your results to identify what you can improve in your next testing session.")}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {canRetry && (
                <Button href={sitePath} variant="white">
                  {t("Practice Again")}
                </Button>
              )}
              <Button href={`/practice-lab/${attempt.website.level.slug}`} variant="ghost" arrow className="!text-white hover:!bg-white/10">
                {t("Explore Other Websites")}
              </Button>
              <Button href="/learn/how-to-write-a-bug-report" variant="ghost" className="!text-white hover:!bg-white/10">
                {t("Read: How to Write a Good Bug Report")}
              </Button>
            </div>
            {!canRetry && <p className="mt-4 text-sm text-white/55">{t("You've used all {n} attempts for this website.", { n: attempt.website.maxAttempts })}</p>}
          </section>
          <p className="mt-8 text-center text-sm text-muted">
            <Link href="/dashboard" className="underline underline-offset-4">{t("Back to my dashboard")}</Link>
          </p>
        </div>
      </div>
    </PageTop>
  );
}
