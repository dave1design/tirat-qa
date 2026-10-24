"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Clock, FileCheck2, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";

export interface SidebarLesson {
  slug: string;
  n: string;
  title: string;
  minutes: number;
  passed: boolean;
  locked: boolean;
}

export interface SidebarLevel {
  n: number;
  title: string;
  lessons: SidebarLesson[];
  examPassed: boolean;
}

/** The round icon tile at the start of every row: done, locked, current or just a lesson. */
function Mark({ passed, locked, current, exam }: { passed: boolean; locked: boolean; current: boolean; exam?: boolean }) {
  const t = useT();
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", passed ? "bg-ok-soft text-ok" : current ? "bg-brand text-white" : "bg-chip text-ink")}>
      {passed ? <Check className="size-[18px]" strokeWidth={3} aria-label={t("Passed")} /> : locked ? <Lock className="size-4" aria-label={t("Locked")} /> : exam ? <FileCheck2 className="size-[18px]" aria-hidden /> : <Play className="size-4" fill="currentColor" aria-hidden />}
    </span>
  );
}

/**
 * "Start the lesson" panel: a switch between the lessons of this level (each a card with its type, title and minutes)
 * and every level of the roadmap as collapsible sections.
 */
export function CourseSidebar({ levels, currentLevel, currentSlug, title }: { levels: SidebarLevel[]; currentLevel: number; currentSlug: string; title?: string }) {
  const t = useT();
  const [tab, setTab] = useState<"level" | "all">("level");
  const here = levels.find((l) => l.n === currentLevel) ?? levels[0];

  const row = (levelN: number, l: SidebarLesson) => {
    const current = levelN === currentLevel && l.slug === currentSlug;
    return (
      <li key={`${levelN}/${l.slug}`}>
        <Link
          href={`/learn/levels/${levelN}/${l.slug}`}
          aria-current={current ? "page" : undefined}
          className={cn("flex items-start gap-3 rounded-2xl border p-3.5 transition-colors hover:bg-card", current ? "border-brand/30 bg-[#f1f6ff]" : "border-line bg-white")}
        >
          <Mark passed={l.passed} locked={l.locked} current={current} />
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] leading-snug">
              <span className="font-semibold">
                {t("Lesson")} {l.n}:
              </span>{" "}
              {l.title}
            </span>
            <span className="mt-1 flex items-center gap-1 text-[13px] text-muted">
              <Clock className="size-3" aria-hidden /> {t("{n} min", { n: l.minutes })}
            </span>
          </span>
        </Link>
      </li>
    );
  };

  const exam = (lv: SidebarLevel) => (
    <li key={`exam-${lv.n}`}>
      <Link href={`/learn/levels/${lv.n}/exam`} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 transition-colors hover:bg-card">
        <Mark passed={lv.examPassed} locked={false} current={false} exam />
        <span className="min-w-0 flex-1 text-[14.5px] leading-snug">
          <span className="font-semibold">{t("Level {n} exam", { n: lv.n })}</span>
          <span className="mt-1 flex items-center gap-1 text-[13px] text-muted">
            <Clock className="size-3" aria-hidden /> {t("{n} min", { n: 60 })}
          </span>
        </span>
      </Link>
    </li>
  );

  return (
    <nav aria-label={t("Course content")} className="p-4">
      <h2 className="px-1 pb-3 text-[1.15rem] font-semibold tracking-[-0.02em]">{title ?? t("Start the lesson")}</h2>
      <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-card p-1">
        {(["level", "all"] as const).map((id) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn("rounded-lg px-3 py-2 text-[14px] font-medium transition-colors", tab === id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink")}
          >
            {id === "level" ? t("This level") : t("All levels")}
          </button>
        ))}
      </div>

      {tab === "level" ? (
        <>
          <p className="mt-4 px-1 text-[13px] font-medium text-muted">
            {t("Level")} {here.n}: {here.title}
          </p>
          <ol className="mt-2 grid gap-2.5">
            {here.lessons.map((l) => row(here.n, l))}
            {exam(here)}
          </ol>
          <div className="mt-4 rounded-2xl bg-card p-4">
            <p className="flex items-center justify-between text-[14px] font-medium">
              <span>{t("Level progress")}</span>
              <span className="text-muted">
                {here.lessons.filter((l) => l.passed).length}/{here.lessons.length}
              </span>
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-brand" style={{ width: `${(here.lessons.filter((l) => l.passed).length / here.lessons.length) * 100}%` }} />
            </div>
            <p className="mt-2 text-[12.5px] text-muted">{t("Pass each quiz (4 of 5) to open the next lesson.")}</p>
          </div>
        </>
      ) : (
        <div className="mt-4 grid gap-2">
          {levels.map((level) => {
            const done = level.lessons.filter((l) => l.passed).length;
            return (
              <details key={level.n} open={level.n === currentLevel} className="group rounded-2xl border border-line">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 hover:bg-card [&::-webkit-details-marker]:hidden">
                  <span aria-hidden className="text-xs text-muted transition-transform group-open:rotate-90">▶</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold leading-snug">
                      {t("Level")} {level.n}: {level.title}
                    </span>
                    <span className="text-xs text-muted">
                      {done} / {level.lessons.length}
                    </span>
                  </span>
                </summary>
                <ol className="grid gap-2 px-3 pb-3">
                  {level.lessons.map((l) => row(level.n, l))}
                  {exam(level)}
                </ol>
              </details>
            );
          })}
        </div>
      )}
    </nav>
  );
}
