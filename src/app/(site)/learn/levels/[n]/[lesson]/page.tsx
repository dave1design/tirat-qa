import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ChevronLeft, Clock, Lightbulb, Lock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { isLessonPassed, loadProgress } from "@/lib/learn-progress";
import { findLesson, neighbours } from "@/content/curriculum";
import { LESSON_GUIDES } from "@/content/curriculum/guides";
import { db } from "@/lib/db";
import { PageTop } from "@/components/layout/SiteShell";
import { LessonFlow } from "@/components/learn/LessonFlow";
import { InlineYouTube } from "@/components/learn/InlineYouTube";
import { LessonDiagram } from "@/components/learn/LessonDiagram";
import { LessonLab } from "@/components/learn/LessonLab";
import { LessonQuiz } from "@/components/learn/LessonQuiz";
import { getLocale, getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ n: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { n, lesson } = await params;
  const found = findLesson(Number(n), lesson, await getLocale());
  return found ? { title: `${found.lesson.n} ${found.lesson.title}`, description: found.lesson.objectives[0] } : {};
}

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-[1.6rem] font-semibold tracking-[-0.035em]">
      {children}
    </h2>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </>
  );
}

/** Splits dense notes into short paragraphs (two sentences each) so they are easier to read. */
function paragraphs(text: string) {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"])|(?<=።)\s+/);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) out.push(sentences.slice(i, i + 2).join(" "));
  return out;
}

