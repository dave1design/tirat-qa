"use client";

import Link from "next/link";
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

/**
 * "Course content": every level as a collapsible section with its lessons, a status mark on each, and the level exam.
 * Uses native <details>, so it works without scripts. The level being studied starts open.
 */
export function CourseSidebar({ levels, currentLevel, currentSlug }: { levels: SidebarLevel[]; currentLevel: number; currentSlug: string }) {
  const t = useT();
  return (
    <nav aria-label={t("Course content")}>
      <h2 className="px-5 pb-3 pt-4 text-[17px] font-semibold tracking-[-0.02em]">{t("Course content")}</h2>
      <div className="border-t border-line">
        {levels.map((level) => {
          const done = level.lessons.filter((l) => l.passed).length;
          const minutes = level.lessons.reduce((s, l) => s + l.minutes, 0);
          return (
            <details key={level.n} open={level.n === currentLevel} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start gap-3 bg-card px-5 py-3.5 hover:bg-chip [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="mt-1 text-xs text-muted transition-transform group-open:rotate-90">▶</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-semibold leading-snug">
                    {t("Level")} {level.n}: {level.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">
                    {done} / {level.lessons.length} · {t("{n} min", { n: minutes })}
                  </span>
                </span>
              </summary>
              <ol>
                {level.lessons.map((l) => {
                  const current = level.n === currentLevel && l.slug === currentSlug;
                  return (
                    <li key={l.slug}>
                      <Link
                        href={`/learn/levels/${level.n}/${l.slug}`}
                        aria-current={current ? "page" : undefined}
                        className={cn("flex items-start gap-3 px-5 py-3 transition-colors hover:bg-chip", current ? "bg-[#e9f0ff]" : "bg-white")}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2",
                            l.passed ? "border-ok bg-ok text-white" : current ? "border-brand text-brand" : "border-[#c4c4c4] text-muted",
                          )}
                        >
                          {l.passed ? <Check className="size-3" strokeWidth={4} aria-label={t("Passed")} /> : l.locked ? <Lock className="size-2.5" aria-label={t("Locked")} /> : current ? <Play className="size-2.5" fill="currentColor" aria-hidden /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block text-[14px] leading-snug", current ? "font-semibold" : "")}>
                            {l.n}. {l.title}
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-xs text-muted">
                            <Clock className="size-3" aria-hidden /> {t("{n} min", { n: l.minutes })}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link href={`/learn/levels/${level.n}/exam`} className="flex items-start gap-3 bg-white px-5 py-3 transition-colors hover:bg-chip">
                    <span className={cn("mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2", level.examPassed ? "border-ok bg-ok text-white" : "border-[#c4c4c4] text-muted")}>
                      {level.examPassed ? <Check className="size-3" strokeWidth={4} aria-label={t("Passed")} /> : <FileCheck2 className="size-2.5" aria-hidden />}
                    </span>
                    <span className="text-[14px] leading-snug">{t("Level {n} exam", { n: level.n })}</span>
                  </Link>
                </li>
              </ol>
            </details>
          );
        })}
      </div>
    </nav>
  );
}
