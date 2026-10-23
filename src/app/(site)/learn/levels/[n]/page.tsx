import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, BookOpenCheck, Check, ChevronRight, Clock, FileCheck2, FlaskConical, Lock, MessagesSquare, PlayCircle, Timer, Video } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { isLessonPassed, isLevelUnlocked, LEARN_LOGIN, loadProgress } from "@/lib/learn-progress";
import { getLevel, levelsFor } from "@/content/curriculum";
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
  if (!user) redirect(LEARN_LOGIN);
  const progress = await loadProgress(user.id);
  if (!isLevelUnlocked(level.n, progress)) redirect("/learn#roadmap");
  const exam_ = user ? await examSummary(user.id, level.n) : null;
  const prev = levelsFor(locale).find((l) => l.n === level.n - 1);
  const next = levelsFor(locale).find((l) => l.n === level.n + 1);
  const isAutomation = level.track === "Automation QA";

  const passedCount = level.lessons.filter((l) => isLessonPassed(progress.get(`${level.n}/${l.slug}`))).length;
  const totalMinutes = level.lessons.reduce((sum, l) => sum + l.minutes, 0);
  const resume = level.lessons.find((l) => !isLessonPassed(progress.get(`${level.n}/${l.slug}`)));
  const startHref = resume ? `/learn/levels/${level.n}/${resume.slug}` : `/learn/levels/${level.n}/exam`;
  const startLabel = passedCount === 0 ? t("Start learning") : resume ? t("Continue learning") : t("Take the level exam");
  const includes: [typeof Video, string][] = [
    [Video, t("{n} video lessons with summaries", { n: level.lessons.length })],
    [BookOpenCheck, t("A required quiz after every lesson")],
    [FlaskConical, t("Optional practice labs")],
    [Timer, t("A 50-question timed level exam")],
    [MessagesSquare, t("Interview preparation")],
  ];

  const startCard = (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-float">
      <Link href={startHref} className="group relative block aspect-video bg-ink" aria-label={startLabel}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${level.lessons[0].video.id}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-white text-ink shadow-float transition-transform group-hover:scale-110">
            <PlayCircle className="size-7" aria-hidden />
          </span>
        </span>
      </Link>
      <div className="p-6">
        {user && (
          <div className="mb-5">
            <div className="flex justify-between text-sm font-medium">
              <span>{t("Your progress")}</span>
              <span>{passedCount} / {level.lessons.length}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-chip" role="progressbar" aria-valuenow={passedCount} aria-valuemin={0} aria-valuemax={level.lessons.length}>
              <div className="h-full rounded-full bg-ok" style={{ width: `${(passedCount / level.lessons.length) * 100}%` }} />
            </div>
          </div>
        )}
        <Link href={startHref} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-[16px] font-semibold text-white hover:bg-brand-dark">
          {startLabel} <ArrowRight className="size-4" aria-hidden />
        </Link>
        <p className="mt-5 text-[15px] font-semibold">{t("This level includes")}</p>
        <ul className="mt-3 grid gap-2.5 text-[14.5px] text-ink-2">
          {includes.map(([Icon, label]) => (
            <li key={label} className="flex items-center gap-3">
              <Icon className="size-4 shrink-0 text-muted" aria-hidden /> {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="pb-20">
      <section className="bg-ink pb-12 pt-32 text-white sm:pt-40 lg:pb-16">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="max-w-[760px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-[#9ec5ff]">
              <Link href="/learn#roadmap" className="hover:underline">{t("Learning roadmap")}</Link>
              <ChevronRight className="size-3.5 text-white/40" aria-hidden />
              <span>{t(level.track)}</span>
            </nav>
            <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">
              {t("Level")} {level.n}: {level.title}
            </h1>
            <p className="mt-4 text-[18px] leading-snug text-white/80">{level.goal}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <Video className="size-4" aria-hidden /> {t("{n} lessons", { n: level.lessons.length })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden /> {t("{n} min", { n: totalMinutes })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-4" aria-hidden /> {t("Level {n} timed exam", { n: level.n })}
              </span>
            </p>
          </div>
          <div aria-hidden className="hidden lg:block" />
        </div>
      </section>

      <div className="container-x">
        <div className="mt-8 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <aside className="lg:order-2 lg:-mt-[19.5rem] lg:self-start lg:sticky lg:top-28">{startCard}</aside>

          <div className="mt-10 min-w-0 lg:order-1 lg:mt-12">
            <section aria-labelledby="learn-title" className="rounded-2xl border border-line p-6 sm:p-7">
              <h2 id="learn-title" className="text-[1.5rem] font-semibold tracking-[-0.03em]">
                {t("What you'll learn")}
              </h2>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {level.lessons.flatMap((l) => l.objectives).map((o) => (
                  <li key={o} className="flex gap-3 text-[15px] leading-snug">
                    <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} aria-hidden /> {o}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12" aria-labelledby="lessons-title">
              <h2 id="lessons-title" className="text-[1.5rem] font-semibold tracking-[-0.03em]">
                {t("Course content")}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {t("{n} lessons", { n: level.lessons.length })} · {t("{n} min", { n: totalMinutes })}
              </p>
              <ol className="mt-5 overflow-hidden rounded-2xl border border-line">
                {level.lessons.map((l, idx) => {
                  const s = progress.get(`${level.n}/${l.slug}`);
                  const passed = isLessonPassed(s);
                  const before = idx > 0 ? { n: level.n, slug: level.lessons[idx - 1].slug } : prev ? { n: prev.n, slug: prev.lessons[prev.lessons.length - 1].slug } : null;
                  const locked = !!user && !!before && !isLessonPassed(progress.get(`${before.n}/${before.slug}`));
                  return (
                    <li key={l.slug} className="border-b border-line last:border-0">
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center gap-4 bg-card px-5 py-4 hover:bg-chip [&::-webkit-details-marker]:hidden">
                          <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90" aria-hidden />
                          <span className="min-w-0 flex-1 text-[16px] font-semibold leading-snug">
                            {l.n} {l.title}
                          </span>
                          {passed && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-ok-soft px-2 py-0.5 text-xs font-medium text-ok">
                              <Check className="size-3" strokeWidth={3} aria-hidden /> {t("Passed")}
                            </span>
                          )}
                          <span className="hidden shrink-0 text-sm text-muted sm:block">{t("{n} min", { n: l.minutes })}</span>
                        </summary>
                        <div className="bg-white px-5 pb-5 pt-4 sm:pl-12">
                          <ul className="grid gap-2 text-[15px] text-ink-2">
                            {l.objectives.map((o) => (
                              <li key={o} className="flex gap-3 leading-snug">
                                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-muted" /> {o}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                            <span>{t("Video and summary · required quiz")}</span>
                            {s?.bestScore != null && <span>{t("Best score {n}/5", { n: s.bestScore })}</span>}
                            {s?.labDone && <span>{t("Lab done")}</span>}
                          </p>
                          <Link href={`/learn/levels/${level.n}/${l.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-[14.5px] font-semibold hover:bg-chip">
                            {locked ? <Lock className="size-4" aria-hidden /> : <PlayCircle className="size-4" aria-hidden />} {locked ? t("Locked") : passed ? t("Review lesson") : t("Start lesson")}
                          </Link>
                        </div>
                      </details>
                    </li>
                  );
                })}
                <li className="bg-card px-5 py-4">
                  <Link href={`/learn/levels/${level.n}/exam`} className="flex items-center gap-4 font-semibold">
                    <FileCheck2 className="size-4 shrink-0 text-muted" aria-hidden />
                    <span className="flex-1">{t("Level {n} exam", { n: level.n })}</span>
                    <ArrowRight className="size-4 text-muted" aria-hidden />
                  </Link>
                </li>
              </ol>
              <p className="mt-4 text-sm text-muted">{t("Each lesson ends with a required quiz. Pass it with 4 of 5 to unlock the next lesson, and pass all three to unlock the level exam.")}</p>
            </section>

            <section className="mt-12" aria-labelledby="req-title">
              <h2 id="req-title" className="text-[1.5rem] font-semibold tracking-[-0.03em]">
                {t("Requirements")}
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{level.prerequisites}</p>
            </section>

            <section className="mt-12" aria-labelledby="desc-title">
              <h2 id="desc-title" className="text-[1.5rem] font-semibold tracking-[-0.03em]">
                {t("Description")}
              </h2>
              <dl className="mt-4 grid gap-5 text-[16px] leading-relaxed text-ink-2">
                <div>
                  <dt className="font-semibold text-ink">{t("Completion outcome")}</dt>
                  <dd className="mt-1">{level.outcome}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">{t("Core deliverable")}</dt>
                  <dd className="mt-1">{level.deliverable}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

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
    </div>
  );
}
