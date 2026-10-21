"use client";

import Link from "next/link";
import { BookOpen, Bug, ChevronRight, ListChecks, Search } from "lucide-react";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import { LEARN_CATEGORIES } from "@/lib/constants";

const icons: Record<string, { icon: typeof BookOpen; tone: Tone }> = {
  fundamentals: { icon: BookOpen, tone: "blue" },
  techniques: { icon: Search, tone: "lime" },
  "bug-reporting": { icon: Bug, tone: "orange" },
  "practical-tips": { icon: ListChecks, tone: "violet" },
};

/** Mega-menu panel for "Learn": the four learning categories plus a featured guide. */
export function LearnMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div role="menu" aria-label="Learn" className="rounded-[32px] border border-line bg-white p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]">
      <p className="px-4 pb-3 pt-4 font-mono text-[12px] uppercase tracking-[0.06em] text-muted">Learn</p>
      <ul className="grid gap-x-4 sm:grid-cols-2">
        {LEARN_CATEGORIES.map((c) => {
          const { icon, tone } = icons[c.slug];
          return (
            <li key={c.slug}>
              <Link
                href={`/learn#${c.slug}`}
                role="menuitem"
                onClick={onNavigate}
                className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-card"
              >
                <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                  <AppTile icon={icon} tone={tone} size={56} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-medium tracking-[-0.02em]">{c.name}</span>
                  <span className="mt-0.5 line-clamp-2 block text-[14px] leading-snug text-muted">{c.description}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/learn/your-first-website-testing-checklist"
        role="menuitem"
        onClick={onNavigate}
        className="group mt-2 flex items-center gap-3 rounded-[22px] bg-card px-4 py-3.5 transition-colors hover:bg-chip"
      >
        <span className="rounded-full bg-brand px-3 py-1.5 text-[13px] font-medium text-white">Start here</span>
        <span className="flex-1 text-[15px] font-medium tracking-[-0.01em]">Your First Website Testing Checklist</span>
        <ChevronRight className="size-5 text-muted transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </Link>
    </div>
  );
}
