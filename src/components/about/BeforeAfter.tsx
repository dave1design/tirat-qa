import { Check, ChevronRight, ClipboardList, FileText, Flag, Layers, Search, Target, Trophy } from "lucide-react";
import { NoteCards } from "./NoteCards";
import { Reveal } from "@/components/ui/Reveal";
import { AppTile, type Tone } from "@/components/ui/AppTile";

type Icon = typeof Check;

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
                <NoteCards />
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
