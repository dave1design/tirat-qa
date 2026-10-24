import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, BookOpen, Check, ChevronRight, Clock, PlayCircle, Timer, Video } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { isLessonPassed, isLevelUnlocked, LEARN_LOGIN, loadProgress, passedExamLevels } from "@/lib/learn-progress";
import { getLevel, levelsFor } from "@/content/curriculum";
import { InterviewPrep } from "@/components/learn/InterviewPrep";
import { LearnApp } from "@/components/learn/LearnApp";
import { CourseSidebar } from "@/components/learn/CourseSidebar";
import { Fold } from "@/components/learn/Fold";
import { LessonCover } from "@/components/learn/LessonCover";
import { buildSidebarLevels } from "@/lib/learn-sidebar";
import { TOTAL_LESSONS } from "@/content/curriculum";
import { AdvancedPaywall } from "@/components/learn/AdvancedPaywall";
import { advancedPriceEtb, canOpenLevel, hasAdvancedAccess, isPaidLevel, pendingAdvancedPayment } from "@/lib/learn-access";
import { examSummary } from "@/lib/exam";
import { EXAM_PASS_POINTS } from "@/content/exam";
import { getLocale, getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ n: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const level = getLevel(Number((await params).n), await getLocale());
  return level ? { title: `Level ${level.n}: ${level.title}`, description: level.goal } : {};
}

const exam = [
  ["Questions", "Exactly 30"],
  ["Part A", "17 common single-best-answer questions"],
  ["Part B", "13 interview-style multi-select scenarios"],
  ["Duration", "60 minutes, visible timer, autosave"],
  ["Scoring", "Out of 100, 80 to pass (24 of 30 correct)"],
];

