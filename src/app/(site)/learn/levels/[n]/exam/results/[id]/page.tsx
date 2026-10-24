import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLevel } from "@/content/curriculum";
import { getLocale, getT } from "@/lib/i18n/server";
import { EXAM_PASS_POINTS, examQuestions } from "@/content/exam";
import { scoreResponses, type ExamOrder } from "@/lib/exam";
import { PageTop } from "@/components/layout/SiteShell";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Exam results" };

type Params = Promise<{ n: string; id: string }>;

export default async function ExamResultsPage({ params }: { params: Params }) {
  const { n, id } = await params;
  const levelN = Number(n);
  const locale = await getLocale();
  const t = await getT();
  const level = getLevel(levelN, locale);
  const bank = examQuestions(levelN, locale);
  if (!level || !bank) notFound();
  const user = await requireUser(`/learn/levels/${levelN}/exam/results/${id}`);

  const attempt = await db.examAttempt.findFirst({ where: { id, userId: user.id, levelN } });
  if (!attempt) notFound();
  if (attempt.status !== "SUBMITTED") redirect(`/learn/levels/${levelN}/exam`);

  const responses = JSON.parse(attempt.responses) as Record<string, number[]>;
  const order = JSON.parse(attempt.order) as ExamOrder;
  const result = scoreResponses(levelN, responses, order.qs);
  const byId = new Map(bank.map((q) => [q.id, q]));
  // only the questions that were missed are reviewed, so the full bank is not handed out
  const review = order.qs.filter((qid) => result.missed.includes(qid)).map((qid) => ({ id: qid, q: byId.get(qid)!, chosen: responses[qid] ?? [] }));

  const gaps = level.lessons
    .map((lesson, i) => ({ lesson, ...result.lessons[i + 1] }))
    .map((g) => ({ ...g, pct: g.total ? Math.round((g.correct / g.total) * 100) : 0 }));

  return (
    <PageTop className="pb-20">
      <div className="container-x max-w-[880px]">
        <Link href={`/learn/levels/${levelN}/exam`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> {t("Level {n} exam", { n: levelN })}
        </Link>

        <div className="mt-6 rounded-[36px] bg-[#141414] p-8 text-white sm:p-10">
          <p className="text-sm text-white/60">{t("Level {n} exam", { n: levelN })} · {formatDateTime(attempt.submittedAt)}</p>
          <p className="mt-3 text-[clamp(3rem,9vw,5rem)] font-semibold leading-none tracking-[-0.05em]">
            {result.score}
            <span className="text-white/45">/100</span>
          </p>
          <p className={`mt-3 text-xl font-medium ${result.passed ? "text-lime" : "text-[#ff8a7a]"}`}>
            {result.passed ? t("Passed. Well done.") : t("Not passed yet. You need {n} to pass.", { n: EXAM_PASS_POINTS })}
          </p>
          {attempt.timedOut && <p className="mt-2 text-sm text-white/60">{t("Time ran out and your saved answers were submitted automatically.")}</p>}
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.08] p-4">
              <dt className="text-sm text-white/60">{t("Part A · knowledge")}</dt>
              <dd className="mt-1 text-2xl font-semibold">{result.partA}/{result.totalA}</dd>
            </div>
            <div className="rounded-2xl bg-white/[0.08] p-4">
              <dt className="text-sm text-white/60">{t("Part B · interview scenarios")}</dt>
              <dd className="mt-1 text-2xl font-semibold">{result.partB}/{result.totalB}</dd>
            </div>
          </dl>
        </div>

        <section className="mt-12" aria-labelledby="gaps">
          <h2 id="gaps" className="text-2xl font-semibold tracking-[-0.035em]">
            {t("Where to focus next")}
          </h2>
          <ul className="mt-5 grid gap-3">
            {gaps.map((g) => (
              <li key={g.lesson.slug} className="rounded-3xl bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">
                    {g.lesson.n} {g.lesson.title}
                  </p>
                  <p className="text-sm text-muted">
                    {t("{done} of {total} correct", { done: g.correct, total: g.total })}
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white" aria-hidden>
                  <div className={`h-full rounded-full ${g.pct >= 80 ? "bg-ok" : "bg-brand"}`} style={{ width: `${g.pct}%` }} />
                </div>
                {g.pct < 80 && (
                  <Link href={`/learn/levels/${levelN}/${g.lesson.slug}`} className="mt-3 inline-block text-sm font-medium text-brand underline underline-offset-4">
                    {t("Review this lesson")}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="review">
          <h2 id="review" className="text-2xl font-semibold tracking-[-0.035em]">
            {t("Questions to review")}
          </h2>
          {review.length === 0 ? (
            <p className="mt-4 rounded-3xl bg-ok-soft p-6 text-ink-2">{t("You answered every question correctly.")}</p>
          ) : (
            <ol className="mt-5 grid gap-4">
              {review.map(({ id: qid, q, chosen }) => (
                <li key={qid} className="rounded-3xl bg-card p-5 sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">{q.part === "A" ? t("Part A") : t("Part B · select all that apply")}</p>
                  <p className="mt-2 text-[17px] font-semibold leading-snug">{q.q}</p>
                  <ul className="mt-4 grid gap-2 text-[15px]">
                    {q.o.map((text, i) => {
                      const isKey = q.a.includes(i);
                      const picked = chosen.includes(i);
                      return (
                        <li
                          key={i}
                          className={`rounded-xl border px-4 py-2.5 ${isKey ? "border-ok bg-ok-soft" : picked ? "border-bad bg-bad-soft" : "border-line bg-white"}`}
                        >
                          {text}
                          {isKey && <span className="ml-2 text-xs font-semibold text-ok">{t("Correct answer")}</span>}
                          {picked && !isKey && <span className="ml-2 text-xs font-semibold text-bad">{t("Your answer")}</span>}
                          {picked && isKey && <span className="ml-2 text-xs font-semibold text-ok">{t("You chose this")}</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 rounded-xl bg-white px-4 py-3 text-[14.5px] text-ink-2">{q.e}</p>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`/learn/levels/${levelN}/exam`} className="rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-dark">
            {result.passed ? t("Back to the exam page") : t("Try again")}
          </Link>
          <Link href={`/learn/levels/${levelN}`} className="rounded-full bg-chip px-6 py-3.5 font-medium hover:bg-[#e5e5e5]">
            {t("Back to the level")}
          </Link>
        </div>
      </div>
    </PageTop>
  );
}
