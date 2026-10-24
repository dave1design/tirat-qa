import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Briefcase, Check, ChevronDown, ClipboardCheck, Clock, FileCheck2, Flame, FlaskConical, Info, Lock, Medal, Play, Search, Star, Target, Trophy, type LucideIcon } from "lucide-react";
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

  const monthLabel = new Date().toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  const orange = "bg-gradient-to-r from-[#ff9a52] to-[#ff5a0f]";
  const card = "rounded-3xl bg-white shadow-[0_2px_14px_rgba(255,107,26,0.08)] ring-1 ring-[#f3e6dd]";
  const peak = Math.max(...stats.weekCounts);

  return (
    <div className="overflow-hidden rounded-[32px] border border-[#f1e4da] bg-white shadow-float">
      {/* top bar: page title and search */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1e4da] bg-[#fffaf6] px-6 py-4 sm:px-8">
        <h1 className="text-[1.2rem] font-semibold tracking-[-0.02em]">{t("Dashboard")}</h1>
        <form action="/learn" role="search" className="relative w-full sm:w-80">
          <label className="sr-only" htmlFor="dash-search">{t("Search lessons")}</label>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink" aria-hidden />
          <input id="dash-search" name="q" placeholder={t("Search lessons")} className="w-full rounded-full border border-[#eadbd0] bg-white py-2.5 pl-11 pr-4 text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange" />
        </form>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 p-6 sm:p-8">
          <h2 className="text-[1.7rem] font-semibold tracking-[-0.035em]">{t("Continue learning")}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* the lesson to resume */}
            <article className="rounded-3xl bg-[#fdf6f1] p-5 ring-1 ring-[#f6e9e0]">
              <div className="flex items-center gap-4">
                <span className="flex size-[60px] shrink-0 items-center justify-center rounded-2xl bg-white text-orange shadow-soft">
                  {(() => {
                    const Icon = TRACKS[current.track].icon;
                    return <Icon className="size-7" aria-hidden />;
                  })()}
                </span>
                <div className="min-w-0">
                  <p className="text-[1.1rem] font-semibold leading-snug tracking-[-0.02em]">{resume ? `${resume.l.n} ${resume.l.title}` : t("You finished every lesson.")}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.06em] text-ink-2">
                    {t("Level")} {current.n} · {t(current.track)}
                  </p>
                </div>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={current.done} aria-valuemin={0} aria-valuemax={current.lessons.length}>
                <div className={cn("h-full rounded-full", orange)} style={{ width: `${Math.max(6, (current.done / current.lessons.length) * 100)}%` }} />
              </div>
              <p className="mt-3 flex items-center justify-between text-sm text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-4" aria-hidden /> {current.done}/{current.lessons.length} {t("Lessons")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden /> {t("{n} min left", { n: minutesLeft })}
                </span>
              </p>
              <Link
                href={resume && !resumeBlocked ? `/learn/levels/${resume.lv.n}/${resume.l.slug}` : resume ? `/learn/levels/${resume.lv.n}` : `/learn/levels/${current.n}/exam`}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-orange hover:underline"
              >
                {resume && !resumeBlocked ? (lessonsDone === 0 ? t("Start learning") : t("Resume learning")) : resume ? t("Unlock Levels 5 to 8") : t("Level {n} exam", { n: current.n })}
                <ArrowRight className="size-[18px] rounded-full border-[1.5px] border-current p-0.5" aria-hidden />
              </Link>
            </article>

            {/* the Practice Lab, the hands-on side of learning */}
            <article className="rounded-3xl bg-[#fdf6f1] p-5 ring-1 ring-[#f6e9e0]">
              <div className="flex items-center gap-4">
                <span className="flex size-[60px] shrink-0 items-center justify-center rounded-2xl bg-white text-orange shadow-soft">
                  <FlaskConical className="size-7" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[1.1rem] font-semibold leading-snug tracking-[-0.02em]">{practice ? practice.title : t("Your Next Challenge Starts Here.")}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.06em] text-ink-2">{t("Practice Lab")}</p>
                </div>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={practice?.done ?? 0} aria-valuemin={0} aria-valuemax={practice?.total ?? 0}>
                <div className={cn("h-full rounded-full", orange)} style={{ width: `${practice?.total ? Math.max(6, (practice.done / practice.total) * 100) : 6}%` }} />
              </div>
              <p className="mt-3 flex items-center justify-between text-sm text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4" aria-hidden /> {practice?.done ?? 0}/{practice?.total ?? 0} {t("challenges")}
                </span>
              </p>
              <Link href={practice?.href ?? "/practice-lab"} className="mt-5 inline-flex items-center gap-2 font-semibold text-orange hover:underline">
                {practice ? t(practice.cta) : t("Explore Practice Lab")} <ArrowRight className="size-[18px] rounded-full border-[1.5px] border-current p-0.5" aria-hidden />
              </Link>
            </article>
          </div>

          <div className="mt-12 flex items-end justify-between gap-3">
            <h2 className="text-[1.7rem] font-semibold tracking-[-0.035em]">{t("Previous learning")}</h2>
            <Link href="/learn" className="text-sm font-semibold text-orange underline underline-offset-4">
              {t("All lessons")}
            </Link>
          </div>
          {previous.length === 0 ? (
            <div className="mt-5 rounded-3xl bg-[#fdf6f1] p-8 text-center">
              <p className="text-xl font-semibold tracking-[-0.03em]">{t("Nothing here yet.")}</p>
              <p className="mt-1 text-ink-2">{t("Lessons you have studied will appear here so you can pick them up again.")}</p>
              {resume && !resumeBlocked && (
                <Link href={`/learn/levels/${resume.lv.n}/${resume.l.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3.5 font-medium text-white hover:opacity-90">
                  {t("Start learning")} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </div>
          ) : (
            <ul className="mt-5 grid gap-5 md:grid-cols-2">
              {previous.map(({ lv, l, s }) => {
                const passed = isLessonPassed(s);
                const blocked = lv.paywalled;
                const score = s.bestScore ?? 0;
                return (
                  <li key={`${lv.n}/${l.slug}`}>
                    <Link href={blocked ? `/learn/levels/${lv.n}` : `/learn/levels/${lv.n}/${l.slug}`} className={cn(card, "group block overflow-hidden transition-shadow hover:shadow-float")}>
                      <span className="relative block aspect-[16/9] bg-ink">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://i.ytimg.com/vi/${l.video.id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                        <span className={cn("absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white", passed ? "bg-ok" : "bg-orange")}>{passed ? t("Passed") : t("In progress")}</span>
                        <span className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8 text-sm font-medium text-white">
                          <Play className="size-5 shrink-0" fill="currentColor" aria-hidden />
                          <span className="tabular-nums">{score}/5</span>
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35">
                            <span className="block h-full rounded-full bg-white" style={{ width: `${score * 20}%` }} />
                          </span>
                          <span className="tabular-nums">{t("{n} min", { n: l.minutes })}</span>
                        </span>
                      </span>
                      <span className="block px-5 pb-5 pt-4">
                        <span className="block text-[1.15rem] font-semibold leading-snug tracking-[-0.025em]">
                          {l.n} {l.title}
                        </span>
                        <span className="mt-1.5 block text-[15px] text-ink-2">
                          {t("Level")} {lv.n} · {t(lv.track)}
                        </span>
                        <span className="mt-4 flex items-center justify-between text-[15px]">
                          <span className="inline-flex items-center gap-1.5 font-semibold">
                            <Star className="size-[18px] text-orange" fill="currentColor" aria-hidden /> {score}/5 <span className="font-normal text-muted">({t("Quiz")})</span>
                          </span>
                          <span className="font-semibold text-orange">{passed ? t("Review lesson") : t("Resume learning")}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <h2 className="mt-12 text-[1.7rem] font-semibold tracking-[-0.035em]">{t("Your learning plan")}</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
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
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f3e6dd]">
                        <span className={cn("block h-full rounded-full", orange)} style={{ width: `${(lv.done / lv.lessons.length) * 100}%` }} />
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

        {/* right panel */}
        <aside className="grid content-start gap-5 border-t border-[#f1e4da] bg-[#fff8f3] p-6 sm:p-8 xl:border-l xl:border-t-0">
          <section aria-label={t("Your profile")} className={cn(card, "p-5")}>
            <div className="flex items-center gap-4">
              <span className="flex size-[84px] shrink-0 items-center justify-center rounded-full border-[3px] border-orange bg-[#fde8da] p-1 text-3xl font-semibold text-orange">
                <span className="flex size-full items-center justify-center rounded-full bg-white">{initial}</span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-[1.35rem] font-semibold tracking-[-0.03em]">{name}</p>
                <p className="truncate text-[15px] text-ink-2">{subtitle}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[15px] font-medium">
                  <Medal className="size-[18px] text-orange" aria-hidden /> {stats.points.toLocaleString("en-US")} {t("Points")}
                </p>
              </div>
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-[#fdf6f1] px-3 py-4 text-center">
              {(
                [
                  [Flame, stats.streak, t("Days Streak")],
                  [Target, `${lessonsDone}/${TOTAL_LESSONS}`, t("Lessons passed")],
                  [Trophy, `${stats.examsPassed}/${levels.length}`, t("Exams passed")],
                ] as [LucideIcon, string | number, string][]
              ).map(([I, v, label]) => (
                <li key={label}>
                  <p className="flex items-center justify-center gap-1.5 text-[1.5rem] font-semibold tracking-[-0.04em]">
                    <I className="size-6 text-orange" aria-hidden /> {v}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-2">{label}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="streak-title" className={cn(card, "p-5")}>
            <div className="flex items-center justify-between">
              <h2 id="streak-title" className="flex items-center gap-2 text-[1.15rem] font-semibold tracking-[-0.02em]">
                {t("Weekly Streak")} <Info className="size-4 text-muted" aria-label={t("Days in a row with a quiz, a lab or an exam")} />
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#eadbd0] px-2.5 py-1.5 text-xs text-ink-2">
                {monthLabel} <ChevronDown className="size-3.5" aria-hidden />
              </span>
            </div>
            <div className="mt-4 border-t border-[#f1e4da] pt-4">
              <p className="text-sm font-semibold">{stats.streak > 0 ? t("You're on a {n}-day streak", { n: stats.streak }) : t("Start your streak today")}</p>
              <ol className="mt-4 grid grid-cols-7 gap-1.5">
                {MON_FIRST.map((d) => {
                  const on = stats.week[d];
                  return (
                    <li
                      key={d}
                      className={cn("flex flex-col items-center rounded-xl py-2.5", on ? "bg-gradient-to-b from-[#ff9a52] to-[#ff5a0f] text-white shadow-[0_6px_14px_-6px_rgba(255,90,15,0.7)]" : d === stats.today ? "ring-1 ring-orange" : "")}
                      aria-label={`${DAY_NAMES[d]} ${stats.weekDates[d]}${on ? ` – ${t("Done")}` : ""}`}
                    >
                      <span className={cn("text-[11px]", on ? "text-white/85" : "text-muted")}>{DAY_NAMES[d]}</span>
                      <span className="mt-0.5 text-[1.3rem] font-semibold tabular-nums">{stats.weekDates[d]}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <ul className="grid grid-cols-2 gap-4">
            {(
              [
                [inProgress, t("In progress")],
                [lessonsDone, t("Completed")],
              ] as [number, string][]
            ).map(([n, label]) => (
              <li key={label} className={cn(card, "p-5")}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fde8da]">
                  <BookOpen className="size-6 text-orange" aria-hidden />
                </span>
                <p className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em]">{t("{n} Lessons", { n })}</p>
                <p className="text-sm text-ink-2">{label}</p>
              </li>
            ))}
          </ul>

          <section aria-labelledby="activity-title" className={cn(card, "p-5")}>
            <h2 id="activity-title" className="flex items-center gap-2 text-[1.15rem] font-semibold tracking-[-0.02em]">
              {t("Weekly Activity")} <Info className="size-4 text-muted" aria-label={t("Lessons and exams you practised each day")} />
            </h2>
            <div className="mt-6 flex gap-3">
              <ul className="flex h-28 flex-col justify-between pb-6 text-[11px] text-muted" aria-hidden>
                {[Math.max(peak, 4), Math.round(Math.max(peak, 4) / 2), 0].map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <div className="flex h-28 flex-1 items-end gap-2 border-b border-dashed border-[#eadbd0]">
                {MON_FIRST.map((d) => {
                  const c = stats.weekCounts[d];
                  const top = peak > 0 && c === peak;
                  return (
                    <div key={d} className="relative flex h-full flex-1 flex-col items-center justify-end">
                      {top && <span className="absolute -top-1 rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-semibold text-white" style={{ bottom: `calc(${Math.max(8, (c / Math.max(peak, 4)) * 100)}% + 22px)`, top: "auto" }}>{c}</span>}
                      <span className={cn("mb-6 block w-full rounded-t-md", top ? "bg-orange" : "bg-[#fde8da]")} style={{ height: `${Math.max(6, (c / Math.max(peak, 4)) * 100)}%` }} />
                      <span className="absolute bottom-0 text-[11px] text-muted">{DAY_NAMES[d]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section aria-labelledby="exam-note" className="rounded-3xl bg-[#fdf6f1] p-5 ring-1 ring-[#f6e9e0]">
            <p id="exam-note" className="flex items-center gap-2 text-xs font-medium text-ink-2">
              <FileCheck2 className="size-3.5" aria-hidden /> {t("Level {n} exam", { n: current.n })}
            </p>
            <p className="mt-1.5 text-[14.5px] leading-snug">
              {examBest != null ? t("Your best score: {n}/100", { n: examBest }) : examReady && !current.paywalled ? t("You can take it now: 50 questions, 60 minutes.") : t("Pass every lesson quiz to unlock this exam")}
            </p>
            {examReady && !current.paywalled && (
              <Link href={`/learn/levels/${current.n}/exam`} className="mt-2 inline-block text-sm font-semibold text-orange underline underline-offset-4">
                {t("Take the level exam")}
              </Link>
            )}
          </section>

          {pendingPayment && (
            <p role="status" className="rounded-3xl bg-[#fdf6f1] p-5 text-[14.5px] leading-snug text-ink-2 ring-1 ring-[#f6e9e0]">
              {t("Your payment is pending confirmation. We'll unlock Levels 5 to 8 as soon as it's verified.")}
            </p>
          )}
          {!advanced && !pendingPayment && (
            <section className="rounded-3xl bg-gradient-to-br from-[#ff9a52] to-[#ff5a0f] p-5 text-white shadow-[0_14px_28px_-12px_rgba(255,90,15,0.6)]">
              <p className="text-[1.3rem] font-semibold leading-tight tracking-[-0.03em]">{t("Levels 5 to 8 · one payment")}</p>
              <p className="mt-1.5 text-sm text-white/90">{advancedPriceEtb().toLocaleString("en-US")} ETB · {t("Pay once and all four advanced levels are yours. No subscription.")}</p>
              <Link href="/learn/levels/5" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange hover:bg-[#fff3ea]">
                {t("Unlock Levels 5 to 8")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
