import { cn } from "@/lib/utils";

const row1 = ["Functional testing", "Form validation", "Navigation testing", "Basic bug identification", "Writing bug reports", "Exploratory testing", "UI testing", "Usability testing"];
const row2 = ["Regression testing", "Positive and negative testing", "Boundary-value analysis", "Equivalence partitioning", "Steps to reproduce", "Expected vs. actual results", "Severity vs. priority", "Screenshots and evidence"];
const dots = ["bg-brand", "bg-violet", "bg-orange", "bg-green", "bg-lime"];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <ul className={cn("flex w-max gap-3 py-1.5 group-hover:[animation-play-state:paused]", reverse ? "animate-marquee-rev" : "animate-marquee")} aria-hidden={undefined}>
        {loop.map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length ? true : undefined}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-[15px] font-medium shadow-soft"
          >
            <span className={cn("size-2.5 rounded-full", dots[i % dots.length])} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Two opposite-direction pill marquees of the skills covered across the Practice Lab. */
export function SkillsMarquee() {
  return (
    <section aria-label="Skills you will practice" className="grid gap-3 overflow-hidden py-10 sm:py-16">
      <Row items={row1} />
      <Row items={row2} reverse />
    </section>
  );
}
