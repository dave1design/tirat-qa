"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { saveExamAnswerAction, submitExamAction } from "@/actions/exam";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

export interface RunnerQuestion {
  id: string;
  part: "A" | "B";
  q: string;
  options: { i: number; t: string }[];
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h > 0 ? `${h}:` : ""}${String(m).padStart(h > 0 ? 2 : 1, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * The timed exam. The countdown is driven by the server's expiry time, every answer is autosaved, warnings appear at
 * 10 and 2 minutes, and the exam submits itself when time runs out.
 */
export function ExamRunner({
  attemptId,
  levelN,
  questions,
  initialAnswers,
  expiresAt,
  serverNow,
}: {
  attemptId: string;
  levelN: number;
  questions: RunnerQuestion[];
  initialAnswers: Record<string, number[]>;
  expiresAt: string;
  serverNow: string;
}) {
  const t = useT();
  const offset = useRef(new Date(serverNow).getTime() - Date.now());
  const end = new Date(expiresAt).getTime();
  const [left, setLeft] = useState(() => end - (Date.now() + offset.current));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>(initialAnswers);
  const [save, setSave] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [confirm, setConfirm] = useState(false);
  const [warn, setWarn] = useState("");
  const submitted = useRef(false);

  const submit = useCallback(
    (timedOut: boolean) => {
      if (submitted.current) return;
      submitted.current = true;
      void submitExamAction(attemptId, timedOut);
    },
    [attemptId],
  );

  useEffect(() => {
    const tick = setInterval(() => {
      const ms = end - (Date.now() + offset.current);
      setLeft(ms);
      if (ms <= 0) submit(true);
      else if (ms <= 2 * 60_000) setWarn(t("Only 2 minutes left. Your answers are saved and the exam submits automatically at zero."));
      else if (ms <= 10 * 60_000) setWarn(t("10 minutes remaining."));
    }, 1000);
    return () => clearInterval(tick);
  }, [end, submit, t]);

  const q = questions[idx];
  const multi = q.part === "B";
  const chosen = answers[q.id] ?? [];

  const choose = (opt: number) => {
    const next = multi ? (chosen.includes(opt) ? chosen.filter((o) => o !== opt) : [...chosen, opt]) : [opt];
    setAnswers((a) => ({ ...a, [q.id]: next }));
    setSave("saving");
    saveExamAnswerAction(attemptId, q.id, next)
      .then((ok) => setSave(ok ? "saved" : "error"))
      .catch(() => setSave("error"));
  };

  const answered = questions.filter((x) => (answers[x.id] ?? []).length > 0).length;
  const low = left <= 10 * 60_000;

  return (
    <div>
      <div className="sticky top-24 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/95 px-5 py-3 shadow-soft backdrop-blur">
        <p className="text-sm font-medium">
          {t("Question {n} of {total}", { n: idx + 1, total: questions.length })} <span className="text-muted">· {t("{n} answered", { n: answered })}</span>
        </p>
        <p className={cn("inline-flex items-center gap-2 text-lg font-semibold tabular-nums", low ? "text-bad" : "text-ink")} role="timer" aria-label={t("Time remaining")}>
          <Clock className="size-4" aria-hidden /> {fmt(left)}
        </p>
        <p className="text-xs text-muted" aria-live="polite">
          {save === "saving" ? t("Saving…") : save === "saved" ? t("Answer saved") : save === "error" ? t("Could not save. Check your connection.") : t("Answers save automatically")}
        </p>
      </div>
      {warn && (
        <p role="alert" className="mt-3 rounded-2xl bg-[#fff4e5] px-4 py-3 text-sm font-medium text-[#b45309]">
          {warn}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
        <section aria-labelledby="exam-q" className="rounded-[28px] bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-muted">
            {q.part === "A" ? t("Part A · single best answer") : t("Part B · interview scenarios, select all that apply")}
          </p>
          <h2 id="exam-q" className="mt-3 text-[1.35rem] font-semibold leading-snug tracking-[-0.03em]">
            {q.q}
          </h2>
          {multi && <p className="mt-2 text-sm font-medium text-brand">{t("Select all that apply. You earn points only when your selection exactly matches.")}</p>}
          <div className="mt-5 grid gap-2.5" role={multi ? "group" : "radiogroup"} aria-labelledby="exam-q">
            {q.options.map((o, pos) => {
              const on = chosen.includes(o.i);
              return (
                <label
                  key={o.i}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 text-[15.5px] leading-snug transition-colors focus-within:ring-2 focus-within:ring-brand/40",
                    on ? "border-brand bg-brand/[0.05]" : "border-line hover:border-ink/30",
                  )}
                >
                  <input type={multi ? "checkbox" : "radio"} name={`q-${q.id}`} checked={on} onChange={() => choose(o.i)} className="mt-1 accent-[#0066ff]" />
                  <span>
                    <span className="mr-2 font-medium text-muted">{String.fromCharCode(65 + pos)}.</span>
                    {o.t}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-3 font-medium shadow-soft hover:bg-chip disabled:opacity-40">
              <ChevronLeft className="size-4" aria-hidden /> {t("Previous")}
            </button>
            {idx < questions.length - 1 ? (
              <button type="button" onClick={() => setIdx((i) => i + 1)} className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark">
                {t("Next")} <ChevronRight className="size-4" aria-hidden />
              </button>
            ) : (
              <button type="button" onClick={() => setConfirm(true)} className="rounded-full bg-ink px-5 py-3 font-medium text-white hover:bg-black">
                {t("Review and submit")}
              </button>
            )}
          </div>
        </section>

        <aside aria-label={t("Question navigator")} className="rounded-[28px] border border-line p-5">
          <p className="text-sm font-semibold">{t("Questions")}</p>
          <ol className="mt-3 grid grid-cols-5 gap-1.5">
            {questions.map((x, i) => {
              const done = (answers[x.id] ?? []).length > 0;
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={done ? t("Question {n}, answered", { n: i + 1 }) : t("Question {n}, not answered", { n: i + 1 })}
                    aria-current={i === idx ? "true" : undefined}
                    className={cn(
                      "h-9 w-full rounded-lg text-[13px] font-medium",
                      i === idx ? "bg-brand text-white" : done ? "bg-ok-soft text-ok" : "bg-chip text-ink-2 hover:bg-[#e5e5e5]",
                      x.part === "B" && i !== idx && "ring-1 ring-inset ring-line",
                    )}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs text-muted">{t("Part A: 1 to {a}. Part B: {b} to {total}.", { a: questions.filter((x) => x.part === "A").length, b: questions.filter((x) => x.part === "A").length + 1, total: questions.length })}</p>
          <button type="button" onClick={() => setConfirm(true)} className="mt-4 w-full rounded-full bg-ink py-3 text-sm font-medium text-white hover:bg-black">
            {t("Submit exam")}
          </button>
        </aside>
      </div>

      {confirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-[440px] rounded-[28px] bg-white p-7 shadow-float">
            <h2 id="confirm-title" className="text-xl font-semibold tracking-[-0.03em]">
              {t("Submit your exam?")}
            </h2>
            <p className="mt-3 text-[15px] text-ink-2">
              {t("You answered {done} of {total} questions.", { done: answered, total: questions.length })}
              {answered < questions.length ? ` ${t("Unanswered questions score zero.")}` : ""} {t("You cannot change answers after submitting.")}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setConfirm(false)} className="flex-1 rounded-full bg-chip py-3 font-medium hover:bg-[#e5e5e5]">
                {t("Keep working")}
              </button>
              <button type="button" onClick={() => submit(false)} className="flex-1 rounded-full bg-brand py-3 font-medium text-white hover:bg-brand-dark">
                {t("Submit now")}
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="sr-only" aria-live="assertive">
        {left <= 0 ? t("Time is up. Submitting your exam.") : ""}
      </p>
      <span hidden>{levelN}</span>
    </div>
  );
}
