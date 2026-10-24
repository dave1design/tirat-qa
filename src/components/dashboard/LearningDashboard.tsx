import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Briefcase, Check, ClipboardCheck, Clock, FileCheck2, FlaskConical, Info, Lock, Play, Search, Sparkles, Trophy, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getT } from "@/lib/i18n/server";
import { levelsFor, TOTAL_LESSONS } from "@/content/curriculum";
import { isLessonPassed, isLevelUnlocked, type LessonStatus } from "@/lib/learn-progress";
import { advancedPriceEtb, isPaidLevel } from "@/lib/learn-access";
import type { LearningStats } from "@/lib/learn-dashboard";

const TRACKS = {
  Foundations: { icon: BookOpen, blob: "bg-[#ccff00]", tile: "bg-[#f1f6dc]" },
  "Manual QA": { icon: ClipboardCheck, blob: "bg-[#d9ccff]", tile: "bg-[#ece8fb]" },
  "Professional QA": { icon: Briefcase, blob: "bg-[#ffe08a]", tile: "bg-[#f7f0dc]" },
  "Automation QA": { icon: Bot, blob: "bg-[#a8ecd0]", tile: "bg-[#e1f2ea]" },
} as const satisfies Record<string, { icon: LucideIcon; blob: string; tile: string }>;

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MON_FIRST = [0, 1, 2, 3, 4, 5, 6];

export interface PracticeSummary {
  title: string;
  href: string;
  cta: string;
  done: number;
  total: number;
}

/**
 * The learner's home, laid out like a course app: "Continue learning" cards and previously studied lessons on the left,
 * a profile, weekly streak and weekly activity panel on the right. Every number comes from the learner's own progress.
 */
