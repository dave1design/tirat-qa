"use client";

import Link from "next/link";
import { Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import { TRACK } from "./tracks";

export interface CatalogLesson {
  key: string;
  href: string;
  n: string;
  title: string;
  minutes: number;
  track: "Foundations" | "Manual QA" | "Professional QA" | "Automation QA";
  level: number;
  levelTitle: string;
  pct: number; // best quiz score as a percentage
  state: "new" | "going" | "passed";
  locked: boolean; // the lesson before it has not been passed yet
  paid: boolean; // needs the one-time payment
}

/** A small circular progress mark: the arc is the best quiz score. */
function Ring({ pct, done }: { pct: number; done: boolean }) {
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 20 20" className="size-5 -rotate-90" aria-hidden>
      <circle cx="10" cy="10" r={r} fill="none" stroke="#e5e5e5" strokeWidth="3" />
      <circle cx="10" cy="10" r={r} fill="none" stroke={done ? "#16a34a" : "#0066ff"} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
    </svg>
  );
}

export function LessonCard({ l, list }: { l: CatalogLesson; list: boolean }) {
  const t = useT();
  const tr = TRACK[l.track];
  const blocked = l.locked && !l.paid;
  const status =
    l.paid ? (
      <span className="inline-flex items-center gap-1 font-medium text-brand">
        <Lock className="size-3.5" aria-hidden /> {t("Paid")}
      </span>
    ) : blocked ? (
      <span className="inline-flex items-center gap-1 text-muted">
        <Lock className="size-3.5" aria-hidden /> {t("Locked")}
      </span>
    ) : l.state === "new" ? (
      <span className="text-muted">{t("Not started")}</span>
    ) : (
      <span className={cn("inline-flex items-center gap-1.5 font-medium", l.state === "passed" ? "text-ok" : "text-ink-2")}>
        <Ring pct={l.pct} done={l.state === "passed"} /> {l.pct}%
      </span>
    );

  const body = (
    <>
      <div className={cn("relative flex items-center justify-center rounded-xl", tr.bg, list ? "h-24 w-36 shrink-0" : "aspect-[16/10]")}>
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] font-medium text-ink-2">
          <Clock className="size-3" aria-hidden /> {t("{n} min", { n: l.minutes })}
        </span>
        <span className={cn("flex size-[68px] items-center justify-center rounded-[22px] bg-gradient-to-br text-white shadow-[0_8px_18px_-6px_rgba(0,0,0,0.35)]", tr.tile, list && "size-14 rounded-2xl")}>
          <tr.icon className="size-7" aria-hidden />
        </span>
      </div>
      <div className={cn("min-w-0", list ? "flex flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-1" : "mt-3")}>
        <div className="min-w-0">
          <p className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">{t(l.track)}</span>
            <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] text-ink-2">
              {t("Level")} {l.level}
            </span>
          </p>
          <p className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.015em]">
            {l.n} {l.title}
          </p>
        </div>
        <p className={cn("flex items-center justify-between gap-2 text-[12.5px]", list ? "w-44 shrink-0" : "mt-3 border-t border-line pt-3")}>
          <span className="text-muted">
            {t("Quiz")}: {t("{n} questions", { n: 5 })}
          </span>
          {status}
        </p>
      </div>
    </>
  );
  const cls = cn("flex rounded-2xl border border-line bg-white p-2.5", list ? "items-center gap-4" : "h-full flex-col", blocked ? "opacity-60" : "transition-shadow hover:shadow-soft");
  return blocked ? (
    <div aria-disabled="true" className={cls}>
      {body}
    </div>
  ) : (
    <Link href={l.href} className={cls}>
      {body}
    </Link>
  );
}

