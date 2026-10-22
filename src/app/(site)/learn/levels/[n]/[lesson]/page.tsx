import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Clock, Lightbulb } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { isLessonPassed, loadProgress } from "@/lib/learn-progress";
import { findLesson, neighbours } from "@/content/curriculum";
import { PageTop } from "@/components/layout/SiteShell";
import { LessonFlow } from "@/components/learn/LessonFlow";
import { InlineYouTube } from "@/components/learn/InlineYouTube";
import { LessonDiagram } from "@/components/learn/LessonDiagram";
import { LessonLab } from "@/components/learn/LessonLab";
import { LessonQuiz } from "@/components/learn/LessonQuiz";

export const dynamic = "force-dynamic";

type Params = Promise<{ n: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { n, lesson } = await params;
  const found = findLesson(Number(n), lesson);
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
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"])/);
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) out.push(sentences.slice(i, i + 2).join(" "));
  return out;
}

export default async function LessonPage({ params }: { params: Params }) {
  const { n, lesson: slug } = await params;
  const levelN = Number(n);
  const found = findLesson(levelN, slug);
  if (!found) notFound();
  const { level, lesson } = found;

  const user = await getCurrentUser();
  const progress = await loadProgress(user?.id ?? null);
  const status = progress.get(`${levelN}/${slug}`);
  const { prev, next } = neighbours(levelN, slug);

  // the quiz gets only the stems and options; the answer key is checked on the server after submission
  const questions = lesson.quiz.map((qu) => ({ q: qu.q, o: [...qu.o] }));
  const labView = { title: lesson.lab.title, task: lesson.lab.task, categories: lesson.lab.categories, items: lesson.lab.items.map((i) => i.t), reflection: lesson.lab.reflection };

  return (
    <PageTop className="pb-20">
      <div className="container-x">
        <Link href={`/learn/levels/${level.n}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" aria-hidden /> Level {level.n}: {level.title}
        </Link>

        <header className="mt-6 max-w-[820px]">
          <p className="inline-flex flex-wrap items-center gap-2 text-sm font-medium">
            <span className="rounded-lg bg-brand px-2.5 py-1.5 text-white">Lesson {lesson.n}</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5">
              <Clock className="size-3.5" aria-hidden /> About {lesson.minutes} min
            </span>
            {isLessonPassed(status) && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-ok-soft px-2.5 py-1.5 text-ok">
                <Check className="size-3.5" strokeWidth={3} aria-hidden /> Quiz passed
              </span>
            )}
          </p>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-balance">{lesson.title}</h1>
          <p className="mt-4 text-[15px] text-muted">
            <span className="font-medium text-ink">Prerequisites:</span> {level.prerequisites}
          </p>
        </header>

        <div className="mx-auto mt-10 max-w-[820px]">
          <section aria-labelledby="objectives-title" className="rounded-[28px] bg-card p-6 sm:p-8">
            <h2 id="objectives-title" className="text-lg font-semibold tracking-[-0.02em]">
              By the end of this lesson you can
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
            <LessonFlow
              startUnlocked={!!status && (status.attempts > 0 || status.labDone)}
              learn={
                <div className="grid gap-12">
                  <section key="concepts" aria-labelledby="concepts">
                    <Heading id="concepts">Core concepts</Heading>
                    <div className="mt-4 grid gap-4 text-[17px] leading-[1.75] text-ink-2">
                      <Paragraphs items={paragraphs(lesson.notes)} />
                    </div>
                  </section>

                  <section key="example" aria-labelledby="example" className="rounded-[28px] bg-[#e8f6f2] p-6 sm:p-8">
                    <h2 id="example" className="flex scroll-mt-28 items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                      <Lightbulb className="size-5 text-[#0f9b8a]" aria-hidden /> Worked example
                    </h2>
                    <p className="mt-3 text-[16.5px] leading-[1.7] text-ink-2">{lesson.example}</p>
                  </section>

                  <section key="illustration" aria-label="Illustration">
                    <LessonDiagram diagram={lesson.diagram} />
                  </section>

                  <section key="video" aria-labelledby="video">
                    <Heading id="video">Watch</Heading>
                    <div className="mt-5">
                      <InlineYouTube videoId={lesson.video.id} title={lesson.video.title} summary={lesson.video.summary} />
                    </div>
                  </section>

                  <section key="recap" aria-labelledby="recap" className="rounded-[28px] border border-line p-6 sm:p-8">
                    <Heading id="recap">Before you move on</Heading>
                    <p className="mt-2 text-[15px] text-muted">Can you do these without looking back at the lesson?</p>
                    <ul className="mt-4 grid gap-2.5 text-[16px] leading-snug">
                      <li className="flex gap-3">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                        Explain &quot;{lesson.title}&quot; in your own words.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                        Name one failure or misconception this lesson helps prevent.
                      </li>
                      <li className="flex gap-3">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                        Describe the evidence you would collect on a real project.
                      </li>
                    </ul>
                  </section>
                </div>
              }
              practice={
                <section aria-labelledby="lab">
                  <Heading id="lab">{`Try it: ${lesson.lab.title}`}</Heading>
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
              quiz={
                <section aria-labelledby="quiz">
                  <Heading id="quiz">Check yourself</Heading>
                  <p className="mt-2 text-[15px] text-muted">Five questions. Answer all of them, submit, then see your score and why each answer is right. You can retry.</p>
                  <div className="mt-6">
                    <LessonQuiz levelN={level.n} lessonSlug={lesson.slug} questions={questions} previousBest={status?.bestScore ?? null} />
                  </div>
                </section>
              }
            />
          </div>

          <nav aria-label="Lesson navigation" className="mt-16 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/learn/levels/${prev.levelN}/${prev.lesson.slug}`} className="group rounded-3xl bg-card p-5 transition-colors hover:bg-chip">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <ArrowLeft className="size-4" aria-hidden /> Previous lesson
                </span>
                <span className="mt-1 block font-medium leading-snug">
                  {prev.lesson.n} {prev.lesson.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/learn/levels/${next.levelN}/${next.lesson.slug}`} className="group rounded-3xl bg-brand p-5 text-white transition-colors hover:bg-brand-dark sm:text-right">
                <span className="flex items-center gap-1.5 text-sm text-white/75 sm:justify-end">
                  Next lesson <ArrowRight className="size-4" aria-hidden />
                </span>
                <span className="mt-1 block font-medium leading-snug">
                  {next.lesson.n} {next.lesson.title}
                </span>
              </Link>
            ) : (
              <Link href="/practice-lab" className="rounded-3xl bg-brand p-5 text-white hover:bg-brand-dark sm:text-right">
                <span className="text-sm text-white/75">You reached the end of the roadmap</span>
                <span className="mt-1 block font-medium">Go to the Practice Lab</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </PageTop>
  );
}
