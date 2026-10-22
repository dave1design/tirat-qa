"use client";

import { useState, useTransition } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { checkLabAction, saveReflectionAction, type LabResult } from "@/actions/learn";
import { cn } from "@/lib/utils";

/**
 * A small sort-the-scenarios lab: explicit task, safe seeded inputs, a Check action, visible result, Reset and a
 * reflection. The answers are checked on the server with fixed rules, so this is not an AI grade.
 */
export function LessonLab({
  levelN,
  lessonSlug,
  lab,
  signedIn,
  initialReflection,
  initialDone,
}: {
  levelN: number;
  lessonSlug: string;
  lab: { title: string; task: string; categories: string[]; items: string[]; reflection: string };
  signedIn: boolean;
  initialReflection: string;
  initialDone: boolean;
}) {
  const blank = () => lab.items.map(() => null as number | null);
  const [picked, setPicked] = useState<(number | null)[]>(blank);
  const [result, setResult] = useState<LabResult | null>(null);
  const [reflection, setReflection] = useState(initialReflection);
  const [saved, setSaved] = useState<{ ok: boolean; message: string } | null>(initialDone ? { ok: true, message: "Lab complete. Your reflection is saved." } : null);
  const [pending, start] = useTransition();

  const filled = picked.filter((p) => p !== null).length;

  const run = () =>
    start(async () => {
      const r = await checkLabAction(levelN, lessonSlug, picked);
      if (r) setResult(r);
    });
  const reset = () => {
    setPicked(blank());
    setResult(null);
  };
  const save = () =>
    start(async () => {
      setSaved(await saveReflectionAction(levelN, lessonSlug, reflection));
    });

  return (
    <div className="rounded-[28px] border border-line bg-white p-5 sm:p-7">
      <p className="text-xl font-semibold tracking-[-0.03em]">{lab.title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        <span className="font-medium text-ink">Task.</span> {lab.task}
      </p>

      <ul className="mt-5 grid gap-3">
        {lab.items.map((text, i) => {
          const r = result?.items[i];
          return (
            <li key={i} className={cn("rounded-2xl border p-4", r ? (r.correct ? "border-ok bg-ok-soft" : "border-bad bg-bad-soft") : "border-line bg-card")}>
              <p className="flex items-start gap-2 text-[15px] font-medium leading-snug">
                <span className="flex-1">{text}</span>
                {r && (r.correct ? <Check className="mt-0.5 size-4 shrink-0 text-ok" aria-label="Correct" /> : <X className="mt-0.5 size-4 shrink-0 text-bad" aria-label="Incorrect" />)}
              </p>
              <div role="radiogroup" aria-label={text} className="mt-3 flex flex-wrap gap-2">
                {lab.categories.map((c, ci) => {
                  const on = picked[i] === ci;
                  return (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      disabled={!!result}
                      onClick={() => setPicked((p) => p.map((v, k) => (k === i ? ci : v)))}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand",
                        on ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-ink/30",
                        r && !r.correct && ci === r.answer && "!border-ok !bg-ok !text-white",
                        result && "cursor-default",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!result && (
          <button type="button" onClick={run} disabled={filled < lab.items.length || pending} className="rounded-full bg-brand px-5 py-3 font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40">
            {pending ? "Checking…" : "Check my answers"}
          </button>
        )}
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-chip px-5 py-3 font-medium hover:bg-[#e5e5e5]">
          <RotateCcw className="size-4" aria-hidden /> Reset lab
        </button>
        {!result && filled < lab.items.length && <span className="text-sm text-muted">Place all {lab.items.length} scenarios to check.</span>}
      </div>

      {result && (
        <div className="mt-5 rounded-2xl bg-[#141414] p-5 text-white" role="status">
          <p className="text-2xl font-semibold tracking-[-0.03em]">
            {result.score}/{result.total} correct
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/75">{result.takeaway}</p>
        </div>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <label htmlFor={`refl-${lessonSlug}`} className="text-[15px] font-medium">
          Reflection
        </label>
        <p className="mt-1 text-sm text-muted">{lab.reflection}</p>
        <textarea
          id={`refl-${lessonSlug}`}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          maxLength={2000}
          className="mt-3 w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
          placeholder="Write a few sentences in your own words…"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={pending} className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white hover:bg-black disabled:opacity-50">
            Save reflection and complete lab
          </button>
          {saved && (
            <span role="status" className={cn("text-sm", saved.ok ? "text-ok" : "text-bad")}>
              {saved.message}
            </span>
          )}
          {!signedIn && !saved && <span className="text-sm text-muted">Sign in to save lab progress.</span>}
        </div>
      </div>
    </div>
  );
}
