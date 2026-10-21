import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/** Shared inner-page hero: soft grey backdrop, uppercase eyebrow chip, big headline, supporting copy. */
export function PageHero({
  eyebrow,
  title,
  children,
  actions,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <section className="hero-bg pb-16 pt-36 sm:pb-24 sm:pt-48">
      <div className={`container-x flex flex-col ${align === "center" ? "items-center text-center" : ""}`}>
        <Reveal>
          <span className="inline-flex h-[34px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium uppercase tracking-[0.06em]">
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="h-display mt-6 max-w-[900px] text-balance !text-[clamp(2.5rem,6vw,4.75rem)]">{title}</h1>
        </Reveal>
        {children && (
          <Reveal delay={160} className={`lead mt-6 grid max-w-[640px] gap-3 ${align === "center" ? "mx-auto" : ""}`}>
            {children}
          </Reveal>
        )}
        {actions && (
          <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {actions}
          </Reveal>
        )}
      </div>
    </section>
  );
}
