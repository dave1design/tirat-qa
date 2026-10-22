import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronLeft, Clock, FileCheck2, Lock, Timer } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { isLessonPassed, loadProgress } from "@/lib/learn-progress";
import { getLevel, levelsFor } from "@/content/curriculum";
import { PageTop } from "@/components/layout/SiteShell";
import { InterviewPrep } from "@/components/learn/InterviewPrep";
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
  ["Questions", "Exactly 50"],
  ["Part A", "25 common single-best-answer questions"],
  ["Part B", "25 interview-style multi-select scenarios"],
  ["Duration", "60 minutes, visible timer, autosave"],
  ["Scoring", "100 points, 2 per question, 80 to pass"],
];

export default async function LevelPage({ params }: { params: Params }) {
  const locale = await getLocale();
  const t = await getT();
  const level = getLevel(Number((await params).n), locale);
  if (!level) notFound();

  const user = await getCurrentUser();
  const progress = await loadProgress(user?.id ?? null);
  const exam_ = user ? await examSummary(user.id, level.n) : null;
  const prev = levelsFor(locale).find((l) => l.n === level.n - 1);
  const next = levelsFor(locale).find((l) => l.n === level.n + 1);
  const isAutomation = level.track === "Automation QA";

  return (
    <PageTop className="pb-20">
      <div className="container-x">
        <Link href="/learn#roadmap" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> {t("Learning roadmap")}
        </Link>

        <header className="mt-6 max-w-[860px]">
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <span className="rounded-lg bg-brand px-2.5 py-1.5 text-white">{t("Level")} {level.n}</span>
            <span className="rounded-lg border border-line bg-white px-2.5 py-1.5">{t(level.track)}</span>
          </p>
          <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.03] tracking-[-0.045em] text-balance">{level.title}</h1>
          <p className="lead mt-5">{level.goal}</p>
        </header>

        <dl className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            [t("Prerequisites"), level.prerequisites],
            [t("Completion outcome"), level.outcome],
            [t("Core deliverable"), level.deliverable],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl bg-card p-6">
              <dt className="eyebrow text-muted">{k}</dt>
              <dd className="mt-2 text-[15.5px] leading-snug">{v}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-16" aria-labelledby="lessons-title">
          <h2 id="lessons-title" className="text-[1.9rem] font-semibold tracking-[-0.04em]">
            {t("Lessons")}
          </h2>
          <ol className="mt-6 grid gap-3">
            {level.lessons.map((l, idx) => {
              const s = progress.get(`${level.n}/${l.slug}`);
              const passed = isLessonPassed(s);
              const before = idx > 0 ? { n: level.n, slug: level.lessons[idx - 1].slug } : prev ? { n: prev.n, slug: prev.lessons[prev.lessons.length - 1].slug } : null;
              const locked = !!user && !!before && !isLessonPassed(progress.get(`${before.n}/${before.slug}`));
              return (
                <li key={l.slug}>
                  <Link href={`/learn/levels/${level.n}/${l.slug}`} className="group flex items-center gap-4 rounded-3xl bg-card p-5 transition-colors hover:bg-chip sm:p-6">
                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-[15px] font-semibold ${passed ? "bg-ok text-white" : "bg-white shadow-soft"}`}>
                      {passed ? <Check className="size-5" strokeWidth={3} aria-label={t("Passed")} /> : l.n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] font-medium leading-snug tracking-[-0.02em]">{l.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden /> {t("{n} min", { n: l.minutes })}
                        </span>
                        <span>{t("Video and summary · required quiz")}</span>
                        {s?.bestScore != null && <span>{t("Best score {n}/5", { n: s.bestScore })}</span>}
                        {s?.labDone && <span>{t("Lab done")}</span>}
                      </span>
                    </span>
                    {locked ? <Lock className="size-5 shrink-0 text-muted" aria-label={t("Locked")} /> : <ArrowRight className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-sm text-muted">{t("Each lesson ends with a required quiz. Pass it with 4 of 5 to unlock the next lesson, and pass all three to unlock the level exam.")}</p>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-2" aria-label={t("Level exam and milestone")}>
          <div className="rounded-[32px] bg-[#141414] p-7 text-white sm:p-9">
            <p className="inline-flex items-center gap-2 text-sm text-white/60">
              <Timer className="size-4" aria-hidden /> {t("Level {n} timed exam", { n: level.n })}
            </p>
            <ul className="mt-5 grid gap-2.5">
              {exam.map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4 border-b border-white/10 pb-2.5 text-[15px] last:border-0">
                  <span className="text-white/60">{t(k)}</span>
                  <span className="text-right font-medium">{t(v)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-white/65">
              {t("Part A tests what you learned from the lessons and videos. Part B is harder and mostly interview questions.")}
              {exam_?.best != null ? ` ${t("Your best score: {n}/100", { n: exam_.best })}${exam_.passed ? ` ${t("(passed)")}` : ` ${t("(pass mark {n})", { n: EXAM_PASS_POINTS })}`}.` : ""}
            </p>
            <Link href={`/learn/levels/${level.n}/exam`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-ink hover:bg-card">
              {exam_?.active ? t("Continue your exam") : exam_?.attempts.length ? t("Take the exam again") : t("Take the level exam")} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="rounded-[32px] bg-card p-7 sm:p-9">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <FileCheck2 className="size-4" aria-hidden /> {isAutomation ? t("Expert-reviewed automation deliverable") : t("Practical application milestone")}
            </p>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-2">{level.milestone}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
              {isAutomation
                ? t("You code locally in your own IDE. The website never executes uploaded code on its production server.")
                : t("The reviewer evaluates accuracy, clarity, reproducibility, coverage, risk awareness and professional communication. Scores and feedback come from a human QA expert, not AI.")}
            </p>
            {!isAutomation && (
              <Link href="/practice-lab" className="mt-6 inline-flex items-center gap-2 font-medium text-brand underline underline-offset-4">
                {t("Open the Practice Lab")} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="interview-title">
          <h2 id="interview-title" className="text-[1.9rem] font-semibold tracking-[-0.04em]">
            {t("Level {n} interview preparation", { n: level.n })}
          </h2>
          <p className="mt-2 max-w-[640px] text-muted">{t("Practise out loud first, then compare your answer with the guide. Every prompt starts with Think first.")}</p>
          <div className="mt-6">
            <InterviewPrep prompts={level.interview} />
          </div>
        </section>

        <nav aria-label={t("Level navigation")} className="mt-16 flex flex-wrap justify-between gap-3">
          {prev ? (
            <Link href={`/learn/levels/${prev.n}`} className="rounded-full bg-chip px-5 py-3 font-medium hover:bg-[#e5e5e5]">
              {t("Level")} {prev.n}: {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/learn/levels/${next.n}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark">
              {t("Level")} {next.n}: {next.title} <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </nav>
      </div>
    </PageTop>
  );
}
