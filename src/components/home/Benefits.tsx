import { Layers, Check, CircleAlert, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SplitText } from "@/components/ui/SplitText";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/ui/Reveal";

const found = ["Unexpected behavior", "Functional issue", "Usability problem", "Validation gap", "Navigation issue", "Display problem", "Edge case"];

/** Auto-scrolling findings list, faded top and bottom. */
function FindBugsArt() {
  const rows = [...found, ...found];
  return (
    <div className="relative h-[210px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_22%,#000_78%,transparent)]">
      <ul className="animate-scroll-up">
        {rows.map((l, i) => (
          <li key={i} className="flex items-center justify-between gap-2 border-b border-line py-3 text-[15px]">
            <span className="font-medium">{l}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", i % 4 === 3 ? "bg-chip text-muted" : "bg-ok-soft text-ok")}>{i % 4 === 3 ? "Keep looking" : "Found"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A report card with a typing caret and a second card peeking behind it. */
function ReportArt() {
  return (
    <div className="relative pt-4">
      <span className="absolute inset-x-4 top-0 h-10 rounded-t-2xl bg-white/70 shadow-soft" />
      <div className="relative animate-float rounded-2xl bg-white p-4 shadow-float">
        <p className="text-[11px] font-medium uppercase tracking-wider text-faint">Bug title</p>
        <p className="mt-0.5 flex items-center text-sm font-medium">
          Form accepts an invalid email
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-ink" />
        </p>
        <div className="my-3 h-px bg-line" />
        {["Steps to reproduce", "Expected result", "Actual result"].map((l, i) => (
          <div key={l} className="mb-2.5 last:mb-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-faint">{l}</p>
            <div className="mt-1.5 h-2 rounded-full bg-chip" style={{ width: `${[78, 64, 52][i]}%` }} />
          </div>
        ))}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <ImageIcon className="size-3.5" aria-hidden /> Screenshot attached
        </div>
      </div>
    </div>
  );
}

/** Three result cards fanned out; they spread wider on hover. */
function FeedbackArt() {
  const cards = [
    { t: "Valid finding", d: "Clear steps and expected result", tone: "bg-ok-soft text-ok", icon: Check, cls: "-rotate-[7deg] group-hover/art:-translate-x-3 group-hover/art:-rotate-[11deg]" },
    { t: "Duplicate", d: "Already reported earlier", tone: "bg-[#fff4e5] text-warn", icon: CircleAlert, cls: "translate-y-3 group-hover/art:translate-y-4" },
    { t: "Missed finding", d: "Topic: form validation", tone: "bg-bad-soft text-bad", icon: CircleAlert, cls: "rotate-[7deg] translate-y-7 group-hover/art:translate-x-3 group-hover/art:rotate-[11deg] group-hover/art:translate-y-8" },
  ];
  return (
    <div className="group/art relative h-[210px]">
      {cards.map((c, i) => (
        <div
          key={c.t}
          className={cn("absolute inset-x-1 flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-float transition-transform duration-500 ease-out", c.cls)}
          style={{ top: i * 12, zIndex: i }}
        >
          <span className={cn("flex size-7 items-center justify-center rounded-full", c.tone)}>
            <c.icon className="size-4" aria-hidden />
          </span>
          <div className="text-sm">
            <p className="font-medium">{c.t}</p>
            <p className="text-xs text-muted">{c.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Bar chart whose bars keep growing and shrinking out of phase. */
function ProgressArt() {
  const bars = [35, 55, 42, 70, 52, 85, 64, 95, 72, 100];
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <div className="flex h-[120px] items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cn("block flex-1 origin-bottom animate-bar rounded-md", i > 6 ? "bg-brand/30" : "bg-brand")}
            style={{ height: `${h}%`, animationDelay: `${i * 0.18}s`, animationDuration: `${2.2 + (i % 3) * 0.5}s` }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs font-medium text-muted">
        <span>Not Started</span>
        <span>In Progress</span>
        <span>Completed</span>
      </div>
    </div>
  );
}

const items = [
  { title: "Find Bugs with Confidence", text: "Explore practice websites and learn to recognize unexpected behavior, functional issues, and usability problems.", art: <FindBugsArt /> },
  { title: "Write Better Bug Reports", text: "Learn to describe issues clearly with reproduction steps, expected results, actual results, and supporting evidence.", art: <ReportArt /> },
  { title: "Learn Through Feedback", text: "Review your submitted reports, understand what you missed, and discover how to improve your testing approach.", art: <FeedbackArt /> },
  { title: "Track Your Progress", text: "Follow your completed challenges, review your results, and see how your practical testing skills develop over time.", art: <ProgressArt /> },
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="benefits-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-center text-center">
          <SectionTag index="1" icon={Layers} label="Why Tirat QA" />
          <SplitText id="benefits-title" className="h-section mt-6 max-w-[760px] text-balance" parts={[{ text: "Build Skills That Go Beyond Theory." }]} />
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80} className={i % 2 === 1 ? "lg:mt-3" : ""}>
              <article className="flex h-full min-h-[440px] flex-col rounded-[32px] bg-card p-6 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
                <h3 className="h-card !text-[1.45rem]">{it.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{it.text}</p>
                <div className="mt-auto pt-8">{it.art}</div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
