import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock, FileCheck2, Flame, FlaskConical, Lock, Medal, Search, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getT } from "@/lib/i18n/server";
import { levelsFor, TOTAL_LESSONS } from "@/content/curriculum";
import { isLessonPassed, isLevelUnlocked, type LessonStatus } from "@/lib/learn-progress";
import { advancedPriceEtb, isPaidLevel } from "@/lib/learn-access";
import { buildCatalogLessons } from "@/lib/learn-catalog";
import type { LearningStats } from "@/lib/learn-dashboard";
import { LessonCard } from "@/components/learn/LessonCard";
import { LessonCover } from "@/components/learn/LessonCover";
import { TRACK } from "@/components/learn/tracks";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface PracticeSummary {
  title: string;
  href: string;
  cta: string;
  done: number;
  total: number;
}

/** A small bordered stat: pastel icon tile, big number, label. */
function Stat({ icon: Icon, tile, value, label }: { icon: LucideIcon; tile: string; value: string | number; label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5">
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", tile)}>
        <Icon className="size-5 text-brand" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[1.35rem] font-semibold leading-none tracking-[-0.03em]">{value}</span>
        <span className="mt-1 block text-[12.5px] text-muted">{label}</span>
      </span>
    </li>
  );
}

function SectionTitle({ id, children, count, href, linkLabel }: { id: string; children: React.ReactNode; count?: number; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2.5 text-[1.5rem] font-semibold tracking-[-0.03em]">
        {children}
        {count != null && <span className="rounded-md bg-chip px-2 py-0.5 text-sm font-medium text-ink-2">{count}</span>}
      </h2>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
          {linkLabel} <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

const GRID = "mt-4 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3";

/**
 * The learner's overview, in the same style as the Lessons page: bordered white cards, pastel tiles, brand blue.
 * Streak first, then where to continue, what was studied before and the eight-level plan.
 */
export async function LearningDashboard({
  name,
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
  const lessons = buildCatalogLessons(levels, progress, advanced);
  const lessonsDone = lessons.filter((l) => l.state === "passed").length;
  const pct = Math.round((lessonsDone / TOTAL_LESSONS) * 100);

  const resumeIdx = lessons.findIndex((l) => l.state !== "passed");
  const upNext = resumeIdx >= 0 ? lessons.slice(resumeIdx, resumeIdx + 4) : [];
  const byKey = new Map(lessons.map((l) => [l.key, l]));
  const previous = stats.recent.flatMap((k) => (byKey.has(k) && byKey.get(k)!.state !== "new" ? [byKey.get(k)!] : [])).slice(0, 5);

  const current = (resumeIdx >= 0 ? levels.find((lv) => lv.n === lessons[resumeIdx].level) : null) ?? levels[levels.length - 1];
  const examReady = current.done === current.lessons.length;
  const examBest = stats.examBest.get(current.n);
  const monthLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.04em]">{t("Dashboard")}</h1>
          <p className="mt-1 text-[15.5px] text-muted">
            {t("Welcome back, {name}.", { name })} {lessonsDone === TOTAL_LESSONS ? t("You finished every lesson.") : t("You're {n}% of the way through the roadmap.", { n: pct })}
          </p>
        </div>
        <form action="/learn" role="search" className="relative w-full sm:w-72">
          <label className="sr-only" htmlFor="dash-search">{t("Search lessons")}</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input id="dash-search" name="q" placeholder={t("Search lessons")} className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-3 text-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand" />
        </form>
      </div>

      {/* streak + numbers */}
      <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section aria-labelledby="streak-title" className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e6efff]">
                <Flame className="size-6 text-brand" fill="currentColor" aria-hidden />
              </span>
              <div>
                <h2 id="streak-title" className="text-[1.25rem] font-semibold leading-tight tracking-[-0.03em]">
                  {stats.streak > 0 ? t("You're on a {n}-day streak", { n: stats.streak }) : t("Start your streak today")}
                </h2>
                <p className="text-[13px] text-muted">{t("Days in a row with a quiz, a lab or an exam")}</p>
              </div>
            </div>
            <span className="rounded-md bg-chip px-2.5 py-1 text-xs font-medium text-ink-2">{monthLabel}</span>
          </div>
          <ol className="mt-5 grid grid-cols-7 gap-1.5" aria-label={t("This week")}>
            {DAY_NAMES.map((day, i) => {
              const on = stats.week[i];
              const today = i === stats.today;
              const filled = on || today; // active days and today share the blue stroke and fill
              return (
                <li
                  key={day}
                  aria-label={`${day} ${stats.weekDates[i]}${on ? ` – ${t("Done")}` : ""}`}
                  className={cn("flex flex-col items-center rounded-2xl border py-2.5", filled ? "border-brand bg-brand text-white" : "border-line text-ink")}
                >
                  <span className={cn("text-[11px]", filled ? "text-white/80" : "text-muted")}>{day}</span>
                  <span className="mt-0.5 text-[1.2rem] font-semibold tabular-nums">{stats.weekDates[i]}</span>
                  <span className="mt-1 flex h-4 items-center">
                    {on ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : <span className={cn("size-1.5 rounded-full", today ? "bg-[#ffd23f]" : "bg-line")} />}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <ul className="grid grid-cols-2 gap-3 self-stretch">
          <Stat icon={Medal} tile="bg-[#e6efff]" value={stats.points.toLocaleString("en-US")} label={t("Points")} />
          <Stat icon={BookOpen} tile="bg-[#e6efff]" value={`${lessonsDone}/${TOTAL_LESSONS}`} label={t("Lessons passed")} />
          <Stat icon={Trophy} tile="bg-[#e6efff]" value={`${stats.examsPassed}/${levels.length}`} label={t("Exams passed")} />
          <Stat icon={FlaskConical} tile="bg-[#e6efff]" value={stats.labsDone} label={t("Labs done")} />
        </ul>
      </div>

      {/* continue */}
      <section aria-labelledby="continue-title" className="mt-10">
        <SectionTitle id="continue-title" href="/learn?view=all" linkLabel={t("All lessons")}>
          {resumeIdx >= 0 ? t("Continue learning") : t("All lessons complete")}
        </SectionTitle>
        <ul className={GRID}>
          {upNext.map((l) => (
            <li key={l.key}>
              <LessonCard l={l} list={false} />
            </li>
          ))}
          {resumeIdx < 0 && (
            <li>
              <Link href={`/learn/levels/${current.n}/exam`} className="flex h-full flex-col rounded-2xl border border-line bg-white p-2.5 transition-shadow hover:shadow-soft">
                <span className="relative block aspect-[16/10] overflow-hidden rounded-lg">
                  <LessonCover n="8.3" track="Automation QA" className="absolute inset-0 h-full w-full" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-medium text-ink-2 shadow-sm">
                    <Clock className="size-3" aria-hidden /> {t("{n} min", { n: 60 })}
                  </span>
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">{t("Level")} {current.n}</span>
                </span>
                <span className="mb-3 mt-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.015em]">{t("Level {n} exam", { n: current.n })}</span>
                <span className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 text-[12.5px]">
                  <span className="text-muted">{examBest != null ? `${examBest}/100` : t("30 questions")}</span>
                  <span className="font-medium text-brand">{t("Take the level exam")}</span>
                </span>
              </Link>
            </li>
          )}
          <li>
            <Link href={practice?.href ?? "/practice-lab"} className="flex h-full flex-col rounded-2xl border border-line bg-white p-2.5 transition-shadow hover:shadow-soft">
              <span className="relative block aspect-[16/10] overflow-hidden rounded-lg">
                <LessonCover n="lab" track="Professional QA" className="absolute inset-0 h-full w-full" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-medium text-ink-2 shadow-sm">
                  <Clock className="size-3" aria-hidden /> {t("Practice Lab")}
                </span>
              </span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">{t("Practice Lab")}</span>
              </span>
              <span className="mb-3 mt-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.015em]">{practice ? practice.title : t("Your Next Challenge Starts Here.")}</span>
              <span className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 text-[12.5px]">
                <span className="text-muted">
                  {practice?.done ?? 0}/{practice?.total ?? 0} {t("challenges")}
                </span>
                <span className="font-medium text-brand">{practice ? t(practice.cta) : t("Explore Practice Lab")}</span>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* previous */}
      <section aria-labelledby="previous-title" className="mt-10">
        <SectionTitle id="previous-title" count={previous.length}>
          {t("Previous learning")}
        </SectionTitle>
        {previous.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-card p-6 text-center text-muted">{t("Lessons you have studied will appear here so you can pick them up again.")}</p>
        ) : (
          <ul className={GRID}>
            {previous.map((l) => (
              <li key={l.key}>
                <LessonCard l={l} list={false} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* plan */}
      <section aria-labelledby="plan-title" className="mt-10">
        <SectionTitle id="plan-title" count={levels.length} href="/learn?view=exams" linkLabel={t("Level exams")}>
          {t("Your learning plan")}
        </SectionTitle>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {levels.map((lv) => {
            const tr = TRACK[lv.track];
            const complete = lv.done === lv.lessons.length;
            const locked = !lv.paywalled && !lv.open;
            const cls = cn("flex items-center gap-3 rounded-2xl border border-line bg-white p-3", locked ? "opacity-60" : "transition-shadow hover:shadow-soft");
            const body = (
              <>
                <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", tr.bg)}>
                  {complete ? <Check className="size-5 text-ok" strokeWidth={3} aria-hidden /> : locked || lv.paywalled ? <Lock className="size-4" aria-hidden /> : <tr.icon className="size-5" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-snug tracking-[-0.01em]">
                    {t("Level")} {lv.n}: {lv.title}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip">
                      <span className="block h-full rounded-full bg-brand" style={{ width: `${(lv.done / lv.lessons.length) * 100}%` }} />
                    </span>
                    <span className="text-xs font-medium text-ink-2">{lv.paywalled ? t("Paid") : `${lv.done}/${lv.lessons.length}`}</span>
                  </span>
                </span>
              </>
            );
            return (
              <li key={lv.n}>
                {locked ? (
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
      </section>

      {/* exam + payment notes */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <section className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6efff]">
            <FileCheck2 className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 text-[14px] leading-snug">
            <p className="font-semibold">{t("Level {n} exam", { n: current.n })}</p>
            <p className="text-muted">
              {examBest != null ? t("Your best score: {n}/100", { n: examBest }) : examReady && !current.paywalled ? t("You can take it now: 30 questions, 60 minutes.") : t("Pass every lesson quiz to unlock this exam")}
            </p>
          </div>
          {examReady && !current.paywalled && (
            <Link href={`/learn/levels/${current.n}/exam`} className="ml-auto shrink-0 text-sm font-medium text-brand hover:underline">
              {t("Take the level exam")}
            </Link>
          )}
        </section>
        {pendingPayment ? (
          <p role="status" className="rounded-2xl border border-line bg-[#e6efff] p-4 text-[14px] leading-snug text-brand">
            {t("Your payment is pending confirmation. We'll unlock Levels 5 to 8 as soon as it's verified.")}
          </p>
        ) : (
          !advanced && (
            <section className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 lg:hidden">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6efff]">
                <Lock className="size-5 text-brand" aria-hidden />
              </span>
              <div className="min-w-0 text-[14px] leading-snug">
                <p className="font-semibold">{t("Levels 5 to 8 · one payment")}</p>
                <p className="text-muted">{advancedPriceEtb().toLocaleString("en-US")} ETB</p>
              </div>
              <Link href="/learn/levels/5" className="ml-auto shrink-0 text-sm font-medium text-brand hover:underline">
                {t("Unlock Levels 5 to 8")}
              </Link>
            </section>
          )
        )}
      </div>
    </div>
  );
}
