import Link from "next/link";
import { ArrowRight, BookOpen, Bot, Briefcase, Check, ClipboardCheck, FileCheck2, Flame, FlaskConical, Lock, Sparkles, Trophy, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getT } from "@/lib/i18n/server";
import { levelsFor, TOTAL_LESSONS } from "@/content/curriculum";
import { isLessonPassed, isLevelUnlocked, type LessonStatus } from "@/lib/learn-progress";
import { advancedPriceEtb, isPaidLevel } from "@/lib/learn-access";
import type { LearningStats } from "@/lib/learn-dashboard";

const TRACKS = {
  Foundations: { icon: BookOpen, blob: "bg-[#ccff00]", tint: "bg-[#f6ffd0]" },
  "Manual QA": { icon: ClipboardCheck, blob: "bg-[#d9ccff]", tint: "bg-[#f1ecff]" },
  "Professional QA": { icon: Briefcase, blob: "bg-[#ffe08a]", tint: "bg-[#fff6d9]" },
  "Automation QA": { icon: Bot, blob: "bg-[#a8ecd0]", tint: "bg-[#e5f8ef]" },
} as const satisfies Record<string, { icon: LucideIcon; blob: string; tint: string }>;

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function Stat({ tint, icon: Icon, value, label }: { tint: string; icon: LucideIcon; value: number | string; label: string }) {
  return (
    <li className={cn("rounded-2xl border-2 border-ink px-4 py-3", tint)}>
      <p className="flex items-center gap-2 text-[26px] font-semibold leading-none tracking-[-0.04em]">
        <Icon className="size-5" aria-hidden /> {value}
      </p>
      <p className="mt-1.5 text-[13px] font-medium text-ink-2">{label}</p>
    </li>
  );
}

/**
 * The learner's home: where to continue, the eight-level plan with status, what is next, a weekly streak and a
 * pointer to the paid levels or the Practice Lab. All numbers come from the learner's own progress.
 */
