import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLevel } from "@/content/curriculum";
import { getLocale, getT } from "@/lib/i18n/server";
import { EXAM_MINUTES, EXAM_PASS_POINTS, examQuestions } from "@/content/exam";
import { examSummary, finalizeAttempt, type ExamOrder } from "@/lib/exam";
import { isLessonPassed, loadProgress } from "@/lib/learn-progress";
import { canOpenLevel } from "@/lib/learn-access";
import { startExamAction } from "@/actions/exam";
import { PageTop } from "@/components/layout/SiteShell";
import { ExamRunner, type RunnerQuestion } from "@/components/learn/ExamRunner";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ n: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const level = getLevel(Number((await params).n));
  return level ? { title: `Level ${level.n} exam` } : {};
}

export default async function ExamPage({ params }: { params: Params }) {
  const levelN = Number((await params).n);
  const locale = await getLocale();
  const t = await getT();
  const level = getLevel(levelN, locale);
  const bank = examQuestions(levelN, locale);
  if (!level || !bank) notFound();
  const user = await requireUser(`/learn/levels/${levelN}/exam`);
  if (!(await canOpenLevel(user, levelN))) redirect(`/learn/levels/${levelN}`);

  const summary = await examSummary(user.id, levelN);
  const progress = await loadProgress(user.id);
  const lessonStatus = level.lessons.map((l) => ({ lesson: l, passed: isLessonPassed(progress.get(`${levelN}/${l.slug}`)) }));
  const unlocked = lessonStatus.every((l) => l.passed);
  const open = await db.examAttempt.findFirst({ where: { userId: user.id, levelN, status: "IN_PROGRESS" }, orderBy: { startedAt: "desc" } });
  if (open && open.expiresAt.getTime() <= Date.now()) {
    await finalizeAttempt(open.id, true);
    redirect(`/learn/levels/${levelN}/exam/results/${open.id}`);
  }

  if (open) {
    // only stems and options are sent; the answer key stays on the server
    const order = JSON.parse(open.order) as ExamOrder;
    const byId = new Map(bank.map((q) => [q.id, q]));
    const questions: RunnerQuestion[] = order.qs.map((id) => {
      const q = byId.get(id)!;
      return { id, part: q.part, q: q.q, options: order.opts[id].map((i) => ({ i, t: q.o[i] })) };
    });
    return (
      <PageTop className="pb-20">
        <div className="container-x max-w-[1100px]">
          <h1 className="text-[1.6rem] font-semibold tracking-[-0.035em]">
            {t("Level {n} exam", { n: level.n })}: {level.title}
          </h1>
          <div className="mt-5">
            <ExamRunner
              attemptId={open.id}
              levelN={levelN}
              questions={questions}
              initialAnswers={JSON.parse(open.responses)}
              expiresAt={open.expiresAt.toISOString()}
              serverNow={new Date().toISOString()}
            />
          </div>
        </div>
      </PageTop>
    );
  }

  const rules = [
    [t("30 questions"), t("Part A has 17 knowledge questions on the lessons and videos (one best answer). Part B has 13 harder interview-style scenarios (select all that apply).")],
    [t("{n} minutes", { n: EXAM_MINUTES }), t("A visible countdown, with warnings at 10 and 2 minutes. The exam submits itself when time runs out.")],
    [t("Out of 100"), t("Your score is the share of correct answers, out of 100. You need {n} to pass (24 of 30). In Part B a question counts only when your selection exactly matches.", { n: EXAM_PASS_POINTS })],
    [t("Autosave"), t("Every answer is saved as you go, and you can pick the exam up again if your connection drops.")],
    [t("Results"), t("You see your total, your Part A and Part B scores, which lessons to revisit, and an explanation for each question you missed.")],
  ];

  return (
    <PageTop className="pb-20">
      <div className="container-x max-w-[860px]">
        <Link href={`/learn/levels/${level.n}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> {t("Level")} {level.n}: {level.title}
        </Link>
        <h1 className="mt-6 text-[clamp(2rem,4.6vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">{t("Level {n} exam", { n: level.n })}</h1>
        <p className="lead mt-4">{t("Show what you learned from the lessons and videos, then stretch yourself on questions like the ones interviewers ask.")}</p>

        <ul className="mt-8 grid gap-3">
          {rules.map(([k, v]) => (
            <li key={k} className="rounded-2xl bg-card p-5">
              <p className="font-semibold">{k}</p>
              <p className="mt-1 text-[15px] text-ink-2">{v}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">{t("The questions are in a new order each attempt.")}</p>

        {unlocked ? (
          <form action={startExamAction.bind(null, levelN)} className="mt-8">
            <button type="submit" className="rounded-full bg-brand px-7 py-4 text-base font-medium text-white hover:bg-brand-dark">
              {summary.attempts.length ? t("Start a new attempt") : t("Start the exam")}
            </button>
          </form>
        ) : (
          <div className="mt-8 rounded-[32px] border border-dashed border-line bg-card p-6">
            <p className="flex items-center gap-2 font-semibold">
              <Lock className="size-4" aria-hidden /> {t("Pass every lesson quiz to unlock this exam")}
            </p>
            <ul className="mt-4 grid gap-2">
              {lessonStatus.map(({ lesson, passed }) => (
                <li key={lesson.slug}>
                  <Link href={`/learn/levels/${levelN}/${lesson.slug}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-[15px] hover:bg-chip">
                    <span>
                      {lesson.n} {lesson.title}
                    </span>
                    <span className={passed ? "font-medium text-ok" : "text-muted"}>{passed ? t("Quiz passed") : t("Quiz not passed yet")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.attempts.length > 0 && (
          <section className="mt-12" aria-labelledby="past">
            <h2 id="past" className="text-xl font-semibold tracking-[-0.03em]">
              {t("Your attempts")}
            </h2>
            <ul className="mt-4 grid gap-2">
              {summary.attempts.map((a) => (
                <li key={a.id}>
                  <Link href={`/learn/levels/${levelN}/exam/results/${a.id}`} className="flex items-center justify-between gap-3 rounded-2xl bg-card px-5 py-3.5 hover:bg-chip">
                    <span className="text-[15px]">{formatDateTime(a.submittedAt)}</span>
                    <span className="font-semibold">
                      {a.score}/100 <span className={(a.score ?? 0) >= EXAM_PASS_POINTS ? "text-ok" : "text-bad"}>{(a.score ?? 0) >= EXAM_PASS_POINTS ? t("Passed") : t("Not passed")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageTop>
  );
}
