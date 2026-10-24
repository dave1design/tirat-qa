import Link from "next/link";
import { Check, Clock, FileCheck2, Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocale, getT } from "@/lib/i18n/server";
import { levelsFor, TOTAL_LESSONS } from "@/content/curriculum";
import { EXAM_PASS_POINTS } from "@/content/exam";
import { isLessonPassed, isLevelUnlocked, loadProgress } from "@/lib/learn-progress";
import { hasAdvancedAccess, isPaidLevel } from "@/lib/learn-access";
import { loadLearningStats } from "@/lib/learn-dashboard";
import { LearnApp } from "@/components/learn/LearnApp";
import { LessonCatalog } from "@/components/learn/LessonCatalog";
import { buildCatalogLessons } from "@/lib/learn-catalog";

type LearnUser = { id: string; role: string };

/** What /learn shows once you are logged in: the sidebar app with every lesson as a card, or the level exams. */
export async function SignedInLearn({ user, view, query }: { user: LearnUser; view: "lessons" | "exams"; query: string }) {
  const t = await getT();
  const levels = levelsFor(await getLocale());
  const progress = await loadProgress(user.id);
  const advanced = await hasAdvancedAccess(user);

  const flat = levels.flatMap((lv) => lv.lessons.map((l) => ({ lv, l })));
  const passedCount = flat.filter(({ lv, l }) => isLessonPassed(progress.get(`${lv.n}/${l.slug}`))).length;

  const lessons = buildCatalogLessons(levels, progress, advanced);

  return (
    <LearnApp active={view === "exams" ? "exams" : "lessons"} advanced={advanced} passed={passedCount} total={TOTAL_LESSONS}>
      <h1 className="text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-[-0.04em]">{view === "exams" ? t("Level exams") : t("Lessons")}</h1>
      <p className="mt-1 text-[15.5px] text-muted">
        {view === "exams" ? t("Each exam has 30 questions in 60 minutes. Pass every lesson quiz of a level to unlock its exam.") : t("Eight levels, {n} lessons. Pass each quiz (4 of 5) to open the next lesson.", { n: TOTAL_LESSONS })}
      </p>
      <div className="mt-7">{view === "exams" ? await Exams({ user, progress }) : <LessonCatalog lessons={lessons} initialQuery={query} />}</div>
    </LearnApp>
  );
}

async function Exams({ user, progress }: { user: LearnUser; progress: Awaited<ReturnType<typeof loadProgress>> }) {
  const t = await getT();
  const levels = levelsFor(await getLocale());
  const advanced = await hasAdvancedAccess(user);
  const stats = await loadLearningStats(user.id, progress);
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
      {levels.map((lv) => {
        const done = lv.lessons.filter((l) => isLessonPassed(progress.get(`${lv.n}/${l.slug}`))).length;
        const ready = done === lv.lessons.length;
        const paid = isPaidLevel(lv.n) && !advanced;
        const best = stats.examBest.get(lv.n);
        const blocked = !paid && (!ready || !isLevelUnlocked(lv.n, progress));
        const passed = best != null && best >= EXAM_PASS_POINTS;
        const cls = cn("flex h-full flex-col rounded-2xl border border-line bg-white p-4", blocked ? "opacity-60" : "transition-shadow hover:shadow-soft");
        const body = (
          <>
            <span className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#ece8fb]">
                {passed ? <Trophy className="size-5" aria-hidden /> : <FileCheck2 className="size-5" aria-hidden />}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <Clock className="size-3" aria-hidden /> {t("{n} minutes", { n: 60 })}
              </span>
            </span>
            <span className="mt-3 text-[16px] font-semibold leading-snug tracking-[-0.02em]">{t("Level {n} exam", { n: lv.n })}</span>
            <span className="mt-1 text-sm text-muted">{lv.title}</span>
            <span className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 text-[13px]">
              <span className="text-muted">{t("{done} of {total} quizzes passed", { done, total: lv.lessons.length })}</span>
              {paid ? (
                <span className="inline-flex items-center gap-1 font-medium text-brand">
                  <Lock className="size-3.5" aria-hidden /> {t("Paid")}
                </span>
              ) : blocked ? (
                <span className="inline-flex items-center gap-1 text-muted">
                  <Lock className="size-3.5" aria-hidden /> {t("Locked")}
                </span>
              ) : best != null ? (
                <span className={cn("inline-flex items-center gap-1 font-medium", passed ? "text-ok" : "text-ink-2")}>
                  {passed && <Check className="size-3.5" strokeWidth={3} aria-hidden />} {best}/100
                </span>
              ) : (
                <span className="font-medium text-brand">{t("Not started")}</span>
              )}
            </span>
          </>
        );
        return (
          <li key={lv.n}>
            {blocked ? (
              <div aria-disabled="true" className={cls}>
                {body}
              </div>
            ) : (
              <Link href={paid ? `/learn/levels/${lv.n}` : `/learn/levels/${lv.n}/exam`} className={cls}>
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