export default async function LessonPage({ params }: { params: Params }) {
  const { n, lesson: slug } = await params;
  const levelN = Number(n);
  const locale = await getLocale();
  const t = await getT();
  const found = findLesson(levelN, slug, locale);
  if (!found) notFound();
  const { level, lesson } = found;

  const user = await getCurrentUser();
  const progress = await loadProgress(user?.id ?? null);
  const status = progress.get(`${levelN}/${slug}`);
  const { prev, next } = neighbours(levelN, slug, locale);
  const passed = isLessonPassed(status);
  const isLastInLevel = found.index === level.lessons.length - 1;

  // a signed-in learner must pass the previous lesson's quiz before opening this lesson
  const prevPassed = !prev || !user || isLessonPassed(progress.get(`${prev.levelN}/${prev.lesson.slug}`));

  const guideSlugs = LESSON_GUIDES[`${levelN}/${slug}`] ?? [];
  const guides = guideSlugs.length
    ? await db.article.findMany({ where: { slug: { in: guideSlugs }, status: "PUBLISHED" }, select: { slug: true, title: true, summary: true } })
    : [];

  // the quiz gets only the stems and options; the answer key is checked on the server after submission
  const questions = lesson.quiz.map((qu) => ({ q: qu.q, o: [...qu.o] }));
  const labView = { title: lesson.lab.title, task: lesson.lab.task, categories: lesson.lab.categories, items: lesson.lab.items.map((i) => i.t), reflection: lesson.lab.reflection };

  return (
    <PageTop className="pb-20">
      <div className="container-x">
        <Link href={`/learn/levels/${level.n}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> {t("Level")} {level.n}: {level.title}
        </Link>

        <header className="mt-6 max-w-[820px]">
          <p className="inline-flex flex-wrap items-center gap-2 text-sm font-medium">
            <span className="rounded-lg bg-brand px-2.5 py-1.5 text-white">{t("Lesson")} {lesson.n}</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5">
              <Clock className="size-3.5" aria-hidden /> {t("About {n} min", { n: lesson.minutes })}
            </span>
            {isLessonPassed(status) && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-ok-soft px-2.5 py-1.5 text-ok">
                <Check className="size-3.5" strokeWidth={3} aria-hidden /> {t("Quiz passed")}
              </span>
            )}
          </p>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">{lesson.title}</h1>
          <p className="mt-4 text-[15px] text-muted">
            <span className="font-medium text-ink">{t("Prerequisites")}:</span> {level.prerequisites}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-[820px]">
          <section aria-labelledby="objectives-title" className="rounded-[28px] bg-card p-6 sm:p-8">
            <h2 id="objectives-title" className="text-lg font-semibold tracking-[-0.02em]">
              {t("By the end of this lesson you can")}
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {lesson.objectives.map((o) => (
                <li key={o} className="flex gap-3 text-[16px] leading-snug">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10">
            {!prevPassed && prev ? (
              <div className="rounded-[28px] border border-dashed border-line bg-card p-8 text-center">
                <Lock className="mx-auto size-6 text-muted" aria-hidden />
                <p className="mt-3 text-xl font-semibold tracking-[-0.03em]">{t("This lesson is locked")}</p>
                <p className="mx-auto mt-2 max-w-[460px] text-[15px] text-muted">{t("Pass the quiz of the previous lesson (4 of 5) to unlock it.")}</p>
                <Link href={`/learn/levels/${prev.levelN}/${prev.lesson.slug}`} className="mt-5 inline-flex rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-dark">
                  {prev.lesson.n} {prev.lesson.title}
                </Link>
              </div>
            ) : (
              <LessonFlow
                startAtQuiz={!!status && status.attempts > 0}
                alreadyPassed={passed}
                prev={prev ? { href: `/learn/levels/${prev.levelN}/${prev.lesson.slug}`, label: `${prev.lesson.n} ${prev.lesson.title}` } : null}
                next={isLastInLevel || !next ? { href: `/learn/levels/${level.n}/exam`, label: t("Level {n} exam", { n: level.n }) } : { href: `/learn/levels/${next.levelN}/${next.lesson.slug}`, label: `${next.lesson.n} ${next.lesson.title}` }}
                nextIsEnd={false}
                learn={
                  <div className="grid gap-12">
                    <section key="concepts" aria-labelledby="concepts">
                      <Heading id="concepts">{t("Core concepts")}</Heading>
                      <div className="mt-4 grid gap-4 text-[17px] leading-[1.75] text-ink-2">
                        <Paragraphs items={paragraphs(lesson.notes)} />
                      </div>
                    </section>

                    <section key="example" aria-labelledby="example" className="rounded-[28px] bg-[#e8f6f2] p-6 sm:p-8">
                      <h2 id="example" className="flex scroll-mt-28 items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                        <Lightbulb className="size-5 text-[#0f9b8a]" aria-hidden /> {t("Worked example")}
                      </h2>
                      <p className="mt-3 text-[16.5px] leading-[1.7] text-ink-2">{lesson.example}</p>
                    </section>

                    <section key="illustration" aria-label={t("Illustration")}>
                      <LessonDiagram diagram={lesson.diagram} />
                    </section>

                    <section key="video" aria-labelledby="video">
                      <Heading id="video">{t("Watch")}</Heading>
                      <div className="mt-5">
                        <InlineYouTube videoId={lesson.video.id} title={lesson.video.title} summary={lesson.video.summary} />
                      </div>
                    </section>

                    {guides.length > 0 && (
                      <section key="guides" aria-labelledby="guides">
                        <Heading id="guides">{t("Go deeper")}</Heading>
                        <p className="mt-2 text-[15px] text-muted">{t("Reference guides that go with this lesson.")}</p>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                          {guides.map((g) => (
                            <li key={g.slug}>
                              <Link href={`/learn/${g.slug}`} className="group flex h-full flex-col rounded-3xl bg-card p-5 transition-colors hover:bg-chip">
                                <span className="flex items-start justify-between gap-3 font-medium leading-snug">
                                  {g.title}
                                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden />
                                </span>
                                <span className="mt-2 text-[14.5px] leading-snug text-muted">{g.summary}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    <section key="recap" aria-labelledby="recap" className="rounded-[28px] border border-line p-6 sm:p-8">
                      <Heading id="recap">{t("Before you move on")}</Heading>
                      <p className="mt-2 text-[15px] text-muted">{t("Can you do these without looking back at the lesson?")}</p>
                      <ul className="mt-4 grid gap-2.5 text-[16px] leading-snug">
                        <li className="flex gap-3">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                          {t("Explain \"{title}\" in your own words.", { title: lesson.title })}
                        </li>
                        <li className="flex gap-3">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                          {t("Name one failure or misconception this lesson helps prevent.")}
                        </li>
                        <li className="flex gap-3">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                          {t("Describe the evidence you would collect on a real project.")}
                        </li>
                      </ul>
                    </section>
                  </div>
                }
                quiz={
                  <section aria-labelledby="quiz">
                    <Heading id="quiz">{t("Check yourself")}</Heading>
                    <p className="mt-2 text-[15px] text-muted">{t("Five questions. Answer all of them, submit, then see your score and why each answer is right. You can retry.")}</p>
                    <div className="mt-6">
                      <LessonQuiz levelN={level.n} lessonSlug={lesson.slug} questions={questions} previousBest={status?.bestScore ?? null} />
                    </div>
                  </section>
                }
                practice={
                  <section aria-labelledby="lab">
                    <Heading id="lab">{`${t("Try it")}: ${lesson.lab.title}`}</Heading>
                    <div className="mt-5">
                      <LessonLab
                        levelN={level.n}
                        lessonSlug={lesson.slug}
                        lab={labView}
                        signedIn={!!user}
                        initialReflection={status?.reflection ?? ""}
                        initialDone={status?.labDone ?? false}
                      />
                    </div>
                  </section>
                }
              />
            )}
          </div>
        </div>
      </div>
    </PageTop>
  );
}
