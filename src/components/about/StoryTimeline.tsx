"use client";

import { useEffect, useRef } from "react";
import { BookOpenCheck, Handshake, Link2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionTag } from "@/components/ui/SectionTag";
import { SplitText } from "@/components/ui/SplitText";
import { Reveal } from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n/client";

const steps: { n: string; title: string; text: string; icon: LucideIcon; grad: string }[] = [
  {
    n: "01",
    title: "Concepts matter",
    text: "Learning software testing concepts is important, but understanding how to apply them can be challenging without practical experience.",
    icon: BookOpenCheck,
    grad: "from-[#0a2fb8] to-[#3d8bff]",
  },
  {
    n: "02",
    title: "Bridging the gap",
    text: "Tirat QA provides practice websites where learners can investigate behavior, identify bugs, document their findings, and review feedback.",
    icon: Link2,
    grad: "from-[#2a1fb8] to-[#8b7bff]",
  },
  {
    n: "03",
    title: "Practical QA, accessible",
    text: "Our goal is to make practical QA training more accessible and give learners a structured way to build their confidence.",
    icon: Handshake,
    grad: "from-[#0a3fd0] to-[#6aa6ff]",
  },
];

/** Story as a vertical timeline: a line draws down as you scroll and each dot lights up when its card is reached. */
export function StoryTimeline() {
  const t = useT();
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const mark = vh * 0.6;
      const p = Math.min(1, Math.max(0, (mark - r.top) / r.height));
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      dots.current.forEach((d) => {
        if (!d) return;
        const on = d.getBoundingClientRect().top < mark;
        d.dataset.on = on ? "1" : "0";
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="story" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="story-title">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <SectionTag index="1" icon={BookOpenCheck} iconClass="text-green" label={t("Our Story")} />
          </Reveal>
          <SplitText id="story-title" className="h-section mt-6 max-w-[480px] text-balance" parts={[{ text: t("From Learning Testing to Practicing Testing.") }]} />
          <Reveal delay={120}>
            <p className="lead mt-6 max-w-[420px]">{t("Our goal is to make practical QA training more accessible and give learners a structured way to build their confidence.")}</p>
            <div className="mt-7">
              <Button href="/learn" variant="light" arrow>
                {t("Explore Learning Resources")}
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <span className="absolute bottom-6 left-[11px] top-6 w-px bg-line" aria-hidden />
          <span ref={fill} className="absolute bottom-6 left-[11px] top-6 w-px origin-top bg-brand" style={{ transform: "scaleY(0)" }} aria-hidden />
          <ol ref={list} className="grid gap-4 pl-10">
            {steps.map((s, i) => (
              <li key={s.n} className="relative">
                <span
                  ref={(el) => {
                    dots.current[i] = el;
                  }}
                  data-on="0"
                  className="absolute -left-10 top-8 flex size-6 items-center justify-center rounded-full border-2 border-brand bg-white transition-[transform,background] duration-500 data-[on='1']:scale-110"
                  aria-hidden
                >
                  <span className="size-2 rounded-full bg-brand" />
                </span>
                <Reveal delay={i * 80}>
                  <article className="group flex flex-col gap-4 rounded-[28px] border border-line bg-card p-2 transition-colors hover:bg-white sm:flex-row sm:items-center">
                    <div className={`relative flex h-[140px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br sm:w-[190px] ${s.grad}`}>
                      <span className="absolute -right-8 -top-8 size-32 rounded-full bg-white/20 blur-2xl" />
                      <span className="absolute inset-0 opacity-[0.14] [background-image:repeating-linear-gradient(45deg,#fff_0_2px,transparent_2px_14px)]" />
                      <s.icon className="relative size-12 text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1.6} aria-hidden />
                    </div>
                    <div className="px-2 pb-3 sm:py-3 sm:pr-5">
                      <p className="font-mono text-[12px] font-medium text-brand">{s.n}</p>
                      <h3 className="mt-1.5 text-[1.3rem] font-medium tracking-[-0.03em]">{t(s.title)}</h3>
                      <p className="mt-1.5 text-[15px] leading-snug text-muted">{t(s.text)}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
