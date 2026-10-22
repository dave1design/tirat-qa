"use client";

import { Check, ClipboardList, FileText, Flag, Layers, Search, Target, Trophy } from "lucide-react";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import { useT } from "@/lib/i18n/client";

const flow: { icon: typeof Check; tone: Tone; t: string; s: string }[] = [
  { icon: Search, tone: "green", t: "Explore functionality", s: "Investigate behavior" },
  { icon: Target, tone: "orange", t: "Identify bugs", s: "Find what's unexpected" },
  { icon: FileText, tone: "gray", t: "Document findings", s: "Structured bug reports" },
  { icon: ClipboardList, tone: "white", t: "Practice websites", s: "Hands-on challenges" },
  { icon: Layers, tone: "violet", t: "Levels", s: "Progressive skills" },
  { icon: Trophy, tone: "blue", t: "Results", s: "Score and feedback" },
  { icon: Flag, tone: "lime", t: "Review and improve", s: "Learn from your results" },
];

/** The practice steps; they pop in one by one when the section loads. */
export function PracticeFlow() {
  const t = useT();
  return (
    <ul className="grid gap-1.5 px-6">
      {flow.map((f, i) => (
        <li
          key={f.t}
          className="group flex items-center gap-3.5 rounded-2xl bg-white/[0.07] px-2.5 py-1.5 transition-colors hover:bg-white/[0.12]"
          style={{ animation: `pop-in .6s ${0.15 * i}s both cubic-bezier(.2,.8,.2,1)` }}
        >
          <AppTile icon={f.icon} tone={f.tone} size={30} />
          <span className="flex-1 text-[14px] font-medium">{t(f.t)}</span>
          <span className="hidden text-[12.5px] text-white/60 sm:block">{t(f.s)}</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-green text-white">
            <Check className="size-3" strokeWidth={3} aria-hidden />
          </span>
        </li>
      ))}
    </ul>
  );
}