export async function LearningDashboard({
  name,
  subtitle,
  progress,
  stats,
  advanced,
  pendingPayment,
  practice,
}: {
  name: string;
  subtitle: string;
  progress: Map<string, LessonStatus>;
  stats: LearningStats;
  advanced: boolean;
  pendingPayment: boolean;
  practice: PracticeSummary | null;
}) {
  const t = await getT();
  const levels = levelsFor(await getLocale()).map((lv) => {
    const done = lv.lessons.filter((l) => isLessonPassed(progress.get(`${lv.n}/${l.slug}`))).length;
    return { ...lv, done, open: isLevelUnlocked(lv.n, progress), paywalled: isPaidLevel(lv.n) && !advanced };
  });
  const lessonsDone = levels.reduce((n, lv) => n + lv.done, 0);
  const flat = levels.flatMap((lv) => lv.lessons.map((l) => ({ lv, l })));
  const resume = flat.find(({ lv, l }) => !isLessonPassed(progress.get(`${lv.n}/${l.slug}`))) ?? null;
  const resumeBlocked = !!resume && resume.lv.paywalled;
  const current = resume?.lv ?? levels[levels.length - 1];
  const minutesLeft = current.lessons.filter((l) => !isLessonPassed(progress.get(`${current.n}/${l.slug}`))).reduce((n, l) => n + l.minutes, 0);
  const examReady = current.done === current.lessons.length;
  const examBest = stats.examBest.get(current.n);

  const byKey = new Map(flat.map((x) => [`${x.lv.n}/${x.l.slug}`, x]));
  const previous = stats.recent.flatMap((k) => (byKey.has(k) ? [{ ...byKey.get(k)!, s: progress.get(k)! }] : [])).slice(0, 6);
  const inProgress = [...progress.values()].filter((s) => s.attempts > 0 && !isLessonPassed(s)).length;

  const maxCount = Math.max(1, ...stats.weekCounts);
  const monthLabel = new Date().toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  const card = "rounded-3xl border border-line bg-white shadow-soft";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.04em]">{t("Welcome back, {name}.", { name })}</h1>
        <form action="/learn" role="search" className="relative w-full sm:w-72">
          <label className="sr-only" htmlFor="dash-search">{t("Search lessons")}</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input id="dash-search" name="q" placeholder={t("Search lessons")} className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-4 text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand" />
        </form>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em]">{t("Continue learning")}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* the lesson to resume */}
            <article className="rounded-3xl bg-[#f3f1ff] p-5">
              <div className="flex items-center gap-4">
                <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft")}>
                  {(() => {
                    const Icon = TRACKS[current.track].icon;
                    return <Icon className="size-6" aria-hidden />;
                  })()}
                </span>
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold leading-snug tracking-[-0.02em]">{resume ? `${resume.l.n} ${resume.l.title}` : t("You finished every lesson.")}</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.06em] text-muted">
                    {t("Level")} {current.n} · {t(current.track)}
                  </p>
                </div>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={current.done} aria-valuemin={0} aria-valuemax={current.lessons.length}>
                <div className="h-full rounded-full bg-brand" style={{ width: `${(current.done / current.lessons.length) * 100}%` }} />
              </div>
              <p className="mt-3 flex items-center justify-between text-sm text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-4" aria-hidden /> {current.done}/{current.lessons.length} {t("Lessons")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden /> {t("{n} min left", { n: minutesLeft })}
                </span>
              </p>
              {resume && !resumeBlocked ? (
                <Link href={`/learn/levels/${resume.lv.n}/${resume.l.slug}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                  {lessonsDone === 0 ? t("Start learning") : t("Resume learning")} <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : resume ? (
                <Link href={`/learn/levels/${resume.lv.n}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                  {t("Unlock Levels 5 to 8")} <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <Link href={`/learn/levels/${current.n}/exam`} className="mt-4 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                  {t("Level {n} exam", { n: current.n })} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </article>

            {/* the Practice Lab, the hands-on side of learning */}
            <article className="rounded-3xl bg-[#fdf3dd] p-5">
              <div className="flex items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft">
                  <FlaskConical className="size-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold leading-snug tracking-[-0.02em]">{practice ? practice.title : t("Your Next Challenge Starts Here.")}</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.06em] text-muted">{t("Practice Lab")}</p>
                </div>
              </div>
              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={practice?.done ?? 0} aria-valuemin={0} aria-valuemax={practice?.total ?? 0}>
                <div className="h-full rounded-full bg-[#f5a524]" style={{ width: `${practice?.total ? (practice.done / practice.total) * 100 : 0}%` }} />
              </div>
              <p className="mt-3 flex items-center justify-between text-sm text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4" aria-hidden /> {practice?.done ?? 0}/{practice?.total ?? 0} {t("challenges")}
                </span>
              </p>
              <Link href={practice?.href ?? "/practice-lab"} className="mt-4 inline-flex items-center gap-2 font-semibold text-[#b45309] hover:underline">
                {practice ? t(practice.cta) : t("Explore Practice Lab")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </article>
          </div>

          <div className="mt-10 flex items-end justify-between gap-3">
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.03em]">{t("Previous learning")}</h2>
            <Link href="/learn" className="text-sm font-medium text-brand underline underline-offset-4">
              {t("All lessons")}
            </Link>
          </div>
          {previous.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-card p-8 text-center">
              <p className="text-xl font-semibold tracking-[-0.03em]">{t("Nothing here yet.")}</p>
              <p className="mt-1 text-muted">{t("Lessons you have studied will appear here so you can pick them up again.")}</p>
              {resume && !resumeBlocked && (
                <Link href={`/learn/levels/${resume.lv.n}/${resume.l.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-dark">
                  {t("Start learning")} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {previous.map(({ lv, l, s }) => {
                const passed = isLessonPassed(s);
                const blocked = lv.paywalled;
                return (
                  <li key={`${lv.n}/${l.slug}`}>
                    <Link href={blocked ? `/learn/levels/${lv.n}` : `/learn/levels/${lv.n}/${l.slug}`} className={cn(card, "group block overflow-hidden transition-shadow hover:shadow-float")}>
                      <span className="relative block aspect-video bg-ink">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.ytimg.com/vi/${l.video.id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex size-12 items-center justify-center rounded-full bg-white/95 text-ink shadow-float transition-transform group-hover:scale-110">
                            <Play className="ml-0.5 size-5" fill="currentColor" aria-hidden />
                          </span>
                        </span>
                        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium">{t("{n} min", { n: l.minutes })}</span>
                      </span>
                      <span className="block p-4">
                        <span className="block text-[16px] font-semibold leading-snug tracking-[-0.02em]">
                          {l.n} {l.title}
                        </span>
                        <span className="mt-1 block text-sm text-muted">
                          {t("Level")} {lv.n} · {t(lv.track)}
                        </span>
                        <span className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                          <span className={cn("inline-flex items-center gap-1.5 font-medium", passed ? "text-ok" : "text-ink-2")}>
                            {passed ? <Check className="size-4" strokeWidth={3} aria-hidden /> : <Zap className="size-4 text-[#f5a524]" fill="currentColor" aria-hidden />}
                            {passed ? t("Passed") : t("In progress")} · {s.bestScore ?? 0}/5
                          </span>
                          <span className="font-medium text-brand">{passed ? t("Review lesson") : t("Resume learning")}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className="mt-10 text-[1.5rem] font-semibold tracking-[-0.03em]">{t("Your learning plan")}</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {levels.map((lv) => {
              const tr = TRACKS[lv.track];
              const complete = lv.done === lv.lessons.length;
              const state = complete ? "done" : lv.paywalled ? "paid" : !lv.open ? "locked" : "open";
              const disabled = state === "locked";
              const cls = cn(card, "flex items-center gap-4 p-4", disabled ? "opacity-60" : "transition-shadow hover:shadow-float");
              const body = (
                <>
                  <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", tr.tile)}>
                    {complete ? <Check className="size-5 text-ok" strokeWidth={3} aria-hidden /> : state === "locked" || state === "paid" ? <Lock className="size-4" aria-hidden /> : <tr.icon className="size-5" aria-hidden />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-snug tracking-[-0.015em]">
                      {t("Level")} {lv.n}: {lv.title}
                    </span>
                    <span className="mt-2 flex items-center gap-3">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip">
                        <span className="block h-full rounded-full bg-brand" style={{ width: `${(lv.done / lv.lessons.length) * 100}%` }} />
                      </span>
                      <span className="text-xs font-medium text-ink-2">{state === "paid" ? t("Paid") : `${lv.done}/${lv.lessons.length}`}</span>
                    </span>
                  </span>
                </>
              );
              return (
                <li key={lv.n}>
                  {disabled ? (
                    <div aria-disabled="true" className={cls}>
                      {body}
                    </div>
                  ) : (
                    <Link href={`/learn/levels/${lv.n}`} className={cls}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="grid content-start gap-5">
          <section aria-label={t("Your profile")} className={cn(card, "p-5")}>
            <div className="flex items-center gap-4">
              <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full border-[3px] border-brand bg-[#e6efff] text-2xl font-semibold text-brand">{initial}</span>
              <div className="min-w-0">
                <p className="truncate text-[1.25rem] font-semibold tracking-[-0.03em]">{name}</p>
                <p className="truncate text-sm text-muted">{subtitle}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <Sparkles className="size-4 text-[#f5a524]" aria-hidden /> {stats.points.toLocaleString("en-US")} {t("Points")}
                </p>
              </div>
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 text-center">
              {[
                [Zap, stats.streak, t("Days Streak")],
                [BookOpen, `${lessonsDone}/${TOTAL_LESSONS}`, t("Lessons passed")],
                [Trophy, `${stats.examsPassed}/${levels.length}`, t("Exams passed")],
              ].map(([Icon, v, label]) => {
                const I = Icon as LucideIcon;
                return (
                  <li key={String(label)}>
                    <p className="flex items-center justify-center gap-1 text-[1.15rem] font-semibold tracking-[-0.03em]">
                      <I className="size-4 text-brand" aria-hidden /> {v as string | number}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-tight text-muted">{label as string}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="streak-title" className={cn(card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 id="streak-title" className="flex items-center gap-2 text-[1.1rem] font-semibold tracking-[-0.02em]">
                {t("Weekly Streak")} <Info className="size-4 text-faint" aria-label={t("Days in a row with a quiz, a lab or an exam")} />
              </h2>
              <span className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted">{monthLabel}</span>
            </div>
            <p className="mt-4 text-sm font-medium">
              {stats.streak > 0 ? t("You're on a {n}-day streak", { n: stats.streak }) : t("Start your streak today")}
            </p>
            <ol className="mt-3 grid grid-cols-7 gap-1.5">
              {MON_FIRST.map((d) => {
                const on = stats.week[d];
                return (
                  <li key={d} className={cn("flex flex-col items-center rounded-xl py-2", on ? "bg-brand text-white" : d === stats.today ? "bg-[#e6efff]" : "")} aria-label={`${DAY_NAMES[d]} ${stats.weekDates[d]}${on ? ` – ${t("Done")}` : ""}`}>
                    <span className={cn("text-[11px]", on ? "text-white/80" : "text-muted")}>{DAY_NAMES[d]}</span>
                    <span className="mt-0.5 text-[1.15rem] font-semibold tabular-nums">{stats.weekDates[d]}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <ul className="grid grid-cols-2 gap-3">
            <li className={cn(card, "p-4")}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#e6efff]">
                <BookOpen className="size-5 text-brand" aria-hidden />
              </span>
              <p className="mt-4 text-[1.5rem] font-semibold tracking-[-0.03em]">{inProgress}</p>
              <p className="text-sm text-muted">{t("Lessons in progress")}</p>
            </li>
            <li className={cn(card, "p-4")}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-ok-soft">
                <Check className="size-5 text-ok" strokeWidth={3} aria-hidden />
              </span>
              <p className="mt-4 text-[1.5rem] font-semibold tracking-[-0.03em]">{lessonsDone}</p>
              <p className="text-sm text-muted">{t("Lessons completed")}</p>
            </li>
          </ul>

          <section aria-labelledby="activity-title" className={cn(card, "p-5")}>
            <h2 id="activity-title" className="flex items-center gap-2 text-[1.1rem] font-semibold tracking-[-0.02em]">
              {t("Weekly Activity")} <Info className="size-4 text-faint" aria-label={t("Lessons and exams you practised each day")} />
            </h2>
            <div className="mt-5 flex h-28 items-end gap-2">
              {MON_FIRST.map((d) => (
                <div key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="text-[11px] font-medium text-ink-2">{stats.weekCounts[d] || ""}</span>
                  <span className={cn("block w-full rounded-md", d === stats.today ? "bg-brand" : "bg-[#dbe6ff]")} style={{ height: `${Math.max(6, (stats.weekCounts[d] / maxCount) * 100)}%` }} />
                  <span className="text-[11px] text-muted">{DAY_NAMES[d]}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="exam-note" className="rounded-3xl bg-[#ece8fb] p-5">
            <p id="exam-note" className="flex items-center gap-2 text-xs font-medium text-ink-2">
              <FileCheck2 className="size-3.5" aria-hidden /> {t("Level {n} exam", { n: current.n })}
            </p>
            <p className="mt-1.5 text-[14.5px] leading-snug">
              {examBest != null ? t("Your best score: {n}/100", { n: examBest }) : examReady && !current.paywalled ? t("You can take it now: 50 questions, 60 minutes.") : t("Pass every lesson quiz to unlock this exam")}
            </p>
            {examReady && !current.paywalled && (
              <Link href={`/learn/levels/${current.n}/exam`} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">
                {t("Take the level exam")}
              </Link>
            )}
          </section>

          {pendingPayment && (
            <p role="status" className="rounded-3xl bg-[#e6efff] p-5 text-[14.5px] leading-snug text-brand">
              {t("Your payment is pending confirmation. We'll unlock Levels 5 to 8 as soon as it's verified.")}
            </p>
          )}
          {!advanced && !pendingPayment && (
            <section className="rounded-3xl bg-[#6c5cff] p-5 text-white">
              <p className="text-[1.2rem] font-semibold leading-tight tracking-[-0.03em]">{t("Levels 5 to 8 · one payment")}</p>
              <p className="mt-1.5 text-sm text-white/80">{advancedPriceEtb().toLocaleString("en-US")} ETB</p>
              <Link href="/learn/levels/5" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-card">
                {t("Unlock Levels 5 to 8")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
