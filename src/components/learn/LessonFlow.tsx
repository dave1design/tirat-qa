"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "learn", label: "Learn", hint: "Read, watch, understand" },
  { id: "practice", label: "Try it", hint: "A short hands-on lab" },
  { id: "quiz", label: "Quiz", hint: "5 questions to check yourself" },
] as const;

/**
 * Guides the learner through one lesson in order: learn it, try it, then take the quiz. The quiz stays locked until
 * the learner says they have finished the lesson, and learners who have already worked on it see every step open.
 */
export function LessonFlow({
  learn,
  practice,
  quiz,
  startUnlocked,
}: {
  learn: ReactNode;
  practice: ReactNode;
  quiz: ReactNode;
  startUnlocked: boolean;
}) {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(startUnlocked ? 2 : 0); // furthest step the learner may open
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const go = (i: number) => {
    setReached((r) => Math.max(r, i));
    setStep(i);
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <ol className="grid gap-2 sm:grid-cols-3" aria-label="Lesson steps">
        {STEPS.map((s, i) => {
          const locked = i > reached;
          const done = i < reached || (i < step);
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
                  {locked ? <Lock className="size-3.5" aria-label="Locked" /> : done && !current ? <Check className="size-4" strokeWidth={3} aria-label="Done" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold leading-tight">{s.label}</span>
                  <span className={cn("block truncate text-[12.5px]", current ? "text-white/75" : "text-muted")}>{s.hint}</span>
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
              <p className="text-xl font-semibold tracking-[-0.03em]">Finished the lesson?</p>
              <p className="mt-2 max-w-[520px] text-[15px] text-white/70">Next you will try a short hands-on lab, then take the five-question quiz.</p>
              <button
                type="button"
                onClick={() => {
                  setReached(2); // finishing the lesson opens the lab and the quiz
                  setStep(1);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-ink hover:bg-card">
                I have finished the lesson <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            {practice}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setStep(0)} className="rounded-full bg-chip px-5 py-3 font-medium hover:bg-[#e5e5e5]">
                Back to the lesson
              </button>
              <button type="button" onClick={() => go(2)} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-dark">
                Continue to the quiz <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            {quiz}
            <div className="mt-8">
              <button type="button" onClick={() => setStep(0)} className="rounded-full bg-chip px-5 py-3 font-medium hover:bg-[#e5e5e5]">
                Review the lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
