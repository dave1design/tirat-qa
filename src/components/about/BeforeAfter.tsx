import { Check, FileText, MessageSquareText, Search, Target } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import { cn } from "@/lib/utils";

const scattered = [
  { t: "Definitions", d: "Read once, easy to forget", rot: "-rotate-[14deg]", pos: "left-[4%] top-[6%]", tone: "green" as Tone, icon: FileText },
  { t: "Concepts", d: "Hard to apply without practice", rot: "rotate-[10deg]", pos: "right-[2%] top-[2%]", tone: "orange" as Tone, icon: Search },
  { t: "Notes", d: "Where do I start testing?", rot: "-rotate-[6deg]", pos: "left-[10%] top-[44%]", tone: "violet" as Tone, icon: MessageSquareText },
  { t: "Theory", d: "No bugs found yet", rot: "rotate-[8deg]", pos: "right-[6%] top-[52%]", tone: "black" as Tone, icon: Target },
];

const flow = [
  { icon: Search, tone: "green" as Tone, t: "Explore functionality", s: "Investigate behavior" },
  { icon: Target, tone: "orange" as Tone, t: "Identify bugs", s: "Find what's unexpected" },
  { icon: FileText, tone: "violet" as Tone, t: "Document findings", s: "Structured bug reports" },
  { icon: MessageSquareText, tone: "blue" as Tone, t: "Review feedback", s: "Learn from your results" },
];

/** Two-panel comparison: scattered learning notes (left, light) versus the practice flow (right, dark). */
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
          <div className="grid overflow-hidden rounded-[40px] border border-line/80 bg-white/60 p-2 md:grid-cols-2">
            <div className="relative h-[440px] overflow-hidden rounded-[32px] bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-wider text-muted">Learning testing</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1 text-[12px] font-medium text-muted">
                  <span className="size-1.5 rounded-full bg-orange" /> Theory only
                </span>
              </div>
              <div className="absolute inset-x-6 top-20 h-[260px]">
                {scattered.map((c, i) => (
                  <div
                    key={c.t}
                    className={cn("absolute flex w-[46%] min-w-[150px] animate-float items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-float", c.rot, c.pos)}
                    style={{ animationDelay: `${-i * 1.4}s`, animationDuration: `${6 + i}s` }}
                  >
                    <AppTile icon={c.icon} tone={c.tone} size={36} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{c.t}</span>
                      <span className="block truncate text-xs text-muted">{c.d}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="absolute inset-x-6 bottom-6 text-center text-sm text-muted">Concepts, definitions and notes — without anywhere to apply them.</p>
            </div>

            <div className="relative h-[440px] overflow-hidden rounded-[32px] bg-[#141414] p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-wider text-white/55">Practicing testing</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium">
                  <span className="size-1.5 rounded-full bg-green" /> Hands-on
                </span>
              </div>
              <ul className="mt-8 grid gap-3">
                {flow.map((f, i) => (
                  <li key={f.t} className="group flex items-center gap-3.5 rounded-2xl bg-white/[0.07] p-3 pr-4 transition-colors hover:bg-white/[0.12]" style={{ opacity: 1 - i * 0.08 }}>
                    <AppTile icon={f.icon} tone={f.tone} size={40} />
                    <span className="flex-1">
                      <span className="block text-[15px] font-medium">{f.t}</span>
                      <span className="block text-xs text-white/55">{f.s}</span>
                    </span>
                    <span className="flex size-5 items-center justify-center rounded-full bg-green/20 text-green">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="absolute inset-x-6 bottom-6 text-center text-sm text-white/55">Investigate, identify, document and improve — on real practice websites.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
