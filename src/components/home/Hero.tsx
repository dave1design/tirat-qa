import { BadgeCheck, BookOpen, Compass, FileText, Rocket } from "lucide-react";
import { HangingIcons } from "./HangingIcons";
import { Button } from "@/components/ui/Button";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import type { LucideIcon } from "lucide-react";

const steps: { title: string; pill: string; icon: LucideIcon; tone: Tone }[] = [
  { title: "Learn", pill: "Free guides and resources", icon: BookOpen, tone: "blue" },
  { title: "Test", pill: "Practice websites", icon: Compass, tone: "violet" },
  { title: "Report", pill: "Structured bug reports", icon: FileText, tone: "orange" },
  { title: "Improve", pill: "Results and feedback", icon: Rocket, tone: "green" },
];

function StepCards() {
  return (
    <div className="mx-auto mt-24 grid max-w-[1136px] grid-cols-2 gap-x-4 gap-y-10 px-5 sm:mt-40 lg:grid-cols-4 lg:gap-x-6">
      {steps.map((s, i) => (
        <Reveal key={s.title} delay={i * 90} className="group text-center">
          <div className="relative h-[170px] overflow-hidden rounded-[28px] border border-line bg-gradient-to-b from-[#f3f3f3] to-white shadow-soft sm:h-[190px]">
            <span className="absolute left-[14%] top-3 h-24 w-[44%] -rotate-3 rounded-2xl bg-white shadow-soft transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:-rotate-6" />
            <span className="absolute right-[12%] top-1 h-24 w-[46%] rotate-3 rounded-2xl bg-gradient-to-br from-[#e9e9e9] to-[#d6d6d6] shadow-soft transition-transform duration-500 group-hover:-translate-y-3 group-hover:translate-x-2 group-hover:rotate-6" />
            <span className="absolute inset-x-[7%] bottom-0 h-[58%] rounded-t-3xl border border-line bg-white shadow-float transition-transform duration-500 group-hover:-translate-y-2">
              <span className="absolute left-4 top-4 size-3 rounded-full" style={{ background: ["#0066ff", "#6c5cff", "#ff6b1a", "#12c957"][i] }} />
              <span className="absolute right-3 top-[-14px]">
                <span className="block animate-pop" style={{ animationDelay: `${i * 0.4}s` }}><AppTile icon={s.icon} tone={s.tone} size={42} /></span>
              </span>
              <span className="absolute inset-x-4 bottom-5 h-px bg-line" />
              <span className="absolute inset-x-4 bottom-9 h-px bg-line" />
            </span>
          </div>
          <p className="mt-5 text-xl tracking-[-0.03em]">{s.title}</p>
          <p className="mx-auto mt-3 inline-block rounded-full bg-chip px-3 py-1.5 text-[13px] font-medium text-muted">{s.pill}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden pb-24 pt-[310px] sm:pb-28 sm:pt-[260px]">
      <HangingIcons />
      <div className="container-x relative">
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium">
              <span className="inline-flex h-[34px] items-center rounded-lg bg-brand px-2.5 text-lime">
                <BadgeCheck className="size-[18px]" fill="currentColor" stroke="#0066ff" strokeWidth={2} aria-hidden />
              </span>
              <span className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">
                Your QA journey starts here
              </span>
            </div>
          </Reveal>
          <div>
            <SplitText
              as="h1"
              className="h-display mt-7 text-balance"
              stagger={90}
              parts={[{ text: "Don't Just Learn Testing." }, { text: "Practice It.", className: "text-brand" }]}
            />
          </div>
          <Reveal delay={160}>
            <p className="lead mx-auto mt-6 max-w-[620px]">
              Discover bugs, test real-world scenarios, and build practical software testing skills through hands-on website challenges.
            </p>
            <p className="lead mx-auto mt-3 max-w-[620px]">Turn your QA knowledge into real testing experience, one bug at a time.</p>
          </Reveal>
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            <Button href="/practice-lab">Start Practicing</Button>
            <Button href="#how-it-works" variant="light" arrow>
              Explore How It Works
            </Button>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 text-sm font-medium text-muted">Learn. Test. Report. Improve.</p>
          </Reveal>
        </div>
      </div>
      <StepCards />
    </section>
  );
}
