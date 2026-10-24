"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

const PassCtx = createContext<(() => void) | null>(null);

/** The quiz calls this when the learner passes, which unlocks the next lesson. */
export const useLessonPassed = () => useContext(PassCtx);

interface Nav {
  href: string;
  label: string;
}

type Tab = "overview" | "quiz" | "practice" | "resources" | "content";

/**
 * The main column of the course player: the video stays on top while the learner moves between Overview, Quiz, Practice
 * lab and Resources. The quiz is required (pass 4 of 5) before the next lesson opens; the lab opens after the quiz.
 * On small screens the course-content sidebar becomes one more tab.
 */
export function LessonFlow({
  video,
  breadcrumb,
  chips,
  heading,
  overview,
  quiz,
  practice,
  resources,
  sidebar,
  startAtQuiz,
  alreadyPassed,
  prev,
  next,
}: {
  video: ReactNode;
  breadcrumb: ReactNode;
  chips: ReactNode;
  heading: ReactNode;
  overview: ReactNode;
  quiz: ReactNode;
  practice: ReactNode;
  resources: ReactNode | null;
  sidebar: ReactNode;
  startAtQuiz: boolean;
  alreadyPassed: boolean;
  prev: Nav | null;
  next: Nav | null;
}) {
  const t = useT();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(startAtQuiz && !alreadyPassed ? "quiz" : "overview");
  const [passed, setPassed] = useState(alreadyPassed);
  const tabs = useRef<HTMLDivElement>(null);

  const markPassed = useCallback(() => {
    setPassed(true);
    router.refresh(); // so the sidebar and progress ring show the new check mark
  }, [router]);

  const go = (id: Tab) => {
    setTab(id);
    tabs.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items: { id: Tab; label: string; locked?: boolean; mobileOnly?: boolean }[] = [
    { id: "overview", label: t("Description") },
    { id: "quiz", label: t("Quiz") },
    { id: "practice", label: t("Practice lab"), locked: !passed },
    ...(resources ? [{ id: "resources" as const, label: t("Resources") }] : []),
    { id: "content", label: t("Course content"), mobileOnly: true },
  ];

  return (
    <PassCtx.Provider value={markPassed}>
      <div className="px-5 pt-5 sm:px-8">
        <Fragment key="breadcrumb">{breadcrumb}</Fragment>
        <div className="mt-4 overflow-hidden rounded-2xl bg-black shadow-soft">
          <Fragment key="video">{video}</Fragment>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Fragment key="chips">{chips}</Fragment>
          </div>
          <div className="flex shrink-0 gap-2">
            {prev && (
              <Link href={prev.href} title={prev.label} className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[14px] font-medium shadow-sm hover:bg-card">
                <ArrowLeft className="size-4" aria-hidden /> {t("Previous lesson")}
              </Link>
            )}
            {next &&
              (passed ? (
                <Link href={next.href} title={next.label} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
                  {t("Next lesson")} <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <button type="button" onClick={() => go("quiz")} title={t("Pass the quiz (4 of 5) to unlock it.")} className="inline-flex items-center gap-2 rounded-xl bg-chip px-4 py-2.5 text-[14px] font-semibold text-muted">
                  <Lock className="size-4" aria-hidden /> {t("Next lesson")}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div ref={tabs} className="mt-6 scroll-mt-20 border-b border-line px-5 sm:px-8">
        <div role="tablist" aria-label={t("Lesson steps")} className="-mb-px -ml-3.5 flex gap-1 overflow-x-auto">
          {items.map((it) => (
            <button
              key={it.id}
              role="tab"
              type="button"
              id={`tab-${it.id}`}
              aria-selected={tab === it.id}
              aria-controls={`panel-${it.id}`}
              disabled={it.locked}
              onClick={() => go(it.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3.5 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand",
                it.mobileOnly && "lg:hidden",
                tab === it.id ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink",
                it.locked && "cursor-not-allowed opacity-50 hover:text-muted",
              )}
            >
              {it.locked && <Lock className="size-3.5" aria-label={t("Locked")} />}
              {it.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="px-5 pb-16 pt-8 sm:px-8">
        <div className={cn(tab === "content" && "max-w-[560px]")}>
          {tab === "overview" && (
            <div>
              <div className="mb-5">
                <Fragment key="heading">{heading}</Fragment>
              </div>
              <Fragment key="overview">{overview}</Fragment>
              <div className="mt-8 rounded-2xl bg-brand p-6 text-white sm:p-8">
                <p className="text-xl font-semibold tracking-[-0.03em]">{passed ? t("Quiz passed") : t("Finished the video and the summary?")}</p>
                <p className="mt-2 max-w-[560px] text-[15px] text-white/80">
                  {passed ? t("Your quiz result already counts. You can retake it or move to the next lesson.") : t("Now test what you learned. The quiz is required: pass it with 4 of 5 to unlock the next lesson.")}
                </p>
                <button type="button" onClick={() => go("quiz")} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink hover:bg-card">
                  {passed ? t("Retake the quiz") : t("Start the quiz")} <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {tab === "quiz" && (
            <div>
              <Fragment key="quiz">{quiz}</Fragment>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => go("overview")} className="rounded-full bg-chip px-5 py-3 font-medium hover:bg-[#e5e5e5]">
                  {t("Review the lesson")}
                </button>
                {passed && (
                  <button type="button" onClick={() => go("practice")} className="rounded-full bg-white px-5 py-3 font-medium shadow-soft hover:bg-chip">
                    {t("Try the optional lab")}
                  </button>
                )}
              </div>
            </div>
          )}

          {tab === "practice" && (
            <div>
              <p className="mb-5 rounded-2xl bg-card px-4 py-3 text-sm text-muted">{t("This lab is optional practice. Your quiz result already counts.")}</p>
              <Fragment key="practice">{practice}</Fragment>
            </div>
          )}

          {tab === "resources" && <Fragment key="resources">{resources}</Fragment>}
          {tab === "content" && <div className="-mx-5 sm:-mx-8"><Fragment key="sidebar">{sidebar}</Fragment></div>}
        </div>
      </div>
    </PassCtx.Provider>
  );
}
