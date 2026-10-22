"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { submitQuizAction, type QuizResult } from "@/actions/learn";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  q: string;
  o: string[];
}

const shuffle = (n: number) => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Five-question knowledge check. The author key stays on the server: the page only sends stems and options,
 * and the result (with explanations) arrives after submission. Options are reshuffled on every retry.
 */
export function LessonQuiz({
  levelN,
  lessonSlug,
  questions,
  previousBest,
}: {
  levelN: number;
  lessonSlug: string;
  questions: QuizQuestion[];
  previousBest: number | null;
}) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  // display order of each question's options (original indices), reshuffled on a retry
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const order = useMemo(() => questions.map((q) => shuffle(q.o.length)), [round, questions]);
  const answered = picked.filter((p) => p !== null).length;

  const submit = () => {
    setError("");
    start(async () => {
      const r = await submitQuizAction(levelN, lessonSlug, picked);
      if (r) setResult(r);
      else setError("Something went wrong. Please try again.");
    });
  };
  const retry = () => {
    setPicked(questions.map(() => null));
    setResult(null);
    setRound((r) => r + 1);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {result ? "Submitted" : `${answered} of ${questions.length} answered`}
        </p>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-chip" aria-hidden>
          <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${((result ? questions.length : answered) / questions.length) * 100}%` }} />
        </div>
      </div>

      <ol className="mt-6 grid gap-5">
        {questions.map((qu, qi) => (
          <li key={qi} className="rounded-3xl bg-card p-5 sm:p-6">
            <fieldset disabled={!!result}>
              <legend className="text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                <span className="mr-2 text-muted">{qi + 1}.</span>
                {qu.q}
              </legend>
              <div className="mt-4 grid gap-2">
                {order[qi].map((oi, pos) => {
                  const selected = picked[qi] === oi;
                  const r = result?.results[qi];
                  const isCorrect = r && oi === r.correctIndex;
                  const wrongPick = r && selected && !r.correct;
                  return (
                    <label
                      key={oi}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-[15px] leading-snug transition-colors focus-within:ring-2 focus-within:ring-brand/40",
                        selected && !r && "border-brand bg-brand/[0.04]",
                        !selected && !r && "border-line hover:border-ink/30",
                        isCorrect && "border-ok bg-ok-soft",
                        wrongPick && "border-bad bg-bad-soft",
                        r && !isCorrect && !wrongPick && "border-line opacity-70",
                      )}
                    >
                      <input
                        type="radio"
                        name={`q${qi}-${round}`}
                        className="mt-1 accent-[#0066ff]"
                        checked={selected}
                        onChange={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))}
                      />
                      <span className="flex-1">
                        <span className="mr-2 font-medium text-muted">{String.fromCharCode(65 + pos)}.</span>
                        {qu.o[oi]}
                      </span>
                      {isCorrect && <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-label="Correct answer" />}
                      {wrongPick && <X className="mt-0.5 size-4 shrink-0 text-bad" aria-label="Your answer was incorrect" />}
                    </label>
                  );
                })}
              </div>
              {result && (
                <p className={cn("mt-4 rounded-2xl px-4 py-3 text-[14px] leading-relaxed", result.results[qi].correct ? "bg-ok-soft text-ink-2" : "bg-white text-ink-2")}>
                  <span className="font-semibold">{result.results[qi].correct ? "Correct. " : "Not quite. "}</span>
                  {result.results[qi].explanation}
                </p>
              )}
            </fieldset>
          </li>
        ))}
      </ol>

      {!result ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={submit}
            disabled={answered < questions.length || pending}
            className="rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? "Scoring…" : "Submit answers"}
          </button>
          {answered < questions.length && <span className="text-sm text-muted">Answer all five questions to submit.</span>}
          {error && <span role="alert" className="text-sm text-bad">{error}</span>}
          {previousBest !== null && <span className="text-sm text-muted">Best so far: {previousBest}/{questions.length}</span>}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-[#141414] p-6 text-white" role="status">
          <p className="text-sm text-white/60">Your score</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.04em]">
            {result.score}/{result.total}
          </p>
          <p className="mt-2 text-[15px] text-white/75">
            {result.passed ? "You passed the knowledge check (4 of 5 needed)." : "You need 4 of 5 to pass. Review the explanations and try again."}
          </p>
          <p className="mt-1 text-sm text-white/55">
            {result.saved ? `Saved to your progress. Best score: ${result.best}/${result.total}.` : "Sign in to save your score and progress."}
          </p>
          <button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-ink hover:bg-card">
            <RotateCcw className="size-4" aria-hidden /> Try again with shuffled options
          </button>
        </div>
      )}
    </div>
  );
}
