"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

const GUIDE = [
  "Define the concept in one or two sentences.",
  "Give a concrete example from real practice, not memorized wording.",
  "Describe the testing action and the evidence you would collect.",
  "Mention trade-offs, risks and what remains untested.",
];

/** Practice workspace: think first, optional hint, then reveal the answer structure and self-rate. */
export function InterviewPrep({ prompts }: { prompts: string[] }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [rating, setRating] = useState<Record<number, number>>({});

  return (
    <ol className="grid gap-3">
      {prompts.map((p, i) => {
        const isOpen = open === i;
        const shown = revealed.has(i);
        return (
          <li key={p} className="rounded-2xl bg-card">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start gap-3 rounded-2xl px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-semibold text-white">{i + 1}</span>
              <span className="flex-1 text-[16px] font-medium leading-snug">{p}</span>
              <span className="text-xl leading-none text-muted" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pl-[3.75rem]">
                <p className="text-sm text-muted">{t("Think first. Answer out loud in 60 to 90 seconds before you look at the guide.")}</p>
                {!shown ? (
                  <button
                    type="button"
                    onClick={() => setRevealed((s) => new Set(s).add(i))}
                    className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-soft hover:bg-chip"
                  >
                    {t("I have answered, show the answer guide")}
                  </button>
                ) : (
                  <div className="mt-3 rounded-2xl bg-white p-4">
                    <p className="text-sm font-semibold">{t("Answer guide")}</p>
                    <ul className="mt-2 grid gap-1.5 text-[14.5px] leading-snug text-ink-2">
                      {GUIDE.map((g) => (
                        <li key={g} className="flex gap-2">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                          {t(g)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm font-semibold">{t("Self-rating")}</p>
                    <div className="mt-2 flex gap-1.5" role="radiogroup" aria-label={t("How well did you answer?")}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={rating[i] === n}
                          onClick={() => setRating((r) => ({ ...r, [i]: n }))}
                          className={cn("size-9 rounded-full border text-sm font-medium", rating[i] === n ? "border-brand bg-brand text-white" : "border-line hover:border-ink/30")}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted">{t("A practice tool only. Tirat does not score interview answers unless a human mock interviewer reviews them.")}</p>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
