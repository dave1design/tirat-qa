import { BookOpen, Check, ChevronRight, ClipboardList, FileText, Flag, HelpCircle, Layers, ListChecks, MessageSquareText, Search, Target, Trophy, Type } from "lucide-react";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { AppTile, type Tone } from "@/components/ui/AppTile";

type Icon = typeof Check;

/** Left panel: long note cards at steep angles that keep rocking slowly (angle = --a, left/top in %). */
const scattered: { t: string; d: string; icon: Icon; tone: Tone; a: number; x: number; y: number; w: number; delay: number }[] = [
  { t: "Definitions", d: "Read once, easy to forget", icon: FileText, tone: "green", a: 84, x: 38, y: 12, w: 300, delay: 0 },
  { t: "Concepts", d: "Hard to apply without practice", icon: Search, tone: "orange", a: -16, x: 50, y: 22, w: 300, delay: -1.2 },
  { t: "Notes", d: "Where do I start testing?", icon: MessageSquareText, tone: "violet", a: 78, x: 20, y: 26, w: 300, delay: -3.1 },
  { t: "Lessons", d: "Watched, never practiced", icon: BookOpen, tone: "lime", a: 38, x: 14, y: 60, w: 320, delay: -4.2 },
  { t: "Theory", d: "No bugs found yet", icon: Target, tone: "gray", a: 30, x: 50, y: 66, w: 300, delay: -2 },
  { t: "Checklist", d: "Never tried on a real website", icon: ListChecks, tone: "orange", a: -12, x: 34, y: 46, w: 320, delay: -5 },
];

const flow: { icon: Icon; tone: Tone; t: string; s: string }[] = [
  { icon: Search, tone: "green", t: "Explore functionality", s: "Investigate behavior" },
  { icon: Target, tone: "orange", t: "Identify bugs", s: "Find what's unexpected" },
  { icon: FileText, tone: "gray", t: "Document findings", s: "Structured bug reports" },
  { icon: ClipboardList, tone: "white", t: "Practice websites", s: "Hands-on challenges" },
  { icon: Layers, tone: "violet", t: "Levels", s: "Progressive skills" },
  { icon: Trophy, tone: "blue", t: "Results", s: "Score and feedback" },
  { icon: Flag, tone: "lime", t: "Review and improve", s: "Learn from your results" },
];

/** Comparison panels with a blue arrow joining them: rocking notes (left, light) → the practice flow (right, dark). */
export function BeforeAfter() {
  return (
    <section className="py-12 sm:py-20" aria-label="Learning versus practicing">
      <div className="container-x">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <p className="lead">
            Learning software testing concepts is important, but understanding how to apply them can be challenging without practical experience.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="relative rounded-[44px] border border-line/70 bg-[#f6f6f6] p-2">
            <div className="grid gap-2 md:grid-cols-2">
              {/* ───── before ───── */}
              <div className="relative h-[500px] overflow-hidden rounded-[36px] bg-white">
                <div className="flex items-center justify-between p-6">
                  <span className="font-mono text-[12px] uppercase tracking-wider text-muted">Learning testing</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1.5 text-[13px] font-medium text-muted">
                    <span className="size-2 rounded-full bg-orange" /> Theory only
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-20 top-14">
                  {scattered.map((c) => (
                    <div
                      key={c.t}
                      className="absolute animate-rock"
                      style={{ left: `${c.x}%`, top: `${c.y}%`, ["--a" as string]: `${c.a}deg`, animationDelay: `${c.delay}s`, animationDuration: `${7 + (Math.abs(c.a) % 4)}s` } as CSSProperties}
                    >
                      <div className="flex items-center gap-3 rounded-[20px] border border-black/[0.04] bg-white p-2.5 pr-5 shadow-[0_14px_34px_-12px_rgba(0,0,0,0.25)]" style={{ width: c.w * 0.6 }}>
                        <AppTile icon={c.icon} tone={c.tone} size={34} />
                        <span className="min-w-0">
                          <span className="block text-[14px] font-medium leading-tight tracking-[-0.02em]">{c.t}</span>
                          <span className="block truncate text-[11.5px] text-muted">{c.d}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="absolute inset-x-6 bottom-6 text-center text-[14px] text-muted">Concepts, definitions and notes — without anywhere to apply them.</p>
              </div>

              {/* ───── after ───── */}
              <div className="relative h-[500px] overflow-hidden rounded-[36px] bg-[#141414] text-white">
                <div className="flex items-center justify-between p-6">
                  <span className="font-mono text-[12px] uppercase tracking-wider text-white/55">Practicing testing</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium">
                    <span className="size-2 rounded-full bg-green" /> Hands-on
                  </span>
                </div>
                <ul className="grid gap-1.5 px-6">
                  {flow.map((f, i) => (
                    <li
                      key={f.t}
                      className="group flex items-center gap-3.5 rounded-2xl bg-white/[0.07] px-2.5 py-1.5 transition-colors hover:bg-white/[0.12]"
                      style={{ animation: `pop-in .6s ${0.15 * i}s both cubic-bezier(.2,.8,.2,1)` }}
                    >
                      <AppTile icon={f.icon} tone={f.tone} size={30} />
                      <span className="flex-1 text-[14px] font-medium">{f.t}</span>
                      <span className="hidden text-[12.5px] text-white/60 sm:block">{f.s}</span>
                      <span className="flex size-5 items-center justify-center rounded-full bg-green text-white">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="absolute inset-x-6 bottom-6 text-center text-[14px] text-white/60">Investigate, identify, document and improve — on real practice websites.</p>
              </div>
            </div>

            {/* the arrow that joins the two panels */}
            <span className="absolute left-1/2 top-1/2 z-10 flex size-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-soft backdrop-blur max-md:top-[calc(50%-2px)]">
              <span className="flex size-[42px] animate-pop items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(0,102,255,0.45)]">
                <ChevronRight className="size-5 max-md:rotate-90" strokeWidth={2.4} aria-hidden />
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