export default async function LevelPage({ params }: { params: Params }) {
  const locale = await getLocale();
  const t = await getT();
  const level = getLevel(Number((await params).n), locale);
  if (!level) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(LEARN_LOGIN);
  const progress = await loadProgress(user.id);
  if (isPaidLevel(level.n) && !(await canOpenLevel(user, level.n))) {
    const paid = levelsFor(locale).filter((l) => isPaidLevel(l.n));
    return <AdvancedPaywall levels={paid} priceEtb={advancedPriceEtb()} pendingRef={(await pendingAdvancedPayment(user.id))?.reference ?? null} passed={[...progress.values()].filter(isLessonPassed).length} />;
  }
  if (!isLevelUnlocked(level.n, progress)) redirect("/learn#roadmap");
  const exam_ = user ? await examSummary(user.id, level.n) : null;
  const prev = levelsFor(locale).find((l) => l.n === level.n - 1);
  const next = levelsFor(locale).find((l) => l.n === level.n + 1);
  const isAutomation = level.track === "Automation QA";

  const advanced = await hasAdvancedAccess(user);
  const examLevels = await passedExamLevels(user.id);
  const { levels: sidebarLevels, passedCount: allPassed } = buildSidebarLevels(locale, progress, advanced, examLevels);

  const passedCount = level.lessons.filter((l) => isLessonPassed(progress.get(`${level.n}/${l.slug}`))).length;
  const totalMinutes = level.lessons.reduce((sum, l) => sum + l.minutes, 0);
  const resume = level.lessons.find((l) => !isLessonPassed(progress.get(`${level.n}/${l.slug}`)));
  const startHref = resume ? `/learn/levels/${level.n}/${resume.slug}` : `/learn/levels/${level.n}/exam`;
  const startLabel = passedCount === 0 ? t("Start learning") : resume ? t("Continue learning") : t("Take the level exam");

  const chips: [typeof Clock, string][] = [
    [BookOpen, t(level.track)],
    [Video, t("{n} lessons", { n: level.lessons.length })],
    [Clock, t("{n} min", { n: totalMinutes })],
    [Timer, t("A 30-question timed level exam")],
  ];

  return (
    <LearnApp active="lessons" advanced={advanced} passed={allPassed} total={TOTAL_LESSONS}>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[15px]">
            <Link href="/learn" className="font-medium text-brand hover:underline">
              {t("Lessons")}
            </Link>
            <ChevronRight className="size-4 text-faint" aria-hidden />
            <span className="text-muted">
              {t("Level")} {level.n}
            </span>
            <ChevronRight className="size-4 text-faint" aria-hidden />
            <span className="text-muted">{level.title}</span>
          </nav>

          <Link href={startHref} aria-label={startLabel} className="group relative mt-4 block aspect-video overflow-hidden rounded-2xl bg-ink shadow-soft">
            <LessonCover n={level.lessons[0].n} track={level.track} className="absolute inset-0 h-full w-full" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-white text-brand shadow-float transition-transform group-hover:scale-110">
                <PlayCircle className="size-8" aria-hidden />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-5 pb-4 pt-12 text-sm font-medium text-white">{startLabel}</span>
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {chips.map(([Icon, label]) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[14px] font-medium shadow-sm">
                  <Icon className="size-4 text-brand" aria-hidden /> {label}
                </span>
              ))}
            </div>
            <Link href={startHref} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
              {startLabel} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <h1 className="mt-8 text-[clamp(1.7rem,3vw,2.3rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-balance">
            {t("Level")} {level.n}: {level.title}
          </h1>
          <p className="mt-3 text-[17px] leading-[1.75] text-ink-2">{level.goal}</p>

          <div className="mt-8 grid gap-3">
            <Fold title={t("What you'll learn")} open>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {level.lessons.flatMap((l) => l.objectives).map((o) => (
                  <li key={o} className="flex gap-3 text-[15.5px] leading-snug">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden /> {o}
                  </li>
                ))}
              </ul>
            </Fold>
            <Fold title={t("Requirements")}>
              <p className="text-[16px] leading-relaxed text-ink-2">{level.prerequisites}</p>
            </Fold>
            <Fold title={t("Description")}>
              <dl className="grid gap-5 text-[16px] leading-relaxed text-ink-2">
                <div>
                  <dt className="font-semibold text-ink">{t("Completion outcome")}</dt>
                  <dd className="mt-1">{level.outcome}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">{t("Core deliverable")}</dt>
                  <dd className="mt-1">{level.deliverable}</dd>
                </div>
              </dl>
            </Fold>
            <Fold title={t("Level {n} timed exam", { n: level.n })} open={passedCount === level.lessons.length}>
              <ul className="divide-y divide-line">
                {exam.map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-4 py-2.5 text-[15px] first:pt-0">
                    <span className="text-muted">{t(k)}</span>
                    <span className="text-right font-medium">{t(v)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                {t("Part A tests what you learned from the lessons and videos. Part B is harder and mostly interview questions.")}
                {exam_?.best != null ? ` ${t("Your best score: {n}/100", { n: exam_.best })}${exam_.passed ? ` ${t("(passed)")}` : ` ${t("(pass mark {n})", { n: EXAM_PASS_POINTS })}`}.` : ""}
              </p>
              <Link href={`/learn/levels/${level.n}/exam`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
                {exam_?.active ? t("Continue your exam") : exam_?.attempts.length ? t("Take the exam again") : t("Take the level exam")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Fold>
            <Fold title={isAutomation ? t("Expert-reviewed automation deliverable") : t("Practical application milestone")}>
              <p className="text-[16.5px] leading-relaxed text-ink-2">{level.milestone}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                {isAutomation
                  ? t("You code locally in your own IDE. The website never executes uploaded code on its production server.")
                  : t("The reviewer evaluates accuracy, clarity, reproducibility, coverage, risk awareness and professional communication. Scores and feedback come from a human QA expert, not AI.")}
              </p>
              {!isAutomation && (
                <Link href="/practice-lab" className="mt-4 inline-flex items-center gap-2 font-medium text-brand underline underline-offset-4">
                  {t("Open the Practice Lab")} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </Fold>
            <Fold title={t("Level {n} interview preparation", { n: level.n })}>
              <p className="mb-4 text-[15px] text-muted">{t("Practise out loud first, then compare your answer with the guide. Every prompt starts with Think first.")}</p>
              <InterviewPrep prompts={level.interview} />
            </Fold>
          </div>

          <nav aria-label={t("Level navigation")} className="mt-10 flex flex-wrap justify-between gap-3">
            {prev ? (
              <Link href={`/learn/levels/${prev.n}`} className="rounded-full border border-line bg-white px-4 py-2.5 text-[14px] font-medium shadow-sm hover:bg-card">
                {t("Level")} {prev.n}: {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/learn/levels/${next.n}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
                {t("Level")} {next.n}: {next.title} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </nav>
        </div>

        <aside className="rounded-2xl border border-line bg-white xl:sticky xl:top-28 xl:self-start">
          <CourseSidebar levels={sidebarLevels} currentLevel={level.n} currentSlug="" title={t("Start the level")} />
        </aside>
      </div>
    </LearnApp>
  );
}
