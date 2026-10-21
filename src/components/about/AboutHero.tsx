import { ArrowRight, Bug, ChartPie, ClipboardCheck, Compass, Flag, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const floaters: { icon: LucideIcon; tone: Tone; size: number; cls: string; delay: string }[] = [
  { icon: Bug, tone: "orange", size: 84, cls: "left-[9%] top-[16%]", delay: "0s" },
  { icon: Search, tone: "black", size: 64, cls: "left-[24%] top-[58%]", delay: "-1.5s" },
  { icon: ClipboardCheck, tone: "green", size: 76, cls: "right-[10%] top-[14%]", delay: "-3s" },
  { icon: Flag, tone: "lime", size: 60, cls: "right-[26%] top-[60%]", delay: "-4.5s" },
  { icon: ChartPie, tone: "violet", size: 70, cls: "left-[44%] top-[10%]", delay: "-2s" },
  { icon: Compass, tone: "white", size: 58, cls: "right-[6%] top-[52%]", delay: "-5s" },
];

/** Split hero: eyebrow chip + two-tone headline on the left, copy and buttons on the right, then a framed visual. */
export function AboutHero() {
  return (
    <section className="hero-bg pb-16 pt-36 sm:pb-24 sm:pt-44">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-1.5 text-sm font-medium">
                <span className="inline-flex h-[34px] items-center gap-2 rounded-lg bg-brand pl-2.5 pr-2 text-white">
                  Tirat QA <Users className="size-[18px] text-lime" fill="currentColor" strokeWidth={1.5} aria-hidden />
                </span>
                <span className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">About Tirat QA</span>
              </div>
            </Reveal>
            <SplitText
              as="h1"
              className="h-display mt-6 !text-[clamp(2.6rem,6.4vw,5rem)] text-balance"
              stagger={80}
              parts={[{ text: "Making Software Testing" }, { text: "Skills Practical.", className: "text-brand" }]}
            />
          </div>
          <Reveal delay={150}>
            <p className="lead">
              Tirat QA is a hands-on software quality assurance practice platform designed to help aspiring and junior QA testers develop practical testing skills.
            </p>
            <p className="lead mt-3">We believe testing is a skill you develop by doing, observing, investigating, and learning from your results.</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button href="/practice-lab">Start Practicing</Button>
              <Button href="#story" variant="light" arrow>
                Our Story
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-14">
          <div className="rounded-[40px] border border-line/80 bg-white/60 p-2">
            <div className="relative h-[340px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0a2fb8] via-brand to-[#7a6cff] sm:h-[520px]">
              <span className="absolute -left-24 -top-24 size-[420px] rounded-full bg-white/15 blur-3xl" />
              <span className="absolute -bottom-32 right-0 size-[460px] rounded-full bg-lime/25 blur-3xl" />
              <span className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:48px_48px]" />

              {/* centre: a report card, like the ones learners write */}
              <div className="absolute left-1/2 top-1/2 w-[78%] max-w-[360px] -translate-x-1/2 -translate-y-[58%] animate-float rounded-3xl bg-white p-5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)]">
                <p className="text-[11px] font-medium uppercase tracking-wider text-faint">Bug report</p>
                <p className="mt-1 text-lg font-medium leading-snug tracking-[-0.02em]">Registration form submits without a valid email</p>
                <div className="mt-4 grid gap-2">
                  {[88, 70, 54].map((w) => (
                    <span key={w} className="block h-2 rounded-full bg-chip" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <span className="mt-4 inline-flex rounded-full bg-ok-soft px-2.5 py-1 text-xs font-medium text-ok">Valid finding</span>
              </div>

              {floaters.map((f, i) => (
                <span key={i} className={`absolute hidden animate-float sm:block ${f.cls}`} style={{ animationDelay: f.delay }}>
                  <AppTile icon={f.icon} tone={f.tone} size={f.size} />
                </span>
              ))}

              {/* glass pills along the bottom, like the reference's team pill and hiring pill */}
              <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2 sm:inset-x-4 sm:bottom-4">
                <div className="rounded-full border border-white/50 bg-white/70 px-5 py-3 backdrop-blur-xl">
                  <p className="text-[15px] font-medium leading-tight">Practice. Find bugs. Improve.</p>
                  <p className="hidden text-[12px] text-muted sm:block">A hands-on platform for practical software testing skills</p>
                </div>
                <Link
                  href="/practice-lab"
                  className="group flex items-center gap-3 rounded-full border border-white/50 bg-white/70 py-2 pl-5 pr-2 backdrop-blur-xl transition-colors hover:bg-white"
                >
                  <span className="text-[15px] font-medium">Start practicing</span>
                  <span className="flex size-10 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