export async function LearningDashboard({
  name,
  progress,
  stats,
  advanced,
  pendingPayment,
  activeAttempt,
}: {
  name: string;
  progress: Map<string, LessonStatus>;
  stats: LearningStats;
  advanced: boolean;
  pendingPayment: boolean;
  activeAttempt: { label: string; href: string } | null;
}) {
  const t = await getT();
  const levels = levelsFor(await getLocale()).map((lv) => {
    const done = lv.lessons.filter((l) => isLessonPassed(progress.get(`${lv.n}/${l.slug}`))).length;
    return { ...lv, done, open: isLevelUnlocked(lv.n, progress), paywalled: isPaidLevel(lv.n) && !advanced };
  });
  const lessonsDone = levels.reduce((n, lv) => n + lv.done, 0);
  const pct = Math.round((lessonsDone / TOTAL_LESSONS) * 100);

  const flat = levels.flatMap((lv) => lv.lessons.map((l) => ({ lv, l })));
  const resumeIdx = flat.findIndex(({ lv, l }) => !isLessonPassed(progress.get(`${lv.n}/${l.slug}`)));
  const resume = resumeIdx >= 0 ? flat[resumeIdx] : null;
  const resumeBlocked = !!resume && resume.lv.paywalled; // the next lesson sits in a paid level
  const upNext = resumeIdx >= 0 ? flat.slice(resumeIdx + (resumeBlocked ? 0 : 1), resumeIdx + 5) : [];

  const current = resume?.lv ?? levels[levels.length - 1];
  const examReady = current.done === current.lessons.length;
  const examBest = stats.examBest.get(current.n);

  const trackNames = ["Foundations", "Manual QA", "Professional QA", "Automation QA"] as const;
  const tracks = trackNames.map((track) => {
    const own = levels.filter((lv) => lv.track === track);
    return { track, done: own.reduce((n, lv) => n + lv.done, 0), total: own.reduce((n, lv) => n + lv.lessons.length, 0) };
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="h-section text-balance">{t("Welcome back, {name}.", { name })}</h1>
          <p className="mt-2 text-[17px] text-muted">
            {lessonsDone === TOTAL_LESSONS ? t("You finished every lesson.") : t("You're {n}% of the way through the roadmap.", { n: pct })}
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat tint="bg-[#fff6d9]" icon={Zap} value={stats.points.toLocaleString("en-US")} label={t("Points")} />
          <Stat tint="bg-[#f1ecff]" icon={BookOpen} value={`${lessonsDone}/${TOTAL_LESSONS}`} label={t("Lessons passed")} />
          <Stat tint="bg-[#e5f8ef]" icon={Trophy} value={`${stats.examsPassed}/${levels.length}`} label={t("Exams passed")} />
          <Stat tint="bg-[#f6ffd0]" icon={FlaskConical} value={stats.labsDone} label={t("Labs done")} />
        </ul>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{t("Continue learning")}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-6 rounded-3xl border-2 border-ink bg-white p-5 sm:p-6">
            <span className={cn("flex size-20 shrink-0 items-center justify-center rounded-[28px] border-2 border-ink", TRACKS[current.track].blob)}>
              {(() => {
                const Icon = TRACKS[current.track].icon;
                return <Icon className="size-9" aria-hidden />;
              })()}
            </span>
            <div className="min-w-[220px] flex-1">
              <p className="inline-flex items-center gap-1.5 rounded-md bg-chip px-2 py-1 text-xs font-medium text-ink-2">
                {t("Level")} {current.n} · {t(current.track)}
              </p>
              <p className="mt-2 text-[1.45rem] font-semibold leading-tight tracking-[-0.035em] text-balance">
                {resume ? `${resume.l.n} ${resume.l.title}` : t("You finished every lesson.")}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-chip" role="progressbar" aria-valuenow={current.done} aria-valuemin={0} aria-valuemax={current.lessons.length}>
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(current.done / current.lessons.length) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-ink-2">
                  {current.done}/{current.lessons.length}
                </span>
              </div>
            </div>
            {resume && !resumeBlocked ? (
              <Link href={`/learn/levels/${resume.lv.n}/${resume.l.slug}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-white hover:bg-ink-2">
                {lessonsDone === 0 ? t("Start learning") : t("Resume learning")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : resume ? (
              <Link href={`/learn/levels/${resume.lv.n}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-dark">
                {t("Unlock Levels 5 to 8")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <Link href={`/learn/levels/${current.n}/exam`} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-white hover:bg-ink-2">
                {t("Level {n} exam", { n: current.n })} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>

          <div className="mt-10 flex items-end justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{t("Your learning plan")}</h2>
            <Link href="/learn#roadmap" className="text-sm font-medium text-brand underline underline-offset-4">
              {t("Open the full learning roadmap")}
            </Link>
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {levels.map((lv) => {
              const tr = TRACKS[lv.track];
              const complete = lv.done === lv.lessons.length;
              const status = complete ? "done" : lv.paywalled ? "paid" : !lv.open ? "locked" : lv.done > 0 || lv.n === current.n ? "going" : "next";
              const chip = {
                done: { label: t("Completed"), cls: "bg-ok-soft text-ok" },
                going: { label: t("In progress"), cls: "bg-[#e6efff] text-brand" },
                next: { label: t("Up next"), cls: "bg-chip text-ink-2" },
                locked: { label: t("Locked"), cls: "bg-chip text-muted" },
                paid: { label: t("Paid"), cls: "bg-ink text-white" },
              }[status];
              const Icon = tr.icon;
              const disabled = status === "locked";
              const body = (
                <>
                  <span aria-hidden className={cn("absolute -right-6 -top-6 size-24 rounded-full", tr.blob)} />
                  <Icon className="absolute right-4 top-4 size-6" aria-hidden />
                  <span className={cn("inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-medium", chip.cls)}>
                    {complete && <Check className="size-3" strokeWidth={3} aria-hidden />}
                    {(status === "locked" || status === "paid") && <Lock className="size-3" aria-hidden />} {chip.label}
                  </span>
                  <span className="mt-3 block pr-10 text-[16px] font-semibold leading-snug tracking-[-0.02em]">
                    {t("Level")} {lv.n}: {lv.title}
                  </span>
                  <span className="mt-auto flex items-center gap-3 pt-4">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip">
                      <span className="block h-full rounded-full bg-ink" style={{ width: `${(lv.done / lv.lessons.length) * 100}%` }} />
                    </span>
                    <span className="text-xs font-medium text-ink-2">
                      {lv.done}/{lv.lessons.length}
                    </span>
                  </span>
                </>
              );
              const cls = cn("relative flex h-full min-h-[148px] flex-col overflow-hidden rounded-3xl border-2 border-ink bg-white p-5", disabled ? "opacity-60" : "transition-transform hover:-translate-y-0.5");
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

          {upNext.length > 0 && !resumeBlocked && (
            <>
              <h2 className="mt-10 text-xl font-semibold tracking-[-0.03em]">{t("Recommended for you")}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {upNext.slice(0, 4).map(({ lv, l }) => {
                  const blocked = lv.paywalled || !lv.open;
                  const tr = TRACKS[lv.track];
                  const inner = (
                    <>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-muted">
                          {t("Lesson")} {l.n} · {t("{n} min", { n: l.minutes })}
                        </span>
                        <span className="mt-1 block text-[15.5px] font-semibold leading-snug tracking-[-0.02em]">{l.title}</span>
                      </span>
                      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl border-2 border-ink", tr.blob)}>
                        {blocked ? <Lock className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
                      </span>
                    </>
                  );
                  const cls = "flex items-center justify-between gap-4 rounded-3xl border-2 border-ink bg-white p-5";
                  return (
                    <li key={`${lv.n}/${l.slug}`}>
                      {blocked ? (
                        <div aria-disabled="true" className={cn(cls, "opacity-60")}>
                          {inner}
                        </div>
                      ) : (
                        <Link href={`/learn/levels/${lv.n}/${l.slug}`} className={cn(cls, "transition-transform hover:-translate-y-0.5")}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <aside className="grid content-start gap-5">
          <section aria-labelledby="streak-title" className="rounded-3xl border-2 border-ink bg-white p-6 shadow-float">
            <div className="flex items-start justify-between gap-3">
              <h2 id="streak-title" className="text-[1.4rem] font-semibold leading-tight tracking-[-0.035em]">
                {stats.streak > 0 ? t("You're on a {n}-day streak", { n: stats.streak }) : t("Start your streak today")}
              </h2>
              <span className="flex items-center gap-1 text-3xl font-semibold tracking-[-0.04em]">
                <Zap className="size-7 text-[#b3e600]" fill="currentColor" aria-hidden /> {stats.streak}
              </span>
            </div>
            <ol className="mt-4 flex justify-between" aria-label={t("This week")}>
              {stats.week.map((on, i) => (
                <li key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 text-[13px] font-semibold",
                      on ? "border-ink bg-lime text-ink" : "border-line text-muted",
                      i === stats.today && !on && "border-ink text-ink",
                    )}
                    aria-label={`${DAYS[i]}${on ? ` – ${t("Done")}` : ""}`}
                  >
                    {on ? <Zap className="size-4" fill="currentColor" aria-hidden /> : DAYS[i]}
                  </span>
                </li>
              ))}
            </ol>
            <ul className="mt-5 grid gap-3">
              {tracks.map((tr) => (
                <li key={tr.track}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium">{t(tr.track)}</span>
                    <span className="text-muted">
                      {tr.done}/{tr.total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full border border-ink/20 bg-chip">
                    <div className="h-full rounded-full bg-[#2dd4bf]" style={{ width: `${tr.total ? (tr.done / tr.total) * 100 : 0}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="events-title">
            <h2 id="events-title" className="text-xl font-semibold tracking-[-0.03em]">
              {t("Coming up")}
            </h2>
            <ul className="mt-4 grid gap-3">
              {resume && !resumeBlocked && (
                <li className="rounded-2xl bg-[#d9f3e8] p-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-ink-2">
                    <BookOpen className="size-3.5" aria-hidden /> {t("Lesson")} · {t("{n} min", { n: resume.l.minutes })}
                  </p>
                  <p className="mt-1.5 text-[14.5px] leading-snug">
                    {resume.l.n} {resume.l.title}
                  </p>
                </li>
              )}
              <li className="rounded-2xl bg-[#e6dcff] p-4">
                <p className="flex items-center gap-2 text-xs font-medium text-ink-2">
                  <FileCheck2 className="size-3.5" aria-hidden /> {t("Level {n} exam", { n: current.n })}
                </p>
                <p className="mt-1.5 text-[14.5px] leading-snug">
                  {examBest != null
                    ? t("Your best score: {n}/100", { n: examBest })
                    : examReady && !current.paywalled
                      ? t("You can take it now: 50 questions, 60 minutes.")
                      : t("Pass every lesson quiz to unlock this exam")}
                </p>
                {examReady && !current.paywalled && (
                  <Link href={`/learn/levels/${current.n}/exam`} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">
                    {t("Take the level exam")}
                  </Link>
                )}
              </li>
              {activeAttempt && (
                <li className="rounded-2xl bg-[#fdeaa8] p-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-ink-2">
                    <FlaskConical className="size-3.5" aria-hidden /> {t("Practice Lab")}
                  </p>
                  <p className="mt-1.5 text-[14.5px] leading-snug">{activeAttempt.label}</p>
                  <Link href={activeAttempt.href} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">
                    {t("Continue Testing")}
                  </Link>
                </li>
              )}
              {pendingPayment && (
                <li className="rounded-2xl bg-[#e6efff] p-4 text-[14.5px] leading-snug text-brand" role="status">
                  {t("Your payment is pending confirmation. We'll unlock Levels 5 to 8 as soon as it's verified.")}
                </li>
              )}
            </ul>
          </section>

          {!advanced ? (
            <section className="rounded-3xl border-2 border-ink bg-[#6c5cff] p-6 text-white">
              <p className="flex items-center gap-2 text-sm text-white/80">
                <Sparkles className="size-4" aria-hidden /> {t("Paid levels")}
              </p>
              <p className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.035em]">{t("Levels 5 to 8 · one payment")}</p>
              <p className="mt-2 text-sm text-white/80">
                {advancedPriceEtb().toLocaleString("en-US")} ETB · {t("Pay once and all four advanced levels are yours. No subscription.")}
              </p>
              <Link href="/learn/levels/5" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-ink hover:bg-card">
                {t("Unlock Levels 5 to 8")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          ) : (
            <section className="rounded-3xl border-2 border-ink bg-[#6c5cff] p-6 text-white">
              <p className="flex items-center gap-2 text-sm text-white/80">
                <Flame className="size-4" aria-hidden /> {t("Practice Lab")}
              </p>
              <p className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.035em]">{t("Your Next Challenge Starts Here.")}</p>
              <Link href="/practice-lab" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-ink hover:bg-card">
                {t("Explore Practice Lab")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
