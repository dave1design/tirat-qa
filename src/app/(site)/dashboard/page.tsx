import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isStaff, requireUser } from "@/lib/auth";
import { loadLab, SITE_CTA } from "@/lib/lab";
import { ATTEMPT_STATUS_LABEL } from "@/lib/scoring/service";
import { formatDate } from "@/lib/utils";
import { PageTop } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Pill, StatusBadge } from "@/components/ui/StatusBadge";
import { getLocale, getT } from "@/lib/i18n/server";
import { isLessonPassed, loadProgress } from "@/lib/learn-progress";
import { levelsFor, TOTAL_LESSONS } from "@/content/curriculum";

export const metadata: Metadata = { title: "My Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const t = await getT();
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

  // learning progress: which lesson to continue with, and how far along each level is
  const progress = await loadProgress(user.id);
  const roadmap = levelsFor(await getLocale()).map((lv) => ({ ...lv, done: lv.lessons.filter((l) => isLessonPassed(progress.get(`${lv.n}/${l.slug}`))).length }));
  const lessonsDone = roadmap.reduce((n, lv) => n + lv.done, 0);
  const resume = roadmap.flatMap((lv) => lv.lessons.map((l) => ({ levelN: lv.n, lesson: l }))).find((x) => !isLessonPassed(progress.get(`${x.levelN}/${x.lesson.slug}`)));

  return (
    <PageTop className="pb-24">
      <div className="container-x">
        <p className="eyebrow text-muted">{t("My dashboard")}</p>
        <h1 className="h-section mt-3 text-balance">{t("Welcome back, {name}.", { name: user.name.split(" ")[0] })}</h1>

        <section aria-labelledby="learning-title" className="mt-10">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col rounded-[36px] bg-brand p-8 text-white sm:p-10">
              <p className="eyebrow text-white/70">{t("Your learning")}</p>
              <h2 id="learning-title" className="mb-10 mt-3 text-3xl font-semibold tracking-[-0.04em] text-balance">
                {resume ? `${resume.lesson.n} ${resume.lesson.title}` : t("You finished every lesson.")}
              </h2>
              <div className="mt-auto h-2 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuenow={lessonsDone} aria-valuemin={0} aria-valuemax={TOTAL_LESSONS}>
                <div className="h-full rounded-full bg-lime" style={{ width: `${(lessonsDone / TOTAL_LESSONS) * 100}%` }} />
              </div>
              <p className="mt-2 text-sm text-white/75">{t("{done} of {total} lessons passed", { done: lessonsDone, total: TOTAL_LESSONS })}</p>
              <Link
                href={resume ? `/learn/levels/${resume.levelN}/${resume.lesson.slug}` : "/learn"}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-ink hover:bg-card"
              >
                {lessonsDone === 0 ? t("Start learning") : t("Continue learning")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {roadmap.map((lv) => (
                <li key={lv.n}>
                  <Link href={`/learn/levels/${lv.n}`} className="flex h-full flex-col justify-between rounded-3xl bg-card p-4 transition-colors hover:bg-chip">
                    <span className="text-[13px] font-medium leading-snug">
                      {t("Level")} {lv.n}: {lv.title}
                    </span>
                    <span className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                      {lv.done === lv.lessons.length && <Check className="size-4 text-ok" strokeWidth={3} aria-hidden />} {lv.done} / {lv.lessons.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-sm">
            <Link href="/learn" className="font-medium text-brand underline underline-offset-4">
              {t("Open the full learning roadmap")}
            </Link>
          </p>
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[32px] bg-card p-7">
            <p className="text-sm text-muted">{t("Attempts")}</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{attempts.length}</p>
          </div>
          <div className="rounded-[32px] bg-card p-7">
            <p className="text-sm text-muted">{t("Completed")}</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{finished.length}</p>
          </div>
          <div className="rounded-[32px] bg-card p-7">
            <p className="text-sm text-muted">{t("Average score")}</p>
            <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{avg === null ? "—" : `${avg}%`}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[36px] bg-[#141414] p-8 text-white sm:p-10">
          {active ? (
            <>
              <p className="eyebrow text-white/60">{t("Continue where you left off")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{t(active.website.name)}</h2>
              <p className="mt-2 text-white/60">{t("{n} reports submitted in this attempt.", { n: active._count.reports })}</p>
              <div className="mt-6"><Button href={`/practice-lab/${active.website.level.slug}/${active.website.slug}`} variant="white" arrow>{t("Continue Testing")}</Button></div>
            </>
          ) : next ? (
            <>
              <p className="eyebrow text-white/60">{t("Up next")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{t(next.name)}</h2>
              <p className="mt-2 max-w-[520px] text-white/60">{t(next.description)}</p>
              <div className="mt-6"><Button href={`/practice-lab/${next.levelSlug}/${next.slug}`} variant="white" arrow>{t("Start Testing")}</Button></div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">{t("Your Next Challenge Starts Here.")}</h2>
              <p className="mt-2 text-white/60">{t("Explore the Practice Lab to find your next practice website.")}</p>
              <div className="mt-6"><Button href="/practice-lab" variant="white" arrow>{t("Explore Practice Lab")}</Button></div>
            </>
          )}
        </div>

        {payments.length > 0 && (
          <div className="mt-6 rounded-3xl bg-[#e6efff] p-5 text-[15px] text-brand" role="status">
            {t(payments.length === 1 ? "{n} payment is pending confirmation. Access is unlocked once it's verified." : "{n} payments are pending confirmation. Access is unlocked once it's verified.", { n: payments.length })}
          </div>
        )}

        <h2 className="mt-14 text-2xl font-semibold tracking-[-0.03em]">{t("Practice websites")}</h2>
        {sites.length === 0 ? (
          <p className="mt-4 rounded-3xl bg-card p-6 text-muted">{t("There are no practice websites available yet. Check back soon for new challenges.")}</p>
        ) : (
          <ul className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((s) => (
              <li key={s.id} className="flex flex-col rounded-[28px] border border-line bg-white p-6">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={s.status} />
                  <Pill>{s.accessRule === "FREE" ? t("Free") : `${s.priceEtb} ETB`}</Pill>
                </div>
                <p className="mt-4 text-lg font-medium tracking-[-0.02em]">{t(s.name)}</p>
                <div className="mt-auto pt-5">
                  <Button
                    href={s.status === "COMPLETED" && s.latestAttemptId ? `/practice-lab/results/${s.latestAttemptId}` : `/practice-lab/${s.levelSlug}/${s.slug}`}
                    variant="light"
                    size="sm"
                    arrow
                  >
                    {t(SITE_CTA[s.status])}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-14 text-2xl font-semibold tracking-[-0.03em]">{t("Recent attempts")}</h2>
        {attempts.length === 0 ? (
          <div className="mt-5 rounded-3xl bg-card p-8 text-center">
            <p className="text-2xl font-semibold tracking-[-0.03em]">{t("No Results Yet.")}</p>
            <p className="mt-2 text-muted">{t("Complete a practice challenge to see your results and feedback here.")}</p>
            <div className="mt-5 flex justify-center"><Button href="/practice-lab" arrow>{t("Explore Practice Lab")}</Button></div>
          </div>
        ) : (
          <ul className="mt-5 grid gap-2.5">
            {attempts.slice(0, 8).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card px-5 py-4">
                <div>
                  <p className="font-medium">{t(a.website.name)} <span className="text-muted">· {t("Attempt {n}", { n: a.attemptNumber })}</span></p>
                  <p className="text-sm text-muted">
                    {formatDate(a.startedAt)} · {t("{n} reports", { n: a._count.reports })} · {t(ATTEMPT_STATUS_LABEL[a.status] ?? a.status)}
                    {a.score !== null && a.maxScore ? ` · ${a.score}/${a.maxScore}` : ""}
                  </p>
                </div>
                {a.finishedAt ? (
                  <Link href={`/practice-lab/results/${a.id}`} className="text-sm font-medium underline underline-offset-4">{t("Review Results")}</Link>
                ) : (
                  <Link href={`/practice-lab/${a.website.level.slug}/${a.website.slug}`} className="text-sm font-medium underline underline-offset-4">{t("Continue")}</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTop>
  );
}
