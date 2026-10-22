"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

const STEPS = [
  { id: "learn", label: "Learn", hint: "Read, watch, understand" },
  { id: "quiz", label: "Quiz", hint: "Required: pass 4 of 5" },
  { id: "practice", label: "Practice lab", hint: "Optional hands-on lab" },
] as const;

const PassCtx = createContext<(() => void) | null>(null);

/** The quiz calls this when the learner passes, which unlocks the next lesson. */
export const useLessonPassed = () => useContext(PassCtx);

interface Nav {
  href: string;
  label: string;
}

/**
 * One lesson as a guided path: learn it (notes, video, guides), then take the quiz, which is required, then an
 * optional practice lab. The quiz opens only when the learner says they have finished the lesson, and the next lesson
 * stays locked until the quiz is passed.
 */
export function LessonFlow({
  learn,
  quiz,
  practice,
  startAtQuiz,
  alreadyPassed,
  prev,
  next,
  nextIsEnd,
}: {
  learn: ReactNode;
  quiz: ReactNode;
  practice: ReactNode;
  startAtQuiz: boolean;
  alreadyPassed: boolean;
  prev: Nav | null;
  next: Nav | null;
  nextIsEnd: boolean;
}) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(alreadyPassed ? 2 : startAtQuiz ? 1 : 0);
  const [passed, setPassed] = useState(alreadyPassed);
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const markPassed = useCallback(() => {
    setPassed(true);
    setReached(2);
  }, []);

  const go = (i: number) => {
    setReached((r) => Math.max(r, i));
    setStep(i);
  };

  return (
    <PassCtx.Provider value={markPassed}>
      <div ref={top} className="scroll-mt-24">
        <ol className="grid gap-2 sm:grid-cols-3" aria-label={t("Lesson steps")}>
          {STEPS.map((s, i) => {
            const locked = i > reached;
            const done = (i === 0 && reached >= 1) || (i === 1 && passed);
            const current = i === step;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={locked}
                  aria-current={current ? "step" : undefined}
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand",
                    current ? "border-brand bg-brand text-white" : "border-line bg-white",
                    locked && "cursor-not-allowed opacity-55",
                    !current && !locked && "hover:border-ink/30",
                  )}
                >
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold", current ? "bg-white text-brand" : done ? "bg-ok text-white" : "bg-chip text-ink")}>
                    {locked ? <Lock className="size-3.5" aria-label={t("Locked")} /> : done && !current ? <Check className="size-4" strokeWidth={3} aria-label={t("Done")} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight">{t(s.label)}</span>
                    <span className={cn("block truncate text-[12.5px]", current ? "text-white/75" : "text-muted")}>{t(s.hint)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          {step === 0 && (
            <div>
              {learn}
              <div className="mt-12 rounded-[28px] bg-[#141414] p-6 text-white sm:p-8">
                <p className="text-xl font-semibold tracking-[-0.03em]">{t("Finished the video and the summary?")}</p>
                <p className="mt-2 max-w-[560px] text-[15px] text-white/70">{t("Now test what you learned. The quiz is required: pass it with 4 of 5 to unlock the next lesson.")}</p>
                <button type="button" onClick={() => go(1)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-ink hover:bg-card">
                  {t("Start the quiz")} <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              {quiz}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => setStep(0)} className="rounded-full bg-chip px-5 py-3 font-medium hover:bg-[#e5e5e5]">
                  {t("Review the lesson")}
                </button>
                {passed && (
                  <button type="button" onClick={() => setStep(2)} className="rounded-full bg-white px-5 py-3 font-medium shadow-soft hover:bg-chip">
                    {t("Try the optional lab")}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-5 rounded-2xl bg-card px-4 py-3 text-sm text-muted">{t("This lab is optional practice. Your quiz result already counts.")}</p>
              {practice}
            </div>
          )}
        </div>

        <nav aria-label={t("Lesson navigation")} className="mt-16 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={prev.href} className="group rounded-3xl bg-card p-5 transition-colors hover:bg-chip">
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <ArrowLeft className="size-4" aria-hidden /> {t("Previous lesson")}
              </span>
              <span className="mt-1 block font-medium leading-snug">{prev.label}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && passed ? (
            <Link href={next.href} className="group rounded-3xl bg-brand p-5 text-white transition-colors hover:bg-brand-dark sm:text-right">
              <span className="flex items-center gap-1.5 text-sm text-white/75 sm:justify-end">
                {nextIsEnd ? t("You reached the end of the roadmap") : t("Next lesson")} <ArrowRight className="size-4" aria-hidden />
              </span>
              <span className="mt-1 block font-medium leading-snug">{next.label}</span>
            </Link>
          ) : next ? (
            <div aria-disabled="true" className="rounded-3xl border border-dashed border-line bg-white p-5 sm:text-right">
              <span className="flex items-center gap-1.5 text-sm text-muted sm:justify-end">
                <Lock className="size-4" aria-hidden /> {t("Next lesson")}
              </span>
              <span className="mt-1 block font-medium leading-snug text-muted">{t("Pass the quiz (4 of 5) to unlock it.")}</span>
            </div>
          ) : null}
        </nav>
      </div>
    </PassCtx.Provider>
  );
}
