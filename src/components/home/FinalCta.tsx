import { Bug, ChartPie, ClipboardCheck, Flag, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { LogoMark } from "@/components/ui/Logo";
import { AppTile, type Tone } from "@/components/ui/AppTile";
import { Reveal } from "@/components/ui/Reveal";
import { Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const sats: { ring: number; angle: number; icon: LucideIcon; tone: Tone }[] = [
  { ring: 100, angle: 300, icon: ClipboardCheck, tone: "black" },
  { ring: 100, angle: 20, icon: ArrowUpRight, tone: "green" },
  { ring: 100, angle: 95, icon: Bug, tone: "blue" },
  { ring: 65, angle: 205, icon: ChartPie, tone: "violet" },
  { ring: 100, angle: 215, icon: Flag, tone: "lime" },
];

function Orbit() {
  return (
    <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[400px] md:block">
      {[100, 65, 33].map((p) => (
        <span key={p} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line" style={{ width: `${p}%`, height: `${p}%` }} />
      ))}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <LogoMark size={64} />
      </span>
      {sats.map((s, i) => {
        const dur = `${s.ring === 100 ? 80 : 55}s`;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit"
            style={{ width: `${s.ring}%`, height: `${s.ring}%`, animationDuration: dur }}
          >
            <span className="absolute inset-0" style={{ transform: `rotate(${s.angle}deg)` }}>
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" style={{ transform: `rotate(${-s.angle}deg)` }}>
                <span className="block animate-orbit" style={{ animationDirection: "reverse", animationDuration: dur }}>
                  <AppTile icon={s.icon} tone={s.tone} size={44} />
                </span>
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function FinalCta({
  label = "Get Started",
  title = "Your Next Bug Is Waiting to Be Found.",
  text = "Put your knowledge into action. Explore a practice website, investigate its behavior, and take the next step in your QA journey.",
  primary = { href: "/sign-up", label: "Get Started" },
  secondary = { href: "/practice-lab", label: "Explore Practice Lab" },
}: {
  label?: string;
  title?: string;
  text?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
} = {}) {
  return (
    <section className="cta-frame mx-3 mt-16 rounded-t-[40px] bg-card px-3 pb-3 pt-3 sm:mx-4 sm:mt-24 sm:px-4 sm:pt-4 lg:rounded-t-[48px]" aria-labelledby="cta-title">
      <div className="mx-auto grid max-w-[1136px] items-center gap-10 overflow-hidden rounded-[32px] bg-white px-7 py-12 shadow-soft sm:px-12 sm:py-16 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <SectionTag index="6" icon={Rocket} label={label} />
          <h2 id="cta-title" className="h-section mt-6 max-w-[520px] text-balance">{title}</h2>
          <p className="lead mt-5 max-w-[500px]">{text}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary && (
              <Button href={secondary.href} variant="light" arrow>
                {secondary.label}
              </Button>
            )}
          </div>
        </Reveal>
        <Orbit />
      </div>
    </section>
  );
}
